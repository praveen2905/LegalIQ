import React, { createContext, useContext, useState } from 'react';
import { SAMPLE_DOCUMENTS, SAMPLE_COMPARISONS, INITIAL_HISTORY } from '../data/mockLegalData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Document State - defaults to null for clean empty state on /analyzer
  const [documents, setDocuments] = useState(SAMPLE_DOCUMENTS);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');

  // Upload Error State
  const [uploadError, setUploadError] = useState(null);

  // Comparison State — start with nothing selected and no results shown
  const [comparisonDocAId, setComparisonDocAId] = useState(null);
  const [comparisonDocBId, setComparisonDocBId] = useState(null);
  const [activeComparisonId, setActiveComparisonId] = useState(SAMPLE_COMPARISONS[0].id);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonError, setComparisonError] = useState(null);
  // null means results haven't been run yet; set to comparison object after explicit run
  const [comparisonResults, setComparisonResults] = useState(null);
  const [comparisonProgress, setComparisonProgress] = useState('');

  // History State
  const [historyItems, setHistoryItems] = useState(INITIAL_HISTORY);

  // Get currently selected document object (null if none selected)
  const selectedDoc = documents.find(d => d.id === selectedDocId) || null;

  // Action: Clear selection back to empty upload state
  const clearSelectedDocument = () => {
    setSelectedDocId(null);
    setUploadError(null);
    setIsAnalyzing(false);
    setAnalysisProgress('');
  };

  // Action: Select a document (e.g. sample) with simulated analysis loading sequence
  const selectDocument = (docId) => {
    setUploadError(null);
    setIsAnalyzing(true);
    setAnalysisProgress('Analyzing document...');

    setTimeout(() => {
      setAnalysisProgress('Finding important clauses...');
    }, 600);

    setTimeout(() => {
      setAnalysisProgress('Preparing your summary...');
    }, 1200);

    setTimeout(() => {
      setSelectedDocId(docId);
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }, 1800);
  };

  // Action: File upload simulation with validation
  const uploadAndAnalyzeFile = (file) => {
    setUploadError(null);

    // Validation 1: File format (PDF or DOCX only)
    const fileName = file.name.toLowerCase();
    const isValidFormat = fileName.endsWith('.pdf') || fileName.endsWith('.docx') || fileName.endsWith('.doc');
    
    // Validation 2: Max size 10 MB (10 * 1024 * 1024 bytes)
    const MAX_SIZE = 10 * 1024 * 1024;
    const isValidSize = file.size <= MAX_SIZE;

    if (!isValidFormat || !isValidSize) {
      setUploadError('Please upload a PDF or DOCX file under 10 MB.');
      return false;
    }

    // Start simulated analysis pipeline
    setIsAnalyzing(true);
    setAnalysisProgress('Uploading document...');

    setTimeout(() => {
      setAnalysisProgress('Finding important clauses...');
    }, 800);

    setTimeout(() => {
      setAnalysisProgress('Preparing your summary...');
    }, 1600);

    setTimeout(() => {
      // Create new analyzed document from template data
      const newDocId = `doc-upload-${Date.now()}`;
      const newDoc = {
        ...SAMPLE_DOCUMENTS[0],
        id: newDocId,
        title: file.name.replace(/\.[^/.]+$/, ""),
        filename: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        lastAnalyzed: 'Just now',
        uploadDate: new Date().toISOString().split('T')[0]
      };

      // Add to documents and set as selected
      setDocuments(prev => [newDoc, ...prev]);
      setSelectedDocId(newDocId);

      // Add to history ledger
      const newHistoryItem = {
        id: `hist-${Date.now()}`,
        documentId: newDocId,
        title: newDoc.title,
        filename: file.name,
        type: newDoc.type,
        analyzedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        riskScore: newDoc.overallRiskScore,
        riskScoreNumber: newDoc.riskScoreNumber,
        highRiskCount: newDoc.riskCounts.high,
        mediumRiskCount: newDoc.riskCounts.medium,
        lowRiskCount: newDoc.riskCounts.low,
        fileSize: newDoc.fileSize,
        status: 'Newly Analyzed'
      };

      setHistoryItems(prev => [newHistoryItem, ...prev]);

      setIsAnalyzing(false);
      setAnalysisProgress('');
    }, 2400);

    return true;
  };

  // Action: Trigger document comparison simulation
  const startComparison = (docAId, docBId) => {
    setComparisonError(null);

    if (!docAId || !docBId) {
      setComparisonError('Please select both documents before comparing.');
      return false;
    }

    if (docAId === docBId) {
      setComparisonError('Please select two different documents to compare.');
      return false;
    }

    // Clear any previous results and start the loading pipeline
    setComparisonResults(null);
    setIsComparing(true);
    setComparisonProgress('Comparing documents...');

    setTimeout(() => {
      setComparisonProgress('Finding clause differences...');
    }, 700);

    setTimeout(() => {
      setComparisonProgress('Preparing comparison...');
    }, 1400);

    setTimeout(() => {
      // Use the first preset comparison data as the mock result
      setComparisonResults(SAMPLE_COMPARISONS[0]);
      setIsComparing(false);
      setComparisonProgress('');
    }, 2000);

    return true;
  };

  // Action: Clear comparison results (called when either selection changes)
  const clearComparisonResults = () => {
    setComparisonResults(null);
    setComparisonError(null);
  };

  // Action: Delete history entry
  const deleteHistoryItem = (id) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
  };

  // Action: Open a document in analyzer from anywhere (e.g. History)
  const openInAnalyzer = (docId) => {
    const docExists = documents.some(d => d.id === docId);
    if (docExists) {
      setSelectedDocId(docId);
    } else {
      setSelectedDocId(documents[0].id);
    }
  };

  // Action: Open comparison view with a pre-selected document from history
  const openInCompare = (docId) => {
    const targetDoc = documents.find(d => d.id === docId) || documents[0];
    const otherDoc = documents.find(d => d.id !== targetDoc.id) || documents[1];
    setComparisonDocAId(targetDoc.id);
    setComparisonDocBId(otherDoc.id);
  };

  return (
    <AppContext.Provider value={{
      documents,
      selectedDocId,
      selectedDoc,
      isAnalyzing,
      analysisProgress,
      uploadError,
      setUploadError,
      selectDocument,
      clearSelectedDocument,
      uploadAndAnalyzeFile,

      comparisonDocAId,
      comparisonDocBId,
      setComparisonDocAId,
      setComparisonDocBId,
      activeComparisonId,
      setActiveComparisonId,
      isComparing,
      comparisonProgress,
      comparisonError,
      setComparisonError,
      comparisonResults,
      startComparison,
      clearComparisonResults,

      historyItems,
      deleteHistoryItem,
      openInAnalyzer,
      openInCompare
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
