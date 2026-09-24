import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.js',
      import.meta.url
    ).toString();
  } catch {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
  }
}

/**
 * Extract raw text and page count from a PDF file
 * @param {File} file 
 * @returns {Promise<{ text: string, pageCount: number }>}
 */
async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages || 1;
  const textChunks = [];

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Group text items into lines
    let lastY;
    let pageLines = [];
    let currentLine = '';

    for (const item of textContent.items) {
      if (typeof item.str !== 'string') continue;
      
      if (lastY !== undefined && Math.abs(item.transform[5] - lastY) > 5) {
        if (currentLine.trim()) {
          pageLines.push(currentLine.trim());
        }
        currentLine = item.str;
      } else {
        currentLine += (currentLine ? ' ' : '') + item.str;
      }
      lastY = item.transform[5];
    }
    
    if (currentLine.trim()) {
      pageLines.push(currentLine.trim());
    }

    const pageText = pageLines.join('\n');
    if (pageText.trim()) {
      textChunks.push(pageText);
    }
  }

  const combinedText = textChunks.join('\n\n');
  return {
    text: combinedText,
    pageCount
  };
}

/**
 * Extract raw text from a DOCX file
 * @param {File} file 
 * @returns {Promise<{ text: string, pageCount: number }>}
 */
async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = (result && result.value) ? result.value.trim() : '';

  // Estimate page count: approx 350 words per standard legal page
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const estimatedPages = Math.max(1, Math.ceil(wordCount / 350));

  return {
    text,
    pageCount: estimatedPages
  };
}

/**
 * Extract text from a plain text file (.txt)
 * @param {File} file 
 * @returns {Promise<{ text: string, pageCount: number }>}
 */
async function extractTextFromTxt(file) {
  const text = await file.text();
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const estimatedPages = Math.max(1, Math.ceil(wordCount / 350));
  return {
    text: text.trim(),
    pageCount: estimatedPages
  };
}

/**
 * Main dispatcher to extract text from an uploaded document
 * @param {File} file 
 * @returns {Promise<{ text: string, pageCount: number }>}
 */
export async function extractTextFromFile(file) {
  if (!file) {
    throw new Error('No file provided for text extraction.');
  }

  const fileName = file.name.toLowerCase();

  try {
    let result;
    if (fileName.endsWith('.pdf')) {
      result = await extractTextFromPdf(file);
    } else if (fileName.endsWith('.docx')) {
      result = await extractTextFromDocx(file);
    } else if (fileName.endsWith('.doc')) {
      // Try mammoth first (handles some modern doc formats)
      try {
        result = await extractTextFromDocx(file);
      } catch {
        throw new Error('Legacy .doc format is not directly readable. Please convert or save the file as .docx or .pdf and re-upload.');
      }
    } else if (fileName.endsWith('.txt')) {
      result = await extractTextFromTxt(file);
    } else {
      throw new Error(`Unsupported file type: ${file.name}. Please upload a PDF (.pdf) or Word document (.docx).`);
    }

    if (!result || !result.text || result.text.trim().length < 20) {
      throw new Error('No readable text could be extracted from this document. The file may be empty, image-only/scanned, or password-protected.');
    }

    return result;
  } catch (err) {
    // Preserve custom descriptive errors
    if (err.message && (
      err.message.includes('Legacy .doc') ||
      err.message.includes('Unsupported file') ||
      err.message.includes('No readable text')
    )) {
      throw err;
    }
    throw new Error(`Failed to extract text from ${file.name}: ${err.message || 'Unknown parsing error'}`);
  }
}
