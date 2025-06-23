import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Award, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Globe,
  FileText,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  X
} from "lucide-react";

export default function OccupationDetailsDialog({ 
  occupation, 
  open, 
  onOpenChange, 
  onSuccess 
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!occupation) return null;

  const renderEligibilityFactors = () => {
    if (!occupation.eligibility_factors || Object.keys(occupation.eligibility_factors).length === 0) {
      return <p className="text-slate-500">No eligibility factors available.</p>;
    }

    return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Eligibility Factor</TableHead>
              <TableHead className="font-semibold">Details for {occupation.occupation_title}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(occupation.eligibility_factors).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium capitalize">
                  {key.replace(/_/g, ' ')}
                </TableCell>
                <TableCell className="text-slate-600">{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderApplicationSteps = () => {
    if (!occupation.application_steps || Object.keys(occupation.application_steps).length === 0) {
      return <p className="text-slate-500">No application steps available.</p>;
    }

    return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Application Steps</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(occupation.application_steps).map(([key, value], index) => (
              <TableRow key={key}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderRequirementsSection = (title, data, icon) => {
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return (
      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-700 capitalize">
                  {key.replace(/_/g, ' ')}:
                </span>
                <span className="text-sm text-slate-600 text-right max-w-xs">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSalaryBenchmarks = () => {
    if (!occupation.salary_benchmarks || Object.keys(occupation.salary_benchmarks).length === 0) {
      return <p className="text-slate-500">No salary information available.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(occupation.salary_benchmarks).map(([key, value]) => (
          <Card key={key} className="border border-slate-200">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600 mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
              <p className="font-semibold text-slate-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderTipsAndIssues = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Success Tips */}
        {occupation.success_tips && Object.keys(occupation.success_tips).length > 0 && (
          <Card className="border border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                <Lightbulb className="w-5 h-5" />
                Success Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(occupation.success_tips).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-700">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Common Issues */}
        {occupation.common_issues && Object.keys(occupation.common_issues).length > 0 && (
          <Card className="border border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                Common Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(occupation.common_issues).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-orange-700">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{occupation.getOccupationIcon()}</div>
              <div>
                <DialogTitle className="text-xl">{occupation.occupation_title}</DialogTitle>
                <p className="text-slate-600">{occupation.country} • ANZSCO {occupation.anzsco_code} • {occupation.occupation_category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Skill Level {occupation.skill_level}</Badge>
              <Badge variant="outline">{occupation.occupation_list}</Badge>
              <Badge variant="secondary" className={occupation.isRecent() ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {occupation.isRecent() ? 'Recently Updated' : 'Needs Review'}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="process">Process</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="salary">Salary</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-slate-200">
                <CardContent className="p-4 text-center">
                  <Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-1">Skill Level</p>
                  <p className="font-medium text-slate-900">{occupation.getSkillLevelDescription()}</p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardContent className="p-4 text-center">
                  <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-1">Occupation List</p>
                  <p className="font-medium text-slate-900">{occupation.occupation_list || 'Not specified'}</p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-1">Visa Types</p>
                  <p className="font-medium text-slate-900">{occupation.visa_types?.length || 0} Available</p>
                </CardContent>
              </Card>
            </div>

            {/* Visa Types */}
            {occupation.visa_types && occupation.visa_types.length > 0 && (
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Available Visa Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {occupation.visa_types.map((visaType, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {visaType}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Processing Notes */}
            {occupation.processing_notes && (
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-slate-600" />
                    Processing Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{occupation.processing_notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="eligibility" className="mt-6">
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Eligibility Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderEligibilityFactors()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="process" className="mt-6">
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Application Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderApplicationSteps()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderRequirementsSection("Skills Assessment", occupation.skills_assessment, <Award className="w-5 h-5 text-blue-600" />)}
              {renderRequirementsSection("Experience Requirements", occupation.experience_requirements, <Clock className="w-5 h-5 text-green-600" />)}
              {renderRequirementsSection("Education Requirements", occupation.education_requirements, <BookOpen className="w-5 h-5 text-purple-600" />)}
              {renderRequirementsSection("English Requirements", occupation.english_requirements, <Globe className="w-5 h-5 text-orange-600" />)}
              {renderRequirementsSection("Licensing Requirements", occupation.licensing_requirements, <FileText className="w-5 h-5 text-red-600" />)}
              {renderRequirementsSection("Assessment Authorities", occupation.assessment_authorities, <Award className="w-5 h-5 text-indigo-600" />)}
            </div>
          </TabsContent>

          <TabsContent value="salary" className="mt-6">
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Salary Benchmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderSalaryBenchmarks()}
              </CardContent>
            </Card>

            {/* Job Outlook */}
            {occupation.job_outlook && Object.keys(occupation.job_outlook).length > 0 && (
              <Card className="border border-slate-200 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Job Outlook
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(occupation.job_outlook).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-start">
                        <span className="text-sm font-medium text-slate-700 capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-sm text-slate-600 text-right max-w-xs">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tips" className="mt-6">
            {renderTipsAndIssues()}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-6 border-t border-slate-200">
          <div className="text-sm text-slate-500">
            Last updated: {occupation.getFormattedLastUpdated()}
            {occupation.updated_by && ` by ${occupation.updated_by}`}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
