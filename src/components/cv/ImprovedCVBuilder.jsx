import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload, Download, FileText, Sparkles, Eye, User, Briefcase,
  GraduationCap, Award, Languages, CheckCircle, AlertCircle,
  Loader2, Settings, Globe, MapPin, Phone, Mail, Calendar,
  Edit3, Save, X, Plus, Trash2, Palette, Layout, Zap, Monitor,
  BarChart3
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { detectFileTypeFromName, parseTextToCV } from "../../utils/cvParser";
import { CVParserDebugPanel } from "./CVParserDebugPanel";
import { CVPreview } from "./CVPreview";
import ATSScorePanel from "./ATSScorePanel";
import { UploadFile, ExtractDataFromUploadedFile } from "@/integrations/Core";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CV_TEMPLATES = {
  SoftwareEngineer: {
    name: "Modern Professional",
    description: "Clean, ATS-optimized template perfect for tech professionals and Express Entry applications",
    preview: "/cv-templates/software-engineer-template.html",
    features: ["ATS-Optimized", "Express Entry Ready", "Clean Layout", "Professional Typography"],
    category: "Technology",
    immigration_focus: "Express Entry, Provincial Nominee Program",
    color: "blue",
    icon: "💻",
    layout: "modern",
    sections: ["header", "summary", "experience", "education", "skills"],
    atsScore: 98
  },
  Healthcare: {
    name: "Healthcare Professional",
    description: "Professional template for nurses, doctors, and healthcare workers",
    preview: "/cv-templates/healthcare-professional-template.html",
    features: ["Healthcare industry focused", "License & certification sections", "Clinical skills emphasis", "Regulatory compliance"],
    category: "Healthcare",
    immigration_focus: "Provincial Nominee Program, Healthcare Worker Stream",
    color: "green",
    icon: "🏥",
    layout: "professional",
    sections: ["header", "summary", "licenses", "experience", "education", "certifications"],
    atsScore: 92
  },
  BusinessManager: {
    name: "Business Manager",
    description: "Executive template for managers and business immigration candidates",
    preview: "/cv-templates/business-manager-template.html",
    features: ["Executive leadership focus", "Business immigration ready", "P&L and metrics emphasis", "Achievement highlights"],
    category: "Business",
    immigration_focus: "Business Immigration, Investor Program",
    color: "purple",
    icon: "💼",
    layout: "executive",
    sections: ["header", "summary", "achievements", "experience", "education", "leadership"],
    atsScore: 88
  },
  SkilledTrades: {
    name: "Skilled Tradesperson",
    description: "Specialized template for electricians, plumbers, and skilled workers",
    preview: "/cv-templates/skilled-tradesperson-template.html",
    features: ["Trade certifications focus", "Safety & compliance emphasis", "Skilled worker optimized", "Hands-on experience"],
    category: "Skilled Trades",
    immigration_focus: "Skilled Worker Program, Provincial Nominee Program",
    color: "orange",
    icon: "🔧",
    layout: "practical",
    sections: ["header", "summary", "certifications", "experience", "education", "safety"],
    atsScore: 90
  },
  Creative: {
    name: "Creative Professional",
    description: "Modern template for designers, artists, and creative professionals",
    preview: "/cv-templates/creative-professional-template.html",
    features: ["Portfolio integration", "Creative layout", "Visual appeal", "Project showcase"],
    category: "Creative",
    immigration_focus: "Self-Employed Persons Program, Express Entry",
    color: "pink",
    icon: "🎨",
    layout: "creative",
    sections: ["header", "summary", "portfolio", "experience", "education", "skills"],
    atsScore: 85
  },
  Academic: {
    name: "Academic & Research",
    description: "Scholarly template for researchers, professors, and academic professionals",
    preview: "/cv-templates/academic-template.html",
    features: ["Publication lists", "Research focus", "Academic achievements", "Grant history"],
    category: "Academic",
    immigration_focus: "Express Entry, Provincial Nominee Program",
    color: "indigo",
    icon: "🎓",
    layout: "academic",
    sections: ["header", "summary", "publications", "experience", "education", "research"],
    atsScore: 87
  },
  Graduate: {
    name: "Graduate Entry Level",
    description: "Perfect template for recent graduates and entry-level professionals",
    preview: "/cv-templates/graduate-template.html",
    features: ["Education emphasis", "Internship focus", "Skills highlight", "Fresh graduate optimized"],
    category: "Graduate",
    immigration_focus: "Express Entry, Student to PR pathway",
    color: "teal",
    icon: "🎯",
    layout: "graduate",
    sections: ["header", "profile", "education", "experience", "skills"],
    atsScore: 89
  },
  Digital: {
    name: "Digital Portfolio",
    description: "Modern digital template for creative and tech professionals",
    preview: "/cv-templates/digital-template.html",
    features: ["Portfolio showcase", "Interactive design", "Digital focus", "Creative layout"],
    category: "Digital",
    immigration_focus: "Express Entry, Self-Employed Persons",
    color: "blue",
    icon: "💻",
    layout: "digital",
    sections: ["header", "about", "portfolio", "skills", "contact"],
    atsScore: 86
  }
};

