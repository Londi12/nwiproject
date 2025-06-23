import React, { useState, useEffect } from "react";
import { Document, Application } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DocumentDetailsDialog from "../../documents/DocumentDetailsDialog";
import DocumentUploadDialog from "../../documents/DocumentUploadDialog";
import { AlertCircle, FileText, Upload, Eye, Download, Search, Send } from "lucide-react";

export default function DocumentsPanel() {
  const [documents, setDocuments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDocumentDetails, setShowDocumentDetails] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [docsData, appsData] = await Promise.all([
        Document.list('-created_date'),
        Application.list()
      ]);

      setDocuments(docsData);
      setApplications(appsData);

      // Recent uploads are documents that have been received recently
      const recent = docsData
        .filter(doc => doc.status === 'Received' || doc.status === 'Under Review' || doc.status === 'Verified')
        .slice(0, 5);

      setRecentUploads(recent);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock functions for button actions
  const handleSendReminder = (clientName) => {
    alert(`Reminder sent to ${clientName || 'all clients with missing documents'}.`);
  };

  const handleUploadClick = () => {
    setShowUploadDialog(true);
  };

  const handleViewDetails = (document) => {
    setSelectedDocument(document);
    setShowDocumentDetails(true);
  };

  const handleDownload = (documentType) => {
    alert(`Downloading ${documentType}...`);
    // Create a mock file download
    const element = document.createElement('a');
    const file = new Blob([`Mock content for ${documentType}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${documentType.replace(/ /g, '_')}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReview = (clientName) => {
    alert(`Starting review process for ${clientName}'s document.`);
  };

  const missingDocuments = documents.filter(doc =>
    doc.status === 'Required' || doc.status === 'Requested'
  );

  const getStatusColor = (status) => {
    const colors = {
      'Required': 'bg-slate-100 text-slate-800',
      'Requested': 'bg-orange-100 text-orange-800',
      'Received': 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Needs Correction': 'bg-purple-100 text-purple-800',
      'Verified': 'bg-green-100 text-green-800',
      'Pending Review': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'bg-slate-100 text-slate-800',
      'Medium': 'bg-orange-100 text-orange-800',
      'Low': 'bg-blue-100 text-blue-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const documentCategories = [
    { name: 'Passports', count: documents.filter(d => d.document_type.includes('Passport')).length, color: 'bg-blue-500' },
    { name: 'Certificates', count: documents.filter(d => d.document_type.includes('Certificate')).length, color: 'bg-green-500' },
    { name: 'CVs/Resumes', count: documents.filter(d => d.document_type.includes('CV') || d.document_type.includes('Resume')).length, color: 'bg-orange-500' },
    { name: 'Bank Statements', count: documents.filter(d => d.document_type.includes('Bank')).length, color: 'bg-purple-500' }
  ];

  const filteredRecentUploads = recentUploads.filter(doc =>
    searchTerm === "" ||
    doc.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Document Details Dialog */}
      <DocumentDetailsDialog
        document={selectedDocument}
        open={showDocumentDetails}
        onOpenChange={setShowDocumentDetails}
        onSuccess={loadData}
      />

      {/* Document Upload Dialog */}
      <DocumentUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onSuccess={loadData}
      />

      <Card className="border-0 shadow-sm rounded-2xl bg-white border-l-4 border-l-red-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Missing Documents ({missingDocuments.length})
            </CardTitle>
            <Button variant="outline" className="text-red-600 border-red-200" onClick={() => handleSendReminder()}>
              <Send className="w-4 h-4 mr-2" />
              Send Reminder
            </Button>
          </div>
          <p className="text-sm text-slate-600">Applications requiring document submission</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b-slate-200">
                <TableHead>Client Name</TableHead>
                <TableHead>Application ID</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Date Requested</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className="border-b-0">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <div className="h-4 bg-slate-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : missingDocuments.map((doc) => (
                <TableRow key={doc.id} className="border-b-0 hover:bg-slate-50/50">
                  <TableCell className="py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{doc.client_name}</p>
                      <p className="text-xs text-slate-500">Last reminder: {doc.date_requested}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">{doc.application_id}</TableCell>
                  <TableCell className="py-4">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {doc.document_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">{doc.date_requested}</TableCell>
                  <TableCell className="py-4">
                    <Badge variant="secondary" className={getPriorityColor(doc.priority)}>
                      {doc.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" onClick={() => handleSendReminder(doc.client_name)}>
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" onClick={handleUploadClick}>
                        <Upload className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" onClick={() => handleViewDetails(doc)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm rounded-2xl bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Document Uploads</CardTitle>
            <Button className="bg-slate-900 hover:bg-slate-800" onClick={handleUploadClick}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
          <p className="text-sm text-slate-600">Recently submitted documents requiring review</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            <Button variant="outline">All Status</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-b-slate-200">
                <TableHead>Client Name</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className="border-b-0">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <div className="h-4 bg-slate-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredRecentUploads.map((doc) => (
                <TableRow key={doc.id} className="border-b-0 hover:bg-slate-50/50">
                  <TableCell className="py-4">{doc.client_name}</TableCell>
                  <TableCell className="py-4">{doc.document_type}</TableCell>
                  <TableCell className="py-4">{doc.date_received}</TableCell>
                  <TableCell className="py-4">{doc.file_size}</TableCell>
                  <TableCell className="py-4">
                    <Badge variant="secondary" className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" onClick={() => handleViewDetails(doc)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" onClick={() => handleDownload(doc.document_type)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      {doc.status === 'Under Review' && (
                        <Button size="sm" variant="outline" onClick={() => handleReview(doc.client_name)}>
                          Review
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm rounded-2xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle>Document Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {documentCategories.map((category, index) => (
              <div key={index} className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-3xl font-bold text-slate-900">{category.count}</div>
                <div className="text-sm text-slate-600 mt-1">{category.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
