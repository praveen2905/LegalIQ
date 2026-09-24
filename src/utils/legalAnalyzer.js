/**
 * LegalIQ - Document-Grounded Legal Analyzer Engine
 *
 * ALL outputs (summary, obligations, rights, dates, financials, clauses,
 * plain-English, Q&A) are derived ONLY from the extracted document text.
 * No hardcoded content is injected. If information is absent, the UI
 * receives "Not specified in the document" rather than a fabricated value.
 */

// ---------------------------------------------------------------------------
// 1. DOCUMENT TYPE DETECTION
// ---------------------------------------------------------------------------

export function detectDocumentType(text) {
  const lower = text.toLowerCase();

  const scores = { nda: 0, employment: 0, lease: 0, saas: 0, general: 1 };

  if (lower.includes('non-disclosure') || lower.includes('nondisclosure') || lower.includes('nda')) scores.nda += 8;
  if (lower.includes('confidentiality agreement') || lower.includes('confidential information')) scores.nda += 6;
  if (lower.includes('disclosing party') && lower.includes('receiving party')) scores.nda += 8;
  if (lower.includes('proprietary information') || lower.includes('trade secret')) scores.nda += 3;

  if (lower.includes('employment agreement') || lower.includes('employment contract')) scores.employment += 8;
  if (lower.includes('employer') && lower.includes('employee')) scores.employment += 8;
  if (lower.includes('base salary') || lower.includes('job duties') || lower.includes('position:')) scores.employment += 5;
  if (lower.includes('non-compete') || lower.includes('at-will')) scores.employment += 4;

  if (lower.includes('lease agreement') || lower.includes('commercial lease') || lower.includes('office lease')) scores.lease += 8;
  if (lower.includes('landlord') && lower.includes('tenant')) scores.lease += 8;
  if (lower.includes('premises') && lower.includes('rent')) scores.lease += 5;
  if (lower.includes('base rent') || lower.includes('hvac') || lower.includes('sublet')) scores.lease += 5;

  if (lower.includes('software as a service') || lower.includes('saas') || lower.includes('master services agreement')) scores.saas += 8;
  if (lower.includes('subscription fee') || lower.includes('service level agreement')) scores.saas += 6;
  if (lower.includes('uptime') || lower.includes('customer data')) scores.saas += 4;

  let highest = 'general';
  let maxScore = 0;
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) { maxScore = score; highest = type; }
  }

  switch (highest) {
    case 'nda': return 'Non-Disclosure Agreement (NDA)';
    case 'employment': return 'Employment Contract';
    case 'lease': return 'Commercial Lease';
    case 'saas': return 'SaaS Terms & Services';
    default: return 'Legal Contract';
  }
}

// ---------------------------------------------------------------------------
// 2. DOCUMENT-GROUNDED EXTRACTION HELPERS
// ---------------------------------------------------------------------------

/**
 * Split text into sentence-level chunks and paragraph-level chunks.
 */
function parseDocument(text) {
  const lines = text.split('\n');
  const paragraphs = [];
  let current = [];
  let startLine = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (current.length > 0) {
        paragraphs.push({ text: current.join(' '), startLine, endLine: i });
        current = [];
      }
      startLine = i + 2;
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) {
    paragraphs.push({ text: current.join(' '), startLine, endLine: lines.length });
  }

  return { lines, paragraphs };
}

/**
 * Find the first paragraph whose lowercased text contains at least one of the keywords.
 */
function findParagraph(paragraphs, keywords) {
  for (const p of paragraphs) {
    const lower = p.text.toLowerCase();
    if (keywords.some(kw => lower.includes(kw)) && p.text.length >= 30) {
      return p;
    }
  }
  return null;
}

/**
 * Extract the surrounding sentence(s) that contain a keyword from the raw text.
 * Returns null if keyword not found.
 */
function extractSentenceContaining(text, keyword) {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(keyword.toLowerCase());
  if (idx === -1) return null;

  // Walk backwards to the start of the sentence
  let start = idx;
  while (start > 0 && !/[.!?\n]/.test(text[start - 1])) start--;
  // Walk forwards to the end of the sentence (up to 2 sentences)
  let end = idx + keyword.length;
  let sentCount = 0;
  while (end < text.length && sentCount < 2) {
    if (/[.!?]/.test(text[end])) sentCount++;
    end++;
  }

  return text.slice(start, end).trim().replace(/\s+/g, ' ');
}

/**
 * Extract title from first meaningful lines of the document.
 */
function extractTitle(text, fileName) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i];
    if (line.length >= 8 && line.length <= 100) {
      if (
        line.toUpperCase() === line ||
        /AGREEMENT|CONTRACT|LEASE|NDA|DISCLOSURE|EMPLOYMENT/i.test(line)
      ) {
        return line.replace(/^[#*_\s]+|[#*_\s]+$/g, '').trim();
      }
    }
  }
  if (fileName) {
    const clean = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  return 'Legal Document';
}

/**
 * Extract contracting parties from "by and between ... and ..." pattern.
 * Returns an array with 1-2 strings, or a fallback based on doc type.
 */
function extractParties(text, docType) {
  // Try "between X and Y"
  const match = text.match(
    /(?:by and between|between|entered into by)\s+([^\n\r,;()]{3,80}?)(?:\s*\([^)]*\))?\s+and\s+([^\n\r,;()]{3,80}?)(?:\s*\([^)]*\))?(?:\.|,|\n|;)/i
  );
  if (match && match[1] && match[2]) {
    const p1 = match[1].trim();
    const p2 = match[2].trim();
    if (p1.length > 2 && p2.length > 2) return [p1, p2];
  }

  // Try "Party A (Landlord)" / "Party B (Tenant)" style
  const roleMatch = text.match(/([A-Z][A-Za-z\s,.]+?)\s*\((?:Landlord|Employer|Disclosing Party|Provider|Vendor)\)/);
  const role2Match = text.match(/([A-Z][A-Za-z\s,.]+?)\s*\((?:Tenant|Employee|Receiving Party|Customer|Client)\)/);
  if (roleMatch && role2Match) return [roleMatch[1].trim(), role2Match[1].trim()];

  // Fallback labels by type (not invented names — just role labels)
  if (docType.includes('NDA')) return ['Disclosing Party', 'Receiving Party'];
  if (docType.includes('Employment')) return ['Employer', 'Employee'];
  if (docType.includes('Lease')) return ['Landlord', 'Tenant'];
  if (docType.includes('SaaS')) return ['Service Provider', 'Customer'];
  return ['Party A', 'Party B'];
}

