import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BackButton from '../components/ui/BackButton';
import { 
  History, 
  Search, 
  Filter, 
  FileText, 
  ShieldAlert, 
  Clock, 
  Download, 
  Trash2, 
  ExternalLink, 
  GitCompare, 
  CheckCircle2,
  Sparkles,
  PlusCircle
} from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { historyItems, deleteHistoryItem, openInAnalyzer, openInCompare } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  // Filter history
  const filteredHistory = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesRisk = riskFilter === 'all' || item.riskScore.toLowerCase().includes(riskFilter.toLowerCase());
    return matchesSearch && matchesType && matchesRisk;
  });

  const handleDelete = (id, title) => {
    if (confirm(`Are you sure you want to remove "${title}" from your history?`)) {
      deleteHistoryItem(id);
    }
  };

  const handleOpenAnalysis = (docId) => {
    openInAnalyzer(docId);
    navigate('/analyzer');
  };

  const handleOpenCompare = (docId) => {
    openInCompare(docId);
    navigate('/compare');
  };

  // Overall Stats
  const totalAnalyzed = historyItems.length;
  const highRiskCount = historyItems.filter(i => i.riskScore.includes('High')).length;
  const totalSavedHours = (totalAnalyzed * 3.5).toFixed(1);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
      
      {/* 1. HEADER CONTROL BAR */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-1">
          <BackButton />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
                  Document Vault &amp; Analysis History
                </h1>
                <p className="text-xs text-slate-500">
                  Access your past contract audits, saved side-by-side comparisons, and risk reports.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/analyzer')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs shrink-0"
            >
              <PlusCircle className="w-4 h-4" /> Analyze New Document
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 w-full">
        
        {/* 2. STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Documents</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900">{totalAnalyzed}</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-[11px] text-slate-500">Saved in vault</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">High Risk Warnings</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-rose-600">{highRiskCount}</span>
              <ShieldAlert className="w-5 h-5 text-rose-500" />
            </div>
            <span className="text-[11px] text-slate-500">Flagged clauses requiring review</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Review Time Saved</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-emerald-600">{totalSavedHours} hrs</span>
              <Clock className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-[11px] text-slate-500">Est. legal reading time avoided</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comparisons Run</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-indigo-600">2</span>
              <GitCompare className="w-5 h-5 text-indigo-500" />
            </div>
            <span className="text-[11px] text-slate-500">Side-by-side matrices</span>
          </div>

        </div>

        {/* 3. SEARCH & FILTERS BAR */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by name or filename..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium outline-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="Lease">Commercial Lease</option>
                <option value="Employment">Employment Contract</option>
                <option value="SaaS">SaaS Terms</option>
                <option value="NDA">NDA</option>
                <option value="Comparison">Comparison Matrix</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Risk Level:</span>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium outline-none cursor-pointer"
              >
                <option value="all">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>
            </div>

          </div>

        </div>

        {/* 4. HISTORY RECORDS GRID / TABLE */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No documents found</h3>
              <p className="text-xs text-slate-500">Try adjusting your search query or reset filter options.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="divide-y divide-slate-100">
                {filteredHistory.map((item) => {
                  const isHigh = item.riskScore.includes('High');
                  const isMed = item.riskScore.includes('Medium');

                  return (
                    <div
                      key={item.id}
                      className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      
                      {/* Left Document Information */}
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isHigh ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                          isMed ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                          'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-extrabold text-slate-900 text-sm">{item.title}</h3>
                            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                              isHigh ? 'bg-rose-100 text-rose-700' :
                              isMed ? 'bg-amber-100 text-amber-700' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                              {item.riskScore}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 font-mono">
                            {item.filename} • {item.fileSize} • Analyzed on {item.analyzedDate}
                          </p>

                          <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-600">
                            <span className="font-medium text-slate-700">Clause Breakdown:</span>
                            <span className="text-rose-600 font-bold">{item.highRiskCount} High</span>
                            <span className="text-amber-600 font-bold">{item.mediumRiskCount} Med</span>
                            <span className="text-emerald-600 font-bold">{item.lowRiskCount} Safe</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Quick Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => handleOpenAnalysis(item.documentId)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View Analysis
                        </button>

                        <button
                          onClick={() => handleOpenCompare(item.documentId)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
                        >
                          <GitCompare className="w-3.5 h-3.5" /> Compare
                        </button>

                        <button
                          onClick={() => alert(`Exporting report for ${item.title}...`)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Export Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete from Vault"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
