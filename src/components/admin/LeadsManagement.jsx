import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Search,
  Eye,
  UserCheck,
  MessageSquare,
  RotateCcw,
  Phone,
  Mail,
  Calendar,
  MapPin
} from "lucide-react";
import { Lead } from '@/entities/all';

export default function LeadsManagement({ loading }) {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [consultantFilter, setConsultantFilter] = useState('all');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter, sourceFilter, consultantFilter]);

  const loadLeads = async () => {
    setLoadingData(true);
    try {
      const data = await Lead.list('-created_date');
      // Add mock admin data
      const enhancedData = data.map(lead => ({
        ...lead,
        assigned_consultant: lead.assigned_to || 'Sarah Johnson',
        last_follow_up: lead.last_contacted || '2024-01-20',
        contact_attempts: Math.floor(Math.random() * 5) + 1,
        lead_score: Math.floor(Math.random() * 100),
        conversion_probability: Math.floor(Math.random() * 100)
      }));
      setLeads(enhancedData);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const filterLeads = () => {
    let filtered = [...leads];

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }

    if (consultantFilter !== 'all') {
      filtered = filtered.filter(lead => lead.assigned_consultant === consultantFilter);
    }

    setFilteredLeads(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Needs Follow-Up': 'bg-orange-100 text-orange-800',
      'Qualified': 'bg-green-100 text-green-800',
      'Converted': 'bg-emerald-100 text-emerald-800',
      'Lost': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSourceIcon = (source) => {
    const icons = {
      'Website': '🌐',
      'Facebook': '📘',
      'WhatsApp': '💬',
      'Referral': '👥',
      'LinkedIn': '💼',
      'Instagram': '📸',
      'Walk-in': '🚶',
      'Email': '📧'
    };
    return icons[source] || '📋';
  };

  const consultants = ['Sarah Johnson', 'Mike Chen', 'David Lee', 'Emma Davis', 'Alex Rodriguez'];
  const sources = ['Website', 'Facebook', 'WhatsApp', 'Referral', 'LinkedIn', 'Instagram', 'Walk-in', 'Email'];

  if (loadingData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
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
          <h2 className="text-xl font-semibold text-slate-900">Leads Management</h2>
          <p className="text-sm text-slate-600">Full access to all leads across all associates</p>
        </div>
        <Button onClick={loadLeads} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
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
                placeholder="Search leads..."
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
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Needs Follow-Up">Needs Follow-Up</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
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
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-600">{filteredLeads.length} leads</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="rounded-2xl border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200">
                  <TableHead className="font-semibold">Lead Name</TableHead>
                  <TableHead className="font-semibold">Contact Info</TableHead>
                  <TableHead className="font-semibold">Source</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Consultant</TableHead>
                  <TableHead className="font-semibold">Interest</TableHead>
                  <TableHead className="font-semibold">Score</TableHead>
                  <TableHead className="font-semibold">Last Follow-up</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900">{lead.name}</div>
                        <div className="text-sm text-slate-600">{lead.current_country}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-500">{lead.target_country}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span className="text-sm text-slate-600">{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span className="text-sm text-slate-600">{lead.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getSourceIcon(lead.source)}</span>
                        <span className="text-sm text-slate-900">{lead.source}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(lead.status)} text-xs`}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-900">{lead.assigned_consultant}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {lead.interest_area}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className={`text-sm font-medium ${lead.lead_score >= 70 ? 'text-green-600' : lead.lead_score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {lead.lead_score}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">{lead.last_follow_up}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Reassign">
                          <UserCheck className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Add Notes">
                          <MessageSquare className="w-4 h-4" />
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
