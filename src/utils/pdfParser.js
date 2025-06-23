// Dedicated PDF Parser using PDF.js
// This file handles PDF text extraction with multiple fallback strategies

let pdfjsLib = null;
let workerInitialized = false;

// Initialize PDF.js with proper worker configuration
async function initializePDFJS() {
  if (pdfjsLib && workerInitialized) {
    return pdfjsLib;
  }

  try {
    console.log('Initializing PDF.js...');
    
    // Try different import strategies
    try {
      pdfjsLib = await import('pdfjs-dist');
      console.log('PDF.js imported successfully (standard)');
    } catch (error) {
      console.log('Standard import failed, trying legacy...');
      pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
      console.log('PDF.js imported successfully (legacy)');
    }

    // Configure worker with multiple fallback strategies
    if (!workerInitialized) {
      try {
        // Strategy 1: Use local worker
        const workerUrl = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url);
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl.toString();
        console.log('Using local PDF.js worker:', workerUrl.toString());
      } catch (error) {
        console.log('Local worker failed, trying CDN...');
        // Strategy 2: Use CDN worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        console.log('Using CDN PDF.js worker');
      }
      
      workerInitialized = true;
    }

    return pdfjsLib;
  } catch (error) {
    console.error('Failed to initialize PDF.js:', error);
    throw new Error(`PDF.js initialization failed: ${error.message}`);
  }
}

// Extract text from PDF with comprehensive error handling
export async function extractPDFText(file) {
  try {
    console.log('Starting PDF text extraction for:', file.name);
    
    // Initialize PDF.js
    const pdfjs = await initializePDFJS();
    
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    console.log('File converted to ArrayBuffer, size:', arrayBuffer.byteLength);
    
    // Load PDF document
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      verbosity: 0, // Reduce console output
      disableAutoFetch: true,
      disableStream: true
    });
    
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded: ${pdf.numPages} pages`);
    
    let fullText = '';
    let successfulPages = 0;
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        console.log(`Processing page ${pageNum}/${pdf.numPages}...`);
        
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Extract and clean text
        const pageText = textContent.items
          .map(item => item.str)
          .filter(str => str && str.trim().length > 0)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (pageText.length > 0) {
          fullText += pageText + '\n\n';
          successfulPages++;
        }
        
        console.log(`Page ${pageNum}: ${pageText.length} characters extracted`);
        
      } catch (pageError) {
        console.error(`Error processing page ${pageNum}:`, pageError);
        // Continue with other pages
      }
    }
    
    // Clean up final text
    const finalText = fullText.trim();
    
    console.log(`PDF extraction completed:`);
    console.log(`- Total pages: ${pdf.numPages}`);
    console.log(`- Successful pages: ${successfulPages}`);
    console.log(`- Total text length: ${finalText.length}`);
    console.log(`- First 200 chars: ${finalText.substring(0, 200)}...`);
    
    if (finalText.length === 0) {
      throw new Error('No text found in PDF. This might be a scanned document or image-based PDF.');
    }
    
    if (finalText.length < 50) {
      console.warn('Very little text extracted. PDF might be mostly images.');
    }
    
    return finalText;
    
  } catch (error) {
    console.error('PDF text extraction failed:', error);
    
    // Provide helpful error messages
    if (error.message.includes('Invalid PDF')) {
      throw new Error('Invalid PDF file. Please ensure the file is not corrupted.');
    } else if (error.message.includes('password')) {
      throw new Error('PDF is password protected. Please provide an unprotected version.');
    } else if (error.message.includes('worker')) {
      throw new Error('PDF processing failed due to worker issues. Please try again or use a different file format.');
    } else {
      throw new Error(`PDF parsing failed: ${error.message}. Try converting to text format or use OCR for scanned PDFs.`);
    }
  }
}

// Test if PDF.js is available and working
export async function testPDFJS() {
  try {
    const pdfjs = await initializePDFJS();
    console.log('PDF.js test successful:', !!pdfjs);
    return true;
  } catch (error) {
    console.error('PDF.js test failed:', error);
    return false;
  }
}

// Check if a file is a valid PDF
export function isPDFFile(file) {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  
  return fileName.endsWith('.pdf') || fileType.includes('pdf');
}

export default {
  extractPDFText,
  testPDFJS,
  isPDFFile
};
