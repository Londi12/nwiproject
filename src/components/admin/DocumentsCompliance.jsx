import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  AlertTriangle,
  Clock,
  Send,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function DocumentsCompliance({ loading }) {
  const [documentStats, setDocumentStats] = useState({
    totalMissing: 34,
    byType: {
      'Passport': 8,
      'Bank Statements': 6,
      'Medical Exam': 5,
      'Police Clearance': 4,
      'Education Certificates': 4,
      'IELTS Results': 3,
      'Employment Letters': 2,
      'Birth Certificate': 2
    },
    expiredDocs: 7,
    incompleteApps: 23
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Documents & Compliance Overview</h2>
        <p className="text-sm text-slate-600">Monitor document status and compliance across all applications</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Missing Documents</p>
                <p className="text-2xl font-bold text-red-600">{documentStats.totalMissing}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">Expired Documents</p>
                <p className="text-2xl font-bold text-orange-600">{documentStats.expiredDocs}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">Incomplete Apps</p>
                <p className="text-2xl font-bold text-yellow-600">{documentStats.incompleteApps}</p>
              </div>
              <FileText className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Compliance Rate</p>
                <p className="text-2xl font-bold text-blue-600">78%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Missing Documents by Type */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            Missing Documents by Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(documentStats.byType).map(([docType, count]) => (
              <div key={docType} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-900">{docType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={(count / documentStats.totalMissing) * 100} className="w-24 h-2" />
                  <Badge className="bg-red-100 text-red-800 text-xs">{count}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle>Compliance Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="justify-start h-auto p-4">
              <Send className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Send Bulk Reminders</div>
                <div className="text-sm opacity-80">Notify clients about missing documents</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <AlertTriangle className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Escalate Critical Cases</div>
                <div className="text-sm opacity-80">Flag urgent document requirements</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
