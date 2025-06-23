// Client-Side CV Parser Implementation
// This actually reads and parses uploaded files

// Real file upload function that stores files locally
export const RealUploadFile = async ({ file }) => {
  try {
    // Create a local URL for the file
    const fileUrl = URL.createObjectURL(file);
    
    return {
      file_url: fileUrl,
      file_id: `file_${Date.now()}`,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      upload_date: new Date().toISOString(),
      file_object: file // Store the actual file object for parsing
    };
  } catch (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }
};

// Real text extraction from uploaded files
export const RealExtractDataFromUploadedFile = async (params) => {
  const fileUrl = typeof params === 'string' ? params : params.file_url;
  const file = params.file_object;
  
  if (!file && !fileUrl) {
    return {
      status: "error",
      details: "No file provided for parsing"
    };
  }

  try {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    let extractedText = '';

    if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      extractedText = await extractTextFromPDF(file);
    } else if (fileType.includes('text') || fileName.endsWith('.txt')) {
      extractedText = await extractTextFromTextFile(file);
    } else if (fileType.includes('image') || fileName.match(/\.(jpg|jpeg|png)$/)) {
      extractedText = await extractTextFromImage(file);
    } else if (fileName.endsWith('.docx')) {
      extractedText = await extractTextFromDOCX(file);
    } else {
      // Fallback: try to read as text
      extractedText = await extractTextFromTextFile(file);
    }

    return {
      status: "success",
      output: {
        raw_text: extractedText
      }
    };
  } catch (error) {
    console.error('Real file parsing error:', error);
    return {
      status: "error",
      details: `Failed to extract text: ${error.message}`
    };
  }
};

// Extract text from PDF files using PDF.js
async function extractTextFromPDF(file) {
  try {
    // Dynamic import to avoid build issues
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
    
    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Extract text with better formatting
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}

// Extract text from text files
async function extractTextFromTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read text file'));
    };
    
    reader.readAsText(file);
  });
}

// Extract text from DOCX files using mammoth
async function extractTextFromDOCX(file) {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    throw new Error(`DOCX parsing failed: ${error.message}`);
  }
}

// Extract text from images using OCR (Tesseract.js)
async function extractTextFromImage(file) {
  try {
    const Tesseract = await import('tesseract.js');
    
    const { data: { text } } = await Tesseract.recognize(file, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });
    
    return text;
  } catch (error) {
    throw new Error(`OCR parsing failed: ${error.message}`);
  }
}

// Check if file type is supported for real parsing
export const isRealParsingSupported = (fileType) => {
  const supportedTypes = ['pdf', 'txt', 'docx', 'jpg', 'jpeg', 'png'];
  return supportedTypes.includes(fileType.toLowerCase());
};

// Get supported file types for real parsing
export const getRealSupportedFileTypes = () => {
  return {
    upload: ['pdf', 'txt', 'docx', 'jpg', 'jpeg', 'png'],
    parsing: ['pdf', 'txt', 'docx', 'jpg', 'jpeg', 'png']
  };
};
