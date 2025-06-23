import React, { useState, useEffect } from "react";
import { Application } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, CheckCircle, Award, Calendar, Trophy } from "lucide-react";

export default function CompletedPanel() {
  const [completedCases, setCompletedCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadCompletedCases();
  }, []);

  useEffect(() => {
    filterCases();
  }, [completedCases, searchTerm, statusFilter]);

  const loadCompletedCases = async () => {
    setLoading(true);
    try {
      // Filter for approved applications only
      const data = await Application.list('-updated_date');
      const approvedCases = data.filter(app => app.status === 'Approved');

      // Add mock completed cases to match screenshot
      const mockCompletedCases = [
        {
          id: 'comp_1',
          client_name: 'Lisa Brown',
          client_email: 'lisa.brown@email.com',
          country: 'USA',
          visa_type: 'Express Entry',
          completed_date: '21/06/2025',
          consultant: 'John Doe',
          duration: 0,
          fee: 7500,
          status: 'Approved'
        },
        {
          id: 'comp_2',
          client_name: 'James Wilson',
          client_email: 'james.wilson@email.com',
          country: 'Not specified',
          visa_type: 'Work Permit',
          completed_date: '21/06/2025',
          consultant: 'consultant@nwivisas.com',
          duration: 0,
          fee: 2500,
          status: 'Approved'
        }
      ];

      setCompletedCases([...mockCompletedCases, ...approvedCases]);
    } catch (error) {
      console.error('Error loading completed cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCases = () => {
    let filtered = [...completedCases];

    if (searchTerm) {
      filtered = filtered.filter(
        app =>
          app.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.client_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.visa_type === statusFilter);
    }

    setFilteredCases(filtered);
  };

  const getVisaTypeColor = (visaType) => {
    const colors = {
      'Express Entry': 'bg-green-100 text-green-800',
      'Provincial Nominee Program': 'bg-blue-100 text-blue-800',
      'Family Sponsorship': 'bg-purple-100 text-purple-800',
      'Study Permit': 'bg-yellow-100 text-yellow-800',
      'Work Permit': 'bg-indigo-100 text-indigo-800',
      'Tourist Visa': 'bg-pink-100 text-pink-800',
      'Business Visa': 'bg-orange-100 text-orange-800',
      'Skilled Worker': 'bg-teal-100 text-teal-800'
    };
    return colors[visaType] || 'bg-gray-100 text-gray-800';
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateAverageDuration = () => {
    if (completedCases.length === 0) return 0;
    const totalDays = completedCases.reduce((acc, app) => {
      return acc + calculateDuration(app.created_date, app.updated_date);
    }, 0);
    return Math.round(totalDays / completedCases.length);
  };

  const calculateTotalRevenue = () => {
    return completedCases.reduce((acc, app) => {
      // Mock fee calculation based on visa type
      const fees = {
        'Express Entry': 3500,
        'Provincial Nominee Program': 4000,
        'Family Sponsorship': 2500,
        'Study Permit': 1500,
        'Work Permit': 2000,
        'Tourist Visa': 500,
        'Business Visa': 5000,
        'Skilled Worker': 3000
      };
      return acc + (fees[app.visa_type] || 2000);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Completed Cases
          </h2>
          <p className="text-slate-600 text-sm mt-1">This section will display all completed client cases. (Placeholder)</p>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-slate-700">{completedCases.length} Success Stories</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search completed cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-200"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white border-slate-200">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Express Entry">Express Entry</SelectItem>
              <SelectItem value="Work Permit">Work Permit</SelectItem>
              <SelectItem value="Family Sponsorship">Family Sponsorship</SelectItem>
              <SelectItem value="Study Permit">Study Permit</SelectItem>
              <SelectItem value="Tourist Visa">Tourist Visa</SelectItem>
              <SelectItem value="Business Visa">Business Visa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200">
                <TableHead className="text-slate-600 font-medium">Client Name</TableHead>
                <TableHead className="text-slate-600 font-medium">Country</TableHead>
                <TableHead className="text-slate-600 font-medium">Visa Type</TableHead>
                <TableHead className="text-slate-600 font-medium">Completed Date</TableHead>
                <TableHead className="text-slate-600 font-medium">Consultant</TableHead>
                <TableHead className="text-slate-600 font-medium">Duration</TableHead>
                <TableHead className="text-slate-600 font-medium">Fee</TableHead>
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
              ) : filteredCases.length > 0 ? (
                filteredCases.map((app) => {
                  // Calculate fee if not provided
                  const fee = app.fee || {
                    'Express Entry': 7500,
                    'Work Permit': 2500,
                    'Family Sponsorship': 3000,
                    'Study Permit': 1500,
                    'Tourist Visa': 500,
                    'Business Visa': 5000
                  }[app.visa_type] || 2000;

                  return (
                    <TableRow key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{app.client_name}</p>
                            <p className="text-xs text-slate-500">{app.client_email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-slate-700">{app.country}</TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="secondary"
                          className={app.visa_type === 'Express Entry' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                        >
                          {app.visa_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-slate-700">
                        {app.completed_date}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-slate-700">{app.consultant}</TableCell>
                      <TableCell className="py-4 text-sm text-slate-700">
                        {app.duration} days
                      </TableCell>
                      <TableCell className="py-4 text-sm font-medium text-slate-900">
                        ${fee.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="w-12 h-12 text-slate-300" />
                      <p className="text-slate-500">No completed cases found.</p>
                      <p className="text-xs text-slate-400">Approved applications will appear here.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-200 shadow-sm rounded-2xl bg-green-50">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">2</div>
            <div className="text-sm text-green-700 font-medium">Total Success</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm rounded-2xl bg-blue-50">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">0</div>
            <div className="text-sm text-blue-700 font-medium">Avg Days</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm rounded-2xl bg-purple-50">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-sm text-purple-700 font-medium">Success Rate</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm rounded-2xl bg-orange-50">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">$10,000</div>
            <div className="text-sm text-orange-700 font-medium">Total Revenue</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
