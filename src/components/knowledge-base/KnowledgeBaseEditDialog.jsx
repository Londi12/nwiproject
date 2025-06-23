import React, { useState, useEffect } from "react";
import { KnowledgeBase } from "@/entities/all";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Save, 
  X, 
  Plus, 
  Trash2,
  Globe,
  FileText,
  Award,
  Calculator,
  DollarSign,
  Clock
} from "lucide-react";

export default function KnowledgeBaseEditDialog({ 
  entry, 
  open, 
  onOpenChange, 
  onSuccess 
}) {
  const [formData, setFormData] = useState({
    title: '',
    visa_code: '',
    country: '',
    visa_type: '',
    category: 'Work Visa',
    icon: '🌍',
    processing_times: '',
    validity_period: '',
    pathway_to_pr: false,
    family_inclusion: false,
    status: 'Active',
    eligibility_criteria: {},
    application_process: {},
    key_requirements: {},
    official_links: {},
    points_system: {},
    fees: {},
    tags: []
  });
  
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title || '',
        visa_code: entry.visa_code || '',
        country: entry.country || '',
        visa_type: entry.visa_type || '',
        category: entry.category || 'Work Visa',
        icon: entry.icon || '🌍',
        processing_times: entry.processing_times || '',
        validity_period: entry.validity_period || '',
        pathway_to_pr: entry.pathway_to_pr || false,
        family_inclusion: entry.family_inclusion || false,
        status: entry.status || 'Active',
        eligibility_criteria: entry.eligibility_criteria || {},
        application_process: entry.application_process || {},
        key_requirements: entry.key_requirements || {},
        official_links: entry.official_links || {},
        points_system: entry.points_system || {},
        fees: entry.fees || {},
        tags: entry.tags || []
      });
    } else {
      // Reset form for new entry
      setFormData({
        title: '',
        visa_code: '',
        country: '',
        visa_type: '',
        category: 'Work Visa',
        icon: '🌍',
        processing_times: '',
        validity_period: '',
        pathway_to_pr: false,
        family_inclusion: false,
        status: 'Active',
        eligibility_criteria: {},
        application_process: {},
        key_requirements: {},
        official_links: {},
        points_system: {},
        fees: {},
        tags: []
      });
    }
  }, [entry, open]);

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

  const handleSave = async () => {
    setLoading(true);
    try {
      // Add current user and timestamp
      const saveData = {
        ...formData,
        updated_by: 'Admin User', // This would come from auth context
        last_updated: new Date().toISOString()
      };

      if (entry) {
        await entry.update(saveData);
      } else {
        await KnowledgeBase.create(saveData);
      }
      
      onSuccess && onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving knowledge base entry:', error);
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
            {entry ? 'Edit Knowledge Base Entry' : 'Create Knowledge Base Entry'}
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
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Skilled Independent Visa (189)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="visa_code">Visa Code</Label>
                <Input
                  id="visa_code"
                  value={formData.visa_code}
                  onChange={(e) => handleInputChange('visa_code', e.target.value)}
                  placeholder="e.g., 189, AEWV"
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
                <Label htmlFor="visa_type">Visa Type *</Label>
                <Input
                  id="visa_type"
                  value={formData.visa_type}
                  onChange={(e) => handleInputChange('visa_type', e.target.value)}
                  placeholder="e.g., Skilled Independent Visa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="processing_times">Processing Times</Label>
                <Input
                  id="processing_times"
                  value={formData.processing_times}
                  onChange={(e) => handleInputChange('processing_times', e.target.value)}
                  placeholder="e.g., 5 to 8 months"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validity_period">Validity Period</Label>
                <Input
                  id="validity_period"
                  value={formData.validity_period}
                  onChange={(e) => handleInputChange('validity_period', e.target.value)}
                  placeholder="e.g., Permanent residence, 5 years"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="pathway_to_pr"
                  checked={formData.pathway_to_pr}
                  onCheckedChange={(checked) => handleInputChange('pathway_to_pr', checked)}
                />
                <Label htmlFor="pathway_to_pr">Pathway to Permanent Residence</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="family_inclusion"
                  checked={formData.family_inclusion}
                  onCheckedChange={(checked) => handleInputChange('family_inclusion', checked)}
                />
                <Label htmlFor="family_inclusion">Family Members Can Be Included</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="eligibility" className="mt-6">
            {renderObjectEditor("Eligibility Criteria", "eligibility_criteria", "Enter eligibility requirement")}
          </TabsContent>

          <TabsContent value="process" className="mt-6 space-y-6">
            {renderObjectEditor("Application Process", "application_process", "Enter process step")}
            {renderObjectEditor("Official Links", "official_links", "Enter URL")}
          </TabsContent>

          <TabsContent value="requirements" className="mt-6 space-y-6">
            {renderObjectEditor("Key Requirements", "key_requirements", "Enter requirement details")}
            {renderObjectEditor("Points System", "points_system", "Enter points value")}
          </TabsContent>

          <TabsContent value="additional" className="mt-6">
            {renderObjectEditor("Fees Information", "fees", "Enter fee amount or details")}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-6 border-t border-slate-200">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {entry ? 'Editing Entry' : 'Creating New Entry'}
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading || !formData.title || !formData.country}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