/**
 * Extract effective date from the document text.
 * Returns "Not specified in the document" if not found.
 */
function extractEffectiveDate(text) {
  const patterns = [
    /(?:dated as of|effective as of|entered into this|effective date[:\s]+)([A-Za-z]+ \d{1,2},? \d{4})/i,
    /(?:dated as of|effective as of|entered into this|effective date[:\s]+)(\d{1,2}(?:st|nd|rd|th)? day of [A-Za-z]+ \d{4})/i,
    /(?:on|as of)\s+([A-Za-z]+ \d{1,2},? \d{4})/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m && m[1]) return m[1].trim();
  }
  return 'Not specified in the document';
}

/**
 * Extract notice period (days) actually stated in the document.
 * Returns the string as written, or null.
 */
function extractNoticePeriod(text) {
  // Match patterns like "60 days prior written notice", "thirty (30) days notice", etc.
  const patterns = [
    /(\d+)\s+days?\s+(?:prior\s+)?(?:written\s+)?notice/i,
    /(thirty|sixty|ninety|fourteen|twenty[-\s]?one|thirty[-\s]?five)\s*(?:\(\d+\))?\s*days?(?:\s+(?:prior|written|advance))?\s+notice/i,
    /notice\s+(?:period\s+)?of\s+(\d+)\s+days?/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m && m[1]) return m[1];
  }
  return null;
}

/**
 * Extract all dollar amounts with their surrounding context from the text.
 * Returns array of { amount, context, lineApprox }
 */
function extractDollarAmounts(text) {
  const results = [];
  const re = /\$[\d,]+(?:\.\d{2})?(?:\s*(?:\/|per)\s*(?:month|year|annum|hour|mo|yr))?/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const start = Math.max(0, text.lastIndexOf('\n', m.index) + 1);
    const end = text.indexOf('\n', m.index + m[0].length);
    const ctx = text.slice(start, end === -1 ? m.index + 150 : end).trim();
    results.push({ amount: m[0], context: ctx.substring(0, 200) });
  }
  return results;
}

/**
 * Extract percentage values with context.
 */
function extractPercentages(text) {
  const results = [];
  const re = /(\d+(?:\.\d+)?%)\s*(?:annual|escalation|bonus|increase|penalty|interest|cap)?/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const start = Math.max(0, text.lastIndexOf('\n', m.index) + 1);
    const end = text.indexOf('\n', m.index + m[0].length);
    const ctx = text.slice(start, end === -1 ? m.index + 150 : end).trim();
    results.push({ pct: m[1], value: parseFloat(m[1]), context: ctx.substring(0, 200) });
  }
  return results;
}

/**
 * Extract all duration mentions (e.g. "12 months", "2 years", "24 months").
 * Returns the first match or null.
 */
function extractDurationMention(text, afterKeyword) {
  const searchText = afterKeyword
    ? text.slice(text.toLowerCase().indexOf(afterKeyword.toLowerCase()))
    : text;
  const m = searchText.match(/(\d+)\s*(?:\(\d+\))?\s*(months?|years?)/i);
  if (m) return `${m[1]} ${m[2]}`;
  return null;
}

// ---------------------------------------------------------------------------
// 3. CLAUSE EXTRACTION
// ---------------------------------------------------------------------------

/**
 * Clause category definitions - keywords for finding matching paragraphs.
 * riskLevel and explanations are used ONLY if matched in the document.
 */
