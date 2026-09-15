// LexiLaw AI - Comprehensive Mock Dataset for Legal Document Companion

export const SAMPLE_DOCUMENTS = [
  {
    id: 'doc-lease-2024',
    title: 'Commercial Office Lease Agreement 2024',
    filename: 'Commercial_Office_Lease_v2.4.pdf',
    type: 'Commercial Lease',
    fileSize: '2.4 MB',
    pageCount: 14,
    uploadDate: '2026-09-14',
    lastAnalyzed: '2 hours ago',
    overallRiskScore: 'High',
    riskScoreNumber: 76, // 0 - 100 risk scale
    riskCounts: { high: 3, medium: 4, low: 5 },
    parties: ['Apex Heights Commercial Properties LLC (Landlord)', 'Nexus Software Solutions Inc. (Tenant)'],
    effectiveDate: 'October 1, 2024',
    expirationDate: 'September 30, 2029 (5 Year Term)',
    summary: 'This Commercial Office Lease Agreement establishes a 5-year tenancy for Office Suite 800 at 450 Tech Plaza. While standard in structure, it contains aggressive financial escalation clauses, uncapped indemnification obligations on the tenant, and strict assignment restrictions requiring landlord consent with high fees.',
    keyObligations: [
      'Tenant must pay $18,500 monthly base rent due on the 1st of each month.',
      'Tenant is responsible for 100% of HVAC maintenance and replacement costs exceeding $1,500 per incident.',
      'Tenant must maintain $2,000,000 general liability insurance naming Landlord as additional insured.',
      'Written notice of non-renewal required 180 days prior to lease expiration.'
    ],
    keyRights: [
      'Tenant has exclusive right to occupy Suite 800 during the lease term.',
      'Right of first refusal for contiguous space on Floor 8 if Landlord seeks to lease it.',
      'Access to building parking facility with 12 assigned unreserved parking spaces.'
    ],
    importantDates: [
      { event: 'Monthly Rent Payment Due', date: '1st of every month', urgency: 'Recurring' },
      { event: 'Annual Base Rent Escalation (+15%)', date: 'October 1 annually', urgency: 'High' },
      { event: 'Lease Non-Renewal Notice Deadline', date: 'April 3, 2029', urgency: 'Critical' },
      { event: 'Lease Expiration Date', date: 'September 30, 2029', urgency: 'Standard' }
    ],
    financialTerms: [
      { item: 'Initial Base Rent', detail: '$18,500 / month ($222,000 annual)', riskLevel: 'Low' },
      { item: 'Annual Rent Escalation', detail: '15% compulsory increase annually (market standard is 3-5%)', riskLevel: 'High' },
      { item: 'Security Deposit', detail: '$55,500 (3 months rent)', riskLevel: 'Medium' },
      { item: 'Operating Expense Pass-Through', detail: 'Uncapped proportional share of building tax & utility increases', riskLevel: 'High' }
    ],
    clauses: [
      {
        id: 'clause-1',
        title: 'Rent Escalation & Adjustment',
        sectionNumber: 'Section 4.2',
        lineRange: 'Lines 45-58',
        text: 'Beginning on the first anniversary of the Commencement Date and on each anniversary thereafter, the Base Rent shall automatically increase by fifteen percent (15%) over the Base Rent payable during the immediately preceding lease year.',
        plainEnglish: 'Your rent will go up by 15% every single year automatically. Over 5 years, your rent will almost double from $18,500/mo to $32,357/mo.',
        riskLevel: 'High',
        riskCategory: 'Financial',
        riskExplanation: 'A 15% annual escalation is dramatically higher than standard commercial office market rates (typically 3% to 5%). This compound growth creates severe financial liability.',
        recommendation: 'Negotiate the annual escalation down to a capped rate between 3% and 4%, or tie it to the Consumer Price Index (CPI).'
      },
      {
        id: 'clause-2',
        title: 'Tenant Indemnification & Liability',
        sectionNumber: 'Section 11.1',
        lineRange: 'Lines 120-138',
        text: 'Tenant agrees to defend, indemnify, and hold harmless Landlord from and against any and all claims, damages, liabilities, losses, costs, and expenses (including attorneys fees) arising from any occurrence in or about the Premises, without cap or limitation.',
        plainEnglish: 'You are completely responsible for any damage, injury, or legal lawsuit that happens on the premises, with no maximum dollar cap on your liability.',
        riskLevel: 'High',
        riskCategory: 'Liability',
        riskExplanation: 'Uncapped indemnity exposes your business to unlimited legal payouts even if incidents are caused by structural faults or Landlord negligence.',
        recommendation: 'Insist on mutual indemnification and add a requirement that indemnity excludes Landlord’s gross negligence or willful misconduct, capped at insurance limits.'
      },
      {
        id: 'clause-3',
        title: 'Maintenance & Capital Repairs',
        sectionNumber: 'Section 8.4',
        lineRange: 'Lines 92-108',
        text: 'Tenant shall keep and maintain the Premises in good order and repair, including all HVAC systems, electrical panels, plumbing fixtures, and glass windows. Tenant shall be sole responsible for full replacement of HVAC units if deemed unserviceable.',
        plainEnglish: 'You are responsible for fixing and replacing major building equipment like air conditioning units and electrical systems, even though you do not own the building.',
        riskLevel: 'High',
        riskCategory: 'Maintenance',
        riskExplanation: 'Commercial tenants should typically only pay routine maintenance contracts for HVAC; full capital replacement of structural HVAC belongs to the property owner.',
        recommendation: 'Modify clause so Tenant pays only for routine servicing up to $1,000/year, while structural and capital replacements remain Landlord’s responsibility.'
      },
      {
        id: 'clause-4',
        title: 'Early Termination & Default Notice',
        sectionNumber: 'Section 16.3',
        lineRange: 'Lines 175-190',
        text: 'In the event Tenant defaults on any term or desires early termination, Tenant shall immediately accelerate and pay all remaining Base Rent for the unexpired Term plus a liquidated damages penalty of 6 months rent.',
        plainEnglish: 'If you need to break the lease early, you must pay all future rent for all remaining years upfront PLUS a 6-month cash penalty.',
        riskLevel: 'Medium',
        riskCategory: 'Termination',
        riskExplanation: 'Accelerated rent without a duty for Landlord to mitigate damages (re-lease the space) is punitive and unenforceable in some jurisdictions.',
        recommendation: 'Add a Landlord duty to mitigate damages by attempting to re-lease the space, and limit early termination penalties to 3 months base rent.'
      },
      {
        id: 'clause-5',
        title: 'Subletting & Assignment',
        sectionNumber: 'Section 14.1',
        lineRange: 'Lines 145-162',
        text: 'Tenant shall not assign, sublet, or transfer this Lease without Landlord’s prior written consent, which Landlord may withhold in its sole and absolute discretion. Landlord shall charge a $5,000 administrative fee for review.',
        plainEnglish: 'You cannot sublease extra space to anyone else unless the landlord agrees. The landlord can say NO for any reason or no reason at all, and charges $5,000 just to consider it.',
        riskLevel: 'Medium',
        riskCategory: 'Operational',
        riskExplanation: 'Landlord can arbitrarily block your ability to mitigate costs if your business downsizes.',
        recommendation: 'Change "sole and absolute discretion" to "which consent shall not be unreasonably withheld, conditioned, or delayed," and reduce admin fee to $500.'
      },
      {
        id: 'clause-6',
        title: 'Use & Hours of Operation',
        sectionNumber: 'Section 2.1',
        lineRange: 'Lines 18-30',
        text: 'The Premises shall be used solely for standard commercial tech office operations between the hours of 7:00 AM and 8:00 PM Monday through Friday.',
        plainEnglish: 'The office can only be used on weekdays from 7 AM to 8 PM. Weekend work or late night software deployments are restricted.',
        riskLevel: 'Low',
        riskCategory: 'Operational',
        riskExplanation: 'Restricts 24/7 keycard access, which is standard for software and technology teams.',
        recommendation: 'Request 24/7/365 building keycard access for authorized employees.'
      }
    ],
    fullText: `COMMERCIAL OFFICE LEASE AGREEMENT

This Commercial Office Lease Agreement ("Lease") is entered into this 1st day of October, 2024, by and between APEX HEIGHTS COMMERCIAL PROPERTIES LLC ("Landlord"), and NEXUS SOFTWARE SOLUTIONS INC. ("Tenant").

SECTION 1. PREMISES & TERM
1.1 Landlord hereby leases to Tenant and Tenant leases from Landlord Suite 800 located on the 8th floor of 450 Tech Plaza, San Francisco, CA ("Premises"), consisting of approximately 6,000 square feet.
1.2 The term of this Lease shall be five (5) years, commencing October 1, 2024, and ending September 30, 2029.

SECTION 2. USE & ACCESS
2.1 The Premises shall be used solely for standard commercial tech office operations between the hours of 7:00 AM and 8:00 PM Monday through Friday.

SECTION 4. RENT & ESCALATION
4.1 Tenant shall pay Base Rent of $18,500.00 per month, due on the first day of each calendar month.
4.2 Beginning on the first anniversary of the Commencement Date and on each anniversary thereafter, the Base Rent shall automatically increase by fifteen percent (15%) over the Base Rent payable during the immediately preceding lease year.

SECTION 8. MAINTENANCE & REPAIRS
8.4 Tenant shall keep and maintain the Premises in good order and repair, including all HVAC systems, electrical panels, plumbing fixtures, and glass windows. Tenant shall be sole responsible for full replacement of HVAC units if deemed unserviceable.

SECTION 11. INDEMNIFICATION
11.1 Tenant agrees to defend, indemnify, and hold harmless Landlord from and against any and all claims, damages, liabilities, losses, costs, and expenses (including attorneys fees) arising from any occurrence in or about the Premises, without cap or limitation.

SECTION 14. ASSIGNMENT & SUBLETTING
14.1 Tenant shall not assign, sublet, or transfer this Lease without Landlord’s prior written consent, which Landlord may withhold in its sole and absolute discretion. Landlord shall charge a $5,000 administrative fee for review.

SECTION 16. DEFAULT & TERMINATION
16.3 In the event Tenant defaults on any term or desires early termination, Tenant shall immediately accelerate and pay all remaining Base Rent for the unexpired Term plus a liquidated damages penalty of 6 months rent.`,
    aiQuestions: [
      {
        question: 'What is the total financial commitment over the 5-year term?',
        answer: 'Based on Section 4.2 (+15% annual compound escalation), the monthly rent increases as follows: Year 1: $18,500/mo ($222,000/yr), Year 2: $21,275/mo ($255,300/yr), Year 3: $24,466/mo ($293,595/yr), Year 4: $28,136/mo ($337,634/yr), Year 5: $32,357/mo ($388,280/yr). Total 5-year Base Rent obligation is approximately $1,496,809.',
        references: ['Section 4.1', 'Section 4.2']
      },
      {
        question: 'Are there any non-standard tenant obligations?',
        answer: 'Yes! Section 8.4 mandates that the Tenant is responsible for full capital replacement of HVAC units if they break down, which is traditionally a Landlord expense. Furthermore, Section 11.1 imposes uncapped indemnification on the Tenant.',
        references: ['Section 8.4', 'Section 11.1']
      },
      {
        question: 'What happens if we need to terminate early?',
        answer: 'Under Section 16.3, early termination triggers rent acceleration (you must pay ALL remaining rent for the rest of the 5 years upfront) plus a 6-month rent penalty fee. This is a severe high-risk clause.',
        references: ['Section 16.3']
      }
    ]
  },

  {
    id: 'doc-employment-2024',
    title: 'Senior Engineer Employment Agreement',
    filename: 'Employment_Agreement_Sr_Engineer.pdf',
    type: 'Employment Contract',
    fileSize: '1.1 MB',
    pageCount: 8,
    uploadDate: '2026-09-10',
    lastAnalyzed: '1 day ago',
    overallRiskScore: 'Medium',
    riskScoreNumber: 52,
    riskCounts: { high: 1, medium: 3, low: 4 },
    parties: ['Vanguard Innovations Corp (Employer)', 'Alex Morgan (Employee)'],
    effectiveDate: 'November 1, 2024',
    expirationDate: 'At-Will Employment',
    summary: 'A comprehensive employment agreement for a Senior Software Role. Includes competitive compensation ($185,000 base + equity options), but features a broad 2-year non-compete covenant and full IP assignment that extends to personal open-source projects built outside working hours.',
    keyObligations: [
      'Perform duties as Lead Systems Architect reportable to the VP of Engineering.',
      'Devote full business time and best efforts exclusively to Vanguard Innovations.',
      'Maintain strict confidentiality of company trade secrets and proprietary codebases.',
      'Provide 30 days written notice prior to voluntary resignation.'
    ],
    keyRights: [
      '$185,000 annual base salary payable bi-weekly.',
      '40,000 Stock Options subject to standard 4-year vesting with 1-year cliff.',
      'Comprehensive medical, dental, and 401(k) matching up to 4%.'
    ],
    importantDates: [
      { event: 'Employment Start Date', date: 'November 1, 2024', urgency: 'Standard' },
      { event: 'Equity Vesting Cliff (25%)', date: 'November 1, 2025', urgency: 'High' },
      { event: 'Post-Employment Non-Compete Expiration', date: '24 months after departure', urgency: 'Critical' }
    ],
    financialTerms: [
      { item: 'Base Annual Salary', detail: '$185,000 USD', riskLevel: 'Low' },
      { item: 'Annual Target Performance Bonus', detail: 'Up to 15% ($27,750) subject to Board approval', riskLevel: 'Low' },
      { item: 'Severance Pay', detail: '2 weeks per year of service (capped at 8 weeks maximum)', riskLevel: 'Medium' }
    ],
    clauses: [
      {
        id: 'clause-emp-1',
        title: 'Post-Employment Non-Compete Covenant',
        sectionNumber: 'Section 7.1',
        lineRange: 'Lines 65-80',
        text: 'For a period of twenty-four (24) months following termination of employment for any reason, Employee shall not directly or indirectly engage in, consult for, or hold ownership in any business entity operating in the field of AI software within North America.',
        plainEnglish: 'You cannot work for any artificial intelligence software company anywhere in North America for 2 full years after leaving this job.',
        riskLevel: 'High',
        riskCategory: 'Restrictive Covenant',
        riskExplanation: 'A 24-month nationwide non-compete is overly restrictive for software engineers and may restrict your livelihood. Note: Non-compete clauses face severe statutory bans in states like California.',
        recommendation: 'Request removal of non-compete entirely, or narrow scope to direct named market competitors for a maximum of 6 months.'
      },
      {
        id: 'clause-emp-2',
        title: 'Intellectual Property & Invention Assignment',
        sectionNumber: 'Section 5.3',
        lineRange: 'Lines 42-58',
        text: 'All inventions, software code, algorithms, trade secrets, and improvements created, conceived, or reduced to practice by Employee during the term of employment—whether on company time or personal time—shall belong exclusively to Employer.',
        plainEnglish: 'The company claims ownership of everything you code or invent, even personal side projects or open-source software created on your weekend home computer.',
        riskLevel: 'Medium',
        riskCategory: 'Intellectual Property',
        riskExplanation: 'Overreaching IP assignment captures side projects unrelated to employer business.',
        recommendation: 'Add statutory exclusion carve-out (e.g., California Labor Code 2870 equivalent) protecting side projects developed on personal time without company resources or trade secrets.'
      },
      {
        id: 'clause-emp-3',
        title: 'Non-Solicitation of Clients & Employees',
        sectionNumber: 'Section 7.3',
        lineRange: 'Lines 82-95',
        text: 'Employee agrees not to recruit, solicit, or hire any employee or contractor of Company for 12 months following departure.',
        plainEnglish: 'You cannot hire your former colleagues for 1 year after leaving.',
        riskLevel: 'Low',
        riskCategory: 'Restrictive Covenant',
        riskExplanation: 'Standard non-solicitation term to protect company headcount.',
        recommendation: 'Standard clause; ensure it specifies active solicitation rather than general public job postings.'
      }
    ],
    fullText: `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is executed on October 25, 2024, by Vanguard Innovations Corp ("Company") and Alex Morgan ("Employee").

SECTION 1. POSITION & DUTIES
1.1 Company hereby employs Employee as Senior Systems Architect.

SECTION 5. INTELLECTUAL PROPERTY
5.3 All inventions, software code, algorithms, trade secrets, and improvements created, conceived, or reduced to practice by Employee during the term of employment—whether on company time or personal time—shall belong exclusively to Employer.

SECTION 7. RESTRICTIVE COVENANTS
7.1 For a period of twenty-four (24) months following termination of employment for any reason, Employee shall not directly or indirectly engage in, consult for, or hold ownership in any business entity operating in the field of AI software within North America.
7.3 Employee agrees not to recruit, solicit, or hire any employee or contractor of Company for 12 months following departure.`,
    aiQuestions: [
      {
        question: 'Is the non-compete enforceable?',
        answer: 'Enforceability depends heavily on state jurisdiction. California (SB 699 / AB 1076) and FTC guidelines ban post-employment non-competes. However, in states allowing non-competes, 24 months nationwide is considered overly broad by courts.',
        references: ['Section 7.1']
      },
      {
        question: 'Can I work on open source software on weekends?',
        answer: 'Under Section 5.3 as currently written, NO. The employer claims ownership of code created on personal time. You must request a written IP exclusion addendum before signing.',
        references: ['Section 5.3']
      }
    ]
  },

  {
    id: 'doc-saas-2024',
    title: 'Enterprise SaaS Master Services Agreement',
    filename: 'SaaS_MSA_Enterprise_2024.pdf',
    type: 'SaaS Terms',
    fileSize: '890 KB',
    pageCount: 11,
    uploadDate: '2026-09-08',
    lastAnalyzed: '3 days ago',
    overallRiskScore: 'Low',
    riskScoreNumber: 24,
    riskCounts: { high: 0, medium: 2, low: 6 },
    parties: ['CloudScale Platform Inc. (Provider)', 'Horizon Global Enterprises (Customer)'],
    effectiveDate: 'September 1, 2024',
    expirationDate: 'August 31, 2026',
    summary: 'A well-balanced Enterprise SaaS Agreement. Features 99.9% Service Level Availability guarantee, SOC2 Type II compliance, robust GDPR/CCPA data privacy protection, and mutual liability caps.',
    keyObligations: [
      'Provider guarantees 99.9% uptime per calendar month.',
      'Customer must pay annual software subscription within Net 30 days of invoice.',
      'Both parties must notify data breach incidents within 48 hours.'
    ],
    keyRights: [
      'Customer retains full ownership of all uploaded data and machine learning artifacts.',
      'SLA downtime credits: 10% credit if uptime drops below 99.0%, 25% credit below 95.0%.',
      'Right to audit security practices and request annual SOC2 reports.'
    ],
    importantDates: [
      { event: 'Annual Renewal Notice Window', date: '60 days prior to Aug 31', urgency: 'Medium' },
      { event: 'Payment Due Date', date: 'Net 30 from invoice', urgency: 'Standard' }
    ],
    financialTerms: [
      { item: 'Annual Subscription Fee', detail: '$48,000 / year billed annually upfront', riskLevel: 'Low' },
      { item: 'Liability Cap', detail: 'Limited to total fees paid in preceding 12 months ($48,000)', riskLevel: 'Low' }
    ],
    clauses: [
      {
        id: 'clause-saas-1',
        title: 'Data Ownership & AI Model Training',
        sectionNumber: 'Section 8.1',
        lineRange: 'Lines 70-82',
        text: 'Customer retains sole and exclusive ownership of all Customer Data. Provider shall not use Customer Data to train foundation public AI models without express written opt-in consent.',
        plainEnglish: 'You own 100% of your data. The software vendor will NOT use your private business documents to train public AI models.',
        riskLevel: 'Low',
        riskCategory: 'Data Privacy',
        riskExplanation: 'Strong privacy protection standard for corporate enterprise clients.',
        recommendation: 'Favorable clause; preserve this language intact.'
      },
      {
        id: 'clause-saas-2',
        title: 'Automatic Renewal & Auto-Billing',
        sectionNumber: 'Section 12.2',
        lineRange: 'Lines 110-122',
        text: 'This Agreement shall automatically renew for successive 12-month periods unless either party provides written notice of non-renewal at least sixty (60) days prior to the expiration of the then-current term.',
        plainEnglish: 'The contract automatically renews every year unless you give written notice 60 days in advance.',
        riskLevel: 'Medium',
        riskCategory: 'Renewal',
        riskExplanation: 'Requires calendar tracking to avoid unwanted automatic multi-thousand dollar subscription renewals.',
        recommendation: 'Set automated calendar alerts 75 days prior to contract expiration.'
      }
    ],
    fullText: `ENTERPRISE SAAS MASTER SERVICES AGREEMENT

This Master Services Agreement ("Agreement") is entered into by CloudScale Platform Inc ("Provider") and Horizon Global Enterprises ("Customer").

SECTION 8. DATA PRIVACY & OWNERSHIP
8.1 Customer retains sole and exclusive ownership of all Customer Data. Provider shall not use Customer Data to train foundation public AI models without express written opt-in consent.

SECTION 12. TERM & RENEWAL
12.2 This Agreement shall automatically renew for successive 12-month periods unless either party provides written notice of non-renewal at least sixty (60) days prior to the expiration of the then-current term.`,
    aiQuestions: [
      {
        question: 'Does the vendor train AI models on our data?',
        answer: 'No. Section 8.1 explicitly states that Customer Data will not be used to train public foundation models without express opt-in consent.',
        references: ['Section 8.1']
      }
    ]
  },

  {
    id: 'doc-nda-2024',
    title: 'Mutual Non-Disclosure Agreement (NDA)',
    filename: 'Mutual_NDA_Standard_2024.pdf',
    type: 'NDA',
    fileSize: '450 KB',
    pageCount: 5,
    uploadDate: '2026-09-01',
    lastAnalyzed: '1 week ago',
    overallRiskScore: 'Low',
    riskScoreNumber: 12,
    riskCounts: { high: 0, medium: 0, low: 4 },
    parties: ['LexiLaw Tech Ltd.', 'Partner Quantum Corp'],
    effectiveDate: 'September 1, 2024',
    expirationDate: '2 Years from Effective Date',
    summary: 'Standard mutual non-disclosure agreement protecting confidential technical and business discussions regarding potential technology partnership. 2-year duration with standard exceptions for publicly available information.',
    keyObligations: [
      'Maintain confidentiality of disclosed information using reasonable degree of care.',
      'Use confidential information solely for evaluating potential business partnership.'
    ],
    keyRights: [
      'Either party may terminate discussions at any time upon written notice.',
      'Prompt return or certified destruction of confidential files upon request.'
    ],
    importantDates: [
      { event: 'Confidentiality Obligation Expiration', date: 'September 1, 2026', urgency: 'Standard' }
    ],
    financialTerms: [
      { item: 'Financial Obligations', detail: 'None. No payment obligations created by this NDA.', riskLevel: 'Low' }
    ],
    clauses: [
      {
        id: 'clause-nda-1',
        title: 'Definition of Confidential Information & Standard Exclusions',
        sectionNumber: 'Section 2.1',
        lineRange: 'Lines 15-32',
        text: 'Confidential Information shall not include information that: (a) is or becomes publicly known through no breach; (b) was already in receiving party possession; or (c) is independently developed without reference to disclosed files.',
        plainEnglish: 'Standard protective definition with fair public domain and independent development exceptions.',
        riskLevel: 'Low',
        riskCategory: 'Confidentiality',
        riskExplanation: 'Industry standard balanced mutual NDA language.',
        recommendation: 'Approve as written.'
      }
    ],
    fullText: `MUTUAL NON-DISCLOSURE AGREEMENT

This Agreement is made between LexiLaw Tech Ltd. and Partner Quantum Corp.

SECTION 2. EXCLUSIONS
2.1 Confidential Information shall not include information that: (a) is or becomes publicly known through no breach; (b) was already in receiving party possession; or (c) is independently developed without reference to disclosed files.`,
    aiQuestions: [
      {
        question: 'How long does confidentiality last?',
        answer: 'Confidentiality obligations expire 2 years after the effective date (September 1, 2026).',
        references: ['Section 3.1']
      }
    ]
  }
];

