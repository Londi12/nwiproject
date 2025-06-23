import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Users, 
  FileText, 
  Phone, 
  Calendar, 
  Upload,
  Search,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export default function QuickActions({ onNavigate, loading = false }) {
  const quickActions = [
    {
      title: 'Add New Lead',
      description: 'Create a new lead record',
      icon: Plus,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      action: () => onNavigate?.('leads'),
      primary: true
    },
    {
      title: 'View All Leads',
      description: 'Manage existing leads',
      icon: Users,
      color: 'bg-green-50 text-green-600 border-green-200',
      action: () => onNavigate?.('leads')
    },
    {
      title: 'Schedule Call',
      description: 'Book a consultation',
      icon: Phone,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      action: () => console.log('Schedule call')
    },
    {
      title: 'Upload Document',
      description: 'Add client documents',
      icon: Upload,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      action: () => console.log('Upload document')
    },
    {
      title: 'Search Records',
      description: 'Find client information',
      icon: Search,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      action: () => console.log('Search records')
    },
    {
      title: 'Send Message',
      description: 'Contact a client',
      icon: MessageSquare,
      color: 'bg-pink-50 text-pink-600 border-pink-200',
      action: () => console.log('Send message')
    }
  ];

  if (loading) {
    return (
      <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 hover:shadow-sm group ${
              action.primary 
                ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className={`text-sm font-medium ${
                  action.primary ? 'text-blue-900' : 'text-slate-900'
                }`}>
                  {action.title}
                </p>
                <p className={`text-xs ${
                  action.primary ? 'text-blue-600' : 'text-slate-500'
                }`}>
                  {action.description}
                </p>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${
              action.primary ? 'text-blue-600' : 'text-slate-400'
            }`} />
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
