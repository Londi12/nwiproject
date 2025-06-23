import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock
} from "lucide-react";

export default function CVToolsUsage({ loading }) {
  const cvStats = {
    totalClients: 247,
    cvsUploaded: 156,
    cvsOutdated: 23,
    associatesNotUsing: 2,
    uploadTrend: '+15%',
    avgProcessingTime: '2.3 min'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">CV Tools Usage</h2>
        <p className="text-sm text-slate-600">Monitor CV upload activity and tool adoption</p>
      </div>

      {/* CV Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">CVs Uploaded</p>
                <p className="text-2xl font-bold text-green-600">{cvStats.cvsUploaded}</p>
                <p className="text-xs text-green-600">{cvStats.uploadTrend} this month</p>
              </div>
              <Upload className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">Clients Without CVs</p>
                <p className="text-2xl font-bold text-orange-600">{cvStats.totalClients - cvStats.cvsUploaded}</p>
                <p className="text-xs text-orange-600">Need follow-up</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Outdated CVs</p>
                <p className="text-2xl font-bold text-red-600">{cvStats.cvsOutdated}</p>
                <p className="text-xs text-red-600">Need updates</p>
              </div>
              <Clock className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            CV Tools Adoption
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall CV Coverage</span>
                <span className="text-sm text-slate-600">{Math.round((cvStats.cvsUploaded / cvStats.totalClients) * 100)}%</span>
              </div>
              <Progress value={(cvStats.cvsUploaded / cvStats.totalClients) * 100} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Associate Tool Usage</span>
                <span className="text-sm text-slate-600">80%</span>
              </div>
              <Progress value={80} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
