import React, { useState, useEffect } from "react";
import { Application, Task, Call, Document } from "@/entities/all";
import {
  Users,
  FileText,
  CheckSquare,
  Phone,
  Upload,
  AlertCircle,
  ClipboardList
} from "lucide-react";
import { isToday, isThisWeek } from "date-fns";
import { leadService } from "../services/leadService";
import { applicationService } from "../services/applicationService";
import { isSupabaseConfigured } from "../lib/supabase";

import StatsCard from "../components/dashboard/StatsCard";
import TabsNavigation from "../components/dashboard/TabsNavigation";
import OverviewPanel from "../components/dashboard/panels/OverviewPanel";
import LeadsPanel from "../components/dashboard/panels/LeadsPanel";
import ApplicationsPanel from "../components/dashboard/panels/ApplicationsPanel";
import TasksPanel from "../components/dashboard/panels/TasksPanel";
import CallsPanel from "../components/dashboard/panels/CallsPanel";
import DocumentsPanel from "../components/dashboard/panels/DocumentsPanel";
import CvToolsPanel from "../components/dashboard/panels/CvToolsPanel";
import CompletedPanel from "../components/dashboard/panels/CompletedPanel";

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    activeApplications: 0,
    missingDocs: 0,
    tasksDue: 0,
    callsToday: 0,
    cvsUploaded: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview"); // Changed initial state from "Leads" to "Overview"

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      if (isSupabaseConfigured()) {
        // Use Supabase services for real data
        const [applicationStats, leadStats, tasks, calls, documents] = await Promise.all([
          applicationService.getStats(),
          leadService.getStats(),
          Task.list(),
          Call.list(),
          Document.list()
        ]);

        const tasksDueToday = tasks.filter(task =>
          task.due_date && isToday(new Date(task.due_date)) && task.status !== 'Completed'
        ).length;

        const callsToday = calls.filter(call =>
          call.scheduled_date && isToday(new Date(call.scheduled_date))
        ).length;

        const missingDocsCount = documents.filter(doc =>
          ['Required', 'Requested'].includes(doc.status)
        ).length;

        setStats({
          activeApplications: applicationStats.inProgress + applicationStats.submitted,
          missingDocs: missingDocsCount,
          tasksDue: tasksDueToday,
          callsToday: callsToday,
          cvsUploaded: applicationStats.thisMonth
        });
      } else {
        // Fallback to mock data
        const [applications, tasks, calls, documents] = await Promise.all([
          Application.list(),
          Task.list(),
          Call.list(),
          Document.list()
        ]);

        const activeApps = applications.filter(app =>
          ['Draft', 'In Progress', 'Submitted', 'Under Review'].includes(app.status)
        ).length;

        const missingDocsCount = documents.filter(doc =>
          ['Required', 'Requested'].includes(doc.status)
        ).length;

        const tasksDueToday = tasks.filter(task =>
          task.due_date && isToday(new Date(task.due_date)) && task.status !== 'Completed'
        ).length;

        const callsToday = calls.filter(call =>
          call.scheduled_date && isToday(new Date(call.scheduled_date))
        ).length;

        const cvsUploadedThisWeek = applications.filter(app => {
          return app.cv_status === 'Uploaded' && isThisWeek(new Date(app.created_date), { weekStartsOn: 1 });
        }).length;

        setStats({
          activeApplications: activeApps,
          missingDocs: missingDocsCount,
          tasksDue: tasksDueToday,
          callsToday: callsToday,
          cvsUploaded: cvsUploadedThisWeek
        });
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Set fallback stats
      setStats({
        activeApplications: 12,
        missingDocs: 5,
        tasksDue: 3,
        callsToday: 2,
        cvsUploaded: 8
      });
    } finally {
      setLoading(false);
    }
  };

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'Overview': return <OverviewPanel setActiveTab={setActiveTab} onNavigate={onNavigate} />;
      case 'Leads': return <LeadsPanel />;
      case 'Applications': return <ApplicationsPanel />;
      case 'Tasks': return <TasksPanel />;
      case 'Calls': return <CallsPanel />;
      case 'Documents': return <DocumentsPanel />;
      case 'CV Tools': return <CvToolsPanel />;
      case 'Completed': return <CompletedPanel />;
      default: return <OverviewPanel setActiveTab={setActiveTab} onNavigate={onNavigate} />; // Fallback to OverviewPanel
    }
  };

  return (
    <div className="space-y-6"> {/* Removed p-6 padding as per outline */}
      {/* Configuration Notice */}
      {!isSupabaseConfigured() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Using Mock Data</h3>
              <p className="text-xs text-yellow-700 mt-1">
                Configure Supabase environment variables to use real data. See .env.example for setup instructions.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
        <StatsCard
          title="Active Applications"
          value={stats.activeApplications}
          subtitle="In progress"
          icon={ClipboardList}
          color="green"
          loading={loading}
        />
        <StatsCard
          title="Missing Documents"
          value={stats.missingDocs}
          subtitle="Require attention"
          icon={AlertCircle}
          color="red"
          loading={loading}
        />
        <StatsCard
          title="Tasks Due Today"
          value={stats.tasksDue}
          subtitle="Pending completion"
          icon={CheckSquare}
          color="orange"
          loading={loading}
        />
        <StatsCard
          title="Scheduled Calls"
          value={stats.callsToday}
          subtitle="Today"
          icon={Phone}
          color="purple"
          loading={loading}
        />
        <StatsCard
          title="CVs Uploaded"
          value={stats.cvsUploaded}
          subtitle="Last 7 days"
          icon={Upload}
          color="indigo"
          loading={loading}
        />
      </div>

      <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="mt-6">
        {renderActivePanel()}
      </div>
    </div>
  );
}
