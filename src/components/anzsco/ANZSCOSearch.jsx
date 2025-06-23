import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  BookOpen, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Users,
  Award,
  Globe
} from "lucide-react";
import {
  getOccupationByCode,
  searchOccupationsByTitle,
  getOccupationsByCategory,
  getAllCategories,
  checkSkillsAssessmentEligibility,
  generateDocumentChecklist,
  calculateAssessmentTimeline,
  matchClientToANZSCO
} from '@/utils/anzscoUtils';

export default function ANZSCOSearch({ onOccupationSelect, clientData = null }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [documentChecklist, setDocumentChecklist] = useState([]);
  const [assessmentTimeline, setAssessmentTimeline] = useState(null);

  const categories = getAllCategories();

  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedCategory]);

  const handleSearch = () => {
    let results = [];

    if (searchTerm.trim()) {
      // Search by occupation title
      results = searchOccupationsByTitle(searchTerm);
    } else if (selectedCategory !== 'all') {
      // Filter by category
      results = getOccupationsByCategory(selectedCategory);
    } else {
      // Show all occupations (limit to prevent overwhelming)
      results = Object.values(getOccupationsByCode('') || {}).slice(0, 10);
    }

    // If client data is available, show match scores
    if (clientData?.occupation) {
      const matches = matchClientToANZSCO(
        clientData.occupation,
        clientData.education_level,
        clientData.work_experience_years
      );
      results = matches.map(match => ({
        ...match.occupation,
        matchScore: match.matchScore,
        eligible: match.eligibility
      }));
    }

    setSearchResults(results);
  };

  const handleOccupationSelect = (occupation) => {
    setSelectedOccupation(occupation);
    
    // Generate eligibility assessment if client data available
    if (clientData) {
      const eligibility = checkSkillsAssessmentEligibility(clientData, occupation.code);
      setEligibilityResult(eligibility);
    }

    // Generate document checklist
    const checklist = generateDocumentChecklist(occupation.code);
    setDocumentChecklist(checklist);

    // Calculate assessment timeline
    const timeline = calculateAssessmentTimeline(occupation.code, {
      hasDocuments: false,
      hasEnglishTest: clientData?.language_skills?.english === 'Advanced'
    });
    setAssessmentTimeline(timeline);

    // Notify parent component
    if (onOccupationSelect) {
      onOccupationSelect(occupation);
    }
  };

  const getSkillLevelBadge = (level) => {
    const colors = {
      1: 'bg-purple-100 text-purple-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-green-100 text-green-800',
      4: 'bg-yellow-100 text-yellow-800',
      5: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      1: 'Professional',
      2: 'Associate Professional',
      3: 'Skilled',
      4: 'Semi-skilled',
      5: 'Unskilled'
    };

    return (
      <Badge className={colors[level] || colors[3]}>
        Level {level} - {labels[level]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            ANZSCO Occupation Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Search by occupation title (e.g., Teacher, Plumber, Electrician)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              Search Results ({searchResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.map((occupation) => (
                <div
                  key={occupation.code}
                  className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => handleOccupationSelect(occupation)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{occupation.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {occupation.code}
                        </Badge>
                        {occupation.matchScore && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            {Math.round(occupation.matchScore)}% match
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{occupation.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {occupation.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {occupation.skillsAssessment.assessingAuthority}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {occupation.skillsAssessment.processingTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getSkillLevelBadge(occupation.skillLevel)}
                      {occupation.eligible !== undefined && (
                        <Badge className={occupation.eligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {occupation.eligible ? 'Eligible' : 'Not Eligible'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Occupation Details */}
      {selectedOccupation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Occupation Details */}
          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                {selectedOccupation.title}
                <Badge variant="outline">{selectedOccupation.code}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Key Tasks</h4>
                <ul className="space-y-1">
                  {selectedOccupation.keyTasks.map((task, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Essential Qualifications</h4>
                <ul className="space-y-1">
                  {selectedOccupation.qualifications.essential.map((qual, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                      <Award className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      {qual}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">English Requirements</h4>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>IELTS:</strong> {selectedOccupation.englishRequirements.IELTS}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Assessment Info */}
          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-600" />
                Skills Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium">Processing Time</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {selectedOccupation.skillsAssessment.processingTime}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium">Cost</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {selectedOccupation.skillsAssessment.cost}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Assessing Authority</h4>
                <p className="text-sm text-slate-600">
                  {selectedOccupation.skillsAssessment.assessingAuthority}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Assessment Requirements</h4>
                <ul className="space-y-1">
                  {selectedOccupation.skillsAssessment.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Eligibility Status */}
              {eligibilityResult && (
                <div className={`p-3 rounded-lg ${eligibilityResult.eligible ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {eligibilityResult.eligible ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${eligibilityResult.eligible ? 'text-green-800' : 'text-red-800'}`}>
                      {eligibilityResult.eligible ? 'Eligible for Skills Assessment' : 'Not Currently Eligible'}
                    </span>
                  </div>
                  {eligibilityResult.recommendations.length > 0 && (
                    <div className="space-y-1">
                      {eligibilityResult.recommendations.map((rec, index) => (
                        <p key={index} className={`text-xs ${eligibilityResult.eligible ? 'text-green-700' : 'text-red-700'}`}>
                          • {rec.message}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Document Checklist */}
      {documentChecklist.length > 0 && (
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Required Documents Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentChecklist.map((doc, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${doc.required ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-slate-900 text-sm">{doc.name}</h4>
                      <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                      {doc.required && <Badge className="bg-red-100 text-red-800 text-xs">Required</Badge>}
                    </div>
                    <p className="text-xs text-slate-600">{doc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assessment Timeline */}
      {assessmentTimeline && (
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Assessment Timeline & Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Timeline</h4>
                <div className="space-y-3">
                  {assessmentTimeline.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-medium text-slate-900 text-sm">{milestone.phase}</h5>
                        <p className="text-xs text-slate-600 mb-1">{milestone.duration}</p>
                        <ul className="text-xs text-slate-500">
                          {milestone.tasks.map((task, taskIndex) => (
                            <li key={taskIndex}>• {task}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Estimated Costs</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Skills Assessment</span>
                    <span className="font-medium">{assessmentTimeline.costs.assessment}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">English Language Test</span>
                    <span className="font-medium">{assessmentTimeline.costs.englishTest}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Document Translation</span>
                    <span className="font-medium">{assessmentTimeline.costs.documentTranslation}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Estimated Cost</span>
                    <span>{assessmentTimeline.costs.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
