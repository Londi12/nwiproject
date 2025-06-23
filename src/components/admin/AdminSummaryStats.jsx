import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Users,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Phone
} from "lucide-react";

export default function AdminSummaryStats({ adminStats, loading }) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="rounded-2xl border-slate-200">
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const totalApplications = adminStats?.totalApplications || 0;
  const applicationsByStatus = adminStats?.applicationsByStatus || {};

  return (
    <div className="space-y-6">
      {/* Top Level Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Applications */}
        <Card className="rounded-2xl border-slate-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Applications</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalApplications}</div>
            <p className="text-xs text-slate-600">All associates combined</p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Processing Rate</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Missing Documents */}
        <Card className="rounded-2xl border-slate-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Documents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{adminStats?.missingDocuments || 0}</div>
            <p className="text-xs text-slate-600">Across all applications</p>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span>High Priority</span>
                <Badge className="bg-red-100 text-red-800 text-xs">12</Badge>
              </div>
              <div className="flex justify-between text-xs">
                <span>Medium Priority</span>
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">22</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overdue Tasks */}
        <Card className="rounded-2xl border-slate-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{adminStats?.overdueTasks || 0}</div>
            <p className="text-xs text-slate-600">Require immediate attention</p>
            <div className="mt-3">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>3 critical tasks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calls Today */}
        <Card className="rounded-2xl border-slate-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Scheduled Today</CardTitle>
            <Phone className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{adminStats?.callsToday || 0}</div>
            <p className="text-xs text-slate-600">All associates</p>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Completed</span>
                <span className="text-green-600">3</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Upcoming</span>
                <span className="text-blue-600">5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Leads */}
        <Card className="rounded-2xl border-slate-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{adminStats?.newLeadsWeek || 0}</div>
            <p className="text-xs text-slate-600">+23% from last week</p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Conversion Rate</span>
                <span>34%</span>
              </div>
              <Progress value={34} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* CVs Uploaded */}
        <Card className="rounded-2xl border-slate-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CVs Uploaded/Updated</CardTitle>
            <Upload className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{adminStats?.cvsUploaded || 0}</div>
            <p className="text-xs text-slate-600">This month</p>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span>New Uploads</span>
                <span className="text-green-600">89</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Updates</span>
                <span className="text-blue-600">67</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications by Status */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Applications by Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(applicationsByStatus).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="mb-2">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900">{count}</div>
                <div className="text-xs text-slate-600">
                  {((count / totalApplications) * 100).toFixed(1)}%
                </div>
                <div className="mt-2">
                  <Progress 
                    value={(count / totalApplications) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Send Reminders</div>
                  <div className="text-xs text-slate-600">Missing documents</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Reassign Tasks</div>
                  <div className="text-xs text-slate-600">Balance workload</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Bulk Approve</div>
                  <div className="text-xs text-slate-600">Ready applications</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Schedule Calls</div>
                  <div className="text-xs text-slate-600">Pending clients</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