// Side-by-side comparison data set
export const SAMPLE_COMPARISONS = [
  {
    id: 'comp-lease-comparison',
    title: 'Standard Office Lease vs Proposed Lease 2024',
    docA: {
      id: 'doc-lease-std',
      name: 'Standard Market Lease (2023 Template)',
      type: 'Commercial Lease'
    },
    docB: {
      id: 'doc-lease-2024',
      name: 'Proposed Commercial Lease (2024)',
      type: 'Commercial Lease'
    },
    overallSimilarity: 72, // % match
    recommendation: 'Document A (Standard Market Lease) is significantly more favorable to Tenant. Document B imposes 3x higher rent escalation, uncapped indemnity, and harsh early termination penalties.',
    summaryDifferences: [
      'Document B features a 15% annual rent escalation, compared to 3.5% in Document A.',
      'Document B requires Tenant to cover full HVAC replacement costs; Document A caps tenant maintenance at $500/year.',
      'Document B contains uncapped indemnity liability; Document A limits liability to insured amounts.',
      'Document A allows subletting with consent not unreasonably withheld; Document B grants Landlord absolute refusal power.'
    ],
    matrix: [
      {
        category: 'Rent Escalation',
        status: 'High Divergence',
        docAValue: '3.5% Fixed Annual Increase tie to CPI index',
        docBValue: '15.0% Compound Annual Increase',
        verdict: 'Doc A is Favorable',
        verdictColor: 'emerald',
        analysis: 'Doc B escalation compounds rent to double over 5 years. Doc A represents fair market rates.'
      },
      {
        category: 'Maintenance & Repairs',
        status: 'Substantial Difference',
        docAValue: 'Landlord maintains HVAC & Structure. Tenant pays $500 max fee per service call.',
        docBValue: 'Tenant responsible for 100% replacement cost of HVAC and building glass.',
        verdict: 'Doc A is Favorable',
        verdictColor: 'emerald',
        analysis: 'Doc B shifts major landlord capital infrastructure costs onto tenant balance sheet.'
      },
      {
        category: 'Indemnification',
        status: 'High Divergence',
        docAValue: 'Mutual Indemnification limited to insurance policy limits ($2M cap). Excludes Landlord negligence.',
        docBValue: 'Uncapped unilateral Tenant indemnity without limitation or fault exclusion.',
        verdict: 'Doc A is Favorable',
        verdictColor: 'emerald',
        analysis: 'Doc B creates unlimited legal Exposure for Tenant.'
      },
      {
        category: 'Subletting & Assignment',
        status: 'Moderate Difference',
        docAValue: 'Consent shall not be unreasonably withheld, delayed, or conditioned. $250 admin fee.',
        docBValue: 'Sole and absolute Landlord discretion. $5,000 non-refundable administrative fee.',
        verdict: 'Doc A is Favorable',
        verdictColor: 'emerald',
        analysis: 'Doc B gives landlord total block authority and charges punitive review fees.'
      },
      {
        category: 'Governing Law',
        status: 'Identical',
        docAValue: 'State of California, San Francisco Superior Court',
        docBValue: 'State of California, San Francisco Superior Court',
        verdict: 'Neutral / Identical',
        verdictColor: 'slate',
        analysis: 'Both contracts specify identical jurisdiction and governing state laws.'
      }
    ]
  },
  {
    id: 'comp-nda-comparison',
    title: 'Standard Mutual NDA vs Vendor One-Way NDA',
    docA: {
      id: 'doc-nda-std',
      name: 'Standard Mutual NDA',
      type: 'NDA'
    },
    docB: {
      id: 'doc-nda-vendor',
      name: 'Vendor One-Way Confidentiality Agreement',
      type: 'NDA'
    },
    overallSimilarity: 61,
    recommendation: 'Document A is mutual and fair. Document B is one-sided, protecting only Vendor disclosures while holding Customer strictly liable with non-disparagement covenants.',
    summaryDifferences: [
      'Document A protects both parties equally; Document B only protects Vendor information.',
      'Document B includes a 3-year non-disparagement clause prohibiting negative online reviews.',
      'Document A specifies 2-year term; Document B specifies perpetual confidentiality obligations.'
    ],
    matrix: [
      {
        category: 'Mutuality',
        status: 'Substantial Difference',
        docAValue: 'Bilateral Mutual Protection (disclosures by both parties covered)',
        docBValue: 'Unilateral One-Way (only Vendor disclosures protected)',
        verdict: 'Doc A is Favorable',
        verdictColor: 'emerald',
        analysis: 'Doc B fails to protect Customer proprietary technical drawings shared during discussions.'
      },
      {
        category: 'Term of Confidentiality',
        status: 'Moderate Difference',
        docAValue: '2 Years from signing date',
        docBValue: 'Perpetual (indefinite duration)',
        verdict: 'Doc A is Favorable',
        verdictColor: 'emerald',
        analysis: 'Perpetual obligations create ongoing administrative burden for standard business info.'
      },
      {
        category: 'Non-Disparagement',
        status: 'High Divergence',
        docAValue: 'None (Standard NDA scope)',
        docBValue: 'Strict post-disclosure non-disparagement clause with $10,000 liquidated damages per instance',
        verdict: 'Doc A is Favorable',
        verdictColor: 'emerald',
        analysis: 'Doc B inserts aggressive non-disparagement penalties inside a basic NDA.'
      }
    ]
  }
];

