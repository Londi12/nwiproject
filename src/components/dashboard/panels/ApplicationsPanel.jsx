import React, { useState, useEffect } from "react";
import { Application, Document } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Filter, Eye, FileText, Phone, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import NewApplicationDialog from "../../applications/NewApplicationDialog";
import ApplicationDetailsDialog from "../../applications/ApplicationDetailsDialog";

export default function ApplicationsPanel() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewAppDialog, setShowNewAppDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    loadApplications();
    loadDocuments();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await Application.list('-created_date');
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const data = await Document.list();
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (searchTerm) {
      filtered = filtered.filter(
        app =>
          app.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.application_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-slate-100 text-slate-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Submitted': 'bg-purple-100 text-purple-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Additional Info Required': 'bg-orange-100 text-orange-800',
      'Interview Scheduled': 'bg-blue-100 text-blue-800',
      'Decision Made': 'bg-purple-100 text-purple-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Withdrawn': 'bg-slate-100 text-slate-800',
      'On Hold': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Draft': <FileText className="w-3 h-3" />,
      'In Progress': <Clock className="w-3 h-3" />,
      'Submitted': <CheckCircle className="w-3 h-3" />,
      'Under Review': <Eye className="w-3 h-3" />,
      'Additional Info Required': <AlertTriangle className="w-3 h-3" />,
      'Interview Scheduled': <Calendar className="w-3 h-3" />,
      'Decision Made': <CheckCircle className="w-3 h-3" />,
      'Approved': <CheckCircle className="w-3 h-3" />,
      'Rejected': <AlertTriangle className="w-3 h-3" />,
      'Withdrawn': <FileText className="w-3 h-3" />,
      'On Hold': <Clock className="w-3 h-3" />
    };
    return icons[status] || <FileText className="w-3 h-3" />;
  };

  const getCvStatusColor = (status) => {
    const colors = {
      'Not Uploaded': 'bg-slate-100 text-slate-800',
      'Uploaded': 'bg-blue-100 text-blue-800',
      'Needs Update': 'bg-orange-100 text-orange-800',
      'Updated': 'bg-green-100 text-green-800',
      'Approved': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getDocumentStatus = (app) => {
    // Get documents for this application
    const appDocs = documents.filter(doc => doc.application_id === app.id);

    if (appDocs.length === 0) {
      return {
        received: 0,
        approved: 0,
        outstanding: 0,
        status: 'bg-slate-100 text-slate-800',
        label: 'No docs'
      };
    }

    const received = appDocs.filter(doc =>
      ['Received', 'Under Review', 'Approved', 'Needs Correction'].includes(doc.status)
    ).length;

    const approved = appDocs.filter(doc => doc.status === 'Approved').length;
    const outstanding = appDocs.filter(doc =>
      ['Required', 'Requested'].includes(doc.status)
    ).length;

    // Determine status color based on document completion
    let status = 'bg-slate-100 text-slate-800';
    let label = `${received}/${appDocs.length}`;

    if (outstanding > 0) {
      status = 'bg-red-100 text-red-800';
      label = `${outstanding} missing`;
    } else if (approved === appDocs.length) {
      status = 'bg-green-100 text-green-800';
      label = 'Complete';
    } else if (received > 0) {
      status = 'bg-orange-100 text-orange-800';
      label = 'In review';
    }

    return { received, approved, outstanding, status, label };
  };

  const handleViewApplication = (app) => {
    setSelectedApplication(app);
    setShowDetailsDialog(true);
  };

  const handleViewDocuments = (app) => {
    // Filter documents for this application and visa type
    const appDocs = documents.filter(doc => doc.application_id === app.id);
    const visaSpecificDocs = getVisaSpecificDocuments(app.visa_type);

    const docSummary = {
      received: appDocs.filter(doc => ['Received', 'Under Review', 'Approved'].includes(doc.status)),
      approved: appDocs.filter(doc => doc.status === 'Approved'),
      outstanding: appDocs.filter(doc => ['Required', 'Requested'].includes(doc.status)),
      visaSpecific: visaSpecificDocs
    };

    const message = `Documents for ${app.client_name} (${app.visa_type})\n\n` +
      `📄 Received: ${docSummary.received.length}\n` +
      `✅ Approved: ${docSummary.approved.length}\n` +
      `⏳ Outstanding: ${docSummary.outstanding.length}\n\n` +
      `Required for ${app.visa_type}:\n${visaSpecificDocs.join(', ')}`;

    alert(message);
  };

  const handleScheduleCall = (app) => {
    const callDetails = `Schedule Call - ${app.client_name}\n\n` +
      `📧 Email: ${app.client_email || 'Not provided'}\n` +
      `📱 Phone: ${app.client_phone || 'Not provided'}\n` +
      `🎯 Visa Type: ${app.visa_type}\n` +
      `📊 Status: ${app.status}\n` +
      `👨‍💼 Consultant: ${app.assigned_consultant || 'Unassigned'}\n` +
      `📈 Progress: ${app.completion_percentage}%`;

    alert(callDetails);
  };

  const getVisaSpecificDocuments = (visaType) => {
    const docRequirements = {
      'Express Entry': ['Passport', 'IELTS Results', 'Education Certificates', 'Experience Letters', 'Police Clearance'],
      'Family Sponsorship': ['Passport', 'Birth Certificate', 'Marriage Certificate', 'Police Clearance', 'Medical Exam'],
      'Student Visa': ['Passport', 'Education Certificates', 'IELTS Results', 'Bank Statements', 'Letter of Acceptance'],
      'Work Permit': ['Passport', 'LMIA', 'Experience Letters', 'Education Certificates', 'Medical Exam'],
      'Visitor Visa': ['Passport', 'Bank Statements', 'Travel Itinerary', 'Invitation Letter'],
      'Business Immigration': ['Passport', 'Business Plan', 'Financial Statements', 'Experience Letters', 'Education Certificates'],
      'Provincial Nominee': ['Passport', 'IELTS Results', 'Education Certificates', 'Experience Letters', 'Provincial Nomination']
    };

    return docRequirements[visaType] || ['Passport', 'Supporting Documents'];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Applications Management</h2>
          <p className="text-slate-600 text-sm mt-1">Track and manage client visa applications</p>
        </div>
        <Button
          onClick={() => setShowNewAppDialog(true)}
          className="bg-slate-900 hover:bg-slate-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Application
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Additional Info Required">Additional Info Required</SelectItem>
              <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
              <SelectItem value="Decision Made">Decision Made</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Withdrawn">Withdrawn</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-white">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-slate-200">
                <TableHead>Client Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Visa Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>CV Status</TableHead>
                <TableHead>Consultant</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b-0">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <div className="h-4 bg-slate-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredApplications.map((app) => {
                const docStatus = getDocumentStatus(app);
                return (
                  <TableRow key={app.id} className="border-b-0 hover:bg-slate-50/50">
                    <TableCell className="py-4 font-medium">
                      <div>
                        <p className="font-semibold text-slate-900">{app.client_name}</p>
                        <p className="text-xs text-slate-500">{app.application_number}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm">{app.country || 'Not specified'}</TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className="bg-slate-100 text-slate-800">
                        {app.visa_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="secondary" className={`${getStatusColor(app.status)} flex items-center gap-1`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-1 min-w-[100px]">
                        <Progress value={app.completion_percentage} className="h-2" />
                        <p className="text-xs text-slate-500">{app.completion_percentage}% complete</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="secondary" className={docStatus.status}>
                        {docStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="secondary" className={getCvStatusColor(app.cv_status)}>
                        {app.cv_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-sm">{app.assigned_consultant}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-slate-700"
                          onClick={() => handleViewApplication(app)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-slate-700"
                          onClick={() => handleViewDocuments(app)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-slate-700"
                          onClick={() => handleScheduleCall(app)}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
      <NewApplicationDialog
        open={showNewAppDialog}
        onOpenChange={setShowNewAppDialog}
        onSuccess={loadApplications}
      />

      <ApplicationDetailsDialog
        application={selectedApplication}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        onSuccess={loadApplications}
      />
    </div>
  );
}
