import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  UserPlus,
  Eye,
  Send,
  RotateCcw,
  Calendar,
  FileText
} from "lucide-react";

export default function AssociatePerformance({ loading }) {
  const [associates, setAssociates] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadAssociateData();
  }, []);

  const loadAssociateData = async () => {
    setLoadingData(true);
    try {
      // Simulate loading associate performance data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAssociates = [
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@nwivisas.com',
          active_applications: 23,
          completed_applications: 67,
          overdue_tasks: 2,
          calls_scheduled: 5,
          missing_docs: 8,
          new_leads: 4,
          last_login: '2024-01-23T09:15:00Z',
          performance_score: 92,
          workload_status: 'optimal',
          specialization: 'Express Entry'
        },
        {
          id: 2,
          name: 'Mike Chen',
          email: 'mike.chen@nwivisas.com',
          active_applications: 31,
          completed_applications: 45,
          overdue_tasks: 5,
          calls_scheduled: 3,
          missing_docs: 12,
          new_leads: 6,
          last_login: '2024-01-23T08:45:00Z',
          performance_score: 85,
          workload_status: 'high',
          specialization: 'Family Sponsorship'
        },
        {
          id: 3,
          name: 'David Lee',
          email: 'david.lee@nwivisas.com',
          active_applications: 18,
          completed_applications: 52,
          overdue_tasks: 1,
          calls_scheduled: 7,
          missing_docs: 5,
          new_leads: 3,
          last_login: '2024-01-23T10:30:00Z',
          performance_score: 88,
          workload_status: 'optimal',
          specialization: 'Student Visas'
        },
        {
          id: 4,
          name: 'Emma Davis',
          email: 'emma.davis@nwivisas.com',
          active_applications: 26,
          completed_applications: 38,
          overdue_tasks: 3,
          calls_scheduled: 4,
          missing_docs: 9,
          new_leads: 5,
          last_login: '2024-01-22T16:20:00Z',
          performance_score: 79,
          workload_status: 'high',
          specialization: 'Work Permits'
        },
        {
          id: 5,
          name: 'Alex Rodriguez',
          email: 'alex.rodriguez@nwivisas.com',
          active_applications: 15,
          completed_applications: 29,
          overdue_tasks: 0,
          calls_scheduled: 6,
          missing_docs: 3,
          new_leads: 2,
          last_login: '2024-01-23T11:00:00Z',
          performance_score: 94,
          workload_status: 'low',
          specialization: 'Business Immigration'
        }
      ];
      
      setAssociates(mockAssociates);
    } catch (error) {
      console.error('Error loading associate data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getWorkloadColor = (status) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'optimal': 'bg-blue-100 text-blue-800',
      'high': 'bg-orange-100 text-orange-800',
      'overloaded': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatLastLogin = (loginTime) => {
    const now = new Date();
    const login = new Date(loginTime);
    const diffHours = Math.floor((now - login) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  if (loadingData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
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
          <h2 className="text-xl font-semibold text-slate-900">Associate Performance</h2>
          <p className="text-sm text-slate-600">Track consultant output and workload distribution</p>
        </div>
        <Button onClick={loadAssociateData} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Associates</p>
                <p className="text-2xl font-bold text-blue-600">{associates.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Performance</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(associates.reduce((sum, a) => sum + a.performance_score, 0) / associates.length)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {associates.reduce((sum, a) => sum + a.overdue_tasks, 0)}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Apps</p>
                <p className="text-2xl font-bold text-purple-600">
                  {associates.reduce((sum, a) => sum + a.active_applications, 0)}
                </p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Associates Performance Table */}
      <Card className="rounded-2xl border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200">
                  <TableHead className="font-semibold">Consultant</TableHead>
                  <TableHead className="font-semibold">Active Apps</TableHead>
                  <TableHead className="font-semibold">Completed</TableHead>
                  <TableHead className="font-semibold">Overdue Tasks</TableHead>
                  <TableHead className="font-semibold">Calls</TableHead>
                  <TableHead className="font-semibold">Missing Docs</TableHead>
                  <TableHead className="font-semibold">New Leads</TableHead>
                  <TableHead className="font-semibold">Performance</TableHead>
                  <TableHead className="font-semibold">Last Login</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {associates.map((associate) => (
                  <TableRow key={associate.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900">{associate.name}</div>
                        <div className="text-sm text-slate-600">{associate.specialization}</div>
                        <Badge className={`${getWorkloadColor(associate.workload_status)} text-xs mt-1`}>
                          {associate.workload_status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{associate.active_applications}</div>
                        <div className="text-xs text-slate-600">active</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{associate.completed_applications}</div>
                        <div className="text-xs text-slate-600">completed</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        {associate.overdue_tasks > 0 ? (
                          <div className="flex items-center justify-center gap-1">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-lg font-semibold text-red-600">{associate.overdue_tasks}</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-lg font-semibold text-green-600">0</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span className="text-lg font-semibold text-blue-600">{associate.calls_scheduled}</span>
                        </div>
                        <div className="text-xs text-slate-600">scheduled</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        {associate.missing_docs > 0 ? (
                          <div className="text-lg font-semibold text-orange-600">{associate.missing_docs}</div>
                        ) : (
                          <div className="text-lg font-semibold text-green-600">0</div>
                        )}
                        <div className="text-xs text-slate-600">missing</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <UserPlus className="w-4 h-4 text-purple-600" />
                          <span className="text-lg font-semibold text-purple-600">{associate.new_leads}</span>
                        </div>
                        <div className="text-xs text-slate-600">this week</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className={`text-lg font-semibold ${getPerformanceColor(associate.performance_score)}`}>
                          {associate.performance_score}%
                        </div>
                        <Progress value={associate.performance_score} className="h-2 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-600">
                        {formatLastLogin(associate.last_login)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" title="View Tasks">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Send Reminder">
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Reassign Applications">
                          <RotateCcw className="w-4 h-4" />
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
