import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  GitCompare, 
  MessageSquare, 
  Upload, 
  FileCheck, 
  Lock, 
  ShieldCheck, 
  Zap, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { LANDING_DEMO_CLAUSES } from '../data/mockLegalData';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  const [activeDemoTab, setActiveDemoTab] = useState(0);

  const activeClause = LANDING_DEMO_CLAUSES[activeDemoTab];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/60 border-b border-slate-200/60">
        
        {/* Subtle Decorative Background Blurs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[200px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold tracking-wide uppercase shadow-2xs animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              GenAI for Legal Assistance & Access
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Legal documents, <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-700 to-blue-600">
                decoded in seconds.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              LexiLaw AI transforms complex legalese into plain language. Upload contracts, detect hidden risks, ask questions, and compare agreements effortlessly.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/analyzer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-base hover:bg-blue-600 transition-all duration-200 shadow-md shadow-slate-900/15 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
              >
                Analyze Document Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/compare"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-700 font-semibold text-base border border-slate-300/80 hover:bg-slate-100 transition-all duration-200 shadow-xs hover:border-slate-400 active:scale-[0.98]"
              >
                <GitCompare className="w-4.5 h-4.5 text-slate-500" />
                Compare Two Contracts
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" /> 100% Private & Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Instant Clause Risk Scoring
              </span>
            </div>

          </div>

          {/* Interactive Hero Sampler Card */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-4 sm:p-6 transition-all">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-medium text-slate-400">Interactive Clause Decoder Sampler</span>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  Live Preview
                </span>
              </div>

              {/* Sampler Selector Tabs */}
              <div className="flex flex-wrap gap-2 my-4">
                {LANDING_DEMO_CLAUSES.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveDemoTab(idx)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeDemoTab === idx
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {item.category}
                  </button>
                ))}
              </div>

              {/* Sampler Output Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/70">
                
                {/* Left: Original Legal Excerpt */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Original Legalese</span>
                    <span className="text-[11px] text-slate-400 font-mono">Dense Contract Excerpt</span>
                  </div>
                  <div className="p-3.5 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm font-mono text-slate-700 leading-relaxed italic">
                    "{activeClause.rawLegal}"
                  </div>
                </div>

                {/* Right: LexiLaw AI Translation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Plain Language Translation
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      activeClause.riskColor === 'rose' 
                        ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {activeClause.riskBadge}
                    </span>
                  </div>
                  <div className="p-3.5 bg-blue-50/60 rounded-lg border border-blue-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {activeClause.plainText}
                  </div>
                </div>

              </div>

              <div className="mt-4 flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">Want to test your own document?</span>
                <Link to="/analyzer" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Open Document Analyzer <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. CORE FEATURES SECTION */}
      <section id="features" className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase">Built For Clarity & Speed</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to navigate legal agreements
            </h3>
            <p className="text-slate-600 text-base">
              No legal background needed. LexiLaw AI provides clear breakdown, risk warnings, and actionable recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 hover:bg-white transition-all duration-200 shadow-2xs hover:shadow-md group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Plain Language Summaries</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get an instant executive summary highlighting parties, obligations, rights, and critical deadline dates in simple English.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 hover:bg-white transition-all duration-200 shadow-2xs hover:shadow-md group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-200">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Clause Risk Detection</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automatically flag unfair escalations, uncapped indemnities, non-competes, and termination penalties with color-coded risk levels.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 hover:bg-white transition-all duration-200 shadow-2xs hover:shadow-md group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                <GitCompare className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Side-by-Side Comparison</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Compare two legal documents side-by-side. See compatibility scores, clause variance matrix, and redline negotiation tips.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 hover:bg-white transition-all duration-200 shadow-2xs hover:shadow-md group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Interactive AI Q&A</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ask specific questions about any clause in plain language and receive precise AI answers backed by direct document citations.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase">Simple 3-Step Process</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From confusing contract to clear insights
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-6 text-base">
                1
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Upload or Select Document</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Drag & drop your PDF, DOCX, or text agreement, or test with our pre-loaded realistic legal templates (Commercial Lease, NDA, Employment, SaaS).
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-6 text-base">
                2
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Instant GenAI Analysis</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our AI decodes the legalese, classifies risk levels, highlights critical line items in the text viewer, and creates plain language summaries.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-6 text-base">
                3
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Ask, Compare & Export</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Ask custom questions in the AI chat drawer, compare redlines against standard market contracts, and export summary reports.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. PRIVACY & SECURITY BANNER */}
      <section className="py-14 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5 text-blue-400" /> Confidentiality First
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold">Your legal documents are private and secure</h3>
              <p className="text-slate-400 text-sm max-w-xl">
                LexiLaw AI processes documents in strict compliance with data protection protocols. Your contracts are never used to train public models.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 text-center min-w-[140px]">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-200">256-bit SSL</span>
              </div>
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 text-center min-w-[140px]">
                <FileCheck className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-200">Zero AI Training</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION CTA */}
      <section className="py-20 bg-gradient-to-b from-slate-100 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ready to decode your legal document?
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto">
            Experience plain-language legal access today with LexiLaw AI. No credit card required.
          </p>
          <div className="pt-2">
            <Link
              to="/analyzer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-slate-900 text-white font-bold text-base hover:bg-blue-600 transition-all duration-200 shadow-lg shadow-slate-900/15 hover:shadow-blue-600/30 active:scale-[0.98]"
            >
              Analyze Your First Document Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
