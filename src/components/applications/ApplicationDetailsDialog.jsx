import React, { useState, useEffect } from 'react';
import { Application, Document } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, User, Calendar, MapPin, Phone, Mail, 
  CheckCircle, Clock, AlertTriangle, DollarSign,
  Briefcase, GraduationCap, FileIcon, Eye, Download
} from 'lucide-react';
import { format } from 'date-fns';

export default function ApplicationDetailsDialog({ application, open, onOpenChange, onSuccess }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (application && open) {
      loadDocuments();
    }
  }, [application, open]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs = await Document.list();
      // Filter documents for this application
      const appDocs = docs.filter(doc => doc.application_id === application.id);
      setDocuments(appDocs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!application) return null;

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Submitted': 'bg-purple-100 text-purple-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Additional Info Required': 'bg-orange-100 text-orange-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Draft': <FileText className="w-4 h-4" />,
      'In Progress': <Clock className="w-4 h-4" />,
      'Submitted': <CheckCircle className="w-4 h-4" />,
      'Under Review': <Eye className="w-4 h-4" />,
      'Additional Info Required': <AlertTriangle className="w-4 h-4" />,
      'Approved': <CheckCircle className="w-4 h-4" />,
      'Rejected': <AlertTriangle className="w-4 h-4" />
    };
    return icons[status] || <FileText className="w-4 h-4" />;
  };

  const getDocumentStatusColor = (status) => {
    const colors = {
      'Required': 'bg-red-100 text-red-800',
      'Requested': 'bg-orange-100 text-orange-800',
      'Received': 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Needs Correction': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleDocumentView = (doc) => {
    alert(`Opening document: ${doc.document_type}\nClient: ${doc.client_name}\nStatus: ${doc.status}`);
  };

  const handleDocumentDownload = (doc) => {
    // Create a mock file download
    const element = document.createElement('a');
    const file = new Blob([`Mock content for ${doc.document_type}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${doc.document_type.replace(/ /g, '_')}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Application Details - {application.case_number}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Application Header */}
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{application.client_name}</h3>
                  <p className="text-slate-600">{application.visa_type} - {application.target_country}</p>
                  <p className="text-sm text-slate-500">Case: {application.case_number}</p>
                </div>
                <Badge className={`${getStatusColor(application.status)} border`}>
                  {getStatusIcon(application.status)}
                  <span className="ml-1">{application.status}</span>
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Application Progress</span>
                  <span>{application.completion_percentage}%</span>
                </div>
                <Progress value={application.completion_percentage} className="h-2" />
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-slate-600">{format(new Date(application.created_date), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="font-medium">Consultant</p>
                    <p className="text-slate-600">{application.consultant || 'Unassigned'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="font-medium">Priority</p>
                    <p className="text-slate-600">{application.priority}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="font-medium">Fee Status</p>
                    <p className="text-slate-600">{application.payment_status || 'Pending'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span>{application.client_email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>{application.client_phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{application.client_location || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Application Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Visa Type:</span> {application.visa_type}
                  </div>
                  <div>
                    <span className="font-medium">Target Country:</span> {application.target_country}
                  </div>
                  <div>
                    <span className="font-medium">CV Status:</span> {application.cv_status || 'Not uploaded'}
                  </div>
                  <div>
                    <span className="font-medium">Lead Source:</span> {application.lead_source || 'Direct'}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-slate-900">Application Documents</h4>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <FileIcon className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-slate-200 rounded animate-pulse" />
                ))}
              </div>
            ) : documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 hover:bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileIcon className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="font-medium text-slate-900">{doc.document_type}</p>
                          <p className="text-sm text-slate-500">
                            {doc.date_received ? `Received ${doc.date_received}` : `Requested ${doc.date_requested}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDocumentStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDocumentView(doc)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {doc.status !== 'Required' && doc.status !== 'Requested' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDocumentDownload(doc)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <FileIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No documents found for this application</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <h4 className="font-medium text-slate-900">Application Timeline</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Application Created</p>
                  <p className="text-sm text-slate-500">{format(new Date(application.created_date), 'MMM d, yyyy h:mm a')}</p>
                </div>
              </div>
              
              {application.status !== 'Draft' && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Status: {application.status}</p>
                    <p className="text-sm text-slate-500">Current application status</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <h4 className="font-medium text-slate-900">Application Notes</h4>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-700">
                {application.notes || 'No notes available for this application.'}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Edit Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
