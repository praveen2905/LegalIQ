import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SAMPLE_DOCUMENTS } from '../data/mockLegalData';
import BackButton from '../components/ui/BackButton';
import {
  GitCompare,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Check,
  XCircle,
  Sliders,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  FilePlus2,
  ArrowRightLeft
} from 'lucide-react';

export default function CompareDocuments() {
  const {
    documents,
    comparisonDocAId,
    comparisonDocBId,
    setComparisonDocAId,
    setComparisonDocBId,
    isComparing,
    comparisonProgress,
    comparisonError,
    setComparisonError,
    comparisonResults,
    startComparison,
    clearComparisonResults
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('all');

  // Resolve document objects (may be null when nothing is selected)
  const docA = comparisonDocAId ? documents.find(d => d.id === comparisonDocAId) : null;
  const docB = comparisonDocBId ? documents.find(d => d.id === comparisonDocBId) : null;

  const bothSelected = !!docA && !!docB;
  const isSameDoc = bothSelected && comparisonDocAId === comparisonDocBId;

  // ------- handlers -------
  const handleDocAChange = (id) => {
    setComparisonError(null);
    clearComparisonResults();
    setComparisonDocAId(id || null);
  };

  const handleDocBChange = (id) => {
    setComparisonError(null);
    clearComparisonResults();
    setComparisonDocBId(id || null);
  };

  const handleRunComparison = () => {
    if (!bothSelected) return;
    startComparison(comparisonDocAId, comparisonDocBId);
  };

  // ------- derived -------
  const canRun = bothSelected && !isSameDoc && !isComparing;
  const filteredMatrix = comparisonResults
    ? comparisonResults.matrix.filter(item =>
        categoryFilter === 'all' ||
        item.category.toLowerCase().includes(categoryFilter.toLowerCase())
      )
    : [];

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">

      {/* ── HEADER BAR ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-1">
          <BackButton />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
                <GitCompare className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
                  Contract Side-by-Side Comparison
                </h1>
                <p className="text-xs text-slate-500">
                  Identify clause divergences, risk shifts, and redline negotiation options between two agreements.
                </p>
              </div>
            </div>

            <button
              onClick={handleRunComparison}
              disabled={!canRun}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-2xs shrink-0 disabled:opacity-40 disabled:pointer-events-none active:scale-95"
            >
              {isComparing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {comparisonProgress || 'Comparing Documents...'}
                </>
              ) : (
                <>
                  <GitCompare className="w-4 h-4" />
                  Run Side-by-Side Comparison
                </>
              )}
            </button>
          </div>
        </div>

        {/* Same-document / error warning strip */}
        {(isSameDoc || comparisonError) && (
          <div className="bg-amber-50 border-t border-amber-200 px-4 py-2.5 text-xs text-amber-900 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-bold">
              {comparisonError || 'Please select two different documents to compare.'}
            </span>
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 w-full">

        {/* ── DOCUMENT SELECTION CARDS ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

          {/* Document A */}
          <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Document A — Base / Standard
              </span>
            </div>

            {/* Selector */}
            <div className="relative">
              <select
                value={comparisonDocAId ?? ''}
                onChange={e => handleDocAChange(e.target.value)}
                disabled={isComparing}
                className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-900 text-xs sm:text-sm font-semibold rounded-xl p-3 pr-8 focus:ring-2 focus:ring-blue-500 outline-none transition-colors cursor-pointer"
              >
                <option value="">— Select a document —</option>
                {documents.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.type})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            {/* Preview snippet or placeholder */}
            {docA ? (
              <p className="text-xs text-slate-500 leading-relaxed flex-1">
                {docA.summary.substring(0, 120)}…
              </p>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                <FilePlus2 className="w-7 h-7" />
                <span className="text-xs font-medium">Select your first document</span>
              </div>
            )}
          </div>

          {/* VS Badge (center column) */}
          <div className="md:col-span-2 flex flex-col items-center justify-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center shadow-md">
              {comparisonResults ? (
                <>
                  <span className="text-sm font-extrabold leading-none">{comparisonResults.overallSimilarity}%</span>
                  <span className="text-[9px] text-slate-300 uppercase font-semibold">Match</span>
                </>
              ) : (
                <ArrowRightLeft className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              {comparisonResults ? 'Clause Alignment' : 'vs'}
            </span>
          </div>

          {/* Document B */}
          <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                Document B — Proposed / Vendor
              </span>
            </div>

            {/* Selector */}
            <div className="relative">
              <select
                value={comparisonDocBId ?? ''}
                onChange={e => handleDocBChange(e.target.value)}
                disabled={isComparing}
                className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-900 text-xs sm:text-sm font-semibold rounded-xl p-3 pr-8 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors cursor-pointer"
              >
                <option value="">— Select a document —</option>
                {documents.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.type})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            {/* Preview snippet or placeholder */}
            {docB ? (
              <p className="text-xs text-slate-500 leading-relaxed flex-1">
                {docB.summary.substring(0, 120)}…
              </p>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                <FilePlus2 className="w-7 h-7" />
                <span className="text-xs font-medium">Select your second document</span>
              </div>
            )}
          </div>
        </div>

        {/* ── CONTENT AREA ─────────────────────────────────────────── */}

        {/* Loading state */}
        {isComparing && (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <h3 className="font-extrabold text-slate-800 text-base">{comparisonProgress}</h3>
            <p className="text-xs text-slate-500">
              Calculating similarity scores, identifying risk shifts, and generating redlines.
            </p>
          </div>
        )}

        {/* Same-doc big warning (only if no loading) */}
        {!isComparing && isSameDoc && (
          <div className="p-12 bg-amber-50/60 rounded-2xl border border-amber-200 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="font-extrabold text-amber-900 text-base">
              Please select two different documents to compare.
            </h3>
            <p className="text-xs text-amber-700">
              Select two distinct agreements in the dropdowns above to display clause variances.
            </p>
          </div>
        )}

        {/* Empty state — nothing selected, no results, not loading */}
        {!isComparing && !isSameDoc && !comparisonResults && (
          <div className="p-14 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto">
              <GitCompare className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-800 text-base">
                {!docA && !docB
                  ? 'Select two documents to begin'
                  : !docA
                  ? 'Now select Document A'
                  : 'Now select Document B'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Choose a document for both slots above, then click{' '}
                <strong>Run Side-by-Side Comparison</strong> to see the clause variance analysis.
              </p>
            </div>
          </div>
        )}

        {/* ── COMPARISON RESULTS (only after explicit run) ─────────── */}
        {!isComparing && !isSameDoc && comparisonResults && (
          <>
            {/* AI Verdict banner */}
            <div className="p-5 bg-indigo-50/80 rounded-2xl border border-indigo-200/80 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>LexiLaw AI Comparison Verdict</span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed font-medium">
                Comparing &quot;{docA?.title}&quot; vs &quot;{docB?.title}&quot;: {comparisonResults.recommendation}
              </p>

              <div className="pt-2 border-t border-indigo-200/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800 mb-2">
                  Key Differences Highlighted:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-indigo-900">
                  {comparisonResults.summaryDifferences.map((diff, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-lg border border-indigo-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      <span>{diff}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Clause Variance Matrix */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  Clause Variance Matrix ({filteredMatrix.length} Categories)
                </h2>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Filter Topic:</span>
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-1.5 font-medium outline-none cursor-pointer"
                  >
                    <option value="all">All Topics</option>
                    {comparisonResults.matrix.map(m => (
                      <option key={m.category} value={m.category}>{m.category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {filteredMatrix.map((item, idx) => {
                  const isHighDiv = item.status === 'High Divergence';
                  const isSubt = item.status === 'Substantial Difference';
                  const isIdentical = item.status === 'Identical';

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all hover:shadow-md"
                    >
                      {/* Card header */}
                      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{item.category}</span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            isIdentical ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            isHighDiv   ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                            isSubt      ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                          'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                          item.verdictColor === 'emerald' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {item.verdict}
                        </span>
                      </div>

                      {/* Side-by-side clause text */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-5 gap-4">
                        <div className="space-y-2 pr-0 md:pr-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
                            Doc A: {docA?.title}
                          </span>
                          <div className="p-3.5 bg-blue-50/40 rounded-xl border border-blue-100 text-xs sm:text-sm text-slate-800 leading-relaxed">
                            {item.docAValue}
                          </div>
                        </div>
                        <div className="space-y-2 pt-4 md:pt-0 pl-0 md:pl-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                            Doc B: {docB?.title}
                          </span>
                          <div className="p-3.5 bg-indigo-50/40 rounded-xl border border-indigo-100 text-xs sm:text-sm text-slate-800 leading-relaxed">
                            {item.docBValue}
                          </div>
                        </div>
                      </div>

                      {/* Redline footer */}
                      <div className="px-5 py-3 bg-slate-100/70 border-t border-slate-200/80 text-xs text-slate-700 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span><strong>Redline Guidance:</strong> {item.analysis}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