// Document History Ledger
export const INITIAL_HISTORY = [
  {
    id: 'hist-1',
    documentId: 'doc-lease-2024',
    title: 'Commercial Office Lease Agreement 2024',
    filename: 'Commercial_Office_Lease_v2.4.pdf',
    type: 'Commercial Lease',
    analyzedDate: '2026-09-14 14:32',
    riskScore: 'High',
    riskScoreNumber: 76,
    highRiskCount: 3,
    mediumRiskCount: 4,
    lowRiskCount: 5,
    fileSize: '2.4 MB',
    status: 'Flagged High Risk'
  },
  {
    id: 'hist-2',
    documentId: 'doc-employment-2024',
    title: 'Senior Engineer Employment Agreement',
    filename: 'Employment_Agreement_Sr_Engineer.pdf',
    type: 'Employment Contract',
    analyzedDate: '2026-09-10 09:15',
    riskScore: 'Medium',
    riskScoreNumber: 52,
    highRiskCount: 1,
    mediumRiskCount: 3,
    lowRiskCount: 4,
    fileSize: '1.1 MB',
    status: 'Reviewed with Recommendations'
  },
  {
    id: 'hist-3',
    documentId: 'doc-saas-2024',
    title: 'Enterprise SaaS Master Services Agreement',
    filename: 'SaaS_MSA_Enterprise_2024.pdf',
    type: 'SaaS Terms',
    analyzedDate: '2026-09-08 16:45',
    riskScore: 'Low',
    riskScoreNumber: 24,
    highRiskCount: 0,
    mediumRiskCount: 2,
    lowRiskCount: 6,
    fileSize: '890 KB',
    status: 'Clean / Safe'
  },
  {
    id: 'hist-4',
    documentId: 'doc-nda-2024',
    title: 'Mutual Non-Disclosure Agreement (NDA)',
    filename: 'Mutual_NDA_Standard_2024.pdf',
    type: 'NDA',
    analyzedDate: '2026-09-01 11:20',
    riskScore: 'Low',
    riskScoreNumber: 12,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 4,
    fileSize: '450 KB',
    status: 'Approved'
  },
  {
    id: 'hist-5',
    documentId: 'comp-lease-comparison',
    title: 'Comparison: Standard Lease vs Proposed 2024 Lease',
    filename: 'Lease_SideBySide_Comparison.pdf',
    type: 'Comparison Matrix',
    analyzedDate: '2026-08-28 15:10',
    riskScore: 'High Divergence',
    riskScoreNumber: 82,
    highRiskCount: 4,
    mediumRiskCount: 2,
    lowRiskCount: 1,
    fileSize: '1.8 MB',
    status: 'Comparison Generated'
  }
];

