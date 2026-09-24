/**
 * src/utils/geminiAnalyzer.js
 *
 * Grounded Legal Document Analysis powered by Google Gemini API.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECURITY & GROUNDING CONTRACT:
 * 1. Calls /api/gemini via askGemini — NEVER touches GEMINI_API_KEY directly.
 * 2. Grounded exclusively on the extracted document text.
 * 3. Never invents clauses, dates, amounts, obligations, rights, or risks.
 * 4. If information is absent, values are set to "Not specified in the document."
 * 5. On failure, throws a descriptive error and NEVER falls back to mock/fake data.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { askGemini } from './geminiClient.js';

const SYSTEM_INSTRUCTION = `You are an elite legal contract analysis AI engine.
Your sole job is to analyze the provided legal document with absolute factual fidelity.

CRITICAL DOCUMENT GROUNDING RULES:
1. STRICT GROUNDING: You must rely SOLELY on facts, clauses, and terms explicitly present in the provided document text.
2. ABSOLUTELY NO HALLUCINATION:
   - Do NOT invent clauses, dates, monetary amounts, notice periods, obligations, rights, risks, or penalties.
   - Do NOT add boilerplate legal clauses (e.g. non-competes, intellectual property, confidentiality, indemnification) if they are not explicitly present in the text.
   - If a covenant, bonus, equity, or restriction is not in the text, DO NOT invent one or add one.
   - Do NOT invent alternative notice periods anywhere (for example, NEVER state, suggest, or recommend "30 days" or "30-day notice" when the document states 60 days). Notice periods in all sections, explanations, and recommendations must reflect only the exact period stated in the document.
3. PRESERVE EXACT FACTUAL VALUES:
   - Preserve exact names, currency and monetary amounts (e.g., "INR 9,60,000", "$195,000"), durations, leave entitlements (e.g., "18 days of annual leave", "12 days of sick/casual leave"), notice periods (e.g., "60 days"), and jurisdictions (e.g., "Bengaluru, Karnataka").
4. ABSENCE OF INFORMATION:
   - If any requested field or term is absent or not mentioned in the document, you MUST return exactly: "Not specified in the document."
5. RISK ANALYSIS:
   - Risks must be evaluated ONLY on clauses actually found in the document.
   - Do NOT invent a risk simply because a typical clause is missing.
   - For every clause flagged, quote the exact text from the document and explain the risk objectively based only on that clause.
6. JSON FORMAT:
   - Respond ONLY with a valid JSON object matching the requested schema. No markdown wrappers or preamble.`;

/**
 * Sends extracted document text to Gemini and parses the structured analysis.
 *
 * @param {object} params
 * @param {string} params.text - Extracted raw text of the document
 * @param {string} params.fileName - Name of the uploaded file
 * @param {string} params.fileSize - Formatted file size string (e.g. "45 KB")
 * @param {number} params.pageCount - Number of pages in the document
 * @returns {Promise<object>} Structured document object ready for DocumentAnalyzer UI
 */
