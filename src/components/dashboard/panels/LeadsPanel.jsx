import React, { useState, useEffect } from "react";
import { Lead } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, Eye, UserPlus, Mail, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

import AddLeadDialog from "../../leads/AddLeadDialog";
import LeadDetailsDialog from "../../leads/LeadDetailsDialog";
import ConvertLeadDialog from "../../leads/ConvertLeadDialog";

export default function LeadsPanel() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState(null);

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await Lead.list('-last_contacted');
      setLeads(data);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = [...leads];

    if (searchTerm) {
      filtered = filtered.filter(
        lead =>
          lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone?.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    setFilteredLeads(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-green-100 text-green-800',
      'Needs Follow-Up': 'bg-orange-100 text-orange-800',
      'Qualified': 'bg-purple-100 text-purple-800',
      'Converted': 'bg-emerald-100 text-emerald-800',
      'Lost': 'bg-slate-100 text-slate-800'
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  const getSourceColor = (source) => {
    const colors = {
      'Website': 'bg-slate-100 text-slate-800',
      'Referral': 'bg-purple-100 text-purple-800',
      'Facebook': 'bg-blue-100 text-blue-800',
      'WhatsApp': 'bg-green-100 text-green-800',
      'LinkedIn': 'bg-indigo-100 text-indigo-800',
      'Instagram': 'bg-pink-100 text-pink-800',
      'Walk-in': 'bg-orange-100 text-orange-800',
      'Email': 'bg-gray-100 text-gray-800',
      'Other': 'bg-slate-100 text-slate-800'
    };
    return colors[source] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Leads Management</h2>
          <p className="text-slate-600 text-sm mt-1">Manage potential clients and prospects</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-slate-900 hover:bg-slate-800 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Needs Follow-Up">Needs Follow-Up</SelectItem>
              <SelectItem value="Qualified">Qualified</SelectItem>
              <SelectItem value="Converted">Converted</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-white hidden sm:flex">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
          <Button variant="outline" className="bg-white sm:hidden px-3">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-slate-200">
                <TableHead className="min-w-[120px]">Name</TableHead>
                <TableHead className="min-w-[140px] hidden sm:table-cell">Contact Info</TableHead>
                <TableHead className="min-w-[80px]">Source</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="min-w-[100px] hidden md:table-cell">Last Contacted</TableHead>
                <TableHead className="min-w-[120px] hidden lg:table-cell">Interest Area</TableHead>
                <TableHead className="min-w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b-0">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <div className="h-4 bg-slate-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="border-b-0 hover:bg-slate-50/50 cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <TableCell className="py-3 sm:py-4 font-medium">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{lead.name}</p>
                      <p className="text-xs text-slate-500 sm:hidden">{lead.email}</p>
                      <p className="text-xs text-slate-500">ID: {lead.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 hidden sm:table-cell">
                    <div className="text-sm">
                      <p className="text-slate-800">{lead.email}</p>
                      <p className="text-slate-500">{lead.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    <Badge variant="secondary" className={`${getSourceColor(lead.source)} text-xs`}>
                      {lead.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    <Badge variant="secondary" className={`${getStatusColor(lead.status)} text-xs`}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-sm hidden md:table-cell">
                    {lead.last_contacted
                      ? format(new Date(lead.last_contacted), 'MMM d, yyyy')
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-sm text-slate-600 hidden lg:table-cell">
                    {lead.interest_area || 'Not specified'}
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-slate-500 hover:text-slate-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-slate-500 hover:text-slate-700 hidden sm:flex"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLeadToConvert(lead);
                          setShowConvertDialog(true);
                        }}
                      >
                        <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-slate-500 hover:text-slate-700 hidden sm:flex"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`mailto:${lead.email}`, '_blank');
                        }}
                      >
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-500 hover:text-slate-700 sm:hidden"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Show mobile action menu
                        }}
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AddLeadDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={loadLeads}
      />

      <LeadDetailsDialog
        lead={selectedLead}
        open={!!selectedLead}
        onOpenChange={(open) => !open && setSelectedLead(null)}
        onSuccess={loadLeads}
      />

      <ConvertLeadDialog
        lead={leadToConvert}
        open={showConvertDialog}
        onOpenChange={setShowConvertDialog}
        onSuccess={() => {
          loadLeads();
          setLeadToConvert(null);
        }}
      />
    </div>
  );
}
