import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CVPreview } from "./CVPreview";
import { parseTextToCV } from "../../utils/cvParser";
import { downloadCVAsPDF, generateA4PDF } from "../../utils/pdfGenerator";
import { Upload, Eye, User, Briefcase, GraduationCap, Award, Download, FileText, AlertCircle, BarChart3, Target, Zap } from "lucide-react";
import ATSScorePanel from "./ATSScorePanel";

export default function SimpleCVBuilder() {
  const [activeTab, setActiveTab] = useState('personal');
  const [cvData, setCvData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      jobTitle: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: []
  });
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [parseResult, setParseResult] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [showATSAnalysis, setShowATSAnalysis] = useState(false);
  const [targetVisa, setTargetVisa] = useState('Express Entry');
  const [targetIndustry, setTargetIndustry] = useState('Software Engineering');
  const fileInputRef = useRef(null);
  const cvPreviewRef = useRef(null);

  const updatePersonalInfo = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateSummary = (value) => {
    setCvData(prev => ({
      ...prev,
      summary: value
    }));
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    }));
  };

  const updateExperience = (index, field, value) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: '',
          institution: '',
          location: '',
          graduationDate: ''
        }
      ]
    }));
  };

  const updateEducation = (index, field, value) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const updateSkills = (value) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(Boolean);
    setCvData(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      // For now, let's use a simplified text extraction approach
      // until we can properly integrate the enhanced parser
      let text = '';

      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        // Handle TXT files
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsText(file);
        });
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        // Handle DOCX files with mammoth
        const arrayBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });

        // Use mammoth to extract text from DOCX
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // For PDF files, show a message that PDF parsing is coming soon
        setUploadError('PDF parsing is currently being enhanced. Please use TXT or DOCX files for now.');
        return;
      } else {
        setUploadError('Unsupported file type. Please use TXT or DOCX files.');
        return;
      }

      if (!text || text.trim().length === 0) {
        setUploadError('No text could be extracted from the file.');
        return;
      }

      // Parse the CV text using the existing parser
      console.log('Extracted text length:', text.length);
      console.log('First 200 characters:', text.substring(0, 200));

      const result = parseTextToCV(text);
      console.log('Parse result:', result);
      setParseResult(result); // Store for debugging

      if (result.success && result.data) {
        // Update CV data with parsed information
        setCvData(result.data);
        setUploadSuccess(`CV parsed successfully! Confidence: ${result.confidence}%`);

        // Auto-advance to summary tab if personal info was filled
        if (result.data.personalInfo.fullName) {
          setActiveTab('summary');
        }
      } else {
        setUploadError(result.error || 'Failed to parse CV');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError(`Error processing file: ${error.message || 'Please try again.'}`);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!cvPreviewRef.current) {
      setDownloadError('CV preview not found. Please try again.');
      return;
    }

    setIsDownloading(true);
    setDownloadError('');

    try {
      // Find the actual CV preview element within the ref
      const cvElement = cvPreviewRef.current.querySelector('.cv-preview-content') || cvPreviewRef.current;

      const result = await generateA4PDF(cvElement, `${cvData.personalInfo.fullName || 'CV'}_CV.pdf`);

      if (!result.success) {
        setDownloadError(result.error || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError('Error generating PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 8; // Total required fields

    if (cvData.personalInfo.fullName) completed++;
    if (cvData.personalInfo.email) completed++;
    if (cvData.personalInfo.phone) completed++;
    if (cvData.personalInfo.location) completed++;
    if (cvData.personalInfo.jobTitle) completed++;
    if (cvData.summary) completed++;
    if (cvData.experience.length > 0) completed++;
    if (cvData.skills.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CV Builder</h1>
            <p className="text-gray-600">Create your professional CV</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">CV Completion Progress</div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {getCompletionPercentage()}% Complete
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Column - Form */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            {/* Upload Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Existing CV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload your CV to auto-fill the fields. Supported formats: DOCX, TXT (PDF coming soon).
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <FileText className="w-4 h-4 mr-1 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-1" />
                        Choose File
                      </>
                    )}
                  </Button>

                  {/* Upload Status Messages */}
                  {uploadError && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{uploadError}</span>
                      </div>
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2 text-green-700">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{uploadSuccess}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Debug Panel (Development Only) */}
            {parseResult && import.meta.env.DEV && (
              <Card className="mb-6 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-sm text-blue-800">
                    🔧 Parser Debug Info (Dev Only)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs space-y-2">
                    <div>
                      <strong>Success:</strong> {parseResult.success ? '✅' : '❌'}
                    </div>
                    <div>
                      <strong>Confidence:</strong> {parseResult.confidence}%
                    </div>
                    {parseResult.error && (
                      <div className="text-red-600">
                        <strong>Error:</strong> {parseResult.error}
                      </div>
                    )}
                    {parseResult.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-blue-700 hover:text-blue-900">
                          View Parsed Data
                        </summary>
                        <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-32">
                          {JSON.stringify(parseResult.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal" className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Personal Info</span>
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Summary</span>
                </TabsTrigger>
                <TabsTrigger value="experience" className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Experience</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  <span className="hidden sm:inline">Education</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span className="hidden sm:inline">Skills</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="e.g., John Smith"
                      value={cvData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      placeholder="e.g., Senior Financial Analyst"
                      value={cvData.personalInfo.jobTitle}
                      onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.smith@email.com"
                      value={cvData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+27 11 123 4567"
                      value={cvData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Johannesburg, SA"
                      value={cvData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="summary" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    placeholder="Write a brief professional summary highlighting your key qualifications and career objectives..."
                    rows={6}
                    value={cvData.summary}
                    onChange={(e) => updateSummary(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Work Experience</h3>
                  <Button onClick={addExperience} size="sm">
                    Add Experience
                  </Button>
                </div>
                {cvData.experience.map((exp, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          placeholder="e.g., Senior Financial Analyst"
                          value={exp.title}
                          onChange={(e) => updateExperience(index, 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          placeholder="e.g., ABC Corporation"
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            placeholder="e.g., 2020"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            placeholder="e.g., Present"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Describe your key responsibilities and achievements..."
                          rows={3}
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="education" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Education</h3>
                  <Button onClick={addEducation} size="sm">
                    Add Education
                  </Button>
                </div>
                {cvData.education.map((edu, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label>Degree</Label>
                        <Input
                          placeholder="e.g., Bachelor of Commerce, Finance"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Institution</Label>
                        <Input
                          placeholder="e.g., University of Cape Town"
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Graduation Date</Label>
                        <Input
                          placeholder="e.g., 2018"
                          value={edu.graduationDate}
                          onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="skills" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    placeholder="Enter your skills separated by commas (e.g., Excel, SQL, Python, Tableau, Financial Modeling, Data Analysis)"
                    rows={4}
                    value={cvData.skills.join(', ')}
                    onChange={(e) => updateSkills(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separate skills with commas. Current skills: {cvData.skills.length}
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="w-1/2 bg-gray-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Create test data if no CV data exists
                    if (!cvData.personalInfo.fullName) {
                      setCvData({
                        personalInfo: {
                          fullName: "Alex Johnson",
                          email: "alex.johnson@email.com",
                          phone: "+1 (555) 123-4567",
                          location: "Toronto, ON, Canada",
                          jobTitle: "Senior Software Engineer"
                        },
                        summary: "Experienced Software Engineer with 5+ years developing scalable web applications using React, Node.js, and AWS. Proven track record of leading cross-functional teams and delivering high-quality solutions.",
                        experience: [{
                          title: "Senior Software Engineer",
                          company: "Tech Solutions Inc.",
                          location: "Toronto, ON",
                          startDate: "2021",
                          endDate: "Present",
                          description: "Led development of microservices architecture serving 100K+ users. Implemented CI/CD pipelines reducing deployment time by 60%."
                        }],
                        education: [{
                          degree: "Bachelor of Computer Science",
                          institution: "University of Toronto",
                          location: "Toronto, ON",
                          graduationDate: "2019"
                        }],
                        skills: ["React", "Node.js", "AWS", "Python", "Docker", "Kubernetes"]
                      });
                    }
                    setShowATSAnalysis(!showATSAnalysis);
                  }}
                  className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  {cvData.personalInfo.fullName ? 'ATS Analysis' : '🧪 Test ATS Analysis'}
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Full Preview
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading || !cvData.personalInfo.fullName}
                >
                  {isDownloading ? (
                    <>
                      <FileText className="w-4 h-4 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-1" />
                      Download PDF
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Template Selection */}
            <div className="mb-4">
              <div className="flex gap-2">
                {['professional', 'modern', 'creative', 'simple'].map((template) => (
                  <button
                    key={template}
                    onClick={() => setSelectedTemplate(template)}
                    className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                      selectedTemplate === template
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {template.charAt(0).toUpperCase() + template.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* ATS Analysis Configuration */}
            {showATSAnalysis && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  ATS Analysis Configuration
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-blue-800">Target Visa</Label>
                    <Select value={targetVisa} onValueChange={setTargetVisa}>
                      <SelectTrigger className="bg-white text-xs">
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
                    <Label className="text-xs font-medium text-blue-800">Target Industry</Label>
                    <Select value={targetIndustry} onValueChange={setTargetIndustry}>
                      <SelectTrigger className="bg-white text-xs">
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
              </div>
            )}

            {/* Download Error Message */}
            {downloadError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{downloadError}</span>
                </div>
              </div>
            )}

            {/* CV Preview */}
            <div
              ref={cvPreviewRef}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <CVPreview
                template={selectedTemplate}
                userData={cvData}
                className="w-full cv-preview-content"
              />
            </div>
          </div>
        </div>

        {/* ATS Analysis Panel */}
        {showATSAnalysis && (
          <div className="mt-6">
            <ATSScorePanel
              cvData={{
                personalInfo: {
                  fullName: cvData.personalInfo.fullName || '',
                  email: cvData.personalInfo.email || '',
                  phone: cvData.personalInfo.phone || '',
                  location: cvData.personalInfo.location || '',
                  jobTitle: cvData.personalInfo.jobTitle || ''
                },
                summary: cvData.summary || '',
                experience: cvData.experience || [],
                education: cvData.education || [],
                skills: cvData.skills || []
              }}
              targetVisa={targetVisa}
              targetIndustry={targetIndustry}
              onApplyEnhancement={(category) => {
                console.log('Applying enhancement for:', category);
                // Handle enhancement application here
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