// Landing Page Interactive Feature Sampler Data
export const LANDING_DEMO_CLAUSES = [
  {
    id: 'demo-1',
    category: 'Commercial Lease',
    rawLegal: 'Landlord may in its sole discretion terminate this tenancy with 10 days notice without liability for relocational expenses or consequential business damages.',
    plainText: 'The landlord can kick your business out in just 10 days without paying a single cent for your moving costs or lost revenue.',
    riskBadge: 'High Risk',
    riskColor: 'rose'
  },
  {
    id: 'demo-2',
    category: 'Employment Contract',
    rawLegal: 'Employee agrees that during employment and for 24 months post-termination, Employee shall not engage in any competing software development worldwide.',
    plainText: 'You cannot work as a software engineer anywhere in the world for 2 years after leaving this company.',
    riskBadge: 'High Risk',
    riskColor: 'rose'
  },
  {
    id: 'demo-3',
    category: 'SaaS Agreement',
    rawLegal: 'Provider shall maintain 99.9% uptime uptime and shall grant a 15% monthly billing credit for any calendar month in which availability drops below 99.0%.',
    plainText: 'The cloud service guarantees 99.9% uptime and gives you a 15% refund if outages happen.',
    riskBadge: 'Low Risk',
    riskColor: 'emerald'
  }
];
