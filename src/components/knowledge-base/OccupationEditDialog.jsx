import React, { useState, useEffect } from "react";
import { OccupationKnowledge } from "@/entities/all";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  X, 
  Plus, 
  Trash2,
  Award,
  Clock,
  BookOpen,
  Globe,
  FileText,
  DollarSign
} from "lucide-react";

export default function OccupationEditDialog({ 
  occupation, 
  open, 
  onOpenChange, 
  onSuccess 
}) {
  const [formData, setFormData] = useState({
    occupation_title: '',
    anzsco_code: '',
    occupation_category: '',
    skill_level: 1,
    country: '',
    visa_types: [],
    occupation_list: '',
    eligibility_factors: {},
    application_steps: {},
    skills_assessment: {},
    experience_requirements: {},
    education_requirements: {},
    english_requirements: {},
    licensing_requirements: {},
    salary_benchmarks: {},
    job_outlook: {},
    assessment_authorities: {},
    success_tips: {},
    common_issues: {},
    processing_notes: '',
    status: 'Active',
    tags: []
  });
  
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (occupation) {
      setFormData({
        occupation_title: occupation.occupation_title || '',
        anzsco_code: occupation.anzsco_code || '',
        occupation_category: occupation.occupation_category || '',
        skill_level: occupation.skill_level || 1,
        country: occupation.country || '',
        visa_types: occupation.visa_types || [],
        occupation_list: occupation.occupation_list || '',
        eligibility_factors: occupation.eligibility_factors || {},
        application_steps: occupation.application_steps || {},
        skills_assessment: occupation.skills_assessment || {},
        experience_requirements: occupation.experience_requirements || {},
        education_requirements: occupation.education_requirements || {},
        english_requirements: occupation.english_requirements || {},
        licensing_requirements: occupation.licensing_requirements || {},
        salary_benchmarks: occupation.salary_benchmarks || {},
        job_outlook: occupation.job_outlook || {},
        assessment_authorities: occupation.assessment_authorities || {},
        success_tips: occupation.success_tips || {},
        common_issues: occupation.common_issues || {},
        processing_notes: occupation.processing_notes || '',
        status: occupation.status || 'Active',
        tags: occupation.tags || []
      });
    } else {
      // Reset form for new entry
      setFormData({
        occupation_title: '',
        anzsco_code: '',
        occupation_category: '',
        skill_level: 1,
        country: '',
        visa_types: [],
        occupation_list: '',
        eligibility_factors: {},
        application_steps: {},
        skills_assessment: {},
        experience_requirements: {},
        education_requirements: {},
        english_requirements: {},
        licensing_requirements: {},
        salary_benchmarks: {},
        job_outlook: {},
        assessment_authorities: {},
        success_tips: {},
        common_issues: {},
        processing_notes: '',
        status: 'Active',
        tags: []
      });
    }
  }, [occupation, open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleObjectFieldChange = (objectField, key, value) => {
    setFormData(prev => ({
      ...prev,
      [objectField]: {
        ...prev[objectField],
        [key]: value
      }
    }));
  };

  const addObjectField = (objectField, key = '', value = '') => {
    if (key.trim()) {
      handleObjectFieldChange(objectField, key, value);
    }
  };

  const removeObjectField = (objectField, key) => {
    setFormData(prev => {
      const newObject = { ...prev[objectField] };
      delete newObject[key];
      return {
        ...prev,
        [objectField]: newObject
      };
    });
  };

  const handleVisaTypesChange = (value) => {
    const visaTypes = value.split(',').map(v => v.trim()).filter(v => v);
    handleInputChange('visa_types', visaTypes);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Add current user and timestamp
      const saveData = {
        ...formData,
        updated_by: 'Admin User', // This would come from auth context
        last_updated: new Date().toISOString()
      };

      if (occupation) {
        await occupation.update(saveData);
      } else {
        await OccupationKnowledge.create(saveData);
      }
      
      onSuccess && onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving occupation knowledge entry:', error);
      alert('Error saving entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderObjectEditor = (title, objectField, placeholder = "Enter value") => {
    const data = formData[objectField] || {};
    
    return (
      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <Input
                value={key}
                onChange={(e) => {
                  const newKey = e.target.value;
                  const newData = { ...data };
                  delete newData[key];
                  newData[newKey] = value;
                  setFormData(prev => ({ ...prev, [objectField]: newData }));
                }}
                placeholder="Field name"
                className="w-1/3"
              />
              <Input
                value={value}
                onChange={(e) => handleObjectFieldChange(objectField, key, e.target.value)}
                placeholder={placeholder}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeObjectField(objectField, key)}
                className="px-3"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const key = prompt('Enter field name:');
              if (key) addObjectField(objectField, key, '');
            }}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-slate-200">
          <DialogTitle>
            {occupation ? 'Edit Occupation Entry' : 'Create Occupation Entry'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="process">Process</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation_title">Occupation Title *</Label>
                <Input
                  id="occupation_title"
                  value={formData.occupation_title}
                  onChange={(e) => handleInputChange('occupation_title', e.target.value)}
                  placeholder="e.g., Plumber (General)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="anzsco_code">ANZSCO Code</Label>
                <Input
                  id="anzsco_code"
                  value={formData.anzsco_code}
                  onChange={(e) => handleInputChange('anzsco_code', e.target.value)}
                  placeholder="e.g., 334111"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="New Zealand">New Zealand</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation_category">Occupation Category</Label>
                <Input
                  id="occupation_category"
                  value={formData.occupation_category}
                  onChange={(e) => handleInputChange('occupation_category', e.target.value)}
                  placeholder="e.g., Trades, Healthcare, IT"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skill_level">Skill Level</Label>
                <Select value={formData.skill_level.toString()} onValueChange={(value) => handleInputChange('skill_level', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Highly Skilled</SelectItem>
                    <SelectItem value="2">2 - Skilled</SelectItem>
                    <SelectItem value="3">3 - Skilled</SelectItem>
                    <SelectItem value="4">4 - Semi-skilled</SelectItem>
                    <SelectItem value="5">5 - Unskilled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation_list">Occupation List</Label>
                <Select value={formData.occupation_list} onValueChange={(value) => handleInputChange('occupation_list', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select occupation list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MLTSSL">MLTSSL</SelectItem>
                    <SelectItem value="STSOL">STSOL</SelectItem>
                    <SelectItem value="ROL">ROL</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visa_types">Visa Types (comma-separated)</Label>
              <Input
                id="visa_types"
                value={formData.visa_types.join(', ')}
                onChange={(e) => handleVisaTypesChange(e.target.value)}
                placeholder="e.g., Skilled Independent (189), Skilled Nominated (190)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="processing_notes">Processing Notes</Label>
              <Textarea
                id="processing_notes"
                value={formData.processing_notes}
                onChange={(e) => handleInputChange('processing_notes', e.target.value)}
                placeholder="Additional processing information..."
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="eligibility" className="mt-6 space-y-6">
            {renderObjectEditor("Eligibility Factors", "eligibility_factors", "Enter eligibility requirement")}
            {renderObjectEditor("Application Steps", "application_steps", "Enter process step")}
          </TabsContent>

          <TabsContent value="process" className="mt-6 space-y-6">
            {renderObjectEditor("Skills Assessment", "skills_assessment", "Enter assessment details")}
            {renderObjectEditor("Assessment Authorities", "assessment_authorities", "Enter authority information")}
          </TabsContent>

          <TabsContent value="requirements" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {renderObjectEditor("Experience Requirements", "experience_requirements", "Enter experience details")}
                {renderObjectEditor("Education Requirements", "education_requirements", "Enter education details")}
              </div>
              <div className="space-y-6">
                {renderObjectEditor("English Requirements", "english_requirements", "Enter English requirements")}
                {renderObjectEditor("Licensing Requirements", "licensing_requirements", "Enter licensing details")}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="additional" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {renderObjectEditor("Salary Benchmarks", "salary_benchmarks", "Enter salary information")}
                {renderObjectEditor("Job Outlook", "job_outlook", "Enter job market information")}
              </div>
              <div className="space-y-6">
                {renderObjectEditor("Success Tips", "success_tips", "Enter helpful tip")}
                {renderObjectEditor("Common Issues", "common_issues", "Enter common problem")}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-6 border-t border-slate-200">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {occupation ? 'Editing Occupation' : 'Creating New Occupation'}
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading || !formData.occupation_title || !formData.country}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
