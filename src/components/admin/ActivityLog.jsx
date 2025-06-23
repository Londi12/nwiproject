import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Upload,
  FileText,
  CheckCircle,
  UserPlus,
  LogIn,
  Clock
} from "lucide-react";

export default function ActivityLog({ loading }) {
  const [activities, setActivities] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadActivityLog();
  }, []);

  const loadActivityLog = async () => {
    setLoadingData(true);
    try {
      // Mock activity data
      const mockActivities = [
        {
          id: 1,
          type: 'document_upload',
          user: 'Sarah Johnson',
          action: 'Uploaded passport for Michael Chen',
          timestamp: '2024-01-23T10:30:00Z',
          details: 'Application: NWI-202401-1001'
        },
        {
          id: 2,
          type: 'application_status',
          user: 'Mike Chen',
          action: 'Changed application status to Submitted',
          timestamp: '2024-01-23T10:15:00Z',
          details: 'Client: Sarah Williams'
        },
        {
          id: 3,
          type: 'cv_update',
          user: 'David Lee',
          action: 'Updated CV for John Smith',
          timestamp: '2024-01-23T09:45:00Z',
          details: 'CV analysis completed'
        },
        {
          id: 4,
          type: 'task_completion',
          user: 'Emma Davis',
          action: 'Completed document review task',
          timestamp: '2024-01-23T09:30:00Z',
          details: 'Task: Review education certificates'
        },
        {
          id: 5,
          type: 'lead_conversion',
          user: 'Alex Rodriguez',
          action: 'Converted lead to client',
          timestamp: '2024-01-23T09:00:00Z',
          details: 'Lead: Maria Garcia'
        },
        {
          id: 6,
          type: 'user_login',
          user: 'Sarah Johnson',
          action: 'Logged into system',
          timestamp: '2024-01-23T08:30:00Z',
          details: 'IP: 192.168.1.100'
        }
      ];
      
      setActivities(mockActivities);
    } catch (error) {
      console.error('Error loading activity log:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      'document_upload': Upload,
      'application_status': FileText,
      'cv_update': FileText,
      'task_completion': CheckCircle,
      'lead_conversion': UserPlus,
      'user_login': LogIn
    };
    return icons[type] || Activity;
  };

  const getActivityColor = (type) => {
    const colors = {
      'document_upload': 'text-blue-600',
      'application_status': 'text-green-600',
      'cv_update': 'text-purple-600',
      'task_completion': 'text-emerald-600',
      'lead_conversion': 'text-orange-600',
      'user_login': 'text-slate-600'
    };
    return colors[type] || 'text-slate-600';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

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
      <div>
        <h2 className="text-xl font-semibold text-slate-900">System Activity Log</h2>
        <p className="text-sm text-slate-600">Real-time system activity and user actions</p>
      </div>

      {/* Activity Feed */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors">
                  <div className={`w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-slate-900">{activity.action}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(activity.timestamp)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Badge variant="outline" className="text-xs">{activity.user}</Badge>
                      <span>{activity.details}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
