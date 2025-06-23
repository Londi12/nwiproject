import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task, Application, Call, Lead } from "@/entities/all";
import { formatDistanceToNow } from "date-fns";
import { FileText, Phone, Users, CheckSquare, Clock } from "lucide-react";

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      const [recentTasks, recentApplications, recentCalls, recentLeads] = await Promise.all([
        Task.list('-created_date', 5),
        Application.list('-created_date', 5),
        Call.list('-created_date', 5),
        Lead.list('-created_date', 5)
      ]);

      const allActivities = [
        ...recentTasks.map(task => ({
          type: 'task',
          title: task.title,
          subtitle: `Task: ${task.type}`,
          time: task.created_date,
          icon: CheckSquare,
          color: 'orange'
        })),
        ...recentApplications.map(app => ({
          type: 'application',
          title: app.client_name,
          subtitle: `New ${app.visa_type} application`,
          time: app.created_date,
          icon: FileText,
          color: 'blue'
        })),
        ...recentCalls.map(call => ({
          type: 'call',
          title: call.client_name,
          subtitle: call.purpose,
          time: call.created_date,
          icon: Phone,
          color: 'green'
        })),
        ...recentLeads.map(lead => ({
          type: 'lead',
          title: lead.name,
          subtitle: `New lead from ${lead.source}`,
          time: lead.created_date,
          icon: Users,
          color: 'purple'
        }))
      ];

      const sortedActivities = allActivities
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 8);

      setActivities(sortedActivities);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-emerald-50 text-emerald-600',
      orange: 'bg-orange-50 text-orange-600',
      purple: 'bg-purple-50 text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <Card className="border-0 shadow-sm rounded-2xl bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-slate-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`p-2 rounded-full ${getColorClasses(activity.color)}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {activity.subtitle}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600 shrink-0">
                  {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
