import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CVPreview } from "./CVPreview";
import { Upload, Eye, User, Briefcase, GraduationCap, Award, Download } from "lucide-react";

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
                    Upload your CV to auto-fill the fields. Supported formats: PDF, DOCX, TXT.
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </CardContent>
            </Card>

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
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Full Preview
                </Button>
                <Button size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download PDF
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

            {/* CV Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <CVPreview
                template={selectedTemplate}
                userData={cvData}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
