import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate PDF from CV preview element
 * @param {HTMLElement} element - The CV preview element to convert
 * @param {string} filename - The filename for the PDF
 * @param {Object} options - Additional options
 */
export async function generatePDFFromElement(element, filename = 'cv.pdf', options = {}) {
  try {
    // Default options
    const defaultOptions = {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      ...options
    };

    // Create canvas from the element
    const canvas = await html2canvas(element, defaultOptions);
    
    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;
    
    // Calculate dimensions to fit A4
    const imgWidth = a4Width;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > a4Height ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png');
    
    // If content is longer than one page, we need to handle pagination
    if (imgHeight > a4Height) {
      let position = 0;
      const pageHeight = a4Height;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      
      let heightLeft = imgHeight - pageHeight;
      
      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    } else {
      // Single page - center vertically
      const yPosition = (a4Height - imgHeight) / 2;
      pdf.addImage(imgData, 'PNG', 0, yPosition, imgWidth, imgHeight);
    }

    // Save the PDF
    pdf.save(filename);
    
    return { success: true, message: 'PDF generated successfully' };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate PDF with better quality and A4 optimization
 * @param {HTMLElement} element - The CV preview element
 * @param {Object} cvData - The CV data for filename generation
 */
export async function downloadCVAsPDF(element, cvData) {
  try {
    // Generate filename from CV data
    const name = cvData?.personalInfo?.fullName || 'CV';
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${sanitizedName}_CV.pdf`;

    // Ensure the element is visible and properly rendered
    if (!element) {
      throw new Error('CV preview element not found');
    }

    // Temporarily show the element if it's hidden
    const originalDisplay = element.style.display;
    const originalVisibility = element.style.visibility;
    
    element.style.display = 'block';
    element.style.visibility = 'visible';

    // Wait a moment for rendering
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate PDF with optimized settings for CV
    const result = await generatePDFFromElement(element, filename, {
      scale: 3, // Higher scale for crisp text
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      letterRendering: true,
      removeContainer: true
    });

    // Restore original styles
    element.style.display = originalDisplay;
    element.style.visibility = originalVisibility;

    return result;
  } catch (error) {
    console.error('Error downloading CV as PDF:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate PDF with exact A4 dimensions and proper scaling
 * @param {HTMLElement} element - The CV preview element
 * @param {string} filename - The filename for the PDF
 */
export async function generateA4PDF(element, filename = 'cv.pdf') {
  try {
    // A4 dimensions in pixels at 300 DPI for high quality
    const a4WidthPx = 2480; // 210mm at 300 DPI
    const a4HeightPx = 3508; // 297mm at 300 DPI
    const scale = 3; // High scale for crisp text

    // Create a temporary container with A4 dimensions
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm';
    tempContainer.style.minHeight = '297mm';
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.style.padding = '15mm';
    tempContainer.style.boxSizing = 'border-box';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    tempContainer.style.fontSize = '12px';
    tempContainer.style.lineHeight = '1.4';
    tempContainer.style.color = '#000000';

    // Clone the CV element and prepare it for PDF
    const clonedElement = element.cloneNode(true);

    // Remove any rounded corners, shadows, and borders for PDF
    clonedElement.style.width = '100%';
    clonedElement.style.maxWidth = 'none';
    clonedElement.style.transform = 'none';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '0';
    clonedElement.style.border = 'none';
    clonedElement.style.borderRadius = '0';
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.backgroundColor = 'transparent';

    // Remove any container styling that might interfere
    const allElements = clonedElement.querySelectorAll('*');
    allElements.forEach(el => {
      el.style.borderRadius = '0';
      el.style.boxShadow = 'none';
      if (el.classList.contains('border')) {
        el.style.border = 'none';
      }
    });

    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    // Wait for fonts and layout to settle
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate canvas with high quality settings
    const canvas = await html2canvas(tempContainer, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      letterRendering: true,
      removeContainer: true,
      width: tempContainer.scrollWidth,
      height: tempContainer.scrollHeight,
      windowWidth: tempContainer.scrollWidth,
      windowHeight: tempContainer.scrollHeight
    });

    // Remove temporary container
    document.body.removeChild(tempContainer);

    // Create PDF with exact A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm

    // Calculate image dimensions to fit A4
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // If content fits on one page
    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      // Handle multi-page content
      let position = 0;
      let remainingHeight = imgHeight;

      while (remainingHeight > 0) {
        if (position > 0) {
          pdf.addPage();
        }

        const pageHeight = Math.min(pdfHeight, remainingHeight);
        pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);

        position += pdfHeight;
        remainingHeight -= pdfHeight;
      }
    }

    // Save PDF
    pdf.save(filename);

    return { success: true, message: 'High-quality A4 PDF generated successfully' };
  } catch (error) {
    console.error('Error generating A4 PDF:', error);
    return { success: false, error: error.message };
  }
}
