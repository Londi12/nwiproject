import React, { useState } from 'react';
import { Call } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Loader2, Phone, User, Calendar, Clock, MessageSquare,
  AlertCircle, CheckCircle, Video, Mail, MapPin, Briefcase
} from 'lucide-react';

export default function ScheduleCallDialog({ open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({
    client_name: '',
    client_contact: '',
    client_email: '',
    purpose: 'Initial Consultation',
    scheduled_date: '',
    scheduled_time: '',
    duration_minutes: '30',
    call_type: 'Video Call',
    consultant: '',
    notes: '',
    case_number: '',
    timezone: 'EST',
    reminder_minutes: '15'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.client_name || !formData.scheduled_date || !formData.scheduled_time) {
        throw new Error('Please fill in all required fields');
      }

      // Combine date and time
      const scheduledDateTime = `${formData.scheduled_date}T${formData.scheduled_time}:00`;

      await Call.create({
        ...formData,
        scheduled_date: scheduledDateTime,
        duration_minutes: parseInt(formData.duration_minutes),
        reminder_minutes: parseInt(formData.reminder_minutes),
        status: 'Scheduled',
        created_date: new Date().toISOString()
      });

      setSuccess(true);
      setTimeout(() => {
        setFormData({
          client_name: '',
          client_contact: '',
          client_email: '',
          purpose: 'Initial Consultation',
          scheduled_date: '',
          scheduled_time: '',
          duration_minutes: '30',
          call_type: 'Video Call',
          consultant: '',
          notes: '',
          case_number: '',
          timezone: 'EST',
          reminder_minutes: '15'
        });
        setSuccess(false);
        onSuccess?.();
        onOpenChange(false);
      }, 1500);

    } catch (error) {
      console.error('Error scheduling call:', error);
      setError(error.message || 'Failed to schedule call. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  // Set default date to today
  React.useEffect(() => {
    if (open && !formData.scheduled_date) {
      setFormData(prev => ({
        ...prev,
        scheduled_date: new Date().toISOString().split('T')[0]
      }));
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            Schedule New Call
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ Call scheduled successfully! Redirecting...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4" />
              Client Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_name" className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Client Name *
                </Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => handleChange('client_name', e.target.value)}
                  placeholder="Enter client's full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="case_number">Case Number</Label>
                <Input
                  id="case_number"
                  value={formData.case_number}
                  onChange={(e) => handleChange('case_number', e.target.value)}
                  placeholder="e.g., EE-2024-1234"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_contact" className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Phone Number *
                </Label>
                <Input
                  id="client_contact"
                  value={formData.client_contact}
                  onChange={(e) => handleChange('client_contact', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              <div>
                <Label htmlFor="client_email" className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email Address
                </Label>
                <Input
                  id="client_email"
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => handleChange('client_email', e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
            </div>
          </div>

          {/* Call Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Call Details
            </h3>
            <div>
              <Label htmlFor="purpose">Call Purpose *</Label>
              <Select value={formData.purpose} onValueChange={(value) => handleChange('purpose', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Initial Consultation">🎯 Initial Consultation</SelectItem>
                  <SelectItem value="Document Review">📄 Document Review</SelectItem>
                  <SelectItem value="Status Update">📊 Status Update</SelectItem>
                  <SelectItem value="Follow-up">📞 Follow-up</SelectItem>
                  <SelectItem value="Technical Discussion">🔧 Technical Discussion</SelectItem>
                  <SelectItem value="Payment Discussion">💰 Payment Discussion</SelectItem>
                  <SelectItem value="Interview Preparation">🎯 Interview Preparation</SelectItem>
                  <SelectItem value="Case Review">🔍 Case Review</SelectItem>
                  <SelectItem value="Final Consultation">✅ Final Consultation</SelectItem>
                  <SelectItem value="Other">❓ Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="call_type">Call Type</Label>
                <Select value={formData.call_type} onValueChange={(value) => handleChange('call_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Video Call">📹 Video Call</SelectItem>
                    <SelectItem value="Phone Call">📞 Phone Call</SelectItem>
                    <SelectItem value="In-Person">🤝 In-Person Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="consultant">Assigned Consultant</Label>
                <Select value={formData.consultant} onValueChange={(value) => handleChange('consultant', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select consultant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                    <SelectItem value="David Lee">David Lee</SelectItem>
                    <SelectItem value="Emma Davis">Emma Davis</SelectItem>
                    <SelectItem value="Alex Rodriguez">Alex Rodriguez</SelectItem>
                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Schedule & Settings Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule & Settings
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="scheduled_date" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Date *
                </Label>
                <Input
                  id="scheduled_date"
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => handleChange('scheduled_date', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="scheduled_time" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Time *
                </Label>
                <Input
                  id="scheduled_time"
                  type="time"
                  value={formData.scheduled_time}
                  onChange={(e) => handleChange('scheduled_time', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={formData.timezone} onValueChange={(value) => handleChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EST">EST (Eastern)</SelectItem>
                    <SelectItem value="CST">CST (Central)</SelectItem>
                    <SelectItem value="MST">MST (Mountain)</SelectItem>
                    <SelectItem value="PST">PST (Pacific)</SelectItem>
                    <SelectItem value="GMT">GMT (London)</SelectItem>
                    <SelectItem value="CET">CET (Europe)</SelectItem>
                    <SelectItem value="IST">IST (India)</SelectItem>
                    <SelectItem value="AEST">AEST (Australia)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration_minutes" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Duration
                </Label>
                <Select value={formData.duration_minutes} onValueChange={(value) => handleChange('duration_minutes', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">⚡ 15 minutes</SelectItem>
                    <SelectItem value="30">🕐 30 minutes</SelectItem>
                    <SelectItem value="45">🕑 45 minutes</SelectItem>
                    <SelectItem value="60">🕒 1 hour</SelectItem>
                    <SelectItem value="90">🕓 1.5 hours</SelectItem>
                    <SelectItem value="120">🕔 2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reminder_minutes">Reminder</Label>
                <Select value={formData.reminder_minutes} onValueChange={(value) => handleChange('reminder_minutes', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes before</SelectItem>
                    <SelectItem value="15">15 minutes before</SelectItem>
                    <SelectItem value="30">30 minutes before</SelectItem>
                    <SelectItem value="60">1 hour before</SelectItem>
                    <SelectItem value="1440">1 day before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Additional Information
            </h3>
            <div>
              <Label htmlFor="notes">Call Notes & Agenda</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Add agenda items, discussion points, documents to review, or any special requirements for this call..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || success}
              className="min-w-[140px]"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {success ? 'Scheduled!' : loading ? 'Scheduling...' : 'Schedule Call'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