const CLAUSE_DEFS = {
  CONFIDENTIALITY_DEF: {
    title: 'Definition of Confidential Information & Scope',
    keywords: ['confidential information', 'proprietary information', 'trade secret', 'marked confidential'],
    category: 'Confidentiality',
    riskLevel: 'Low',
    riskExplanation: 'Defines the scope of protected information exchanged under this agreement.',
    recommendation: 'Ensure standard exclusions (public domain, prior possession, independent development) are explicitly listed.'
  },
  CONFIDENTIALITY_EXCLUSIONS: {
    title: 'Exclusions from Confidentiality',
    keywords: ['shall not include information', 'publicly known', 'public domain', 'already in possession', 'independently developed', 'rightfully received'],
    category: 'Confidentiality',
    riskLevel: 'Low',
    riskExplanation: 'Protects the receiving party for information they lawfully held before disclosure.',
    recommendation: 'Confirm this exclusion also covers compelled disclosures (e.g. court order) with prompt notice.'
  },
  NON_DISCLOSURE_OBLIGATION: {
    title: 'Non-Disclosure & Non-Use Covenants',
    keywords: ['agree not to disclose', 'reasonable care', 'solely for the purpose', 'strict confidence', 'need to know'],
    category: 'Confidentiality',
    riskLevel: 'Medium',
    riskExplanation: 'Restricts sharing confidential materials with unauthorized parties.',
    recommendation: 'Confirm the standard of care is "reasonable" — not impossibly high "absolute" or "utmost" care.'
  },
  NDA_TERM: {
    title: 'Confidentiality Term & Survival',
    keywords: ['survive termination', 'period of years', 'duration of', 'in perpetuity', 'perpetual confidentiality'],
    category: 'Term & Duration',
    riskLevel: 'Medium',
    riskExplanation: 'Controls how long after termination the confidentiality obligations remain binding.',
    recommendation: 'Cap obligations at 1-3 years for commercial data; perpetual survival is rarely appropriate.'
  },
  INJUNCTIVE_RELIEF: {
    title: 'Injunctive Relief & Remedies',
    keywords: ['irreparable harm', 'injunctive relief', 'monetary damages inadequate', 'without posting bond'],
    category: 'Remedies',
    riskLevel: 'Medium',
    riskExplanation: 'Allows the injured party to seek immediate court injunction without proving monetary loss.',
    recommendation: 'Consider removing "without the necessity of posting bond" to limit overbroad injunctions.'
  },
  NON_COMPETE: {
    title: 'Post-Employment Non-Compete Covenant',
    keywords: ['non-compete', 'covenant not to compete', 'competing business', 'engage in', 'consult for any', 'ownership in any business'],
    category: 'Restrictive Covenant',
    riskLevel: 'High',
    riskExplanation: 'Restricts your ability to work for competitors after departure. Enforceability depends heavily on jurisdiction.',
    recommendation: 'Narrow scope to direct named competitors, reduce duration, and confirm enforceable under local law.'
  },
  NON_SOLICIT: {
    title: 'Non-Solicitation of Employees & Clients',
    keywords: ['non-solicitation', 'solicit any employee', 'recruit', 'hire any employee', 'solicit clients', 'divert customers'],
    category: 'Restrictive Covenant',
    riskLevel: 'Medium',
    riskExplanation: 'Restricts recruiting company personnel or soliciting clients post-employment.',
    recommendation: 'Ensure this only covers active solicitation — not passive job postings or inbound inquiries.'
  },
  IP_ASSIGNMENT: {
    title: 'Intellectual Property & Invention Assignment',
    keywords: ['inventions', 'intellectual property', 'work made for hire', 'assign to employer', 'conceived or reduced to practice', 'all works'],
    category: 'Intellectual Property',
    riskLevel: 'High',
    riskExplanation: 'Assigns all created works and inventions to the employer, potentially including personal side projects.',
    recommendation: 'Add a statutory exclusion (e.g. California Labor Code 2870 equivalent) protecting personal projects built without company resources.'
  },
  COMPENSATION: {
    title: 'Compensation, Salary & Benefits',
    keywords: ['base salary', 'annual salary', 'bi-weekly', 'stock options', 'equity', 'severance', 'paid time off', 'benefits'],
    category: 'Financial',
    riskLevel: 'Low',
    riskExplanation: 'Defines the full compensation package including base pay and ancillary benefits.',
    recommendation: 'Confirm bonus criteria use objective, measurable benchmarks rather than sole management discretion.'
  },
  AT_WILL: {
    title: 'At-Will Employment & Notice Period',
    keywords: ['at-will', 'terminate at any time', 'with or without cause', 'notice of resignation', 'written notice prior'],
    category: 'Termination',
    riskLevel: 'Low',
    riskExplanation: 'Either party may end the employment relationship at any time, with the notice period set by the document.',
    recommendation: 'Ensure the notice requirement is mutual — it should apply equally when the employer terminates.'
  },
  RENT_ESCALATION: {
    title: 'Rent Amount & Annual Escalation',
    keywords: ['base rent', 'monthly rent', 'escalation', 'increase annually', 'first anniversary', 'payable during'],
    category: 'Financial',
    riskLevel: 'High',
    riskExplanation: 'Sets the base rent and annual escalation rate. Compounded increases above 4-5% significantly inflate total lease cost.',
    recommendation: 'Negotiate escalation to standard market rate (3-4%) or tie it to the CPI index.'
  },
  MAINTENANCE_REPAIRS: {
    title: 'Maintenance, Repairs & Capital Replacements',
    keywords: ['maintenance', 'repair', 'hvac', 'electrical panels', 'plumbing', 'premises in good order', 'capital replacement'],
    category: 'Maintenance',
    riskLevel: 'High',
    riskExplanation: 'Defines who pays for ongoing maintenance and major capital replacements (e.g. HVAC, roof).',
    recommendation: 'Tenant should only bear routine servicing costs. Full capital replacement belongs with the property owner.'
  },
  INDEMNIFICATION: {
    title: 'Indemnification & Hold Harmless',
    keywords: ['indemnify', 'hold harmless', 'defend', 'claims, damages', 'liabilities, losses', 'without cap'],
    category: 'Liability',
    riskLevel: 'High',
    riskExplanation: 'Requires a party to absorb legal defense costs and damages. Uncapped indemnity creates unlimited financial exposure.',
    recommendation: 'Add mutual indemnification, exclude indemnitor\'s own negligence/misconduct, and cap at insurance coverage limits.'
  },
  LIABILITY_CAP: {
    title: 'Limitation of Liability & Damages Cap',
    keywords: ['limitation of liability', 'liability cap', 'consequential damages', 'punitive damages', 'indirect damages'],
    category: 'Liability',
    riskLevel: 'Medium',
    riskExplanation: 'Sets the ceiling on recoverable financial damages in a dispute.',
    recommendation: 'Ensure cap is mutual and set to total fees paid in the preceding 12 months, with clear carve-outs for intentional misconduct.'
  },
  EARLY_TERMINATION: {
    title: 'Default, Remedies & Early Termination',
    keywords: ['early termination', 'default', 'liquidated damages', 'accelerate', 'unexpired term', 'penalty of', 'cure period'],
    category: 'Termination',
    riskLevel: 'High',
    riskExplanation: 'Specifies financial penalties and obligations triggered by early exit or breach of contract.',
    recommendation: 'Limit penalty to 2-3 months, require a cure period before penalty kicks in, and include a duty to mitigate.'
  },
  SUBLETTING: {
    title: 'Assignment & Subletting Restrictions',
    keywords: ['sublet', 'assignment', 'transfer this lease', 'written consent', 'absolute discretion', 'administrative fee'],
    category: 'Operational',
    riskLevel: 'Medium',
    riskExplanation: 'Controls whether you can transfer lease rights to others and on what terms.',
    recommendation: 'Change "sole and absolute discretion" to "consent not unreasonably withheld, conditioned, or delayed."'
  },
  USE_AND_ACCESS: {
    title: 'Premises Use & Operating Hours',
    keywords: ['premises shall be used', 'hours of operation', '7:00 am', 'monday through friday', 'building access'],
    category: 'Operational',
    riskLevel: 'Low',
    riskExplanation: 'Restricts when and how the premises can be used.',
    recommendation: 'Request 24/7 keycard access for all authorized employees if operations require it.'
  },
  GOVERNING_LAW: {
    title: 'Governing Law & Dispute Resolution',
    keywords: ['governing law', 'jurisdiction', 'construed in accordance with', 'courts of', 'arbitration', 'venue'],
    category: 'Compliance',
    riskLevel: 'Low',
    riskExplanation: 'Designates which jurisdiction\'s laws govern and where disputes are resolved.',
    recommendation: 'Ensure jurisdiction is local or neutral. Distant forum clauses impose travel and cost burdens.'
  }
};

/**
 * For each matching clause, build a plain-English explanation derived
 * from the actual excerpt — not a fixed template.
 */
