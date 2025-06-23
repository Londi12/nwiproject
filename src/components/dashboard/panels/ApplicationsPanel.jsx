import React, { useState, useEffect } from "react";
import { Application } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Filter, Eye, FileText, Phone } from "lucide-react";
import NewApplicationDialog from "../../applications/NewApplicationDialog";

export default function ApplicationsPanel() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewAppDialog, setShowNewAppDialog] = useState(false);

  useEffect(() => {
    loadApplications();
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

  const filterApplications = () => {
    let filtered = [...applications];

    if (searchTerm) {
      filtered = filtered.filter(
        app =>
          app.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.case_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-orange-100 text-orange-800',
      'Submitted': 'bg-purple-100 text-purple-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCvStatusColor = (status) => {
    const colors = {
      'Not Uploaded': 'bg-red-100 text-red-800',
      'Uploaded': 'bg-blue-100 text-blue-800',
      'Needs Update': 'bg-orange-100 text-orange-800',
      'Updated': 'bg-green-100 text-green-800',
      'Approved': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getDocumentStatus = (app) => {
    // Mock document status based on completion percentage
    if (app.completion_percentage < 50) return { missing: 4, status: 'bg-red-100 text-red-800' };
    if (app.completion_percentage < 80) return { missing: 2, status: 'bg-orange-100 text-orange-800' };
    return { missing: 0, status: 'bg-green-100 text-green-800' };
  };

  const handleViewApplication = (app) => {
    alert(`Viewing application for ${app.client_name}\nVisa Type: ${app.visa_type}\nStatus: ${app.status}\nCase Number: ${app.case_number}`);
  };

  const handleViewDocuments = (app) => {
    alert(`Opening documents for ${app.client_name}\nApplication ID: ${app.id}\nCompletion: ${app.completion_percentage}%`);
  };

  const handleScheduleCall = (app) => {
    alert(`Scheduling call with ${app.client_name}\nEmail: ${app.client_email}\nConsultant: ${app.assigned_consultant}`);
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
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
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
                        <p className="text-xs text-slate-500">{app.case_number}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm">{app.country || 'Not specified'}</TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className="bg-slate-100 text-slate-800">
                        {app.visa_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="secondary" className={getStatusColor(app.status)}>
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
                      {docStatus.missing > 0 ? (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          {docStatus.missing} missing
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Complete
                        </Badge>
                      )}
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
    </div>
  );
}
