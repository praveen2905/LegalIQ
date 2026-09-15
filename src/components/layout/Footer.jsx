import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ShieldCheck, Zap, Lock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Scale className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-xl tracking-tight">
                LexiLaw <span className="text-blue-500">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              GenAI-powered legal document companion helping individuals, freelancers, and businesses understand, compare, and navigate legal documents with clarity and confidence.
            </p>
            <div className="flex items-center gap-4 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Bank-grade Encryption</span>
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-blue-400" /> 100% Confidential</span>
            </div>
          </div>

          {/* Core Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Core Pages</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Landing Page</Link>
              </li>
              <li>
                <Link to="/analyzer" className="hover:text-white transition-colors">Document Analyzer</Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">Compare Documents</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition-colors">Analysis History</Link>
              </li>
            </ul>
          </div>

          {/* Legal Assistance Features */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">AI Capabilities</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Plain-English Translations
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Risk Level Detection
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Side-by-Side Redlining
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Document Q&A Assistant
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} LexiLaw AI. All rights reserved. Built for GenAI Legal Assistance Challenge.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed for legal access & clarity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
