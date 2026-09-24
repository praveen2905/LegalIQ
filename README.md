# LexiLaw AI

GenAI-powered Legal-Tech assistant for understanding, analyzing, and comparing legal documents.

**Understand Legal Documents. Simply.**

[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple?style=flat-square&logo=vite)](https://vite.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ESM-yellow?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-orange?style=flat-square&logo=google)](https://aistudio.google.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

**[Live Demo](https://legal-iq-tau.vercel.app/)** • **[GitHub Repository](https://github.com/praveen2905/LegalIQ)**

---

## Overview

LexiLaw AI is an AI-assisted legal document analysis application designed to make contracts and agreements easier for non-lawyers to understand. Reviewing legal agreements—such as employment contracts, non-disclosure agreements (NDAs), and commercial leases—often presents significant hurdles due to dense legalese, confusing clauses, and obscured obligations.

Built for the **AI for Legal Assistance & Access** challenge, LexiLaw AI allows users to upload standard PDF and DOCX files to receive plain-language summaries, clause-by-clause risk assessments, critical deadlines, financial commitments, and interactive document Q&A. The application is an informational tool to aid document comprehension and does not provide legal advice or replace qualified legal counsel.

---

## Problem

- **Dense Language:** Legal contracts are written in specialized jargon that is difficult for non-lawyers to interpret accurately.
- **Buried Terms:** Critical obligations, restrictive covenants, automatic renewals, and liability caps are often obscured across dozens of clauses.
- **Access & Cost Barriers:** Reviewing every routine contract with an attorney is cost-prohibitive for individuals, freelancers, and small businesses seeking an initial understanding.

---

## Solution

LexiLaw AI provides a straightforward workflow to review documents:
- **Upload Contracts:** Upload PDF or DOCX files directly in the browser, or choose from pre-loaded sample agreements.
- **Client-Side Text Extraction:** Extracts document text locally in the browser using `pdfjs-dist` and `mammoth`.
- **Secure Backend Relay:** Extracted text is sent to a serverless backend (`/api/gemini`), keeping API keys off the client.
- **Document-Grounded Analysis:** Google Gemini analyzes clauses, risks, dates, and obligations based strictly on the provided text.
- **Structured Interface:** Results are presented in an organized layout featuring risk ratings (High, Medium, Low), plain-English explanations, and practical tips.
- **Ask Your Document:** An interactive chat drawer allows users to ask specific questions directly grounded in the active document text.
- **Document Comparison:** A side-by-side comparison interface allows users to review differences between agreements (currently demonstrated using curated comparison data).

---

## Key Features

| Feature | Description | Implementation Status |
|---|---|---|
| **PDF & DOCX Upload** | Client-side text and page extraction for `.pdf` and `.docx` files up to 10 MB. | Fully Implemented |
| **Gemini-Powered Analysis** | Server-side contract breakdown using Google Gemini 2.5 Flash via `@google/genai`. | Fully Implemented |
| **Executive Summary** | Objective overview of contract type, identified parties, effective date, and scope. | Fully Implemented |
| **Clause Risk Analysis** | Granular inspection of key clauses categorized by risk level with plain-language explanations. | Fully Implemented |
| **Dates, Deadlines & Financials** | Extraction of effective dates, renewal windows, fee structures, and financial terms. | Fully Implemented |
| **Obligations & Rights** | Distinct lists separating affirmative duties from protected user rights. | Fully Implemented |
| **Ask Your Document** | Grounded Q&A chat drawer that queries Gemini with the active document text. | Fully Implemented |
| **Document Comparison** | Side-by-side interface for comparing clauses, additions, and risk shifts between contracts. | UI & Sample Data |
| **Analysis History** | Session audit log allowing users to search, filter by risk level or type, and reopen files. | Fully Implemented |
| **Sample Agreements** | Pre-loaded NDA, Employment, and Lease agreements for instant evaluation. | Fully Implemented |
| **Responsive UI** | Clean, accessible design with clear loading states, progress messages, and error alerts. | Fully Implemented |

---

## How It Works

```
User
  ↓
React + Vite Frontend  ──►  Client-Side Text Extraction (pdfjs-dist / mammoth)
  ↓
Vercel Serverless API (/api/gemini)  ──►  Google Gemini API (gemini-2.5-flash)
  ↓
Structured JSON Analysis  ──►  LexiLaw AI Interactive Workspace
```

1. **Document Input:** The user uploads a PDF or DOCX file (or selects a sample agreement).
2. **Text Extraction:** The browser extracts the text content locally using `pdfjs-dist` (PDF) or `mammoth` (DOCX).
3. **Serverless Dispatch:** The text is sent via POST to `/api/gemini`, keeping the Gemini API key protected on the server.
4. **Grounded AI Processing:** The serverless handler uses the `@google/genai` SDK with `gemini-2.5-flash` and strict grounding instructions.
5. **Structured Presentation:** The model returns structured JSON rendered across executive summaries, clause risks, deadlines, and interactive chat.

---

## AI Integration

- **Google Gemini API:** Powered by `gemini-2.5-flash` via the official `@google/genai` SDK.
- **Server-Side API Integration:** All API calls originate exclusively from `/api/gemini` (Vercel Serverless Function).
- **Environment Security:** `GEMINI_API_KEY` is stored as an environment variable and is never exposed to client-side code.
- **Document-Grounded Prompting:** The application instructs Gemini to base analysis strictly on the supplied document text and to state `"Not specified in the document."` when terms are absent, rather than inventing missing details.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19 & React Router 7** | Frontend component framework and client-side routing |
| **Vite 8** | Development server and production bundler |
| **JavaScript (ESM)** | Application logic and utilities |
| **Tailwind CSS 4 & Lucide React** | Responsive styling, design system, and iconography |
| **pdfjs-dist & mammoth** | Client-side PDF and DOCX text extraction |
| **@google/genai** | Official Google GenAI SDK |
| **Vercel** | Serverless function execution and production hosting |
| **Git & GitHub** | Version control and source code repository |

---

## Project Structure

```
LegalIQ/
├── api/
│   ├── gemini.js            # Serverless function handling Gemini API requests
│   └── gemini-ping.js       # Health-check endpoint for API availability
├── public/                  # Favicon and static symbols
├── src/
│   ├── components/          # Navbar, Footer, and UI controls (BackButton)
│   ├── context/AppContext.jsx # Global state & upload pipeline
│   ├── data/mockLegalData.js # Sample contracts & comparison presets
│   ├── pages/               # LandingPage, DocumentAnalyzer, CompareDocuments, HistoryPage
│   ├── utils/               # PDF/DOCX extractors, Gemini client, grounding prompts
│   ├── App.jsx              # Main router and layout shell
│   └── main.jsx             # React DOM entry point
├── .env.example             # Safe environment variable template
├── .gitignore               # Excludes .env.local, node_modules, build outputs
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite config with local API dev middleware
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ or v20+) and npm
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation & Local Run

1. **Clone repository and install dependencies:**
   ```bash
   git clone https://github.com/praveen2905/LegalIQ.git
   cd LegalIQ
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Add your Gemini API key in `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start local development:**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:5173`. (`vite.config.js` executes `api/gemini.js` locally in Node.js, reading `.env.local` server-side during `npm run dev`.)

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## Environment Variables

| Variable | Required | Purpose |
|---|:---:|---|
| `GEMINI_API_KEY` | Yes | Server-side Gemini API authentication in `/api/gemini` |

- Never commit `.env.local` to source control (`.gitignore` protects it).
- Never hardcode the API key in client-side code.
- `.env.example` contains only the empty variable template.

---

## Deployment

1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. In **Project Settings** → **Environment Variables**, add `GEMINI_API_KEY` with your Gemini key.
4. Deploy. Vercel builds the Vite frontend and deploys `api/` as serverless functions.

**Live Deployment:** **[https://legal-iq-tau.vercel.app/](https://legal-iq-tau.vercel.app/)**

---

## Security Considerations

- **Server-Side Key Storage:** `GEMINI_API_KEY` is loaded exclusively within serverless functions and never exposed to the client.
- **Git Exclusions:** `.env.local` and local environment files are ignored via `.gitignore`.
- **Protected Endpoint:** The frontend communicates with the relative backend endpoint (`/api/gemini`) rather than contacting the Gemini API directly from the client.
- **HTTPS Enforcement:** Production traffic is encrypted using HTTPS on Vercel.

---

## User Flow

```
Landing Page
  → Upload Document (PDF/DOCX) or Select Sample
  → Document Analyzer Workspace
      • Review Executive Summary & Identified Parties
      • Inspect Clause Risk Breakdown (High / Medium / Low)
      • Check Important Dates, Deadlines & Notice Periods
      • Review Financial Terms & Commitments
      • Ask specific questions via "Ask Your Document" Chat Drawer
  → Compare Documents (Side-by-side clause & risk difference view)
  → Review History (Audit session records and re-open analyses)
```

---

## Design & UX

- **Legal-Tech SaaS Interface:** Neutral slate and indigo palette designed for focus and readability.
- **Responsive Layout:** Optimized for desktop, tablet, and mobile displays.
- **Plain-Language Presentation:** Clarifies legal provisions while citing original section references.
- **Clear State Handling:** Responsive loading spinners, analysis progress stages, and explicit error alerts.
- **Clean Navigation:** Scoped footer on the landing page and uncluttered secondary workspace views.

---

## Limitations & Disclaimer

> **DISCLAIMER:**  
> **LexiLaw AI is an artificial intelligence-powered informational and educational tool designed to help users understand legal documents. It does not provide legal advice, legal opinions, or professional legal representation, and does not create an attorney-client relationship.**  
>  
> AI-generated analysis may contain errors, inaccuracies, or omissions. Users should verify all important terms, numbers, and deadlines directly against the original contract text and consult a licensed attorney or qualified legal professional before making legal decisions.

---

## Future Improvements

- **Optical Character Recognition (OCR):** Support for scanned image-only PDFs.
- **Dynamic Multi-Document Comparison:** Generating automated AI redline diffs between any two uploaded contracts.
- **Document Export Formats:** Exporting structured reports to annotated PDF or DOCX formats.
- **Jurisdiction-Specific Checks:** Contextual rule checks based on specific state or regional legal frameworks.
- **Multi-Turn Chat Memory:** Extended conversation context for complex, multi-step document investigations.

---

## Challenge Alignment

### AI for Legal Assistance & Access

LexiLaw AI directly addresses the **AI for Legal Assistance & Access** challenge by:
- **Demystifying Contract Jargon:** Translating complex legalese into clear, structured summaries and actionable explanations for non-lawyers.
- **Improving Comprehension:** Breaking contracts into manageable modules—executive summary, risk-rated clauses, deadlines, financial commitments, and rights.
- **Enhancing Accessibility:** Offering a web-based tool with pre-loaded samples that anyone can evaluate immediately without setup barriers.
- **Using GenAI Responsibly:** Applying strict document-grounded system instructions to keep outputs tied directly to the text provided.

---

## License

License: Not specified.