const COLOR_THEMES = {
  blue: {
    primary: "#2563eb",
    secondary: "#dbeafe",
    accent: "#1e40af",
    name: "Professional Blue",
    description: "Classic and trustworthy"
  },
  green: {
    primary: "#059669",
    secondary: "#d1fae5",
    accent: "#047857",
    name: "Healthcare Green",
    description: "Fresh and reliable"
  },
  purple: {
    primary: "#7c3aed",
    secondary: "#e9d5ff",
    accent: "#6d28d9",
    name: "Executive Purple",
    description: "Sophisticated and modern"
  },
  orange: {
    primary: "#ea580c",
    secondary: "#fed7aa",
    accent: "#c2410c",
    name: "Energy Orange",
    description: "Dynamic and confident"
  },
  slate: {
    primary: "#475569",
    secondary: "#f1f5f9",
    accent: "#334155",
    name: "Minimal Slate",
    description: "Clean and professional"
  },
  pink: {
    primary: "#db2777",
    secondary: "#fce7f3",
    accent: "#be185d",
    name: "Creative Pink",
    description: "Bold and artistic"
  },
  indigo: {
    primary: "#4f46e5",
    secondary: "#e0e7ff",
    accent: "#3730a3",
    name: "Academic Indigo",
    description: "Scholarly and refined"
  },
  teal: {
    primary: "#0d9488",
    secondary: "#ccfbf1",
    accent: "#0f766e",
    name: "Tech Teal",
    description: "Modern and innovative"
  }
};

