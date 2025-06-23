import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Users,
  FileText,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Eye,
  Settings,
  Download,
  Bell,
  Activity
} from "lucide-react";

// Import admin panel components
import AdminSummaryStats from '@/components/admin/AdminSummaryStats';
import ApplicationsOverview from '@/components/admin/ApplicationsOverview';
import AssociatePerformance from '@/components/admin/AssociatePerformance';
import LeadsManagement from '@/components/admin/LeadsManagement';
import TasksOverview from '@/components/admin/TasksOverview';
import DocumentsCompliance from '@/components/admin/DocumentsCompliance';
import CVToolsUsage from '@/components/admin/CVToolsUsage';
import ActivityLog from '@/components/admin/ActivityLog';
import AdminControls from '@/components/admin/AdminControls';
import DropdownTest from '@/components/test/DropdownTest';

export default function AdminDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Simulate loading admin data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAdminStats({
        totalApplications: 247,
        applicationsByStatus: {
          draft: 23,
          submitted: 45,
          processing: 89,
          approved: 67,
          rejected: 23
        },
        missingDocuments: 34,
        overdueTasks: 12,
        callsToday: 8,
        newLeadsWeek: 15,
        cvsUploaded: 156
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminTabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: TrendingUp,
      component: AdminSummaryStats
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: FileText,
      component: ApplicationsOverview
    },
    {
      id: 'associates',
      label: 'Associates',
      icon: Users,
      component: AssociatePerformance
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: Eye,
      component: LeadsManagement
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: Calendar,
      component: TasksOverview
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: AlertTriangle,
      component: DocumentsCompliance
    },
    {
      id: 'cvtools',
      label: 'CV Tools',
      icon: FileText,
      component: CVToolsUsage
    },
    {
      id: 'activity',
      label: 'Activity Log',
      icon: Activity,
      component: ActivityLog
    },
    {
      id: 'controls',
      label: 'Admin Controls',
      icon: Settings,
      component: AdminControls
    },
    {
      id: 'test',
      label: 'Dropdown Test',
      icon: Eye,
      component: DropdownTest
    }
  ];

  return (
    <Layout currentPageName="Admin Dashboard" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-600">NWI Visas CRM - Manager Control Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Reports
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              System Alerts
            </Button>
            <Badge className="bg-green-100 text-green-800">
              Admin Access
            </Badge>
          </div>
        </div>

        {/* Quick Stats Bar */}
        {!loading && adminStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card className="rounded-2xl border-slate-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{adminStats.totalApplications}</div>
                  <div className="text-xs text-slate-600">Total Applications</div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-slate-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{adminStats.missingDocuments}</div>
                  <div className="text-xs text-slate-600">Missing Docs</div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-slate-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{adminStats.overdueTasks}</div>
                  <div className="text-xs text-slate-600">Overdue Tasks</div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-slate-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{adminStats.callsToday}</div>
                  <div className="text-xs text-slate-600">Calls Today</div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-slate-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{adminStats.newLeadsWeek}</div>
                  <div className="text-xs text-slate-600">New Leads</div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-slate-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{adminStats.cvsUploaded}</div>
                  <div className="text-xs text-slate-600">CVs Uploaded</div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-slate-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{adminStats.applicationsByStatus.approved}</div>
                  <div className="text-xs text-slate-600">Approved</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Admin Tabs */}
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-slate-200 px-6 py-4">
                <TabsList className="grid grid-cols-3 lg:grid-cols-10 gap-2 bg-slate-50 p-1 rounded-xl">
                  {adminTabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              <div className="p-6">
                {adminTabs.map((tab) => {
                  const ComponentToRender = tab.component;
                  return (
                    <TabsContent key={tab.id} value={tab.id} className="mt-0">
                      <ComponentToRender 
                        adminStats={adminStats}
                        loading={loading}
                        onRefresh={loadAdminData}
                      />
                    </TabsContent>
                  );
                })}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
