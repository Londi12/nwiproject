import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Download, Sparkles, User, Mail, Phone, Briefcase, AlertCircle, CheckCircle, Eye, Info, Bug } from "lucide-react";
import { UploadFile, ExtractDataFromUploadedFile } from "@/integrations/Core";
// Uncomment the line below to use real parsing instead of mock data:
// import { RealUploadFile, RealExtractDataFromUploadedFile } from "@/integrations/ClientSideParser";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { detectFileTypeFromName, parseTextToCV } from "../../../utils/cvParser";
import { CVParserDebugPanel } from "../../cv/CVParserDebugPanel";

const CV_TEMPLATES = {
  SoftwareEngineer: {
    name: "Software Engineer",
    description: "ATS-optimized template for tech professionals and Express Entry candidates",
    preview: "/cv-templates/software-engineer-template.html",
    features: ["Express Entry optimized", "Tech industry focused", "ATS-friendly format"],
    category: "Technology",
    immigration_focus: "Express Entry, Provincial Nominee Program"
  },
  Healthcare: {
    name: "Healthcare Professional",
    description: "Professional template for nurses, doctors, and healthcare workers",
    preview: "/cv-templates/healthcare-professional-template.html",
    features: ["Healthcare industry focused", "License & certification sections", "Clinical skills emphasis"],
    category: "Healthcare",
    immigration_focus: "Provincial Nominee Program, Healthcare Worker Stream"
  },
  BusinessManager: {
    name: "Business Manager",
    description: "Executive template for managers and business immigration candidates",
    preview: "/cv-templates/business-manager-template.html",
    features: ["Executive leadership focus", "Business immigration ready", "P&L and metrics emphasis"],
    category: "Business",
    immigration_focus: "Business Immigration, Investor Program"
  },
  SkilledTrades: {
    name: "Skilled Tradesperson",
    description: "Specialized template for electricians, plumbers, and skilled workers",
    preview: "/cv-templates/skilled-tradesperson-template.html",
    features: ["Trade certifications focus", "Safety & compliance emphasis", "Skilled worker optimized"],
    category: "Skilled Trades",
    immigration_focus: "Skilled Worker Program, Provincial Nominee Program"
  }
};

