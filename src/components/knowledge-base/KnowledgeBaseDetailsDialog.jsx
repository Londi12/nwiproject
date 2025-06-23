import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ExternalLink, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Globe,
  FileText,
  Award,
  Languages,
  Calculator,
  Edit,
  X
} from "lucide-react";

export default function KnowledgeBaseDetailsDialog({ 
  entry, 
  open, 
  onOpenChange, 
  onSuccess 
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!entry) return null;

  const renderEligibilityCriteria = () => {
    if (!entry.eligibility_criteria || Object.keys(entry.eligibility_criteria).length === 0) {
      return <p className="text-slate-500">No eligibility criteria available.</p>;
    }

    return (
      <div className="space-y-4">
        {Object.entries(entry.eligibility_criteria).map(([key, value]) => (
          <div key={key} className="border-l-4 border-blue-200 pl-4">
            <h4 className="font-medium text-slate-900 capitalize mb-1">
              {key.replace(/_/g, ' ')}
            </h4>
            <p className="text-slate-600 text-sm">{value}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderApplicationProcess = () => {
    if (!entry.application_process || Object.keys(entry.application_process).length === 0) {
      return <p className="text-slate-500">No application process information available.</p>;
    }

    return (
      <div className="space-y-4">
        {Object.entries(entry.application_process).map(([key, value], index) => (
          <div key={key} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-900 mb-1">
                Step {index + 1}
              </h4>
              <p className="text-slate-600 text-sm">{value}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderKeyRequirements = () => {
    if (!entry.key_requirements || Object.keys(entry.key_requirements).length === 0) {
      return <p className="text-slate-500">No key requirements available.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(entry.key_requirements).map(([key, value]) => (
          <Card key={key} className="border border-slate-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-slate-900 mb-2 capitalize">
                {key.replace(/_/g, ' ')}
              </h4>
              <p className="text-slate-600 text-sm">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderPointsSystem = () => {
    if (!entry.points_system || Object.keys(entry.points_system).length === 0) {
      return <p className="text-slate-500">No points system information available.</p>;
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(entry.points_system).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-700 capitalize">
                {key.replace(/_/g, ' ')}
              </span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {value} pts
              </Badge>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOfficialLinks = () => {
    if (!entry.official_links || Object.keys(entry.official_links).length === 0) {
      return <p className="text-slate-500">No official links available.</p>;
    }

    return (
      <div className="space-y-3">
        {Object.entries(entry.official_links).map(([key, url]) => (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-blue-600" />
            <div className="flex-1">
              <p className="font-medium text-slate-900 capitalize">
                {key.replace(/_/g, ' ')}
              </p>
              <p className="text-xs text-slate-500 truncate">{url}</p>
            </div>
          </a>
        ))}
      </div>
    );
  };

  const renderFeesInformation = () => {
    if (!entry.fees || Object.keys(entry.fees).length === 0) {
      return <p className="text-slate-500">No fee information available.</p>;
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(entry.fees).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-700 capitalize">
                {key.replace(/_/g, ' ')}
              </span>
              <span className="font-medium text-slate-900">
                {typeof value === 'number' ? `${entry.fees.currency || ''} ${value.toLocaleString()}` : value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{entry.getCountryFlag()}</div>
              <div>
                <DialogTitle className="text-xl">{entry.title}</DialogTitle>
                <p className="text-slate-600">{entry.country} • {entry.visa_type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {entry.visa_code && (
                <Badge variant="outline">Code: {entry.visa_code}</Badge>
              )}
              <Badge variant="secondary" className={entry.isRecent() ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {entry.isRecent() ? 'Recently Updated' : 'Needs Review'}
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
            <TabsTrigger value="points">Points</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-slate-200">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-1">Processing Time</p>
                  <p className="font-medium text-slate-900">{entry.processing_times || 'Not specified'}</p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardContent className="p-4 text-center">
                  <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-1">Validity</p>
                  <p className="font-medium text-slate-900">{entry.validity_period || 'Not specified'}</p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-1">PR Pathway</p>
                  <p className="font-medium text-slate-900">{entry.pathway_to_pr ? 'Yes' : 'No'}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Family Inclusion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    {entry.family_inclusion ? 'Family members can be included in the application' : 'Individual application only'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Fee Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {entry.fees && Object.keys(entry.fees).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(entry.fees).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm text-slate-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span className="text-sm font-medium">
                            {typeof value === 'number' ? `${entry.fees.currency || ''} ${value.toLocaleString()}` : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500">Fee information not available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="eligibility" className="mt-6">
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Eligibility Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderEligibilityCriteria()}
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
                {renderApplicationProcess()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="mt-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Key Requirements
              </h3>
              {renderKeyRequirements()}
            </div>
          </TabsContent>

          <TabsContent value="points" className="mt-6">
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-orange-600" />
                  Points System
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderPointsSystem()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="mt-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Official Resources
              </h3>
              {renderOfficialLinks()}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-6 border-t border-slate-200">
          <div className="text-sm text-slate-500">
            Last updated: {entry.getFormattedLastUpdated()}
            {entry.updated_by && ` by ${entry.updated_by}`}
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