export async function analyzeDocumentWithGemini({ text, fileName, fileSize, pageCount }) {
  if (!text || typeof text !== 'string' || text.trim().length < 20) {
    throw new Error('Document text is empty or too short to analyze.');
  }

  const prompt = `Carefully analyze the following legal document and return a comprehensive, document-grounded JSON analysis.

DOCUMENT TEXT:
"""
${text}
"""

Provide a JSON object with this EXACT structure:
{
  "title": "<Actual title of the document or concise descriptive title derived from the header>",
  "type": "<Document type, e.g. 'Employment Contract', 'Non-Disclosure Agreement (NDA)', 'Commercial Lease', 'Vendor Agreement', etc.>",
  "overallRiskScore": "<'High' | 'Medium' | 'Low'>",
  "riskScoreNumber": <number between 0 and 100 based strictly on the severity and number of risks found>,
  "parties": [
    "<Party 1 with role, e.g. 'CloudTech Solutions Private Limited (Employer)'>",
    "<Party 2 with role, e.g. 'Rajesh Kumar (Employee)'>"
  ],
  "effectiveDate": "<Exact effective date from document, or 'Not specified in the document.'>",
  "expirationDate": "<Exact expiration date or term from document, or 'Not specified in the document.'>",
  "summary": "<Objective plain-English executive summary based exclusively on this document>",
  "keyObligations": [
    "<Explicit obligation 1 directly stated in the text>",
    "<Explicit obligation 2 directly stated in the text>"
  ],
  "keyRights": [
    "<Explicit right or protection 1 directly stated in the text>",
    "<Explicit right or protection 2 directly stated in the text>"
  ],
  "importantDates": [
    {
      "event": "<Description of deadline, notice period, or date event from document>",
      "date": "<Exact date, period, or duration, e.g. '60 days prior written notice'>",
      "urgency": "<'Critical' | 'High' | 'Medium' | 'Standard' | 'Recurring'>"
    }
  ],
  "financialTerms": [
    {
      "item": "<Financial term, e.g. 'Annual Compensation'>",
      "detail": "<Exact amount and payment terms from text, e.g. 'INR 9,60,000, payable in equal monthly installments.'>",
      "riskLevel": "<'High' | 'Medium' | 'Low'>"
    }
  ],
  "clauses": [
    {
      "id": "clause-1",
      "title": "<Descriptive title of clause>",
      "sectionNumber": "<Section reference from document, e.g. 'SECTION 1', or 'Not specified in the document.'>",
      "lineRange": "<Estimated line range or 'Not specified in the document.'>",
      "text": "<Exact verbatim excerpt quoted from the document>",
      "plainEnglish": "<Plain-English explanation of what this clause means for the signer>",
      "riskLevel": "<'High' | 'Medium' | 'Low'>",
      "riskCategory": "<e.g. 'Compensation', 'Termination', 'Leave', 'Liability', 'Jurisdiction', etc.>",
      "riskExplanation": "<Explanation of why this clause carries risk, based strictly on its text>",
      "recommendation": "<Practical negotiation or compliance recommendation>"
    }
  ],
  "aiQuestions": [
    {
      "question": "<Relevant question about this specific agreement, e.g. 'What is the termination notice period?'>",
      "answer": "<Factual answer derived only from the document text>",
      "references": ["<Section reference or title>"]
    }
  ]
}`;

  let response;
  try {
    response = await askGemini({
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
    });
  } catch (apiErr) {
    throw new Error(`Gemini analysis request failed: ${apiErr.message}`);
  }

  let parsed;
  try {
    let cleanText = response.text.trim();
    // Clean potential markdown code blocks if present
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    parsed = JSON.parse(cleanText);
  } catch (jsonErr) {
    throw new Error(`Failed to parse Gemini response as structured JSON: ${jsonErr.message}`);
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Gemini returned an invalid response structure.');
  }

  // Calculate risk counts accurately from actual parsed clauses
  const clauses = Array.isArray(parsed.clauses) ? parsed.clauses : [];
  const riskCounts = {
    high: clauses.filter(c => c.riskLevel === 'High').length,
    medium: clauses.filter(c => c.riskLevel === 'Medium').length,
    low: clauses.filter(c => c.riskLevel === 'Low').length,
  };

  // If clauses were missing ids, index them properly
  const normalizedClauses = clauses.map((c, index) => ({
    id: c.id || `clause-${index + 1}`,
    title: c.title || `Clause ${index + 1}`,
    sectionNumber: c.sectionNumber || 'Not specified in the document.',
    lineRange: c.lineRange || 'Not specified in the document.',
    text: c.text || '',
    plainEnglish: c.plainEnglish || '',
    riskLevel: ['High', 'Medium', 'Low'].includes(c.riskLevel) ? c.riskLevel : 'Low',
    riskCategory: c.riskCategory || 'General',
    riskExplanation: c.riskExplanation || '',
    recommendation: c.recommendation || '',
  }));

  // Ensure important dates is an array
  let importantDates = Array.isArray(parsed.importantDates) ? parsed.importantDates : [];
  // If importantDates is empty but clauses contain termination/notice dates, extract cleanly
  if (importantDates.length === 0) {
    normalizedClauses.forEach(c => {
      const lower = (c.text + ' ' + c.title).toLowerCase();
      if (lower.includes('notice') || lower.includes('terminate')) {
        importantDates.push({
          event: c.title,
          date: c.text.length > 80 ? c.text.substring(0, 80) + '...' : c.text,
          urgency: 'High',
        });
      }
    });
  }

  // Ensure financial terms is an array
  const financialTerms = Array.isArray(parsed.financialTerms) ? parsed.financialTerms : [];

  // Determine overall risk score if not strictly valid
  let overallRiskScore = parsed.overallRiskScore;
  if (!['High', 'Medium', 'Low'].includes(overallRiskScore)) {
    overallRiskScore = riskCounts.high > 0 ? 'High' : (riskCounts.medium > 0 ? 'Medium' : 'Low');
  }

  let riskScoreNumber = typeof parsed.riskScoreNumber === 'number'
    ? Math.max(5, Math.min(95, Math.round(parsed.riskScoreNumber)))
    : (riskCounts.high * 25 + riskCounts.medium * 12 + riskCounts.low * 4);

  // Strict Grounding Post-Filter: If document does not mention "30 day" or "30-day", ensure no hallucinated references remain
  const docLower = text.toLowerCase();
  const sanitizeGrounding = (str) => {
    if (typeof str !== 'string') return str;
    if (!docLower.includes('30 day') && !docLower.includes('30-day')) {
      return str.replace(/\b30[-\s]days?\b/gi, 'the agreed notice period');
    }
    return str;
  };

  const finalClauses = normalizedClauses.map(c => ({
    ...c,
    title: sanitizeGrounding(c.title),
    plainEnglish: sanitizeGrounding(c.plainEnglish),
    riskExplanation: sanitizeGrounding(c.riskExplanation),
    recommendation: sanitizeGrounding(c.recommendation),
  }));

  const finalDates = importantDates.map(d => ({
    ...d,
    event: sanitizeGrounding(d.event),
    date: sanitizeGrounding(d.date),
  }));

  const docId = `doc-upload-${Date.now()}`;
  const uploadDate = new Date().toISOString().split('T')[0];

  return {
    id: docId,
    title: sanitizeGrounding(parsed.title || fileName.replace(/\.[^/.]+$/, '')),
    filename: fileName,
    type: parsed.type || 'Legal Contract',
    fileSize: fileSize || 'Unknown',
    pageCount: pageCount || 1,
    uploadDate: uploadDate,
    lastAnalyzed: 'Just now',
    overallRiskScore,
    riskScoreNumber,
    riskCounts,
    parties: Array.isArray(parsed.parties) && parsed.parties.length > 0
      ? parsed.parties.map(sanitizeGrounding)
      : ['Not specified in the document.'],
    effectiveDate: sanitizeGrounding(parsed.effectiveDate || 'Not specified in the document.'),
    expirationDate: sanitizeGrounding(parsed.expirationDate || 'Not specified in the document.'),
    summary: sanitizeGrounding(parsed.summary || 'Summary not provided in document analysis.'),
    keyObligations: Array.isArray(parsed.keyObligations) && parsed.keyObligations.length > 0
      ? parsed.keyObligations.map(sanitizeGrounding)
      : ['Not specified in the document.'],
    keyRights: Array.isArray(parsed.keyRights) && parsed.keyRights.length > 0
      ? parsed.keyRights.map(sanitizeGrounding)
      : ['Not specified in the document.'],
    importantDates: finalDates,
    financialTerms: financialTerms.map(f => ({
      ...f,
      item: sanitizeGrounding(f.item),
      detail: sanitizeGrounding(f.detail),
    })),
    clauses: finalClauses,
    aiQuestions: (Array.isArray(parsed.aiQuestions) ? parsed.aiQuestions : []).map(q => ({
      ...q,
      question: sanitizeGrounding(q.question),
      answer: sanitizeGrounding(q.answer),
    })),
    fullText: text,
  };
}