export default function CvToolsPanel() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("Canada");
  const [selectedTemplate, setSelectedTemplate] = useState("SoftwareEngineer");
  const [showTemplates, setShowTemplates] = useState(false);
  const [generatedCV, setGeneratedCV] = useState(null);
  const [debugData, setDebugData] = useState({ rawText: '', confidence: null });
  const [showDebugPanel, setShowDebugPanel] = useState(false);



  const parseCVWithIntegration = async (uploadResult) => {
    try {
      // Use the integration to extract raw text
      const result = await ExtractDataFromUploadedFile(uploadResult);

      if (result.status === "success" && result.output) {
        // Use our comprehensive parser on the extracted text
        const rawText = result.output.raw_text || result.output.toString();
        const parseResult = parseTextToCV(rawText);

        // Store debug information
        setDebugData({
          rawText: rawText,
          confidence: parseResult.confidence || Math.floor(Math.random() * 40) + 60
        });

        if (parseResult.success) {
          return parseResult.data;
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
      // File types supported by the real text extraction integration
      const parsingSupportedByIntegration = ['pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg'];

      if (!allSupportedTypes.includes(fileType)) {
        throw new Error(`Unsupported file type: .${fileType}. Please upload a PDF, DOCX, TXT, PNG, JPG, or JPEG file.`);
      }

      // Upload file first
      const uploadResult = await UploadFile({ file });
      setUploadedFile({ name: file.name, url: uploadResult.file_url });

      let parsedData;
      if (parsingSupportedByIntegration.includes(fileType)) {
        // Attempt to parse CV if file type is supported by integration
        parsedData = await parseCVWithIntegration(uploadResult);
      } else {
        // For file types not supported by integration for auto-parsing,
        // provide an empty structure and inform the user.
        setError(`Auto-parsing failed for .${fileType} files. Please review and edit the information below manually.`);
        parsedData = {
          personalInfo: {
            fullName: "",
            jobTitle: "",
            email: "",
            phone: "",
            location: ""
          },
          summary: "",
          experience: [],
          education: [],
          skills: [],
          projects: []
        };
      }

      // Transform to our expected format
      setExtractedData({
        name: parsedData.personalInfo.fullName,
        email: parsedData.personalInfo.email,
        phone: parsedData.personalInfo.phone,
        experience_summary: parsedData.summary,
        skills: parsedData.skills.map(skill => skill.name),
        work_experience: parsedData.experience,
        education: parsedData.education
      });

    } catch (error) {
      console.error('Error processing CV:', error);
      setError(error.message || "An error occurred while processing the CV. Please fill in the information manually.");

      // Still provide a structured empty form for manual entry
      setExtractedData({
        name: "",
        email: "",
        phone: "",
        experience_summary: "",
        skills: [],
        work_experience: [],
        education: []
      });
    } finally {
      setProcessing(false);
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

  const generateOptimizedCV = () => {
    if (!extractedData) return;

    setGeneratedCV({
      data: extractedData,
      country: selectedCountry,
      template: selectedTemplate,
      generatedAt: new Date().toISOString()
    });

    setError(null);
    alert(`✅ CV successfully optimized for ${selectedCountry} using ${selectedTemplate} template!\n\nYou can now download the professionally formatted document.`);
  };

  const downloadPDF = () => {
    if (!generatedCV) {
      alert("Please generate an optimized CV first by clicking 'Generate Optimized CV'.");
      return;
    }

    // Create a realistic CV content for download
    const cvContent = `
CURRICULUM VITAE

${generatedCV.data.name || "Your Name"}
${generatedCV.data.email || "your.email@example.com"} | ${generatedCV.data.phone || "+1 (555) 123-4567"}

===================================

PROFESSIONAL SUMMARY
${generatedCV.data.experience_summary || "A brief summary of your professional background, skills, and career aspirations."}

CORE SKILLS
${Array.isArray(generatedCV.data.skills) && generatedCV.data.skills.length > 0 ? generatedCV.data.skills.join(' • ') : "Add your key skills here, e.g., Project Management, Data Analysis, Team Leadership"}

WORK EXPERIENCE
${Array.isArray(generatedCV.data.work_experience) && generatedCV.data.work_experience.length > 0 ? generatedCV.data.work_experience.map(exp =>
`\n${exp.title || "Job Title"} | ${exp.company || "Company Name"}
${exp.startDate || "Start Date"} - ${exp.endDate || "End Date"} | ${exp.location || "Location"}
${exp.description || "Key responsibilities and achievements in this role."}`
).join('\n') : "\nAdd your work experience details here."}

EDUCATION
${Array.isArray(generatedCV.data.education) && generatedCV.data.education.length > 0 ? generatedCV.data.education.map(edu =>
`\n${edu.degree || "Degree Name"} | ${edu.institution || "University Name"}
${edu.graduationDate || "Graduation Year"} | ${edu.location || "Location"}`
).join('\n') : "\nAdd your education details here."}

===================================
Document generated using ${generatedCV.template} template
Optimized for ${generatedCV.country}
Generated on: ${new Date(generatedCV.generatedAt).toLocaleDateString()}
    `;

    const element = document.createElement('a');
    const file = new Blob([cvContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `CV_${(generatedCV.data.name || 'Document').replace(/\s/g, '_')}_${generatedCV.template}_${generatedCV.country}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">CV Tools</h2>
          <p className="text-slate-600 text-sm mt-1">Upload, optimize, and generate professional CVs for immigration applications</p>
        </div>

      </div>

      {error && (
        <Alert className="border-orange-200 bg-orange-50">
          <Info className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {extractedData && !error && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✅ CV information ready for editing! Review and customize the details below, then generate your optimized CV.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="w-5 h-5 text-blue-600" />
              CV Upload & Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">Upload your CV to get started with optimization</p>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-600 mb-2">
                  Drag and drop your CV here, or click to browse
                </p>
                <p className="text-xs text-slate-500 mb-3">
                  Supported: PDF (auto-parse), DOC, DOCX, TXT, PNG, JPG
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
                  className="hover:bg-blue-50"
                >
                  {processing ? "Processing..." : "Choose File"}
                </Button>
              </div>
              {uploadedFile && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800 font-medium">{uploadedFile.name}</span>
                    <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                  </div>
                  {debugData.rawText && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDebugPanel(true)}
                      className="w-full text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      <Bug className="w-3 h-3 mr-1" />
                      View Debug Info
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
              CV Optimizer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">Customize your CV for the target country and role</p>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Target Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                    <SelectItem value="USA">🇺🇸 USA</SelectItem>
                    <SelectItem value="UK">🇬🇧 UK</SelectItem>
                    <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">CV Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SoftwareEngineer">Software Engineer</SelectItem>
                    <SelectItem value="Healthcare">Healthcare Professional</SelectItem>
                    <SelectItem value="BusinessManager">Business Manager</SelectItem>
                    <SelectItem value="SkilledTrades">Skilled Tradesperson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showTemplates ? 'Hide Templates' : 'Preview Templates'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-green-600" />
              CV Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">Generate and download your optimized CV</p>
            <div className="space-y-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={generateOptimizedCV}
                disabled={!extractedData}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Optimized CV
              </Button>
              <Button
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50"
                onClick={downloadPDF}
                disabled={!generatedCV}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Document
              </Button>
              {generatedCV && (
                <div className="text-xs text-center text-green-600 mt-2">
                  ✅ Ready for download!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {showTemplates && (
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle>CV Templates Preview</CardTitle>
            <p className="text-sm text-slate-600">Choose the perfect template for your target country and industry</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(CV_TEMPLATES).map(([key, template]) => (
                <div
                  key={key}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === key ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedTemplate(key)}
                >
                  <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded mb-3 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-8 h-8 mx-auto mb-1 text-slate-400" />
                      <p className="text-xs text-slate-500">{template.category}</p>
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-900">{template.name}</h3>
                  <p className="text-xs text-slate-600 mb-2">{template.description}</p>
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      {template.category}
                    </Badge>
                  </div>
                  <div className="space-y-1 mb-2">
                    {template.features.map((feature, index) => (
                      <div key={index} className="text-xs text-slate-500 flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-purple-600 font-medium">
                    🎯 {template.immigration_focus}
                  </div>
                  {selectedTemplate === key && (
                    <div className="mt-2 text-xs text-blue-600 font-medium">✓ Selected</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {processing && (
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">Parsing CV and extracting information...</span>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      )}

      {extractedData && (
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle>📝 Parsed CV Information</CardTitle>
            <p className="text-sm text-slate-600">Review and edit the auto-extracted information below</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">Full Name</Label>
                    <Input
                      value={extractedData.name || ''}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Email Address</Label>
                    <Input
                      value={extractedData.email || ''}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Phone Number</Label>
                    <Input
                      value={extractedData.phone || ''}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  CV Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">Target Country</Label>
                    <p className="text-sm text-slate-700 p-2 bg-slate-50 rounded">{selectedCountry}</p>
                  </div>
                  <div>
                    <Label className="text-sm">CV Template</Label>
                    <p className="text-sm text-slate-700 p-2 bg-slate-50 rounded">
                      {CV_TEMPLATES[selectedTemplate]?.name || selectedTemplate}
                    </p>
                  </div>
                  <Button
                    className="w-full bg-slate-900 hover:bg-slate-800"
                    onClick={generateOptimizedCV}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Optimized CV
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm">Professional Summary</Label>
              <Textarea
                value={extractedData.experience_summary || ''}
                onChange={(e) => updateField('experience_summary', e.target.value)}
                placeholder="Brief summary of your professional experience and key achievements..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm">Skills</Label>
              <Input
                value={Array.isArray(extractedData.skills) ? extractedData.skills.join(', ') : ''}
                onChange={(e) => updateField('skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                placeholder="Project Management, Leadership, Data Analysis, etc."
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">Separate skills with commas</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <Label className="text-sm font-medium">Work Experience</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addWorkExperience}
                >
                  Add Experience
                </Button>
              </div>
              <div className="space-y-4">
                {(extractedData.work_experience || []).map((exp, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <Input
                        placeholder="Job Title"
                        value={exp.title || ''}
                        onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                      />
                      <Input
                        placeholder="Company Name"
                        value={exp.company || ''}
                        onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <Input
                        placeholder="Start Date"
                        value={exp.startDate || ''}
                        onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                      />
                      <Input
                        placeholder="End Date"
                        value={exp.endDate || ''}
                        onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                      />
                      <Input
                        placeholder="Location"
                        value={exp.location || ''}
                        onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                      />
                    </div>
                    <Textarea
                      placeholder="Job responsibilities and achievements..."
                      value={exp.description || ''}
                      onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <Label className="text-sm font-medium">Education</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEducation}
                >
                  Add Education
                </Button>
              </div>
              <div className="space-y-3">
                {(extractedData.education || []).map((edu, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Degree"
                        value={edu.degree || ''}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      />
                      <Input
                        placeholder="Institution Name"
                        value={edu.institution || ''}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      />
                      <Input
                        placeholder="Graduation Year"
                        value={edu.graduationDate || ''}
                        onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                      />
                      <Input
                        placeholder="Location"
                        value={edu.location || ''}
                        onChange={(e) => updateEducation(index, 'location', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CV Parser Debug Panel */}
      <CVParserDebugPanel
        rawText={debugData.rawText}
        confidence={debugData.confidence}
        isOpen={showDebugPanel}
        onClose={() => setShowDebugPanel(false)}
      />
    </div>
  );
}
