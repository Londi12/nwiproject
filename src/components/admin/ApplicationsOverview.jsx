import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Search,
  Filter,
  Eye,
  UserCheck,
  RefreshCw,
  AlertTriangle,
  Upload,
  MoreHorizontal,
  Calendar,
  User
} from "lucide-react";
import { Application } from '@/entities/all';

export default function ApplicationsOverview({ loading }) {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [consultantFilter, setConsultantFilter] = useState('all');
  const [visaTypeFilter, setVisaTypeFilter] = useState('all');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter, consultantFilter, visaTypeFilter]);

  const loadApplications = async () => {
    setLoadingData(true);
    try {
      const data = await Application.list('-updated_date');
      // Add mock admin data
      const enhancedData = data.map(app => ({
        ...app,
        assigned_consultant: app.assigned_consultant || 'Sarah Johnson',
        completion_percentage: Math.floor(Math.random() * 100),
        missing_docs_count: Math.floor(Math.random() * 5),
        date_assigned: app.date_assigned || '2024-01-15',
        last_updated: app.updated_date || new Date().toISOString().split('T')[0]
      }));
      setApplications(enhancedData);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.case_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (consultantFilter !== 'all') {
      filtered = filtered.filter(app => app.assigned_consultant === consultantFilter);
    }

    if (visaTypeFilter !== 'all') {
      filtered = filtered.filter(app => app.visa_type === visaTypeFilter);
    }

    setFilteredApplications(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Submitted': 'bg-yellow-100 text-yellow-800',
      'Under Review': 'bg-orange-100 text-orange-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const consultants = ['Sarah Johnson', 'Mike Chen', 'David Lee', 'Emma Davis', 'Alex Rodriguez'];
  const visaTypes = ['Express Entry', 'Provincial Nominee', 'Family Sponsorship', 'Student Visa', 'Work Permit'];

  if (loadingData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Applications Overview</h2>
          <p className="text-sm text-slate-600">Full access to all applications across associates</p>
        </div>
        <Button onClick={loadApplications} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border-slate-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={consultantFilter} onValueChange={setConsultantFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Consultants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Consultants</SelectItem>
                {consultants.map(consultant => (
                  <SelectItem key={consultant} value={consultant}>{consultant}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={visaTypeFilter} onValueChange={setVisaTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Visa Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visa Types</SelectItem>
                {visaTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-600">{filteredApplications.length} results</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card className="rounded-2xl border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200">
                  <TableHead className="font-semibold">Client Name</TableHead>
                  <TableHead className="font-semibold">Visa Type</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Completion</TableHead>
                  <TableHead className="font-semibold">Missing Docs</TableHead>
                  <TableHead className="font-semibold">Consultant</TableHead>
                  <TableHead className="font-semibold">Date Assigned</TableHead>
                  <TableHead className="font-semibold">Last Updated</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900">{app.client_name}</div>
                        <div className="text-sm text-slate-600">{app.client_email}</div>
                        {app.case_number && (
                          <div className="text-xs text-slate-500">{app.case_number}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {app.visa_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(app.status)} text-xs`}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${getCompletionColor(app.completion_percentage)}`}>
                            {app.completion_percentage}%
                          </span>
                        </div>
                        <Progress value={app.completion_percentage} className="h-2 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {app.missing_docs_count > 0 ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-600">
                              {app.missing_docs_count}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-green-600">Complete</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-900">{app.assigned_consultant}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-600">{app.date_assigned}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">{app.last_updated}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <UserCheck className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Upload className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
