# LexiLaw AI

> **Understand Legal Documents. Simply.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-legal--iq--tau.vercel.app-blue?style=flat-square&logo=vercel)](https://legal-iq-tau.vercel.app/)
[![Powered by Gemini](https://img.shields.io/badge/AI-Google%20Gemini%202.5%20Flash-orange?style=flat-square&logo=google)](https://aistudio.google.com/)
[![Built with React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)](https://react.dev/)

---

## 1. Project Overview

### The Problem
Legal documents—such as employment contracts, non-disclosure agreements (NDAs), commercial leases, and software terms of service—are notorious for dense, opaque language, hidden liability clauses, and confusing jargon. For everyday individuals, startup founders, freelancers, and small business owners without a dedicated legal team, thoroughly understanding these agreements is intimidating, time-consuming, and prone to costly oversights.

### The Solution
**LexiLaw AI** is a GenAI-powered Legal-Tech application designed to bridge the gap between complex contract legalese and plain-English comprehension. By uploading standard agreements (PDF or DOCX), users receive instant, strictly grounded breakdowns: plain-language executive summaries, categorized clause-by-clause risk assessments, critical deadlines, financial commitments, and an interactive "Ask Your Document" Q&A assistant.

---

## 2. Challenge Alignment: AI for Legal Assistance & Access

LexiLaw AI directly addresses the **AI for Legal Assistance & Access** challenge track by democratizing contract comprehension:

- **Demystifying Complex Contracts:** Translates convoluted legal provisions into actionable, clear plain-English summaries so non-lawyers can make informed decisions.
- **Strict Document Grounding:** Restricts AI extraction exclusively to the uploaded document text to prevent hallucinations of terms, dates, or obligations that do not exist.
- **Risk Identification & Transparency:** Highlights high-, medium-, and low-risk terms (e.g., uncapped indemnification, automatic renewals, restrictive covenants) alongside practical recommendations.
- **Contract Version Comparison:** Provides a dedicated side-by-side comparison tool to spot differences, additions, and removals between document drafts.
- **Accessibility for All:** Built with a minimal-friction, responsive interface with pre-loaded sample agreements for users who wish to explore legal analysis immediately.

---

## 3. Live Demo

Experience the live application deployed on Vercel:

🔗 **[https://legal-iq-tau.vercel.app/](https://legal-iq-tau.vercel.app/)**

---

## 4. Core Features

| Feature | Description |
|---|---|
| **Document Analyzer** | Core workspace providing multi-tab analysis of legal agreements. |
| **PDF & DOCX Upload** | Client-side text extraction for PDF and DOCX files up to 10 MB. |
| **Google Gemini Integration** | Server-side contract analysis powered by Google Gemini 2.5 Flash. |
| **Executive Summary** | Objective, high-level summary of the contract's scope, parties, and primary intent. |
| **Clause-by-Clause Analysis** | Granular inspection of key clauses, quoting original text with section references. |
| **Risk Detection & Scoring** | Quantitative risk score (0–100) and categorized breakdown (High, Medium, Low risk). |
| **Critical Dates & Deadlines** | Extraction of effective dates, expiration terms, renewal notices, and deadlines. |
| **Financial Commitments** | Extraction of monetary amounts, compensation, escalation rates, and penalties. |
| **Obligations & Rights** | Distinct ledgers separating affirmative duties from user protections and rights. |
| **Plain-English Translations** | Simplified explanations accompanying every flagged clause for layperson understanding. |
| **Ask Your Document** | Interactive chat assistant answering natural-language queries grounded in the contract text. |
| **Document Comparison** | Side-by-side analyzer comparing two contract drafts to identify modified terms and risk shifts. |
| **Analysis History** | Local audit ledger documenting previously analyzed files, risk scores, and timestamps. |
| **Pre-Loaded Sample Documents** | Ready-to-analyze commercial lease, NDA, and employment agreements for instant evaluation. |
| **Responsive Design** | Optimized layouts across desktop, tablet, and mobile screens. |
| **State Handling** | Clear loading indicators, progress messages, empty states, and validation alerts. |

---

## 5. How It Works

### Architectural Flow

```
┌─────────────────────────────────────────────────────────┐
│                      User Browser                       │
│  React (Vite) Frontend • Drag & Drop PDF / DOCX Upload  │
└────────────────────────────┬────────────────────────────┘
                             │ Client-side text extraction
                             ▼ (pdfjs-dist / mammoth)
┌─────────────────────────────────────────────────────────┐
│                Extracted Raw Text Payload                │
└────────────────────────────┬────────────────────────────┘
                             │ POST /api/gemini
                             │ (GEMINI_API_KEY kept server-side)
                             ▼
┌─────────────────────────────────────────────────────────┐
│              Server-Side API (Vercel Serverless)        │
│          api/gemini.js  •  Node.js Runtime              │
└────────────────────────────┬────────────────────────────┘
                             │ @google/genai SDK
                             │ Model: gemini-2.5-flash
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Google Gemini API                    │
│   Strict Grounding Prompt • Structured JSON Output      │
└────────────────────────────┬────────────────────────────┘
                             │ Validated JSON Response
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 Document Analyzer UI                    │
│   Executive Summary • Clause Risks • Dates • Chat Q&A   │
└─────────────────────────────────────────────────────────┘
```

1. **Upload & Extract:** The user selects or drags a document. The browser uses `pdfjs-dist` or `mammoth` to extract the text content locally.
2. **Secure Proxy Dispatch:** The frontend sends the text payload to `/api/gemini`. The frontend code never touches or possesses the `GEMINI_API_KEY`.
3. **Grounded AI Analysis:** The serverless function invokes the official `@google/genai` SDK using `gemini-2.5-flash` with strict document-grounding instructions.
4. **Structured Mapping:** Gemini returns a structured JSON payload containing the summary, obligations, rights, dates, financials, clauses, and risk ratings.
5. **Interactive Exploration:** The UI displays the categorized analysis, highlights corresponding clauses in the reader view, and allows interactive Q&A.

---

## 6. AI & Gemini Integration

- **Model:** `gemini-2.5-flash` via the official `@google/genai` JavaScript SDK.
- **Serverless API Bridge:** Calls originate from [api/gemini.js](api/gemini.js) on Vercel Serverless, ensuring `GEMINI_API_KEY` is never exposed to the client.
- **Strict Grounding Protocol:** The system instruction enforces that the model must:
  - Rely exclusively on facts present in the uploaded document.
  - Never invent clauses, dates, amounts, obligations, rights, or notice periods.
  - Return `"Not specified in the document."` for any absent term.
  - Preserve exact names, dates, currencies, notice periods, and jurisdictions.
- **Structured JSON Mode:** Enforces `responseMimeType: 'application/json'` to guarantee consistent schema parsing without conversational boilerplate.

---

## 7. Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend Framework** | React 19 | UI rendering with functional components and hooks |
| **Build Tool** | Vite 8 | Fast build tooling and local development server |
| **Routing** | React Router 7 | Client-side routing between Analyzer, Compare, History |
| **Styling** | Tailwind CSS 4 | Utility-first responsive styling |
| **Icons** | Lucide React | Modern iconography |
| **Document Parsing** | pdfjs-dist & mammoth | Client-side PDF and DOCX text extraction |
| **GenAI SDK** | @google/genai | Official Google GenAI JavaScript SDK |
| **AI Model** | Gemini 2.5 Flash | Fast, grounded legal analysis and document Q&A |
| **Deployment** | Vercel | Serverless hosting and backend function execution |
| **Version Control** | Git & GitHub | Source code repository and tracking |

---

## 8. Project Structure

```
LegalIQ/
├── api/
│   ├── gemini.js            # Vercel serverless function: POST /api/gemini
│   └── gemini-ping.js       # Connectivity health check: GET /api/gemini-ping
├── public/
│   ├── favicon.svg          # Application favicon
│   └── icons.svg            # SVG symbols
├── src/
│   ├── assets/              # Static media assets
│   ├── components/
│   │   ├── layout/          # Navbar, Footer
│   │   └── ui/              # Reusable UI controls (BackButton, etc.)
│   ├── context/
│   │   └── AppContext.jsx   # Global application state and upload actions
│   ├── data/
│   │   └── mockLegalData.js # Baseline demo contracts (Lease, NDA, SaaS)
│   ├── pages/
│   │   ├── DocumentAnalyzer.jsx # Core analyzer workspace & Q&A drawer
│   │   ├── CompareDocuments.jsx # Side-by-side contract comparison
│   │   ├── HistoryPage.jsx      # Audit history ledger
│   │   └── LandingPage.jsx      # Marketing homepage & feature overview
│   ├── utils/
│   │   ├── documentExtractor.js # PDF & DOCX text extraction engine
│   │   ├── geminiAnalyzer.js    # Gemini document grounding & schema mapping
│   │   ├── geminiClient.js      # Client-side API proxy helper
│   │   └── legalAnalyzer.js     # Legal parsing helpers
│   ├── App.css
│   ├── App.jsx              # Main routes and application shell
│   ├── index.css            # Tailwind CSS root imports
│   └── main.jsx             # React DOM entry point
├── .env.example             # Safe environment variable template
├── .gitignore               # Git exclusion rules (.env.local, node_modules, etc.)
├── index.html               # HTML5 application template
├── package.json             # Project dependencies and npm scripts
├── package-lock.json        # Deterministic dependency lockfile
└── vite.config.js           # Vite configuration with local API dev middleware
```

---

## 9. Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended; Node 20+ supported)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- A Google Gemini API Key (obtain from [Google AI Studio](https://aistudio.google.com/app/apikey))

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/praveen2905/LegalIQ.git
   cd LegalIQ
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: `.env.local` is gitignored and will never be committed).*

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at:
   ```
   http://localhost:5173
   ```
   *The built-in Vite dev middleware automatically executes `api/gemini.js` locally in Node.js, reading `.env.local` server-side.*

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 10. Environment Variables

| Variable | Required | Location | Description |
|---|:---:|---|---|
| `GEMINI_API_KEY` | **Yes** | Server Environment (`.env.local` locally / Vercel dashboard in production) | Google Gemini API key used by `/api/gemini` and `/api/gemini-ping` serverless functions. |

> **IMPORTANT:** Never commit `.env.local` or hardcode API keys in frontend code. The client only makes relative requests to `/api/gemini`.

---

## 11. Deployment to Vercel

The project is configured for one-click deployment on Vercel:

1. Push your repository to GitHub.
2. Import the project in the [Vercel Dashboard](https://vercel.com).
3. In **Project Settings** → **Environment Variables**, add:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `<Your Google AI Studio API Key>`
   - **Environment:** Production, Preview, Development
4. Click **Deploy**. Vercel will build the Vite frontend and host `api/` as serverless functions automatically.

---

## 12. Security & Privacy

- **Server-Side Key Isolation:** `GEMINI_API_KEY` is loaded exclusively inside Node.js serverless functions. It is never included in client JavaScript bundles or build artifacts.
- **Git Security:** Sensitive environment files (`.env`, `.env.local`, `*.log`) are explicitly blocked by `.gitignore`.
- **Data Transmission:** When a user uploads a document, extracted text is securely transmitted over HTTPS to `/api/gemini` and evaluated by the Gemini API according to Google's standard enterprise API data processing policies.
- **Document Grounding:** Prompts restrict analysis strictly to the provided text to prevent factual hallucinations.

---

## 13. User Flow

```
[ Landing Page ]
       │
       ▼
[ Upload Document / Select Sample ]
       │
       ├─► (PDF / DOCX Upload) ──► Text Extraction ──► /api/gemini ──► Grounded Analysis
       │
       └─► (Sample Document)   ──► Instant Baseline Preview
       │
       ▼
[ Document Analyzer Workspace ]
       │
       ├─► [Executive Summary]: Overview, Parties, Obligations, Rights, Dates, Financials
       ├─► [Clause Risks]: Categorized Risk Badges, Plain-English Translations, Recommendations
       ├─► [Ask Your Document]: AI Q&A grounded strictly in the contract text
       └─► [Export Report]: Copy plain-language summaries and findings
       │
       ▼
[ Compare Documents ] ──► Side-by-side version comparison of clauses and risk shifts
       │
       ▼
[ History Ledger ]    ──► Review timestamps, filenames, and risk summaries
```

---

## 14. Design Philosophy

- **Legal-Tech SaaS Aesthetic:** Clean, neutral slate and blue color palette conveying trust, clarity, and precision.
- **Progressive Disclosure:** Essential takeaways (risk score, executive summary, parties) are immediately visible; detailed clause texts and redline recommendations are accessible on demand.
- **Plain-English Priority:** Jargon is translated into everyday language while preserving exact monetary values, deadlines, and section references.
- **Zero Hallucination Tolerance:** Absence of a clause is explicitly labeled as `"Not specified in the document."` rather than assuming or inventing terms.

---

## 15. Limitations & Legal Disclaimer

> **DISCLAIMER:**  
> **LexiLaw AI is an artificial intelligence-powered software tool designed solely for informational assistance, educational purposes, and document readability. It does NOT provide legal advice, legal opinions, or professional legal representation.**  
>  
> LexiLaw AI is not a law firm, and use of this software does not create an attorney-client relationship. While LexiLaw AI strives for factual fidelity, automated analyses may contain inaccuracies, omissions, or misinterpretations. You should always consult a licensed attorney or qualified legal professional before signing, modifying, or relying upon any legal contract or agreement.

---

## 16. Future Improvements

- **Multi-Document Synthesis:** Cross-referencing master service agreements (MSAs) with accompanying statements of work (SOWs).
- **Export to Redlined Word/PDF:** Exporting analyzed agreements with highlighted risk comments and suggested clause revisions.
- **Custom Jurisdiction Rulebooks:** Specialized compliance screening against specific regional regulations (e.g., GDPR, California Consumer Privacy Act, Indian Contract Act).
- **OCR Support:** Integration with optical character recognition for scanned/image-only legal PDFs.

---

## 17. License

License: Not specified
