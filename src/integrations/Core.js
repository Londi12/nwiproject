// Core Integration Functions for Visa Flow Platform
// Real text extraction using PDF.js, mammoth.js, and Tesseract.js

import { extractPDFText, isPDFFile } from '../utils/pdfParser.js';

// Real file upload function that stores files locally
export const UploadFile = async ({ file }) => {
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

// Real text extraction from uploaded files using PDF.js, mammoth.js, and Tesseract.js
export const ExtractDataFromUploadedFile = async (params) => {
  const fileUrl = typeof params === 'string' ? params : params.file_url;
  const file = params.file_object;

  if (!file && !fileUrl) {
    return {
      status: "error",
      details: "No file provided for parsing"
    };
  }

  try {
    console.log('Starting real text extraction for file:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size, 'bytes');

    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    let extractedText = '';

    if (isPDFFile(file)) {
      console.log('Extracting text from PDF using dedicated parser...');
      try {
        extractedText = await extractPDFText(file);
      } catch (pdfError) {
        console.error('PDF extraction failed:', pdfError);
        // Fallback: suggest OCR for image-based PDFs
        throw new Error(`PDF text extraction failed: ${pdfError.message}. If this is a scanned PDF, try converting it to an image (PNG/JPG) and upload again for OCR processing.`);
      }
    } else if (fileType.includes('text') || fileName.endsWith('.txt')) {
      console.log('Extracting text from text file...');
      extractedText = await extractTextFromTextFile(file);
    } else if (fileName.endsWith('.docx') || fileType.includes('wordprocessingml')) {
      console.log('Extracting text from DOCX...');
      extractedText = await extractTextFromDOCX(file);
    } else if (fileType.includes('image') || fileName.match(/\.(jpg|jpeg|png)$/)) {
      console.log('Extracting text from image using OCR...');
      extractedText = await extractTextFromImage(file);
    } else {
      // Fallback: try to read as text
      console.log('Unknown file type, attempting to read as text...');
      extractedText = await extractTextFromTextFile(file);
    }

    console.log('Text extraction completed. Length:', extractedText.length);
    console.log('First 200 characters:', extractedText.substring(0, 200));

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from the file');
    }

    return {
      status: "success",
      output: {
        raw_text: extractedText.trim()
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

// Real text extraction functions using various libraries

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

// Extract text from DOCX files using mammoth.js
async function extractTextFromDOCX(file) {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (!result.value || result.value.trim().length === 0) {
      throw new Error('No text found in DOCX file');
    }

    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error(`DOCX parsing failed: ${error.message}`);
  }
}

// Extract text from images using OCR (Tesseract.js)
async function extractTextFromImage(file) {
  try {
    const Tesseract = await import('tesseract.js');

    console.log('Starting OCR processing...');
    const { data: { text } } = await Tesseract.recognize(file, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });

    if (!text || text.trim().length === 0) {
      throw new Error('No text could be extracted from the image');
    }

    return text;
  } catch (error) {
    console.error('OCR parsing error:', error);
    throw new Error(`OCR parsing failed: ${error.message}`);
  }
}

// CV parsing with real integration
export const parseCVWithIntegration = async (fileUrl) => {
  try {
    const extractedData = await ExtractDataFromUploadedFile(fileUrl);
    return extractedData;
  } catch (error) {
    console.error('Error parsing CV:', error);
    throw new Error('Failed to parse CV. Please try again or upload a different format.');
  }
};

// Check if file type is supported for real parsing
export const isParsingSupported = (fileType) => {
  const supportedTypes = ['pdf', 'docx', 'txt', 'jpg', 'jpeg', 'png'];
  return supportedTypes.includes(fileType.toLowerCase());
};

// Get supported file types for real parsing
export const getSupportedFileTypes = () => {
  return {
    upload: ['pdf', 'docx', 'txt', 'jpg', 'jpeg', 'png'],
    parsing: ['pdf', 'docx', 'txt', 'jpg', 'jpeg', 'png']
  };
};

// Mock function to validate file before upload
export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const supportedTypes = getSupportedFileTypes().upload;
  const fileExtension = file.name.split('.').pop().toLowerCase();
  
  const validation = {
    isValid: true,
    errors: []
  };
  
  if (file.size > maxSize) {
    validation.isValid = false;
    validation.errors.push('File size must be less than 10MB');
  }
  
  if (!supportedTypes.includes(fileExtension)) {
    validation.isValid = false;
    validation.errors.push(`File type .${fileExtension} is not supported. Supported types: ${supportedTypes.join(', ')}`);
  }
  
  return validation;
};

// Mock function to generate CV analysis report
export const generateCVAnalysis = async (cvData) => {
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const analysis = {
    overallScore: 85,
    strengths: [
      "Strong technical skills in modern technologies",
      "Good work experience progression",
      "Clear and well-structured format",
      "Relevant education background"
    ],
    improvements: [
      "Add more quantifiable achievements",
      "Include language proficiency levels",
      "Add professional certifications",
      "Consider adding volunteer experience"
    ],
    sections: {
      personalInfo: {
        score: 90,
        feedback: "Complete contact information provided"
      },
      summary: {
        score: 80,
        feedback: "Good summary, could be more specific about achievements"
      },
      experience: {
        score: 85,
        feedback: "Relevant experience, add more metrics and achievements"
      },
      education: {
        score: 90,
        feedback: "Strong educational background"
      },
      skills: {
        score: 85,
        feedback: "Good technical skills, consider adding soft skills"
      }
    },
    immigrationReadiness: {
      score: 80,
      feedback: "Good foundation for immigration application",
      recommendations: [
        "Obtain English language test results (IELTS/TOEFL)",
        "Get educational credentials assessed",
        "Gather employment reference letters",
        "Consider professional certification in target country"
      ]
    }
  };
  
  return analysis;
};

// Mock function to export CV data
export const exportCVData = async (cvData, format = 'json') => {
  // Simulate export delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  switch (format.toLowerCase()) {
    case 'json':
      return {
        data: JSON.stringify(cvData, null, 2),
        filename: `cv_export_${Date.now()}.json`,
        mimeType: 'application/json'
      };
    case 'pdf':
      return {
        data: 'mock_pdf_data',
        filename: `cv_export_${Date.now()}.pdf`,
        mimeType: 'application/pdf'
      };
    default:
      throw new Error(`Export format ${format} not supported`);
  }
};

// Mock function to save CV data to database
export const saveCVData = async (cvData, clientId) => {
  // Simulate save delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: `cv_${Date.now()}`,
    client_id: clientId,
    data: cvData,
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    version: 1
  };
};

// Export all functions
export default {
  UploadFile,
  ExtractDataFromUploadedFile,
  parseCVWithIntegration,
  isParsingSupported,
  getSupportedFileTypes,
  validateFile,
  generateCVAnalysis,
  exportCVData,
  saveCVData
};
