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
      
      if (textContent.items.length === 0) continue;
      
      // Step 1: Collect text items with their actual positions and dimensions
      const items = textContent.items
        .filter(item => item.str && item.str.length > 0)
        .map(item => ({
          str: item.str,
          x: item.transform[4],
          y: item.transform[5],
          width: item.width || 0,
          // item.height is the real text height in user-space units;
          // transform[3] (scaleY) * font-size is a secondary fallback;
          // hard fallback to 12 if everything is zero/missing
          height: item.height || Math.abs(item.transform[3]) || 12,
          hasEOL: item.hasEOL,
        }));
      
      if (items.length === 0) {
        fullText += '\n\n';
        continue;
      }
      
      // Step 2: Sort all items into reading order
      // PDF Y-axis points UP, so higher Y = higher on the page → sort Y descending
      // Within the same visual line, sort X ascending (left to right)
      const lineThreshold = items.reduce((s, it) => s + it.height, 0) / items.length * 0.4;
      
      items.sort((a, b) => {
        const yDiff = b.y - a.y; // descending (top of page first)
        if (Math.abs(yDiff) > lineThreshold) return yDiff;
        return a.x - b.x; // ascending (left first)
      });
      
      // Step 3: Group items into visual lines by Y proximity
      const lines = [];
      let currentLine = [items[0]];
      
      for (let j = 1; j < items.length; j++) {
        const refY = currentLine[0].y;
        const curY = items[j].y;
        
        if (Math.abs(curY - refY) <= lineThreshold) {
          currentLine.push(items[j]);
        } else {
          lines.push(currentLine);
          currentLine = [items[j]];
        }
      }
      lines.push(currentLine);
      
      // Step 4: Build clean text — sort each line by X, detect gaps for spacing
      const avgLineHeight = items.reduce((s, it) => s + it.height, 0) / items.length;
      let pageText = '';
      let prevLineY = null;
      
      for (const line of lines) {
        line.sort((a, b) => a.x - b.x);
        
        const lineY = line[0].y;
        
        // Detect line breaks vs paragraph breaks using actual line heights
        if (prevLineY !== null) {
          const gap = prevLineY - lineY; // positive because Y decreases going down
          if (gap > avgLineHeight * 1.8) {
            pageText += '\n\n'; // paragraph / section break
          } else {
            pageText += '\n';   // normal line break
          }
        }
        
        // Join items within the line, inserting spaces for horizontal gaps
        let lineText = '';
        for (let k = 0; k < line.length; k++) {
          if (k > 0 && line[k - 1].width > 0) {
            const prevEnd = line[k - 1].x + line[k - 1].width;
            const gap = line[k].x - prevEnd;
            // If gap is larger than ~1/3 of a character width, insert a space
            if (gap > avgLineHeight * 0.2 && !lineText.endsWith(' ')) {
              lineText += ' ';
            }
          }
          lineText += line[k].str;
        }
        
        pageText += lineText;
        prevLineY = lineY;
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