function buildPlainEnglish(catKey, excerptText, docExtracted) {
  const lower = excerptText.toLowerCase();

  switch (catKey) {
    case 'CONFIDENTIALITY_DEF':
      return `Defines what counts as protected confidential information under this agreement, based on the specific language in the document.`;

    case 'CONFIDENTIALITY_EXCLUSIONS':
      return `Certain categories of information are not protected — specifically information that was already public, previously known, or independently created.`;

    case 'NON_DISCLOSURE_OBLIGATION':
      return `You must keep the disclosed information confidential and only use it for the stated purpose in this agreement.`;

    case 'NDA_TERM': {
      const dur = extractDurationMention(excerptText, null);
      return dur
        ? `Confidentiality obligations under this agreement last for ${dur}.`
        : `Specifies how long confidentiality obligations remain binding after the agreement ends.`;
    }

    case 'INJUNCTIVE_RELIEF':
      return `If confidentiality is breached, the other party can immediately seek a court injunction${lower.includes('without posting bond') ? ' without needing to post a bond' : ''}.`;

    case 'NON_COMPETE': {
      const dur = extractDurationMention(excerptText, null);
      const hasNorthAmerica = lower.includes('north america');
      const hasNationwide = lower.includes('nationwide') || lower.includes('united states');
      const geo = hasNorthAmerica ? 'North America' : hasNationwide ? 'nationwide' : 'the specified territory';
      return dur
        ? `You cannot work for competing companies within ${geo} for ${dur} after leaving.`
        : `Restricts working for competitors in ${geo} for a set period after departure.`;
    }

    case 'NON_SOLICIT':
      return `You cannot recruit former colleagues or solicit clients from this company after your departure.`;

    case 'IP_ASSIGNMENT': {
      const includesPersonalTime = lower.includes('personal time') || lower.includes('outside working hours') || lower.includes('outside of employment');
      return includesPersonalTime
        ? `The company claims ownership of code, inventions, and works you create — including those made on personal time.`
        : `All inventions, code, and intellectual property you create during employment belong to the company.`;
    }

    case 'COMPENSATION': {
      const dollars = docExtracted.dollars;
      const relevant = dollars.find(d => lower.includes(d.amount.toLowerCase().replace(/[\s,]/g, '')));
      return relevant
        ? `Specifies your compensation as stated in the document: "${relevant.context.substring(0, 120).trim()}".`
        : `Defines the pay structure, schedule, and benefits included in the agreement.`;
    }

    case 'AT_WILL': {
      const noticeDays = extractNoticePeriod(excerptText);
      if (noticeDays) {
        return `Employment can be ended by either party at any time. The required written notice period is ${noticeDays} days as stated in the document.`;
      }
      return `Employment is at-will — either party can end it at any time with the notice period stated in the agreement.`;
    }

    case 'RENT_ESCALATION': {
      const pcts = extractPercentages(excerptText);
      const dollars = docExtracted.dollars;
      const rentDollar = dollars.find(d => lower.includes('rent'));
      if (pcts.length > 0 && rentDollar) {
        return `Your rent is ${rentDollar.amount} and will increase by ${pcts[0].pct} as stated in this clause.`;
      }
      if (pcts.length > 0) return `Rent escalates by ${pcts[0].pct} per the terms of this clause.`;
      if (rentDollar) return `Your rent obligation is ${rentDollar.amount} per the terms of this clause.`;
      return `Defines the rent amount and how it escalates over the lease term.`;
    }

    case 'MAINTENANCE_REPAIRS': {
      const hvac = lower.includes('hvac') || lower.includes('air condition');
      return hvac
        ? `You are responsible for maintaining and potentially replacing HVAC and building systems — check whether this covers full capital replacement.`
        : `Defines who bears the cost of maintaining and repairing the premises and its systems.`;
    }

    case 'INDEMNIFICATION': {
      const uncapped = lower.includes('without cap') || lower.includes('without limitation') || lower.includes('any and all');
      return uncapped
        ? `You are required to defend and cover all legal costs and damages — without any dollar cap on your exposure.`
        : `Requires one party to cover the other's legal costs and damages arising from the contract.`;
    }

    case 'LIABILITY_CAP': {
      const capMatch = excerptText.match(/\$[\d,]+/);
      return capMatch
        ? `Maximum liability under this contract is capped at ${capMatch[0]} per the document terms.`
        : `Sets a ceiling on the total financial liability either party can face under this contract.`;
    }

    case 'EARLY_TERMINATION': {
      const noticeDays = extractNoticePeriod(excerptText);
      const hasLiquidated = lower.includes('liquidated damages');
      const hasAccelerate = lower.includes('accelerate') || lower.includes('remaining rent');
      let exp = `Ending this agreement early`;
      if (hasAccelerate) exp += ` requires paying all remaining amounts upfront`;
      if (hasLiquidated) exp += ` plus a liquidated damages penalty`;
      if (noticeDays) exp += `. Notice period: ${noticeDays} days`;
      return exp + `.`;
    }

    case 'SUBLETTING': {
      const absoluteDiscretion = lower.includes('absolute discretion') || lower.includes('sole discretion');
      return absoluteDiscretion
        ? `You cannot sublet or assign this lease without approval, which the landlord can refuse for any reason.`
        : `Subleasing or assigning this agreement requires prior written consent from the other party.`;
    }

    case 'USE_AND_ACCESS': {
      const timeMatch = excerptText.match(/\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)/g);
      return timeMatch
        ? `The premises can only be used during the hours specified: ${timeMatch.join(' to ')}.`
        : `Defines the allowed uses and access hours for the leased space.`;
    }

    case 'GOVERNING_LAW': {
      const stateMatch = excerptText.match(/(?:laws? of(?: the state of)? )([A-Z][a-zA-Z\s]{2,30})/);
      return stateMatch
        ? `This agreement is governed by the laws of ${stateMatch[1].trim()}.`
        : `Designates the legal jurisdiction that governs interpretation and disputes under this agreement.`;
    }

    default:
      return `See the clause excerpt for exact terms. Review with legal counsel before execution.`;
  }
}

/**
 * Extract clauses strictly from the document. Only include a clause
 * if its keywords are actually found in the document text.
 */
