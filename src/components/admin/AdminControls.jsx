import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Users,
  FileText,
  Bell,
  Download,
  Database,
  Shield,
  Calendar
} from "lucide-react";

export default function AdminControls({ loading }) {
  const adminActions = [
    {
      title: 'User Management',
      description: 'Create, edit, and manage consultant accounts',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      actions: ['Add Consultant', 'Edit Permissions', 'View Activity']
    },
    {
      title: 'Visa Templates',
      description: 'Create and edit visa application templates',
      icon: FileText,
      color: 'bg-green-100 text-green-600',
      actions: ['Create Template', 'Edit Existing', 'Import Templates']
    },
    {
      title: 'System Alerts',
      description: 'Set system-wide deadlines and notifications',
      icon: Bell,
      color: 'bg-orange-100 text-orange-600',
      actions: ['Set Deadlines', 'Configure Alerts', 'Notification Rules']
    },
    {
      title: 'Reports & Export',
      description: 'Generate and export system reports',
      icon: Download,
      color: 'bg-purple-100 text-purple-600',
      actions: ['Performance Report', 'Financial Report', 'Export Data']
    },
    {
      title: 'Database Management',
      description: 'Backup and maintain system data',
      icon: Database,
      color: 'bg-indigo-100 text-indigo-600',
      actions: ['Backup Data', 'Data Cleanup', 'Import Data']
    },
    {
      title: 'Security Settings',
      description: 'Manage system security and access controls',
      icon: Shield,
      color: 'bg-red-100 text-red-600',
      actions: ['Access Control', 'Security Audit', 'Password Policy']
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Admin Controls</h2>
        <p className="text-sm text-slate-600">System administration and configuration tools</p>
      </div>

      {/* Admin Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Card key={index} className="rounded-2xl border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{action.title}</div>
                    <div className="text-sm text-slate-600 font-normal">{action.description}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {action.actions.map((actionItem, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      {actionItem}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick System Stats */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-600" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-slate-900">99.9%</div>
              <div className="text-sm text-slate-600">System Uptime</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-slate-900">5</div>
              <div className="text-sm text-slate-600">Active Users</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-slate-900">2.1GB</div>
              <div className="text-sm text-slate-600">Database Size</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-slate-900">v2.1.0</div>
              <div className="text-sm text-slate-600">System Version</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
