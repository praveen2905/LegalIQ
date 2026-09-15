import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/ui/BackButton';
import { SAMPLE_DOCUMENTS } from '../data/mockLegalData';
import { 
  FileText, 
  Upload, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  Download, 
  Search, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  Send, 
  Copy, 
  Check, 
  HelpCircle, 
  Eye, 
  ArrowRight,
  RefreshCw,
  FileCheck,
  AlertCircle,
  X,
  BookOpen,
  PlusCircle,
  UploadCloud,
  FileCode
} from 'lucide-react';

export default function DocumentAnalyzer() {
  const { 
    documents, 
    selectedDocId, 
    selectedDoc, 
    isAnalyzing, 
    analysisProgress, 
    uploadError, 
    setUploadError, 
    selectDocument, 
    clearSelectedDocument,
    uploadAndAnalyzeFile 
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'clauses' | 'chat' | 'export'
  const [selectedClauseId, setSelectedClauseId] = useState(null);
  const [clauseFilter, setClauseFilter] = useState('all'); // 'all' | 'High' | 'Medium' | 'Low'
  const [copied, setCopied] = useState(false);
  const [explainModalClause, setExplainModalClause] = useState(null);

  // References for scrolling
  const readerRefs = useRef({});

  // Chat Assistant State
  const [chatMessages, setChatMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Sync chat message when document changes
  useEffect(() => {
    if (selectedDoc) {
      setExplainModalClause(null);
      setSelectedClauseId(null);
      setChatMessages([
        {
          sender: 'ai',
          text: `Hello! I have analyzed "${selectedDoc.title}". I detected ${selectedDoc.riskCounts?.high || 0} high-risk clause(s) and ${selectedDoc.riskCounts?.medium || 0} medium-risk item(s). What questions do you have?`,
          references: [],
          timestamp: 'Just now'
        }
      ]);
    }
  }, [selectedDocId]);

  // Handle Drag & Drop / File Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAndAnalyzeFile(file);
    }
    e.target.value = '';
  };

  // Scroll to clause in Reader
  const scrollToReaderClause = (clauseId) => {
    setSelectedClauseId(clauseId);
    const el = readerRefs.current[clauseId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Chat message submission
  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isTyping || !selectedDoc) return;

    setUploadError(null);

    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerQ = query.toLowerCase();
      
      let match = selectedDoc.aiQuestions.find(q => 
        lowerQ.includes(q.question.toLowerCase().replace('?', '')) ||
        q.question.toLowerCase().includes(lowerQ)
      );

      let aiResponseText = '';
      let references = [];

      if (match) {
        aiResponseText = match.answer;
        references = match.references;
      } else if (lowerQ.includes('notice') || lowerQ.includes('renewal')) {
        aiResponseText = `Regarding notice and renewal in "${selectedDoc.title}": Section terms specify written notice of non-renewal prior to contract expiration. Failing to provide timely notice results in automatic renewal.`;
        references = [selectedDoc.clauses[0]?.sectionNumber || 'Section 4.2'];
      } else if (lowerQ.includes('leave') || lowerQ.includes('terminate') || lowerQ.includes('early')) {
        aiResponseText = `Early termination conditions: Under ${selectedDoc.clauses.find(c => c.riskCategory === 'Termination')?.sectionNumber || 'Section 16.3'}, early termination requires written advance notice and may trigger liquidated damages.`;
        references = [selectedDoc.clauses.find(c => c.riskCategory === 'Termination')?.sectionNumber || 'Termination Clause'];
      } else if (lowerQ.includes('liability') || lowerQ.includes('cap') || lowerQ.includes('indemnity')) {
        aiResponseText = `Liability terms: ${selectedDoc.clauses.find(c => c.riskCategory === 'Liability')?.plainEnglish || 'Liability terms specify obligations for damages and legal claims.'}`;
        references = [selectedDoc.clauses.find(c => c.riskCategory === 'Liability')?.sectionNumber || 'Indemnity Section'];
      } else if (lowerQ.includes('payment') || lowerQ.includes('fee') || lowerQ.includes('rent')) {
        aiResponseText = `Payment terms: Payments are due on scheduled due dates. ${selectedDoc.financialTerms[0]?.detail || 'See financial section for details.'}`;
        references = [selectedDoc.financialTerms[0]?.item || 'Payment Terms'];
      } else {
        aiResponseText = `I can currently answer questions based on the available document information. Try asking about the payment terms, termination, liability, confidentiality, or notice period.`;
        references = [];
      }

      const aiMsg = {
        sender: 'ai',
        text: aiResponseText,
        references,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const filteredClauses = selectedDoc ? selectedDoc.clauses.filter(clause => {
    if (clauseFilter === 'all') return true;
    return clause.riskLevel === clauseFilter;
  }) : [];

  const handleCopySummary = () => {
    if (!selectedDoc) return;
    navigator.clipboard.writeText(selectedDoc.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // =========================================================================
  // 1. EMPTY INITIAL STATE (No document selected yet & not analyzing)
  // =========================================================================
  if (!selectedDoc && !isAnalyzing) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
        
        {/* Header Bar */}
        <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-1">
            <BackButton />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
                  Document Analyzer
                </h1>
                <p className="text-xs text-slate-500">
                  Upload a legal agreement or select a sample document to start GenAI analysis.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10 w-full flex-1">
          
          {/* Main Upload Dropzone Card */}
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors p-8 sm:p-12 text-center shadow-xs space-y-6">
            
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Upload your legal document
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Drag & drop your PDF or DOCX here, or browse your files.
              </p>
            </div>

            {/* Upload Button */}
            <div className="pt-2">
              <label className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-slate-900/10 hover:shadow-blue-600/20 transition-all cursor-pointer active:scale-98">
                <Upload className="w-4 h-4" />
                <span>Choose File</span>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.docx,.doc" 
                />
              </label>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              Supported formats: PDF, DOCX • Maximum size: 10 MB
            </p>

            {/* Error Banner if invalid upload attempted */}
            {uploadError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-center justify-center gap-2 max-w-md mx-auto animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{uploadError}</span>
              </div>
            )}

          </div>

          {/* Sample Documents Selection */}
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Or try a sample document
              </h3>
              <p className="text-xs text-slate-500">
                Select a pre-analyzed legal template below to test the analyzer features.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SAMPLE_DOCUMENTS.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => selectDocument(doc.id)}
                  className="bg-white p-5 rounded-xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {doc.type}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      doc.overallRiskScore === 'High' ? 'bg-rose-100 text-rose-700' :
                      doc.overallRiskScore === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {doc.overallRiskScore} Risk
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {doc.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {doc.summary}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{doc.pageCount} pages • {doc.fileSize}</span>
                    <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Analyze Sample <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. ANALYSIS WORKSPACE STATE (Shown after document is loaded or analyzing)
  // =========================================================================
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      
      {/* TOP CONTROL BAR */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-1">
          <BackButton />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Document Switcher & Info */}
          {selectedDoc && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                    {selectedDoc.title}
                  </h1>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    selectedDoc.overallRiskScore === 'High' 
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : selectedDoc.overallRiskScore === 'Medium'
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}>
                    {selectedDoc.overallRiskScore} Risk ({selectedDoc.riskScoreNumber}/100)
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>{selectedDoc.type}</span> • <span>{selectedDoc.fileSize}</span> • <span>{selectedDoc.pageCount} pages</span> • <span>Analyzed {selectedDoc.lastAnalyzed}</span>
                </p>
              </div>
            </div>
          )}

          {/* Actions: Switch Sample, Upload, Reset */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={clearSelectedDocument}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Upload Another
            </button>

            <select
              value={selectedDocId || ''}
              onChange={(e) => selectDocument(e.target.value)}
              disabled={isAnalyzing}
              className="bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-colors cursor-pointer disabled:opacity-50"
            >
              <option value="" disabled>Switch Sample...</option>
              {documents.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.title} ({doc.overallRiskScore} Risk)
                </option>
              ))}
            </select>

            <label className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer shrink-0 ${
              isAnalyzing ? 'opacity-50 pointer-events-none' : 'active:scale-95'
            }`}>
              {isAnalyzing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>{isAnalyzing ? 'Processing...' : 'Upload File'}</span>
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.docx,.doc" 
                disabled={isAnalyzing}
              />
            </label>
          </div>

          </div>{/* end inner row */}

        </div>

        {/* Upload Error Banner if any */}
        {uploadError && (
          <div className="bg-rose-50 border-t border-b border-rose-200 px-4 py-2.5 text-xs text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-semibold">{uploadError}</span>
            </div>
            <button onClick={() => setUploadError(null)} className="text-rose-600 hover:text-rose-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading Bar when analyzing */}
        {isAnalyzing && (
          <div className="bg-blue-50 border-t border-b border-blue-200 px-4 py-2.5 text-xs text-blue-900 flex items-center gap-3 animate-pulse">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
            <span className="font-bold">{analysisProgress || 'Analyzing document...'}</span>
          </div>
        )}
      </div>

      {/* WORKSPACE CONTENT (If document loaded) */}
      {selectedDoc && !isAnalyzing && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT PANE: Interactive Document Text Viewer */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[750px]">
              
              <div className="px-4 py-3.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-xs uppercase tracking-wider text-slate-700">Document Reader</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{selectedDoc.filename}</span>
              </div>

              {/* Document Content Scroll View */}
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 font-sans text-sm text-slate-800 space-y-4 leading-relaxed bg-white">
                
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-800 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Click any highlighted clause block below to select it and view plain-language analysis.</span>
                </div>

                {/* Document Text Rendering with Clause Highlights */}
                <div className="space-y-4 font-mono text-xs text-slate-700">
                  {selectedDoc.clauses.map((clause) => {
                    const isSelected = selectedClauseId === clause.id;
                    const isHigh = clause.riskLevel === 'High';
                    const isMed = clause.riskLevel === 'Medium';

                    return (
                      <div
                        key={clause.id}
                        ref={(el) => (readerRefs.current[clause.id] = el)}
                        onClick={() => {
                          setSelectedClauseId(clause.id);
                          setActiveTab('clauses');
                        }}
                        className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer relative group ${
                          isSelected 
                            ? 'ring-2 ring-blue-600 bg-blue-50/50 border-blue-300 shadow-xs' 
                            : isHigh 
                            ? 'bg-rose-50/40 border-rose-200 hover:border-rose-400' 
                            : isMed 
                            ? 'bg-amber-50/40 border-amber-200 hover:border-amber-400'
                            : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 font-sans">
                          <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            {clause.sectionNumber}: {clause.title}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isHigh ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                            isMed ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}>
                            {clause.riskLevel} Risk
                          </span>
                        </div>

                        <p className="text-slate-700 leading-relaxed italic text-[11px] sm:text-xs">
                          "{clause.text}"
                        </p>

                        <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] font-sans">
                          <span className="text-slate-400">{clause.lineRange}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExplainModalClause(clause);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors"
                          >
                            <BookOpen className="w-3 h-3" /> Explain Simply
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

            {/* RIGHT PANE: Multi-Tab AI Analysis Drawer */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[750px] relative">
              
              {/* Drawer Header Tabs */}
              <div className="bg-slate-100/80 border-b border-slate-200 p-2 flex items-center gap-1 overflow-x-auto">
                
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  Executive Summary
                </button>

                <button
                  onClick={() => setActiveTab('clauses')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
                    activeTab === 'clauses'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Clause Risks
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                    {selectedDoc.clauses.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'chat'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  Ask Your Document
                </button>

                <button
                  onClick={() => setActiveTab('export')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'export'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  Export Report
                </button>

              </div>

              {/* TAB CONTENT AREA */}
              <div className="p-5 overflow-y-auto flex-1 space-y-6">
                
                {/* TAB 1: EXECUTIVE OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Summary Box */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/90 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Plain Language Executive Summary</h3>
                        <button 
                          onClick={handleCopySummary}
                          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed font-normal">
                        {selectedDoc.summary}
                      </p>
                    </div>

                    {/* Key Obligations & Rights Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Key Obligations */}
                      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/80 space-y-3">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600" /> Key Tenant/User Obligations
                        </h4>
                        <ul className="space-y-2 text-xs text-amber-950">
                          {selectedDoc.keyObligations.map((ob, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                              <span>{ob}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Key Rights */}
                      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/80 space-y-3">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Your Rights & Protections
                        </h4>
                        <ul className="space-y-2 text-xs text-emerald-950">
                          {selectedDoc.keyRights.map((rt, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                              <span>{rt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    {/* Important Dates & Financial Terms */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" /> Critical Dates & Deadlines
                      </h3>
                      <div className="bg-white rounded-xl border border-slate-200/80 divide-y divide-slate-100 text-xs">
                        {selectedDoc.importantDates.map((item, idx) => (
                          <div key={idx} className="p-3 flex items-center justify-between">
                            <span className="font-medium text-slate-800">{item.event}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-slate-600">{item.date}</span>
                              <span className={`px-2 py-0.5 rounded-md font-semibold ${
                                item.urgency === 'Critical' ? 'bg-rose-100 text-rose-700' :
                                item.urgency === 'High' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {item.urgency}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" /> Financial Commitments & Risk
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedDoc.financialTerms.map((fin, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{fin.item}</span>
                              <span className={`px-2 py-0.2 rounded-full font-bold text-[10px] ${
                                fin.riskLevel === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {fin.riskLevel}
                              </span>
                            </div>
                            <p className="text-slate-600">{fin.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 2: CLAUSE BREAKDOWN & RISK FLAGS */}
                {activeTab === 'clauses' && (
                  <div className="space-y-4 animate-fade-in">
                    
                    {/* Filter Pills */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <span className="text-xs font-semibold text-slate-500">Filter Risk Level:</span>
                      <div className="flex items-center gap-1.5">
                        {['all', 'High', 'Medium', 'Low'].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setClauseFilter(lvl)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              clauseFilter === lvl
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {lvl === 'all' ? 'All Clauses' : `${lvl} Risk`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Clause Cards List */}
                    <div className="space-y-4">
                      {filteredClauses.map((clause) => {
                        const isHigh = clause.riskLevel === 'High';
                        const isMed = clause.riskLevel === 'Medium';
                        const isSelected = selectedClauseId === clause.id;

                        return (
                          <div
                            key={clause.id}
                            onClick={() => scrollToReaderClause(clause.id)}
                            className={`p-4 rounded-xl border transition-all space-y-3 cursor-pointer ${
                              isSelected
                                ? 'ring-2 ring-blue-600 bg-blue-50/20 border-blue-300 shadow-xs'
                                : isHigh
                                ? 'bg-rose-50/20 border-rose-200 hover:border-rose-300'
                                : isMed
                                ? 'bg-amber-50/20 border-amber-200 hover:border-amber-300'
                                : 'bg-slate-50/50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{clause.title}</span>
                                <span className="text-xs font-mono text-slate-400">({clause.sectionNumber})</span>
                              </div>
                              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                isHigh ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                isMed ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}>
                                {clause.riskLevel} Risk
                              </span>
                            </div>

                            {/* Plain English Translation */}
                            <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-blue-600 block">Plain English Translation:</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExplainModalClause(clause);
                                  }}
                                  className="text-[11px] text-blue-600 hover:underline font-bold flex items-center gap-1"
                                >
                                  <BookOpen className="w-3 h-3" /> Explain Simply
                                </button>
                              </div>
                              {clause.plainEnglish}
                            </div>

                            {/* Original Legal Excerpt */}
                            <div className="p-2.5 bg-slate-100/70 rounded-lg text-xs font-mono text-slate-600 leading-relaxed italic">
                              "{clause.text}"
                            </div>

                            {/* Risk & Negotiation Recommendation */}
                            <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="font-bold text-rose-700 block mb-0.5">Why it's risky:</span>
                                <p className="text-slate-600">{clause.riskExplanation}</p>
                              </div>
                              <div>
                                <span className="font-bold text-emerald-700 block mb-0.5">Recommended Redline:</span>
                                <p className="text-slate-600">{clause.recommendation}</p>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>

                  </div>
                )}

                {/* TAB 3: INTERACTIVE AI Q&A ASSISTANT */}
                {activeTab === 'chat' && (
                  <div className="flex flex-col h-full animate-fade-in">
                    
                    {/* Chat Message History */}
                    <div className="flex-1 space-y-3 overflow-y-auto pr-1 pb-4 min-h-[360px]">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex gap-3 text-xs sm:text-sm ${
                            msg.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {msg.sender === 'ai' && (
                            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                              <Sparkles className="w-4 h-4" />
                            </div>
                          )}

                          <div className={`p-3.5 rounded-2xl max-w-[85%] space-y-1.5 ${
                            msg.sender === 'user'
                              ? 'bg-slate-900 text-white rounded-br-none'
                              : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none'
                          }`}>
                            <p className="leading-relaxed font-normal">{msg.text}</p>
                            
                            {msg.references?.length > 0 && (
                              <div className="pt-1 flex items-center gap-1.5 text-[10px] text-blue-600 font-semibold">
                                <span>Source References:</span>
                                {msg.references.map((ref, rIdx) => (
                                  <span key={rIdx} className="bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                    {ref}
                                  </span>
                                ))}
                              </div>
                            )}

                            <span className="text-[10px] text-slate-400 block text-right font-mono">
                              {msg.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                          <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                          <span>LexiLaw AI is searching document context...</span>
                        </div>
                      )}
                    </div>

                    {/* Recommended Prompt Chips */}
                    <div className="py-2 space-y-1.5 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Suggested Questions:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => handleSendMessage('What is the notice period?')}
                          disabled={isTyping}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-blue-700 text-xs font-medium transition-colors text-left disabled:opacity-50"
                        >
                          "What is the notice period?"
                        </button>

                        <button
                          onClick={() => handleSendMessage('What happens if I leave early?')}
                          disabled={isTyping}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-blue-700 text-xs font-medium transition-colors text-left disabled:opacity-50"
                        >
                          "What happens if I leave early?"
                        </button>

                        <button
                          onClick={() => handleSendMessage('What is the liability cap?')}
                          disabled={isTyping}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-blue-700 text-xs font-medium transition-colors text-left disabled:opacity-50"
                        >
                          "What is the liability cap?"
                        </button>

                        {selectedDoc.aiQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(q.question)}
                            disabled={isTyping}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-medium transition-colors text-left disabled:opacity-50"
                          >
                            "{q.question}"
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Input Form */}
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={inputQuery}
                        onChange={(e) => setInputQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask any question about this legal document..."
                        disabled={isTyping}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={isTyping || !inputQuery.trim()}
                        className="p-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white transition-colors shadow-2xs disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )}

                {/* TAB 4: EXPORT REPORT */}
                {activeTab === 'export' && (
                  <div className="space-y-6 animate-fade-in">
                    
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-6 h-6 text-emerald-600" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Analysis Ready for Export</h4>
                          <p className="text-xs text-slate-600">Download formatted executive PDF summary or export JSON metadata.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Exporting analysis report for ${selectedDoc.title} as PDF...`)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4" /> Download PDF Report
                      </button>
                    </div>

                    {/* Formatted Report Preview */}
                    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4 font-sans">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <div>
                          <h2 className="font-extrabold text-lg text-slate-900">LexiLaw AI Audit Report</h2>
                          <span className="text-xs text-slate-500">Generated on {new Date().toLocaleDateString()}</span>
                        </div>
                        <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg">
                          CONFIDENTIAL
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-700">
                        <p><strong>Document Name:</strong> {selectedDoc.title}</p>
                        <p><strong>Parties Involved:</strong> {selectedDoc.parties.join(' AND ')}</p>
                        <p><strong>Overall Risk Assessment:</strong> <span className="font-bold text-rose-600">{selectedDoc.overallRiskScore} ({selectedDoc.riskScoreNumber}/100)</span></p>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <h4 className="font-bold text-xs uppercase text-slate-500 mb-1">Executive Summary</h4>
                        <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-lg border">
                          {selectedDoc.summary}
                        </p>
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* EXPLAIN SIMPLY MODAL OVERLAY */}
              {explainModalClause && (
                <div className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
                    
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <h3 className="font-extrabold text-slate-900 text-base">Explain Simply</h3>
                      </div>
                      <button 
                        onClick={() => setExplainModalClause(null)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">{explainModalClause.title} ({explainModalClause.sectionNumber})</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          explainModalClause.riskLevel === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {explainModalClause.riskLevel} Risk
                        </span>
                      </div>

                      <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs sm:text-sm text-blue-950 font-medium leading-relaxed">
                        "{explainModalClause.plainEnglish}"
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 italic">
                        Original Legalese: "{explainModalClause.text}"
                      </div>

                      <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
                        <span>Location: {explainModalClause.lineRange}</span>
                        <span className="font-semibold text-blue-600">Source: {selectedDoc.title}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          scrollToReaderClause(explainModalClause.id);
                          setExplainModalClause(null);
                          setActiveTab('clauses');
                        }}
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs transition-colors shadow-xs"
                      >
                        Focus Clause in Reader & Right Drawer
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
