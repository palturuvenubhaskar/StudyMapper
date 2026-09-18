import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';
import { extractTextFromImage } from './ocrService';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractTextFromFile = async (file) => {
  const type = file.type;

  if (type.startsWith('image/')) {
    // 1. Image OCR
    return await extractTextFromImage(file);
  } else if (type === 'application/pdf') {
    // 2. PDF Parsing
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      let pageText = '';
      let lastY = null;
      
      for (const item of textContent.items) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 2) {
          pageText += '\n';
        } else if (lastY !== null && Math.abs(item.transform[4] - lastY) > 0) { // Same line but might need space if not present
           // PDF JS usually includes spaces, but we can rely on hasEOL
        }
        pageText += item.str;
        if (item.hasEOL) {
          pageText += '\n';
          lastY = null; // Reset for next line
        } else {
          lastY = item.transform[5];
        }
      }
      
      fullText += pageText + '\n\n';
    }
    return fullText;
  } else if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.endsWith('.docx')
  ) {
    // 3. DOCX Parsing
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } else {
    throw new Error('Unsupported file type. Please upload an Image, PDF, or DOCX file.');
  }
};
