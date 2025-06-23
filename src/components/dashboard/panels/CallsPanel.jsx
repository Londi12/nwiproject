import React, { useState, useEffect } from "react";
import { Call } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Phone, Calendar, Clock, Video } from "lucide-react";
import { format, isToday, parseISO } from "date-fns";
import ScheduleCallDialog from "../../calls/ScheduleCallDialog";

export default function CallsPanel() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleCallDialog, setShowScheduleCallDialog] = useState(false);

  useEffect(() => {
    loadCalls();
  }, []);

  const loadCalls = async () => {
    setLoading(true);
    try {
      const data = await Call.list('-scheduled_date');
      setCalls(data);
    } catch (error) {
      console.error('Error loading calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-slate-100 text-slate-800',
      'rescheduled': 'bg-orange-100 text-orange-800',
      'no_show': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCallTypeIcon = (callType) => {
    switch (callType) {
      case 'Video Call':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'Phone Call':
        return <Phone className="w-5 h-5 text-green-600" />;
      case 'In-Person':
        return <Calendar className="w-5 h-5 text-purple-600" />;
      default:
        return <Phone className="w-5 h-5 text-blue-600" />;
    }
  };

  const todayCalls = calls.filter(call =>
    call.scheduled_date && isToday(parseISO(call.scheduled_date)) && call.status === 'Scheduled'
  );

  const upcomingCalls = calls.filter(call =>
    call.scheduled_date && !isToday(parseISO(call.scheduled_date)) && call.status === 'Scheduled'
  );

  const handleJoinCall = (call) => {
    if (call.call_type === 'Video Call') {
      alert(`Joining video call with ${call.client_name}\nMeeting ID: ${call.id}\nPurpose: ${call.purpose}`);
    } else if (call.call_type === 'Phone Call') {
      alert(`Calling ${call.client_name}\nContact: ${call.client_contact}\nPurpose: ${call.purpose}`);
    } else {
      alert(`In-person meeting with ${call.client_name}\nPurpose: ${call.purpose}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="w-5 h-5 text-green-600" />
              Today's Calls ({todayCalls.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-slate-200 rounded animate-pulse" />
              ))
            ) : todayCalls.length > 0 ? (
              todayCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-3">
                    {getCallTypeIcon(call.call_type)}
                    <div>
                      <p className="font-semibold text-slate-900">{call.client_name}</p>
                      <p className="text-sm text-slate-600">{call.purpose}</p>
                      <p className="text-xs text-slate-500">{call.client_contact}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-700">
                      {format(parseISO(call.scheduled_date), 'h:mm a')}
                    </p>
                    <Button
                      size="sm"
                      className="mt-1 bg-slate-900 hover:bg-slate-800"
                      onClick={() => handleJoinCall(call)}
                    >
                      {call.call_type === 'Video Call' ? 'Join Call' : call.call_type === 'Phone Call' ? 'Call Now' : 'Meeting'}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">No calls scheduled for today</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
              Upcoming Calls ({upcomingCalls.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-16 bg-slate-200 rounded animate-pulse" />
              ))
            ) : upcomingCalls.slice(0, 4).map((call) => (
              <div key={call.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getCallTypeIcon(call.call_type)}
                  <div>
                    <p className="font-semibold text-slate-900">{call.client_name}</p>
                    <p className="text-sm text-slate-600">{call.purpose}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">
                    {format(parseISO(call.scheduled_date), 'MMM d')}
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {format(parseISO(call.scheduled_date), 'h:mm a')}
                  </p>
                </div>
              </div>
            ))}
            {upcomingCalls.length === 0 && !loading && (
              <p className="text-slate-500 text-center py-4">No upcoming calls scheduled</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm rounded-2xl bg-white">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle>Schedule New Call</CardTitle>
            <Button
              onClick={() => setShowScheduleCallDialog(true)}
              className="bg-slate-900 hover:bg-slate-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Call
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-0 shadow-sm rounded-2xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle>All Scheduled Calls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 rounded animate-pulse" />
            ))
          ) : calls.map((call) => (
            <div key={call.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {getCallTypeIcon(call.call_type)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{call.client_name}</p>
                  <p className="text-sm text-slate-600">{call.purpose}</p>
                  <p className="text-xs text-slate-500">
                    {format(parseISO(call.scheduled_date), 'MMM d, yyyy • h:mm a')} • {call.duration_minutes} min
                  </p>
                  <p className="text-xs text-slate-500">{call.notes}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className={getStatusColor(call.status.toLowerCase())}>
                  {call.status}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleJoinCall(call)}
                    disabled={call.status !== 'Scheduled'}
                  >
                    {call.call_type === 'Video Call' ? 'Join' : call.call_type === 'Phone Call' ? 'Call' : 'Meet'}
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <ScheduleCallDialog
        open={showScheduleCallDialog}
        onOpenChange={setShowScheduleCallDialog}
        onSuccess={loadCalls}
      />
    </div>
  );
}