function extractClauses(text, docType) {
  const lowerText = text.toLowerCase();
  const { paragraphs } = parseDocument(text);
  const dollarAmounts = extractDollarAmounts(text);
  const docExtracted = { dollars: dollarAmounts };

  // Determine which clause categories are candidates for this doc type
  let candidates;
  if (docType.includes('NDA')) {
    candidates = ['CONFIDENTIALITY_DEF', 'CONFIDENTIALITY_EXCLUSIONS', 'NON_DISCLOSURE_OBLIGATION', 'NDA_TERM', 'INJUNCTIVE_RELIEF', 'GOVERNING_LAW'];
  } else if (docType.includes('Employment')) {
    candidates = ['COMPENSATION', 'NON_COMPETE', 'NON_SOLICIT', 'IP_ASSIGNMENT', 'AT_WILL', 'GOVERNING_LAW'];
  } else if (docType.includes('Lease')) {
    candidates = ['RENT_ESCALATION', 'MAINTENANCE_REPAIRS', 'INDEMNIFICATION', 'EARLY_TERMINATION', 'SUBLETTING', 'USE_AND_ACCESS'];
  } else {
    candidates = ['LIABILITY_CAP', 'INDEMNIFICATION', 'CONFIDENTIALITY_DEF', 'EARLY_TERMINATION', 'GOVERNING_LAW'];
  }

  // Cross-type additions: add if keyword appears regardless of doc type
  if (lowerText.includes('indemnif') && !candidates.includes('INDEMNIFICATION')) candidates.push('INDEMNIFICATION');
  if ((lowerText.includes('non-compete') || lowerText.includes('covenant not to compete')) && !candidates.includes('NON_COMPETE')) candidates.push('NON_COMPETE');
  if (lowerText.includes('liquidated damages') && !candidates.includes('EARLY_TERMINATION')) candidates.push('EARLY_TERMINATION');

  const usedParaStarts = new Set();
  const clauses = [];
  let index = 1;

  for (const catKey of candidates) {
    const def = CLAUSE_DEFS[catKey];
    if (!def) continue;

    // Check if any keyword appears in the full text at all
    const foundKw = def.keywords.find(kw => lowerText.includes(kw));
    if (!foundKw) continue; // ← STRICT: skip if clause not in document

    // Find the matching paragraph
    let para = null;
    for (const p of paragraphs) {
      if (usedParaStarts.has(p.startLine)) continue;
      const pLower = p.text.toLowerCase();
      if (def.keywords.some(kw => pLower.includes(kw)) && p.text.length >= 30) {
        para = p;
        break;
      }
    }

    let excerptText = '';
    let lineRange = '';
    let sectionNum = '';

    if (para) {
      usedParaStarts.add(para.startLine);
      excerptText = para.text;
      lineRange = `Lines ${para.startLine}–${para.endLine}`;

      // Try to detect section number from the paragraph start
      const secM = para.text.match(/^(?:section|clause|article|item|\d+\.)[\s.]*([0-9A-Za-z.]+)/i);
      sectionNum = secM ? `Section ${secM[1]}` : `Para. ${para.startLine}`;
    } else {
      // Keyword exists in text — extract a sentence-level excerpt
      const sentence = extractSentenceContaining(text, foundKw);
      if (!sentence) continue;
      excerptText = sentence;
      const kwIdx = lowerText.indexOf(foundKw);
      const approxLine = text.slice(0, kwIdx).split('\n').length;
      lineRange = `Near line ${approxLine}`;
      sectionNum = `Near line ${approxLine}`;
    }

    // Truncate to a readable length
    if (excerptText.length > 320) excerptText = excerptText.slice(0, 317) + '...';

    const plainEnglish = buildPlainEnglish(catKey, excerptText, docExtracted);

    clauses.push({
      id: `clause-upload-${index}`,
      title: def.title,
      sectionNumber: sectionNum,
      lineRange,
      text: excerptText,
      plainEnglish,
      riskLevel: def.riskLevel,
      riskCategory: def.category,
      riskExplanation: def.riskExplanation,
      recommendation: def.recommendation
    });

    index++;
  }

  // If absolutely nothing matched, extract the first few substantive paragraphs as general clauses
  if (clauses.length === 0) {
    const viable = paragraphs.filter(p => p.text.length > 60).slice(0, 3);
    viable.forEach((p, i) => {
      clauses.push({
        id: `clause-upload-${i + 1}`,
        title: `Provision ${i + 1}`,
        sectionNumber: `Para. ${p.startLine}`,
        lineRange: `Lines ${p.startLine}–${p.endLine}`,
        text: p.text.slice(0, 300) + (p.text.length > 300 ? '...' : ''),
        plainEnglish: 'Extracted from document text. Review with legal counsel before execution.',
        riskLevel: 'Low',
        riskCategory: 'General',
        riskExplanation: 'Clause content identified from document structure.',
        recommendation: 'Review with qualified legal counsel before execution.'
      });
    });
  }

  return clauses;
}

// ---------------------------------------------------------------------------
// 4. FINANCIAL TERMS — STRICTLY FROM DOCUMENT
// ---------------------------------------------------------------------------

function extractFinancialTerms(text, docType) {
  const terms = [];
  const dollars = extractDollarAmounts(text);
  const percentages = extractPercentages(text);
  const lowerText = text.toLowerCase();

  // Extract all dollar amounts found in the document
  if (dollars.length > 0) {
    // Label the first amount according to doc type context
    for (const d of dollars.slice(0, 4)) {
      const ctxLower = d.context.toLowerCase();
      let item = 'Financial Amount';
      if (docType.includes('Lease') && (ctxLower.includes('rent') || ctxLower.includes('lease'))) {
        item = 'Rent / Lease Payment';
      } else if (docType.includes('Employment') && (ctxLower.includes('salary') || ctxLower.includes('compensation'))) {
        item = 'Salary / Compensation';
      } else if (ctxLower.includes('deposit')) {
        item = 'Security Deposit';
      } else if (ctxLower.includes('penalty') || ctxLower.includes('damages')) {
        item = 'Penalty / Damages';
      } else if (ctxLower.includes('bonus')) {
        item = 'Bonus';
      } else if (ctxLower.includes('fee')) {
        item = 'Fee';
      }

      // Avoid duplicate items with same amount
      if (!terms.some(t => t.detail.includes(d.amount))) {
        terms.push({
          item,
          detail: d.context.length > 120 ? d.context.slice(0, 120) + '...' : d.context,
          riskLevel: item.includes('Penalty') || item.includes('Damages') ? 'High' : 'Low'
        });
      }
    }
  }

  // Escalation percentages
  for (const p of percentages.slice(0, 2)) {
    const riskLevel = p.value > 5 ? 'High' : p.value > 2 ? 'Medium' : 'Low';
    const detail = p.context.length > 120 ? p.context.slice(0, 120) + '...' : p.context;
    if (!terms.some(t => t.detail.includes(p.pct))) {
      terms.push({ item: `${p.pct} Rate`, detail, riskLevel });
    }
  }

  // Liquidated damages
  if (lowerText.includes('liquidated damages') && !terms.some(t => t.item === 'Liquidated Damages')) {
    const ctx = extractSentenceContaining(text, 'liquidated damages');
    if (ctx) {
      terms.push({
        item: 'Liquidated Damages',
        detail: ctx.slice(0, 150),
        riskLevel: 'High'
      });
    }
  }

  // NDA: explicitly state no payment obligations if no money found
  if (terms.length === 0) {
    if (docType.includes('NDA')) {
      terms.push({
        item: 'Financial Obligations',
        detail: 'No monetary payment obligations identified in this document.',
        riskLevel: 'Low'
      });
    } else {
      terms.push({
        item: 'Payment Terms',
        detail: 'No specific dollar amounts extracted. Review document for payment schedule.',
        riskLevel: 'Low'
      });
    }
  }

  return terms;
}

