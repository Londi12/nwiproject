import React, { useState } from 'react';
import { Task } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { format, addDays } from 'date-fns';
import {
  Calendar as CalendarIcon, Loader2, CheckSquare, User, Clock,
  AlertCircle, CheckCircle, FileText, Phone, Mail, Users, Briefcase
} from 'lucide-react';

export default function AddTaskDialog({ open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Follow-up',
    priority: 'Medium',
    due_date: null,
    assigned_to: '',
    client_name: '',
    case_number: '',
    estimated_hours: '',
    reminder_date: null
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
      if (!formData.title) {
        throw new Error('Task title is required');
      }

      await Task.create({
        ...formData,
        due_date: formData.due_date ? format(formData.due_date, 'yyyy-MM-dd') : null,
        reminder_date: formData.reminder_date ? format(formData.reminder_date, 'yyyy-MM-dd') : null,
        status: 'Pending',
        created_date: new Date().toISOString()
      });

      setSuccess(true);
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          type: 'Follow-up',
          priority: 'Medium',
          due_date: null,
          assigned_to: '',
          client_name: '',
          case_number: '',
          estimated_hours: '',
          reminder_date: null
        });
        setSuccess(false);
        onSuccess?.();
        onOpenChange(false);
      }, 1500);

    } catch (error) {
      console.error('Error creating task:', error);
      setError(error.message || 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  // Quick date presets
  const getQuickDate = (days) => {
    return addDays(new Date(), days);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            Add New Task
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
              ✅ Task created successfully! Redirecting...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Task Information
            </h3>
            <div>
              <Label htmlFor="title" className="flex items-center gap-1">
                <CheckSquare className="w-3 h-3" />
                Task Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Follow up on document submission"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Provide detailed task description, requirements, and any special instructions..."
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Task Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Follow-up">📞 Follow-up</SelectItem>
                    <SelectItem value="Document Request">📄 Document Request</SelectItem>
                    <SelectItem value="Call">☎️ Call</SelectItem>
                    <SelectItem value="CV Update">📝 CV Update</SelectItem>
                    <SelectItem value="Application Review">🔍 Application Review</SelectItem>
                    <SelectItem value="Payment Follow-up">💰 Payment Follow-up</SelectItem>
                    <SelectItem value="Meeting">🤝 Meeting</SelectItem>
                    <SelectItem value="Interview Prep">🎯 Interview Preparation</SelectItem>
                    <SelectItem value="Document Translation">🌐 Document Translation</SelectItem>
                    <SelectItem value="Medical Exam">🏥 Medical Examination</SelectItem>
                    <SelectItem value="Biometrics">👆 Biometrics Appointment</SelectItem>
                    <SelectItem value="Other">❓ Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">🟢 Low</SelectItem>
                    <SelectItem value="Medium">🟡 Medium</SelectItem>
                    <SelectItem value="High">🟠 High</SelectItem>
                    <SelectItem value="Urgent">🔴 Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Client & Case Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Client & Case Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_name" className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Client Name
                </Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => handleChange('client_name', e.target.value)}
                  placeholder="Enter client name"
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
          </div>

          {/* Assignment & Timeline Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Assignment & Timeline
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assigned_to">Assigned To</Label>
                <Select value={formData.assigned_to} onValueChange={(value) => handleChange('assigned_to', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
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
              <div>
                <Label htmlFor="estimated_hours" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Estimated Hours
                </Label>
                <Input
                  id="estimated_hours"
                  value={formData.estimated_hours}
                  onChange={(e) => handleChange('estimated_hours', e.target.value)}
                  placeholder="e.g., 2.5"
                  type="number"
                  step="0.5"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="due_date" className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  Due Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.due_date ? format(formData.due_date, 'PPP') : 'Select due date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 border-b">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleChange('due_date', new Date())}
                        >
                          Today
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleChange('due_date', getQuickDate(1))}
                        >
                          Tomorrow
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleChange('due_date', getQuickDate(7))}
                        >
                          Next Week
                        </Button>
                      </div>
                    </div>
                    <Calendar
                      mode="single"
                      selected={formData.due_date}
                      onSelect={(date) => handleChange('due_date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="reminder_date">Reminder Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.reminder_date ? format(formData.reminder_date, 'PPP') : 'Set reminder'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.reminder_date}
                      onSelect={(date) => handleChange('reminder_date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
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
              className="min-w-[120px]"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {success ? 'Created!' : loading ? 'Creating...' : 'Add Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
