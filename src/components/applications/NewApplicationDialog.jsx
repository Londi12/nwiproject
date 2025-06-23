import React, { useState } from 'react';
import { Application } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2, User, Mail, Globe, FileText, Briefcase, Calendar,
  DollarSign, AlertCircle, CheckCircle, MapPin, Phone
} from 'lucide-react';

export default function NewApplicationDialog({ open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    country: '',
    visa_type: '',
    assigned_consultant: '',
    priority: 'Medium',
    estimated_fee: '',
    target_completion: '',
    notes: '',
    client_address: '',
    emergency_contact: ''
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
      if (!formData.client_name || !formData.client_email || !formData.country || !formData.visa_type) {
        throw new Error('Please fill in all required fields');
      }

      // Generate case number
      const caseNumber = `${formData.visa_type?.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

      await Application.create({
        ...formData,
        status: 'Draft',
        cv_status: 'Not Uploaded',
        completion_percentage: 10,
        case_number: caseNumber,
        created_date: new Date().toISOString(),
        target_completion_date: formData.target_completion ? new Date(formData.target_completion).toISOString() : null
      });

      setSuccess(true);
      setTimeout(() => {
        setFormData({
          client_name: '',
          client_email: '',
          client_phone: '',
          country: '',
          visa_type: '',
          assigned_consultant: '',
          priority: 'Medium',
          estimated_fee: '',
          target_completion: '',
          notes: '',
          client_address: '',
          emergency_contact: ''
        });
        setSuccess(false);
        onSuccess?.();
        onOpenChange(false);
      }, 1500);

    } catch (error) {
      console.error('Error creating application:', error);
      setError(error.message || 'Failed to create application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            New Immigration Application
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
              ✅ Application created successfully! Redirecting...
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
                  Full Name *
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
                <Label htmlFor="client_email" className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email Address *
                </Label>
                <Input
                  id="client_email"
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => handleChange('client_email', e.target.value)}
                  placeholder="client@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_phone" className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Phone Number
                </Label>
                <Input
                  id="client_phone"
                  value={formData.client_phone}
                  onChange={(e) => handleChange('client_phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact" className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Emergency Contact
                </Label>
                <Input
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) => handleChange('emergency_contact', e.target.value)}
                  placeholder="Emergency contact name & phone"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="client_address" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Current Address
              </Label>
              <Input
                id="client_address"
                value={formData.client_address}
                onChange={(e) => handleChange('client_address', e.target.value)}
                placeholder="Current residential address"
              />
            </div>
          </div>

          {/* Immigration Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Immigration Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Destination Country *</Label>
                <Select value={formData.country} onValueChange={(value) => handleChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                    <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                    <SelectItem value="United Kingdom">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="New Zealand">🇳🇿 New Zealand</SelectItem>
                    <SelectItem value="United States">🇺🇸 United States</SelectItem>
                    <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                    <SelectItem value="Other">🌍 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="visa_type">Visa/Immigration Program *</Label>
                <Select value={formData.visa_type} onValueChange={(value) => handleChange('visa_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select immigration program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Express Entry">🇨🇦 Express Entry</SelectItem>
                    <SelectItem value="Provincial Nominee Program">🇨🇦 Provincial Nominee Program</SelectItem>
                    <SelectItem value="Family Sponsorship">👨‍👩‍👧‍👦 Family Sponsorship</SelectItem>
                    <SelectItem value="Study Permit">🎓 Study Permit</SelectItem>
                    <SelectItem value="Work Permit">💼 Work Permit</SelectItem>
                    <SelectItem value="Tourist Visa">✈️ Tourist Visa</SelectItem>
                    <SelectItem value="Business Visa">🏢 Business Visa</SelectItem>
                    <SelectItem value="Skilled Worker">⚡ Skilled Worker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Case Management Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Case Management
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="assigned_consultant">Assigned Consultant</Label>
                <Select value={formData.assigned_consultant} onValueChange={(value) => handleChange('assigned_consultant', value)}>
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
              <div>
                <Label htmlFor="estimated_fee" className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Estimated Fee
                </Label>
                <Input
                  id="estimated_fee"
                  value={formData.estimated_fee}
                  onChange={(e) => handleChange('estimated_fee', e.target.value)}
                  placeholder="e.g., $3,500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="target_completion" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Target Completion Date
              </Label>
              <Input
                id="target_completion"
                type="date"
                value={formData.target_completion}
                onChange={(e) => handleChange('target_completion', e.target.value)}
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Additional Information</h3>
            <div>
              <Label htmlFor="notes">Case Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant notes about the client's case, special requirements, timeline concerns, etc..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
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
              {success ? 'Created!' : loading ? 'Creating...' : 'Create Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