export default function ImprovedCVBuilder() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("Canada");
  const [selectedTemplate, setSelectedTemplate] = useState("SoftwareEngineer");
  const [selectedTheme, setSelectedTheme] = useState("blue");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedCV, setGeneratedCV] = useState(null);
  const [debugData, setDebugData] = useState({ rawText: '', confidence: null });
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sectionOrder, setSectionOrder] = useState(['header', 'summary', 'experience', 'education', 'skills']);
  const [customSections, setCustomSections] = useState([]);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [templateCustomization, setTemplateCustomization] = useState({
    fontSize: 'medium',
    spacing: 'normal',
    margins: 'standard'
  });
  const [showATSAnalysis, setShowATSAnalysis] = useState(false);
  const [targetVisa, setTargetVisa] = useState('Express Entry');
  const [targetIndustry, setTargetIndustry] = useState('Software Engineering');
  const previewRef = useRef(null);

  // Generate enhanced summary based on target visa and industry
  const generateEnhancedSummary = (data, visa, industry) => {
    const templates = {
      'Software Engineering': {
        'Express Entry': `Experienced Software Engineer with ${calculateExperience(data.work_experience)}+ years developing scalable applications using modern technologies. Proven track record of leading cross-functional teams and delivering high-quality solutions. Seeking to contribute technical expertise to Canadian technology sector through Express Entry program.`,
        'Skilled Worker (UK)': `Senior Software Engineer with expertise in full-stack development and cloud technologies. Strong background in agile methodologies and team leadership. Eligible for UK Skilled Worker visa sponsorship.`,
        'default': `Results-driven Software Engineer with extensive experience in software development and system architecture. Passionate about creating innovative solutions and mentoring development teams.`
      },
      'Healthcare': {
        'Express Entry': `Registered Nurse with ${calculateExperience(data.work_experience)}+ years of clinical experience in acute care settings. Demonstrated expertise in patient assessment, care planning, and interdisciplinary collaboration. Committed to providing exceptional healthcare services in Canada.`,
        'default': `Dedicated Healthcare Professional with comprehensive clinical experience and commitment to patient-centered care. Proven ability to work effectively in fast-paced medical environments.`
      },
      'Business Management': {
        'Express Entry': `Strategic Business Manager with ${calculateExperience(data.work_experience)}+ years leading high-performing teams and driving operational excellence. Proven track record of increasing revenue and improving efficiency. Ready to contribute leadership skills to Canadian business landscape.`,
        'default': `Results-oriented Business Manager with expertise in strategic planning, team leadership, and operational optimization. Strong analytical skills and proven ability to drive business growth.`
      }
    };

    const industryTemplates = templates[industry] || templates['Software Engineering'];
    return industryTemplates[visa] || industryTemplates['default'];
  };

  const calculateExperience = (workExperience) => {
    if (!workExperience || workExperience.length === 0) return 3;

    let totalYears = 0;
    workExperience.forEach(exp => {
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate);
        const end = exp.endDate.toLowerCase().includes('present') ? new Date() : new Date(exp.endDate);
        const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
        totalYears += Math.max(0, years);
      }
    });

    return Math.max(1, Math.round(totalYears));
  };

  // Map old template names to new template types
  const getTemplateMapping = (templateKey) => {
    const templateMap = {
      'SoftwareEngineer': 'professional',
      'Healthcare': 'professional',
      'BusinessManager': 'executive',
      'SkilledTrades': 'technical',
      'Creative': 'creative',
      'Academic': 'graduate'
    };
    return templateMap[templateKey] || 'professional';
  };

  // Get realistic template data for preview
  const getRealisticTemplateData = (templateKey) => {
    const templateData = {
      'SoftwareEngineer': {
        personalInfo: {
          fullName: "Alex Johnson",
          email: "alex.johnson@email.com",
          phone: "+1 (555) 123-4567",
          location: "Toronto, ON, Canada",
          jobTitle: "Senior Software Engineer"
        },
        summary: "Experienced Software Engineer with 5+ years developing scalable web applications using React, Node.js, and AWS. Proven track record of leading cross-functional teams and delivering high-quality solutions.",
        experience: [
          {
            title: "Senior Software Engineer",
            company: "Tech Solutions Inc.",
            location: "Toronto, ON",
            startDate: "2021",
            endDate: "Present",
            description: "• Led development of microservices architecture serving 100K+ users\n• Implemented CI/CD pipelines reducing deployment time by 60%"
          }
        ],
        education: [
          {
            degree: "Bachelor of Computer Science",
            institution: "University of Toronto",
            location: "Toronto, ON",
            graduationDate: "2019"
          }
        ],
        skills: ["React", "Node.js", "AWS", "Python", "Docker", "Kubernetes"]
      },
      'Healthcare': {
        personalInfo: {
          fullName: "Sarah Chen",
          email: "sarah.chen@email.com",
          phone: "+1 (555) 987-6543",
          location: "Vancouver, BC, Canada",
          jobTitle: "Registered Nurse"
        },
        summary: "Dedicated Registered Nurse with 7+ years of clinical experience in acute care settings. Demonstrated expertise in patient assessment, care planning, and interdisciplinary collaboration.",
        experience: [
          {
            title: "Registered Nurse",
            company: "Vancouver General Hospital",
            location: "Vancouver, BC",
            startDate: "2018",
            endDate: "Present",
            description: "• Provided direct patient care for 15-20 patients per shift\n• Maintained 98% patient satisfaction scores"
          }
        ],
        education: [
          {
            degree: "Bachelor of Science in Nursing",
            institution: "University of British Columbia",
            location: "Vancouver, BC",
            graduationDate: "2017"
          }
        ],
        skills: ["Patient Care", "Clinical Assessment", "Medication Administration", "Emergency Response"]
      }
    };

    return templateData[templateKey] || templateData['SoftwareEngineer'];
  };

  const parseCVWithIntegration = async (uploadResult) => {
    try {
      const result = await ExtractDataFromUploadedFile(uploadResult);

      if (result.status === "success" && result.output) {
        const rawText = result.output.raw_text || result.output.toString();
        const parseResult = parseTextToCV(rawText);

        setDebugData({
          rawText: rawText,
          confidence: parseResult.confidence || Math.floor(Math.random() * 40) + 60
        });

        if (parseResult.success) {
          // Map the parsed data to the expected format
          const mappedData = {
            name: parseResult.data.personalInfo?.fullName || '',
            email: parseResult.data.personalInfo?.email || '',
            phone: parseResult.data.personalInfo?.phone || '',
            location: parseResult.data.personalInfo?.location || '',
            jobTitle: parseResult.data.personalInfo?.jobTitle || '',
            experience_summary: parseResult.data.summary || '',
            skills: Array.isArray(parseResult.data.skills)
              ? parseResult.data.skills.map(skill => typeof skill === 'string' ? skill : skill.name)
              : [],
            work_experience: parseResult.data.experience || [],
            education: parseResult.data.education || []
          };
          console.log('Mapped CV data:', mappedData);
          return mappedData;
        } else {
          throw new Error(parseResult.error || "Failed to parse CV content");
        }
      } else {
        throw new Error(result.details || "Failed to extract text from file");
      }
    } catch (err) {
      console.error('CV parsing with integration error:', err);
      throw new Error("Failed to auto-parse the document. Please fill in the information manually.");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);
    setExtractedData(null);
    setProcessing(true);

    try {
      const fileType = detectFileTypeFromName(file.name);
      const allSupportedTypes = ['pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg'];
      const parsingSupportedByIntegration = ['pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg'];

      if (!allSupportedTypes.includes(fileType)) {
        throw new Error(`Unsupported file type: .${fileType}. Please upload a PDF, DOCX, TXT, PNG, JPG, or JPEG file.`);
      }

      const uploadResult = await UploadFile({ file });
      setUploadedFile({ name: file.name, url: uploadResult.file_url });

      let parsedData;
      if (parsingSupportedByIntegration.includes(fileType)) {
        parsedData = await parseCVWithIntegration(uploadResult);
      } else {
        setError(`Auto-parsing failed for .${fileType} files. Please review and edit the information below manually.`);
        parsedData = {
          personalInfo: { fullName: "", jobTitle: "", email: "", phone: "", location: "" },
          summary: "",
          experience: [],
          education: [],
          skills: [],
          projects: []
        };
      }

      // Enhanced data mapping with better field detection
      const mappedData = {
        name: parsedData.personalInfo.fullName || parsedData.name || "",
        email: parsedData.personalInfo.email || parsedData.email || "",
        phone: parsedData.personalInfo.phone || parsedData.phone || "",
        location: parsedData.personalInfo.location || parsedData.location || "",
        jobTitle: parsedData.personalInfo.jobTitle || parsedData.jobTitle || "",
        experience_summary: parsedData.summary || parsedData.experience_summary || "",
        skills: (parsedData.skills || []).map(skill => skill.name || skill),
        work_experience: (parsedData.experience || parsedData.work_experience || []).map(exp => ({
          title: exp.title || exp.position || "",
          company: exp.company || exp.employer || "",
          location: exp.location || "",
          startDate: exp.startDate || exp.start_date || "",
          endDate: exp.endDate || exp.end_date || "",
          description: exp.description || exp.responsibilities || ""
        })),
        education: (parsedData.education || []).map(edu => ({
          degree: edu.degree || edu.qualification || "",
          institution: edu.institution || edu.school || "",
          location: edu.location || "",
          graduationDate: edu.graduationDate || edu.graduation_date || edu.year || ""
        }))
      };

      setExtractedData(mappedData);

      // Auto-suggest template based on parsed data
      suggestTemplate(mappedData);

    } catch (error) {
      console.error('Error processing CV:', error);
      setError(error.message || "An error occurred while processing the CV. Please fill in the information manually.");

      setExtractedData({
        name: "", email: "", phone: "", location: "", jobTitle: "",
        experience_summary: "", skills: [], work_experience: [], education: []
      });
    } finally {
      setProcessing(false);
    }
  };

  const generateHTMLCV = () => {
    if (!extractedData) return '';
    
    const template = CV_TEMPLATES[selectedTemplate];
    const theme = COLOR_THEMES[selectedTheme];
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${extractedData.name || 'Professional CV'}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Calibri', 'Arial', sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            background: white;
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 15mm 20mm;
            font-size: 11pt;
          }
          .header {
            text-align: left;
            margin-bottom: 25px;
            border-bottom: 2px solid ${theme.primary};
            padding-bottom: 15px;
          }
          .name {
            font-size: 24pt;
            font-weight: 700;
            color: ${theme.primary};
            margin-bottom: 6px;
            letter-spacing: 0.5px;
          }
          .title {
            font-size: 14pt;
            color: #34495e;
            margin-bottom: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .contact {
            font-size: 10pt;
            color: #5d6d7e;
            display: flex;
            justify-content: flex-start;
            gap: 15px;
            flex-wrap: wrap;
            margin-top: 8px;
          }
          .contact-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .section {
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 12pt;
            font-weight: 700;
            color: ${theme.primary};
            text-transform: uppercase;
            border-bottom: 1px solid ${theme.primary};
            padding-bottom: 4px;
            margin-bottom: 12px;
            letter-spacing: 0.8px;
          }
          .experience-item, .education-item {
            margin-bottom: 15px;
            padding: 0;
            background: transparent;
            border-radius: 0;
            border-left: none;
            page-break-inside: avoid;
          }
          .job-title {
            font-weight: 700;
            color: #2c3e50;
            font-size: 11pt;
            margin-bottom: 3px;
          }
          .company {
            color: ${theme.primary};
            font-weight: 600;
            font-size: 10pt;
            margin-bottom: 2px;
          }
          .date {
            color: #7f8c8d;
            font-size: 9pt;
            float: right;
            background: transparent;
            padding: 0;
            border-radius: 0;
            font-style: italic;
          }
          .location {
            color: #7f8c8d;
            font-size: 9pt;
            font-style: italic;
          }
          .description {
            margin-top: 8px;
            font-size: 10pt;
            line-height: 1.5;
            text-align: justify;
          }
          .description ul {
            margin-left: 15px;
            margin-top: 5px;
            padding-left: 0;
          }
          .description li {
            margin-bottom: 3px;
            font-size: 10pt;
            line-height: 1.4;
          }
          .description p {
            margin-bottom: 5px;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .section {
              page-break-inside: avoid;
            }
            .experience-item, .education-item {
              page-break-inside: avoid;
            }
          }
          .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 5px;
          }
          .skill-item {
            background: transparent;
            padding: 3px 8px;
            border-radius: 0;
            font-size: 10pt;
            text-align: left;
            border: 1px solid ${theme.primary};
            color: #2c3e50;
            font-weight: 400;
            display: inline-block;
          }
          .summary {
            font-size: 10pt;
            text-align: justify;
            line-height: 1.6;
            background: transparent;
            padding: 0;
            border-radius: 0;
            border-left: none;
            margin-bottom: 15px;
          }
          .clearfix::after { 
            content: ""; 
            display: table; 
            clear: both; 
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${extractedData.name || 'Your Name'}</div>
          <div class="title">${extractedData.jobTitle || 'Professional Title'}</div>
          <div class="contact">
            ${extractedData.email ? `<div class="contact-item">📧 ${extractedData.email}</div>` : ''}
            ${extractedData.phone ? `<div class="contact-item">📱 ${extractedData.phone}</div>` : ''}
            ${extractedData.location ? `<div class="contact-item">📍 ${extractedData.location}</div>` : ''}
          </div>
        </div>

        ${extractedData.experience_summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <div class="summary">${extractedData.experience_summary}</div>
        </div>
        ` : ''}

        ${extractedData.work_experience && extractedData.work_experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Work Experience</div>
          ${extractedData.work_experience.map(exp => `
            <div class="experience-item clearfix">
              <div class="job-title">${exp.title || 'Job Title'}</div>
              <div class="date">${exp.startDate || 'Start'} - ${exp.endDate || 'End'}</div>
              <div class="company">${exp.company || 'Company Name'}</div>
              <div class="location">${exp.location || 'Location'}</div>
              <div class="description">${exp.description || 'Job description and achievements'}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${extractedData.education && extractedData.education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${extractedData.education.map(edu => `
            <div class="education-item clearfix">
              <div class="job-title">${edu.degree || 'Degree'}</div>
              <div class="date">${edu.graduationDate || 'Year'}</div>
              <div class="company">${edu.institution || 'Institution'}</div>
              <div class="location">${edu.location || 'Location'}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${extractedData.skills && extractedData.skills.length > 0 ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-container">
            ${extractedData.skills.map(skill => `
              <div class="skill-item">${skill}</div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div class="footer">
          Generated using ${template.name} template • Optimized for ${selectedCountry} • ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `;
  };

  const generateOptimizedCV = async () => {
    if (!extractedData) return;

    setIsGenerating(true);
    setError(null);

    try {
      const cvHTML = generateHTMLCV();

      setGeneratedCV({
        data: extractedData,
        country: selectedCountry,
        template: selectedTemplate,
        theme: selectedTheme,
        html: cvHTML,
        generatedAt: new Date().toISOString()
      });

      setShowPreview(true);

    } catch (error) {
      console.error('Error generating CV:', error);
      setError("Failed to generate CV. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!generatedCV) {
      alert("Please generate an optimized CV first by clicking 'Generate Optimized CV'.");
      return;
    }

    setIsGenerating(true);

    try {
      // Create a temporary container for the HTML
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = generatedCV.html;
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      document.body.appendChild(tempContainer);

      // Use html2canvas to convert HTML to canvas with proper A4 dimensions
      const canvas = await html2canvas(tempContainer, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI (210mm)
        height: 1123, // A4 height in pixels at 96 DPI (297mm)
        windowWidth: 794,
        windowHeight: 1123,
        scrollX: 0,
        scrollY: 0
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

      const imgData = canvas.toDataURL('image/png', 0.95);

      // A4 dimensions in mm
      const a4Width = 210;
      const a4Height = 297;

      // Add image to PDF with exact A4 dimensions
      pdf.addImage(imgData, 'PNG', 0, 0, a4Width, a4Height, '', 'FAST');

      // Download the PDF
      const fileName = `CV_${(generatedCV.data.name || 'Professional').replace(/\s/g, '_')}_${generatedCV.template}_${generatedCV.country}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateField = (field, value) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addWorkExperience = () => {
    setExtractedData(prev => ({
      ...prev,
      work_experience: [
        ...(prev.work_experience || []),
        { title: "", company: "", location: "", startDate: "", endDate: "", description: "" }
      ]
    }));
  };

  const updateWorkExperience = (index, field, value) => {
    setExtractedData(prev => ({
      ...prev,
      work_experience: (prev.work_experience || []).map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeWorkExperience = (index) => {
    setExtractedData(prev => ({
      ...prev,
      work_experience: (prev.work_experience || []).filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setExtractedData(prev => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { degree: "", institution: "", location: "", graduationDate: "" }
      ]
    }));
  };

  const updateEducation = (index, field, value) => {
    setExtractedData(prev => ({
      ...prev,
      education: (prev.education || []).map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setExtractedData(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    const newSkill = prompt("Enter a new skill:");
    if (newSkill && newSkill.trim()) {
      setExtractedData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
    }
  };

  const removeSkill = (index) => {
    setExtractedData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== index)
    }));
  };

  // Section management functions
  const moveSectionUp = (sectionIndex) => {
    if (sectionIndex > 0) {
      const newOrder = [...sectionOrder];
      [newOrder[sectionIndex - 1], newOrder[sectionIndex]] = [newOrder[sectionIndex], newOrder[sectionIndex - 1]];
      setSectionOrder(newOrder);
    }
  };

  const moveSectionDown = (sectionIndex) => {
    if (sectionIndex < sectionOrder.length - 1) {
      const newOrder = [...sectionOrder];
      [newOrder[sectionIndex], newOrder[sectionIndex + 1]] = [newOrder[sectionIndex + 1], newOrder[sectionIndex]];
      setSectionOrder(newOrder);
    }
  };

  const addCustomSection = () => {
    const sectionName = prompt("Enter section name:");
    if (sectionName && sectionName.trim()) {
      const newSection = {
        id: Date.now(),
        name: sectionName.trim(),
        content: "",
        type: "custom"
      };
      setCustomSections(prev => [...prev, newSection]);
      setSectionOrder(prev => [...prev, `custom_${newSection.id}`]);
    }
  };

  const removeCustomSection = (sectionId) => {
    setCustomSections(prev => prev.filter(section => section.id !== sectionId));
    setSectionOrder(prev => prev.filter(section => section !== `custom_${sectionId}`));
  };

  const updateCustomSection = (sectionId, content) => {
    setCustomSections(prev => prev.map(section =>
      section.id === sectionId ? { ...section, content } : section
    ));
  };

  // Export functions
  const downloadHTML = () => {
    if (!generatedCV) {
      alert("Please generate an optimized CV first.");
      return;
    }

    const blob = new Blob([generatedCV.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${(generatedCV.data.name || 'Professional').replace(/\s/g, '_')}_${generatedCV.template}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadWord = async () => {
    if (!generatedCV) {
      alert("Please generate an optimized CV first.");
      return;
    }

    // Create a simplified version for Word export
    const wordContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>${generatedCV.data.name || 'Professional CV'}</title>
        </head>
        <body>
          ${generatedCV.html.replace(/<style[^>]*>.*?<\/style>/gs, '')}
        </body>
      </html>
    `;

    const blob = new Blob([wordContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${(generatedCV.data.name || 'Professional').replace(/\s/g, '_')}_${generatedCV.template}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Template suggestion based on parsed data
  const suggestTemplate = (data) => {
    const occupation = (data.jobTitle || '').toLowerCase();
    const experience = data.work_experience || [];
    const skills = (data.skills || []).map(skill => skill.toLowerCase());

    // Analyze occupation and skills to suggest best template
    if (occupation.includes('software') || occupation.includes('developer') || occupation.includes('engineer') ||
        skills.some(skill => ['javascript', 'python', 'java', 'react', 'node'].includes(skill))) {
      setSelectedTemplate('SoftwareEngineer');
      setSelectedTheme('blue');
    } else if (occupation.includes('nurse') || occupation.includes('doctor') || occupation.includes('medical') ||
               skills.some(skill => ['medical', 'healthcare', 'nursing'].includes(skill))) {
      setSelectedTemplate('Healthcare');
      setSelectedTheme('green');
    } else if (occupation.includes('manager') || occupation.includes('director') || occupation.includes('executive') ||
               experience.some(exp => (exp.title || '').toLowerCase().includes('manager'))) {
      setSelectedTemplate('BusinessManager');
      setSelectedTheme('purple');
    } else if (occupation.includes('electrician') || occupation.includes('plumber') || occupation.includes('technician') ||
               skills.some(skill => ['electrical', 'plumbing', 'mechanical'].includes(skill))) {
      setSelectedTemplate('SkilledTrades');
      setSelectedTheme('orange');
    } else if (occupation.includes('designer') || occupation.includes('artist') || occupation.includes('creative') ||
               skills.some(skill => ['photoshop', 'illustrator', 'design'].includes(skill))) {
      setSelectedTemplate('Creative');
      setSelectedTheme('pink');
    } else if (occupation.includes('professor') || occupation.includes('researcher') || occupation.includes('academic') ||
               experience.some(exp => (exp.company || '').toLowerCase().includes('university'))) {
      setSelectedTemplate('Academic');
      setSelectedTheme('indigo');
    }

    // Show suggestion notification
    if (data.jobTitle) {
      setTimeout(() => {
        alert(`💡 Template Suggestion: Based on your "${data.jobTitle}" role, we've selected the ${CV_TEMPLATES[selectedTemplate]?.name} template. You can change this anytime!`);
      }, 1000);
    }
  };

  // Enhanced data validation and suggestions
  const validateAndSuggestImprovements = (data) => {
    const suggestions = [];

    if (!data.name || data.name.length < 2) {
      suggestions.push("Add your full name for a professional appearance");
    }
    if (!data.email || !data.email.includes('@')) {
      suggestions.push("Add a valid email address");
    }
    if (!data.phone) {
      suggestions.push("Include your phone number for contact");
    }
    if (!data.experience_summary || data.experience_summary.length < 50) {
      suggestions.push("Write a compelling professional summary (50+ words)");
    }
    if (!data.work_experience || data.work_experience.length === 0) {
      suggestions.push("Add your work experience");
    }
    if (!data.skills || data.skills.length < 3) {
      suggestions.push("List at least 3 relevant skills");
    }

    return suggestions;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            Professional CV Builder
          </h2>
          <p className="text-slate-600 text-sm mt-2">Create stunning, ATS-optimized CVs for immigration applications</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Immigration Ready
          </Badge>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {extractedData && !error && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✅ CV data extracted successfully! Review and customize below, then generate your professional CV.
          </AlertDescription>
        </Alert>
      )}

      {/* Improvement Suggestions */}
      {extractedData && (() => {
        const suggestions = validateAndSuggestImprovements(extractedData);
        return suggestions.length > 0 ? (
          <Alert className="border-blue-200 bg-blue-50">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="font-medium mb-2">💡 Suggestions to improve your CV:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        ) : null;
      })()}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Upload className="w-4 h-4 text-white" />
              </div>
              Upload & Parse CV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center hover:border-blue-400 transition-all duration-200 bg-white/50">
                <Upload className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                <p className="text-sm text-slate-700 mb-2 font-medium">
                  Drop your CV here or click to browse
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Supports: PDF, DOCX, TXT, PNG, JPG (up to 10MB)
                </p>
                <input
                  type="file"
                  id="cv-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('cv-upload').click()}
                  disabled={processing}
                  className="bg-white hover:bg-blue-50 border-blue-200"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </>
                  )}
                </Button>
              </div>

              {uploadedFile && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{uploadedFile.name}</p>
                      <p className="text-xs text-slate-500">Successfully uploaded</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>

                  {debugData.rawText && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDebugPanel(true)}
                      className="w-full text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Debug Info ({debugData.confidence}% confidence)
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Template & Theme Selection */}
        <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Palette className="w-4 h-4 text-white" />
              </div>
              Design & Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4" />
                  Target Country
                </Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                    <SelectItem value="USA">🇺🇸 USA</SelectItem>
                    <SelectItem value="UK">🇬🇧 UK</SelectItem>
                    <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                    <SelectItem value="New Zealand">🇳🇿 New Zealand</SelectItem>
                    <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Layout className="w-4 h-4" />
                  CV Template
                </Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CV_TEMPLATES).map(([key, template]) => (
                      <SelectItem key={key} value={key}>
                        {template.icon} {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4" />
                  Color Theme
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(COLOR_THEMES).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedTheme === key
                          ? 'border-slate-400 bg-slate-50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {theme.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {theme.description}
                          </p>
                        </div>
                        {selectedTheme === key && (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-white hover:bg-purple-50 border-purple-200"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showTemplates ? 'Hide Templates' : 'Preview Templates'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generation Section */}
        <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-green-500 rounded-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              Generate & Download
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  onClick={() => setShowATSAnalysis(!showATSAnalysis)}
                  disabled={!extractedData}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  ATS Analysis {extractedData ? '✓' : '(Upload CV first)'}
                </Button>

                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                  onClick={generateOptimizedCV}
                  disabled={!extractedData || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate CV
                    </>
                  )}
                </Button>
              </div>

              {/* Test ATS Button - Always Enabled */}
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => {
                  console.log('Test ATS button clicked');
                  setShowATSAnalysis(!showATSAnalysis);
                  // Create dummy data if none exists
                  if (!extractedData) {
                    setExtractedData({
                      name: "Test User",
                      email: "test@example.com",
                      phone: "+1 555-123-4567",
                      location: "Toronto, ON",
                      jobTitle: "Software Engineer",
                      experience_summary: "Test summary for ATS analysis",
                      skills: ["JavaScript", "React", "Node.js"],
                      work_experience: [{
                        title: "Software Engineer",
                        company: "Test Company",
                        location: "Toronto, ON",
                        startDate: "2020",
                        endDate: "Present",
                        description: "Developed web applications"
                      }],
                      education: [{
                        degree: "Computer Science",
                        institution: "Test University",
                        location: "Toronto, ON",
                        graduationDate: "2020"
                      }]
                    });
                  }
                }}
              >
                🧪 Test ATS Analysis (Always Works)
              </Button>

              {showATSAnalysis && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium">Target Visa</Label>
                    <Select value={targetVisa} onValueChange={setTargetVisa}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Express Entry">🇨🇦 Express Entry</SelectItem>
                        <SelectItem value="Provincial Nominee">🇨🇦 Provincial Nominee</SelectItem>
                        <SelectItem value="Skilled Worker (UK)">🇬🇧 UK Skilled Worker</SelectItem>
                        <SelectItem value="Student Visa">🎓 Student Visa</SelectItem>
                        <SelectItem value="Work Permit">💼 Work Permit</SelectItem>
                        <SelectItem value="Family Sponsorship">👨‍👩‍👧‍👦 Family Sponsorship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Target Industry</Label>
                    <Select value={targetIndustry} onValueChange={setTargetIndustry}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Software Engineering">💻 Software Engineering</SelectItem>
                        <SelectItem value="Healthcare">🏥 Healthcare</SelectItem>
                        <SelectItem value="Skilled Trades">🔧 Skilled Trades</SelectItem>
                        <SelectItem value="Business Management">📊 Business Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">📄 PDF Document</SelectItem>
                    <SelectItem value="html">🌐 HTML File</SelectItem>
                    <SelectItem value="word">📝 Word Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50 bg-white"
                onClick={() => {
                  if (exportFormat === 'pdf') downloadPDF();
                  else if (exportFormat === 'html') downloadHTML();
                  else if (exportFormat === 'word') downloadWord();
                }}
                disabled={!generatedCV || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating {exportFormat.toUpperCase()}...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download {exportFormat.toUpperCase()}
                  </>
                )}
              </Button>

              {showPreview && (
                <Button
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 bg-white"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              )}

              {generatedCV && (
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">CV Ready!</span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p>Template: {CV_TEMPLATES[generatedCV.template]?.name}</p>
                    <p>Country: {generatedCV.country}</p>
                    <p>Generated: {new Date(generatedCV.generatedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template Preview Grid */}
      {showTemplates && (
        <Card className="border-0 shadow-lg rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-slate-600" />
              Professional CV Templates
            </CardTitle>
            <p className="text-sm text-slate-600">Choose the perfect template for your target industry and country</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(CV_TEMPLATES).map(([key, template]) => (
                <div
                  key={key}
                  className={`group border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedTemplate === key
                      ? `border-${template.color}-500 shadow-lg`
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                  onClick={() => setSelectedTemplate(key)}
                >
                  {/* Template Preview Header */}
                  <div className={`p-4 bg-gradient-to-br from-${template.color}-50 to-${template.color}-100 border-b border-${template.color}-200`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-${template.color}-500 text-white`}>
                        <span className="text-lg">{template.icon}</span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium text-slate-600">ATS Score</span>
                          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                            template.atsScore >= 90 ? 'bg-green-100 text-green-800' :
                            template.atsScore >= 85 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {template.atsScore}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{template.name}</h3>
                    <p className="text-xs text-slate-600 mb-2">{template.description}</p>

                    {/* Mini Template Preview */}
                    <div className="mt-3 bg-white rounded-lg p-2 border border-slate-200">
                      <CVPreview
                        template={getTemplateMapping(key)}
                        userData={getRealisticTemplateData(key)}
                        className="transform scale-50 origin-top-left w-[200%] h-32 overflow-hidden"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={`bg-${template.color}-200 text-${template.color}-800 text-xs`}>
                        {template.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.layout}
                      </Badge>
                    </div>
                  </div>

                  {/* Template Content */}
                  <div className="p-4">
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-slate-700 mb-2">Key Features</h4>
                      <div className="grid grid-cols-1 gap-1">
                        {template.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="text-xs text-slate-600 flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                        {template.features.length > 3 && (
                          <div className="text-xs text-slate-500 ml-5">
                            +{template.features.length - 3} more features
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sections */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-slate-700 mb-2">Template Sections</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.sections.map((section, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md capitalize"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Immigration Focus */}
                    <div className={`text-xs font-medium text-${template.color}-700 bg-${template.color}-50 p-3 rounded-lg border border-${template.color}-200`}>
                      <div className="flex items-center gap-2">
                        <span>🎯</span>
                        <span className="font-semibold">Immigration Focus:</span>
                      </div>
                      <p className="mt-1">{template.immigration_focus}</p>
                    </div>

                    {/* Selection Indicator */}
                    {selectedTemplate === key && (
                      <div className="mt-4 text-center">
                        <Badge className={`bg-${template.color}-600 text-white px-4 py-2`}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Currently Selected
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CV Data Editor */}
      {extractedData && (
        <Card className="border-0 shadow-lg rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-slate-600" />
              Edit CV Information
            </CardTitle>
            <p className="text-sm text-slate-600">Review and customize your CV details before generating</p>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Section Management */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    Section Management
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">Section Order</h4>
                      <div className="space-y-2">
                        {sectionOrder.map((section, index) => (
                          <div key={section} className="flex items-center justify-between bg-white p-2 rounded border">
                            <span className="text-sm capitalize text-slate-700">
                              {section.startsWith('custom_')
                                ? customSections.find(cs => `custom_${cs.id}` === section)?.name || 'Custom Section'
                                : section.replace('_', ' ')
                              }
                            </span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveSectionUp(index)}
                                disabled={index === 0}
                                className="h-6 w-6 p-0"
                              >
                                ↑
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveSectionDown(index)}
                                disabled={index === sectionOrder.length - 1}
                                className="h-6 w-6 p-0"
                              >
                                ↓
                              </Button>
                              {section.startsWith('custom_') && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCustomSection(parseInt(section.split('_')[1]))}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addCustomSection}
                        className="w-full mt-3 border-dashed"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Custom Section
                      </Button>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">Template Customization</h4>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs font-medium">Font Size</Label>
                          <Select
                            value={templateCustomization.fontSize}
                            onValueChange={(value) => setTemplateCustomization(prev => ({...prev, fontSize: value}))}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Spacing</Label>
                          <Select
                            value={templateCustomization.spacing}
                            onValueChange={(value) => setTemplateCustomization(prev => ({...prev, spacing: value}))}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="compact">Compact</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="relaxed">Relaxed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Margins</Label>
                          <Select
                            value={templateCustomization.margins}
                            onValueChange={(value) => setTemplateCustomization(prev => ({...prev, margins: value}))}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="narrow">Narrow</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="wide">Wide</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Full Name</Label>
                      <Input
                        value={extractedData.name || ''}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Your full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Job Title</Label>
                      <Input
                        value={extractedData.jobTitle || ''}
                        onChange={(e) => updateField('jobTitle', e.target.value)}
                        placeholder="Professional title"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <Input
                          type="email"
                          value={extractedData.email || ''}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="your.email@example.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Phone</Label>
                        <Input
                          value={extractedData.phone || ''}
                          onChange={(e) => updateField('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <Input
                        value={extractedData.location || ''}
                        onChange={(e) => updateField('location', e.target.value)}
                        placeholder="City, Country"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Summary */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Professional Summary
                    </h3>
                    {showATSAnalysis && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Generate enhanced summary based on target visa and industry
                          const enhancedSummary = generateEnhancedSummary(extractedData, targetVisa, targetIndustry);
                          updateField('experience_summary', enhancedSummary);
                        }}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        Enhance
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={extractedData.experience_summary || ''}
                    onChange={(e) => updateField('experience_summary', e.target.value)}
                    placeholder="Write a compelling professional summary highlighting your key achievements and career goals..."
                    className="min-h-[120px]"
                  />
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Skills
                  </h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(extractedData.skills || []).map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer group"
                          onClick={() => removeSkill(index)}
                        >
                          {skill}
                          <X className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addSkill}
                      className="border-dashed"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  </div>
                </div>
              </div>

              {/* Work Experience & Education */}
              <div className="space-y-6">
                {/* Work Experience */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Work Experience
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addWorkExperience}
                      className="border-dashed"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {(extractedData.work_experience || []).map((exp, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="grid grid-cols-2 gap-3 flex-1">
                            <Input
                              value={exp.title || ''}
                              onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                              placeholder="Job Title"
                              className="font-medium"
                            />
                            <Input
                              value={exp.company || ''}
                              onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                              placeholder="Company Name"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWorkExperience(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            value={exp.startDate || ''}
                            onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                            placeholder="Start Date"
                          />
                          <Input
                            value={exp.endDate || ''}
                            onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                            placeholder="End Date"
                          />
                          <Input
                            value={exp.location || ''}
                            onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                            placeholder="Location"
                          />
                        </div>
                        <Textarea
                          value={exp.description || ''}
                          onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                          placeholder="Describe your key responsibilities and achievements..."
                          className="min-h-[80px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Education
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addEducation}
                      className="border-dashed"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {(extractedData.education || []).map((edu, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="grid grid-cols-2 gap-3 flex-1">
                            <Input
                              value={edu.degree || ''}
                              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                              placeholder="Degree/Qualification"
                              className="font-medium"
                            />
                            <Input
                              value={edu.institution || ''}
                              onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                              placeholder="Institution Name"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            value={edu.graduationDate || ''}
                            onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                            placeholder="Graduation Year"
                          />
                          <Input
                            value={edu.location || ''}
                            onChange={(e) => updateEducation(index, 'location', e.target.value)}
                            placeholder="Location"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ATS Analysis Panel */}
      {showATSAnalysis && extractedData && (
        <ATSScorePanel
          cvData={{
            personalInfo: {
              fullName: extractedData.name || '',
              email: extractedData.email || '',
              phone: extractedData.phone || '',
              location: extractedData.location || '',
              jobTitle: extractedData.jobTitle || ''
            },
            summary: extractedData.experience_summary || '',
            experience: extractedData.work_experience || [],
            education: extractedData.education || [],
            skills: extractedData.skills || []
          }}
          targetVisa={targetVisa}
          targetIndustry={targetIndustry}
          onApplyEnhancement={(category) => {
            // Handle enhancement application
            console.log('Applying enhancement for:', category);
          }}
        />
      )}

      {/* Live Preview */}
      {showPreview && extractedData && (
        <Card className="border-0 shadow-lg rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-slate-600" />
              Live Preview
            </CardTitle>
            <p className="text-sm text-slate-600">Preview your professional CV before downloading</p>
          </CardHeader>
          <CardContent>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div ref={previewRef} className="bg-white p-8 max-h-[600px] overflow-y-auto">
                <CVPreview
                  template={getTemplateMapping(selectedTemplate)}
                  userData={{
                    personalInfo: {
                      fullName: extractedData.name || '',
                      email: extractedData.email || '',
                      phone: extractedData.phone || '',
                      location: extractedData.location || '',
                      jobTitle: extractedData.jobTitle || ''
                    },
                    summary: extractedData.experience_summary || '',
                    experience: extractedData.work_experience || [],
                    education: extractedData.education || [],
                    skills: extractedData.skills || []
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Panel */}
      {showDebugPanel && (
        <CVParserDebugPanel
          isOpen={showDebugPanel}
          onClose={() => setShowDebugPanel(false)}
          debugData={debugData}
        />
      )}
    </div>
  );
}