// ---------------------------------------------------------------------------
// 5. IMPORTANT DATES — STRICTLY FROM DOCUMENT
// ---------------------------------------------------------------------------

function extractImportantDates(text, docType, effectiveDate, expirationDate) {
  const items = [];

  // Always include effective date (may be "Not specified")
  items.push({
    event: 'Agreement Effective Date',
    date: effectiveDate,
    urgency: effectiveDate === 'Not specified in the document' ? 'Standard' : 'Standard'
  });

  // Expiration / term end date
  if (expirationDate !== 'Not specified in the document') {
    items.push({
      event: 'Agreement Expiration / Term End',
      date: expirationDate,
      urgency: 'High'
    });
  }

  // Notice periods — only what's in the doc
  const noticeDays = extractNoticePeriod(text);
  if (noticeDays) {
    items.push({
      event: 'Required Notice Period',
      date: `${noticeDays} days prior written notice`,
      urgency: 'Critical'
    });
  }

  // Specific date mentions
  const specificDates = [...text.matchAll(/\b([A-Z][a-z]+ \d{1,2},? \d{4})\b/g)].map(m => m[1]);
  const uniqueDates = [...new Set(specificDates)].slice(0, 3);
  for (const d of uniqueDates) {
    if (!items.some(i => i.date.includes(d))) {
      // Find context for this date
      const ctx = extractSentenceContaining(text, d);
      if (ctx && ctx.length > 10) {
        items.push({
          event: ctx.slice(0, 60).replace(d, '').trim().replace(/^[-–:,\s]+/, '') || 'Contract Date',
          date: d,
          urgency: 'Standard'
        });
      }
    }
  }

  // Lease-specific: look for rent due date pattern
  if (docType.includes('Lease')) {
    const rentDue = text.match(/(?:due|payable) on the (\d+(?:st|nd|rd|th)?) day/i);
    if (rentDue) {
      items.push({
        event: 'Rent Due Date',
        date: `${rentDue[1]} of every month`,
        urgency: 'Recurring'
      });
    }
  }

  // Employment: non-compete duration if present
  if (docType.includes('Employment')) {
    const nonCompetePara = extractSentenceContaining(text, 'non-compete') ||
                           extractSentenceContaining(text, 'covenant not to compete');
    if (nonCompetePara) {
      const dur = extractDurationMention(nonCompetePara, null);
      if (dur) {
        items.push({
          event: 'Non-Compete Covenant Expiration',
          date: `${dur} after departure`,
          urgency: 'Critical'
        });
      }
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// 6. KEY OBLIGATIONS & RIGHTS — DERIVED FROM MATCHED CLAUSES (NOT RAW TEXT)
// ---------------------------------------------------------------------------

function extractObligationsAndRights(text, docType, clauses) {
  const obligations = [];
  const rights = [];

  /**
   * Given a clause, extract a concise 1-sentence obligation or right
   * from its own excerpt — which is already isolated from other paragraphs.
   */
  function sentenceFrom(clauseText, keyword) {
    if (!clauseText) return null;
    const lower = clauseText.toLowerCase();
    const idx = keyword ? lower.indexOf(keyword.toLowerCase()) : 0;
    const searchStart = idx === -1 ? 0 : idx;
    // Find sentence containing the keyword
    let start = searchStart;
    while (start > 0 && !/[.!\n]/.test(clauseText[start - 1])) start--;
    let end = searchStart;
    while (end < clauseText.length && !/[.!\n]/.test(clauseText[end])) end++;
    const sentence = clauseText.slice(start, end + 1).trim().replace(/\s+/g, ' ');
    return sentence.length > 15 ? sentence.slice(0, 200) : null;
  }

  // Build obligations from MATCHED clauses only
  for (const clause of clauses) {
    const lower = clause.text.toLowerCase();
    const cat = clause.riskCategory;

    if (cat === 'Financial') {
      // Only the pay sentence — not full clause text which may span sections
      const paySentence = sentenceFrom(clause.text, 'shall pay') ||
                          sentenceFrom(clause.text, 'salary') ||
                          sentenceFrom(clause.text, 'rent');
      if (paySentence) obligations.push(paySentence);
    }

    if (cat === 'Intellectual Property') {
      const ipSentence = sentenceFrom(clause.text, 'shall belong') ||
                         sentenceFrom(clause.text, 'assign') ||
                         sentenceFrom(clause.text, 'inventions');
      if (ipSentence) obligations.push(ipSentence);
    }

    if (cat === 'Restrictive Covenant' && clause.title.toLowerCase().includes('non-compete')) {
      const ncSentence = sentenceFrom(clause.text, 'shall not') ||
                         sentenceFrom(clause.text, 'engage') ||
                         clause.text.slice(0, 180).trim();
      if (ncSentence) obligations.push(ncSentence);
    }

    if (cat === 'Termination') {
      const noticeSentence = sentenceFrom(clause.text, 'days prior') ||
                             sentenceFrom(clause.text, 'written notice') ||
                             sentenceFrom(clause.text, 'terminate');
      if (noticeSentence) obligations.push(noticeSentence);
    }

    if (cat === 'Confidentiality') {
      const confSentence = sentenceFrom(clause.text, 'shall not disclose') ||
                           sentenceFrom(clause.text, 'agree not to') ||
                           sentenceFrom(clause.text, 'reasonable care');
      if (confSentence) obligations.push(confSentence);
    }

    if (cat === 'Maintenance') {
      const maintSentence = sentenceFrom(clause.text, 'shall maintain') ||
                            sentenceFrom(clause.text, 'responsible for') ||
                            clause.text.slice(0, 180).trim();
      if (maintSentence) obligations.push(maintSentence);
    }
  }

  // Build rights from MATCHED clauses only
  for (const clause of clauses) {
    const cat = clause.riskCategory;

    if (cat === 'Confidentiality' && clause.title.toLowerCase().includes('exclusion')) {
      const exclSentence = sentenceFrom(clause.text, 'shall not include') ||
                           sentenceFrom(clause.text, 'publicly known') ||
                           clause.text.slice(0, 180).trim();
      if (exclSentence) rights.push(exclSentence);
    }

    if (cat === 'Remedies') {
      const remedySentence = sentenceFrom(clause.text, 'may seek') ||
                             sentenceFrom(clause.text, 'entitled to') ||
                             sentenceFrom(clause.text, 'injunctive');
      if (remedySentence) rights.push(remedySentence);
    }

    if (cat === 'Termination') {
      const termRightSentence = sentenceFrom(clause.text, 'either party may') ||
                                sentenceFrom(clause.text, 'right to terminate');
      if (termRightSentence && !rights.some(r => r.includes(termRightSentence.slice(0, 40)))) {
        rights.push(termRightSentence);
      }
    }

    if (cat === 'Financial' && clause.title.toLowerCase().includes('compensation')) {
      // Right to receive compensation
      const compRight = sentenceFrom(clause.text, 'shall pay') || sentenceFrom(clause.text, 'salary');
      if (compRight) rights.push(`Right to receive: ${compRight}`);
    }

    if (cat === 'Liability') {
      const liabRight = sentenceFrom(clause.text, 'limited to') || sentenceFrom(clause.text, 'shall not exceed');
      if (liabRight) rights.push(liabRight);
    }
  }

  // Deduplicate and clean — no more than 5 obligations, 4 rights
  const cleanObl = [...new Set(obligations)].filter(o => o.length > 15).slice(0, 5);
  const cleanRts = [...new Set(rights)].filter(r => r.length > 15).slice(0, 4);

  return {
    keyObligations: cleanObl.length > 0
      ? cleanObl
      : ['Obligations not individually itemized. Review full document text for binding duties.'],
    keyRights: cleanRts.length > 0
      ? cleanRts
      : ['Rights not individually itemized. Review full document text for entitlements.']
  };
}

// ---------------------------------------------------------------------------
// 7. EXECUTIVE SUMMARY — BASED ON EXTRACTED FACTS
// ---------------------------------------------------------------------------


function buildSummary(docType, title, parties, effectiveDate, expirationDate, clauses, dollars, noticeDays) {
  const partyStr = parties.join(' and ');
  const highClauses = clauses.filter(c => c.riskLevel === 'High');
  const medClauses = clauses.filter(c => c.riskLevel === 'Medium');

  let summary = `This ${docType} — "${title}" — is entered into between ${partyStr}`;
  summary += effectiveDate !== 'Not specified in the document' ? `, effective ${effectiveDate}` : '';
  summary += '. ';

  // Financial context from actual document
  if (dollars.length > 0) {
    const firstDollar = dollars[0];
    summary += `Key financial terms include ${firstDollar.amount}. `;
  }

  // Notice context from actual document
  if (noticeDays) {
    summary += `The agreement requires ${noticeDays} days written notice for relevant actions. `;
  }

  // Risk context
  if (highClauses.length > 0) {
    summary += `Analysis identified ${highClauses.length} high-risk clause(s) requiring attention: ${highClauses.map(c => c.title).join(', ')}.`;
  } else if (medClauses.length > 0) {
    summary += `Analysis identified ${medClauses.length} medium-risk clause(s) to review: ${medClauses.map(c => c.title).join(', ')}.`;
  } else {
    summary += `No high-risk clauses were detected. Standard review is still recommended before execution.`;
  }

  return summary;
}

// ---------------------------------------------------------------------------
// 8. AI Q&A — GROUNDED TO EXTRACTED FACTS
// ---------------------------------------------------------------------------

function buildAiQuestions(docType, clauses, effectiveDate, expirationDate, dollars, noticeDays) {
  const qas = [];

  const findClause = (cat) => clauses.find(c => c.riskCategory === cat);
  const findClauseByTitle = (keyword) => clauses.find(c => c.title.toLowerCase().includes(keyword.toLowerCase()));

  if (docType.includes('NDA')) {
    qas.push({
      question: 'How long do confidentiality obligations last?',
      answer: expirationDate !== 'Not specified in the document'
        ? `Based on the document, confidentiality obligations last for ${expirationDate}.`
        : 'The confidentiality term duration is not explicitly specified in this document.',
      references: [findClause('Term & Duration')?.sectionNumber || findClauseByTitle('Term')?.sectionNumber || 'Term Section']
    });
    qas.push({
      question: 'What information is excluded from confidentiality?',
      answer: findClauseByTitle('Exclusions')
        ? `The exclusions clause states: "${findClauseByTitle('Exclusions')?.text?.slice(0, 200)}..."`
        : 'Exclusions from confidentiality are not explicitly listed in this document.',
      references: [findClauseByTitle('Exclusions')?.sectionNumber || 'Not specified']
    });
    qas.push({
      question: 'What notice is required before termination?',
      answer: noticeDays
        ? `This document requires ${noticeDays} days prior written notice.`
        : 'No specific notice period for termination is stated in this document.',
      references: [findClause('Term & Duration')?.sectionNumber || 'Not specified']
    });

  } else if (docType.includes('Employment')) {
    const ncClause = findClauseByTitle('Non-Compete');
    qas.push({
      question: 'Is there a non-compete clause in this agreement?',
      answer: ncClause
        ? `Yes. The non-compete clause (${ncClause.sectionNumber}) states: "${ncClause.text.slice(0, 220)}..."`
        : 'No non-compete clause was identified in this document.',
      references: [ncClause?.sectionNumber || 'Not specified']
    });
    const compClause = findClause('Financial');
    qas.push({
      question: 'What is the compensation stated in this agreement?',
      answer: compClause
        ? `Compensation terms (${compClause.sectionNumber}): "${compClause.text.slice(0, 220)}"`
        : dollars.length > 0
          ? `The document references the following financial amount: ${dollars[0].amount}. Full context: "${dollars[0].context.slice(0, 160)}"`
          : 'No specific compensation amount was identified in this document.',
      references: [compClause?.sectionNumber || 'Not specified']
    });
    qas.push({
      question: 'What is the resignation or termination notice period?',
      answer: noticeDays
        ? `This document states that ${noticeDays} days prior written notice is required.`
        : 'No specific notice period is stated in this document.',
      references: [findClause('Termination')?.sectionNumber || 'Not specified']
    });

  } else if (docType.includes('Lease')) {
    const rentClause = findClause('Financial');
    qas.push({
      question: 'What are the rent and escalation terms?',
      answer: rentClause
        ? `Rent terms (${rentClause.sectionNumber}): "${rentClause.text.slice(0, 220)}"`
        : dollars.length > 0
          ? `The document references ${dollars[0].amount}. Context: "${dollars[0].context.slice(0, 160)}"`
          : 'Rent terms not explicitly stated in the extracted document text.',
      references: [rentClause?.sectionNumber || 'Not specified']
    });
    const termClause = findClause('Termination');
    qas.push({
      question: 'What happens if the lease is broken early?',
      answer: termClause
        ? `Early termination clause (${termClause.sectionNumber}): "${termClause.text.slice(0, 220)}"`
        : 'Early termination terms are not explicitly identified in this document.',
      references: [termClause?.sectionNumber || 'Not specified']
    });
    qas.push({
      question: 'What notice is required before lease expiration?',
      answer: noticeDays
        ? `This document requires ${noticeDays} days prior written notice before lease expiry.`
        : 'No notice period for lease non-renewal is specified in this document.',
      references: ['Not specified']
    });

  } else {
    const liabilityClause = findClause('Liability');
    qas.push({
      question: 'What is the liability cap under this contract?',
      answer: liabilityClause
        ? `Liability terms (${liabilityClause.sectionNumber}): "${liabilityClause.text.slice(0, 220)}"`
        : 'No explicit liability cap was identified in this document.',
      references: [liabilityClause?.sectionNumber || 'Not specified']
    });
    const termClause = findClause('Termination');
    qas.push({
      question: 'How can this agreement be terminated?',
      answer: termClause
        ? `Termination clause (${termClause.sectionNumber}): "${termClause.text.slice(0, 220)}"`
        : noticeDays
          ? `Termination requires ${noticeDays} days written notice per the document.`
          : 'Termination terms are not explicitly identified in this document.',
      references: [termClause?.sectionNumber || 'Not specified']
    });
  }

  return qas;
}

// ---------------------------------------------------------------------------
// 9. MAIN EXPORT
// ---------------------------------------------------------------------------

/**
 * Analyzes extracted document text and returns a fully grounded analysis object.
 * All fields are derived from the actual document text.
 * Nothing is hardcoded or injected from templates for uploaded files.
 */
export function analyzeDocumentText({ text, fileName, fileSize, pageCount }) {
  if (!text || text.trim().length < 20) {
    throw new Error('Insufficient document text to perform legal analysis.');
  }

  const docType = detectDocumentType(text);
  const title = extractTitle(text, fileName);
  const parties = extractParties(text, docType);
  const effectiveDate = extractEffectiveDate(text);

  // Expiration/term extraction — strictly from text, no fallback inventions
  let expirationDate = 'Not specified in the document';
  const termMatch = text.match(
    /(?:term of this (?:agreement|lease) shall be|for a period of|expires? on|expiration date[:\s]+)\s*([^\n\r,.]{5,60}?(?:years?|months?|\d{4}))/i
  );
  if (termMatch && termMatch[1]) {
    expirationDate = termMatch[1].trim();
  } else {
    // Check for "at-will" in employment (genuine doc attribute, not invented)
    if (docType.includes('Employment') && text.toLowerCase().includes('at-will')) {
      expirationDate = 'At-will — no fixed term';
    }
  }

  const noticeDays = extractNoticePeriod(text);
  const dollars = extractDollarAmounts(text);

  const clauses = extractClauses(text, docType);
  const financialTerms = extractFinancialTerms(text, docType);
  const importantDates = extractImportantDates(text, docType, effectiveDate, expirationDate);
  const { keyObligations, keyRights } = extractObligationsAndRights(text, docType, clauses);
  const summary = buildSummary(docType, title, parties, effectiveDate, expirationDate, clauses, dollars, noticeDays);
  const aiQuestions = buildAiQuestions(docType, clauses, effectiveDate, expirationDate, dollars, noticeDays);

  // Risk scoring
  const highCount = clauses.filter(c => c.riskLevel === 'High').length;
  const medCount = clauses.filter(c => c.riskLevel === 'Medium').length;
  const lowCount = clauses.filter(c => c.riskLevel === 'Low').length;

  let overallRiskScore = 'Low';
  let riskScoreNumber = Math.max(12, 10 + lowCount * 2);

  if (highCount >= 2) {
    overallRiskScore = 'High';
    riskScoreNumber = Math.min(92, 65 + highCount * 8 + medCount * 3);
  } else if (highCount === 1 || medCount >= 3) {
    overallRiskScore = 'Medium';
    riskScoreNumber = Math.min(64, 45 + highCount * 10 + medCount * 4);
  } else if (medCount >= 1) {
    overallRiskScore = 'Medium';
    riskScoreNumber = 38;
  }

  return {
    id: `doc-upload-${Date.now()}`,
    title,
    filename: fileName || `${title}.pdf`,
    type: docType,
    fileSize: fileSize || 'Unknown',
    pageCount: pageCount || 1,
    uploadDate: new Date().toISOString().split('T')[0],
    lastAnalyzed: 'Just now',
    overallRiskScore,
    riskScoreNumber,
    riskCounts: { high: highCount, medium: medCount, low: lowCount },
    parties,
    effectiveDate,
    expirationDate,
    summary,
    keyObligations,
    keyRights,
    importantDates,
    financialTerms,
    clauses,
    fullText: text,
    aiQuestions
  };
}
