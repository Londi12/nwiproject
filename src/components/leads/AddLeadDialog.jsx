import React, { useState } from 'react';
import { Lead } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Mail, Phone, MapPin, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';

export default function AddLeadDialog({ open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    status: 'New',
    notes: '',
    interest_area: '',
    assigned_to: '',
    country: '',
    budget: ''
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
      if (!formData.name || !formData.source) {
        throw new Error('Name and Source are required fields');
      }

      await Lead.create({
        ...formData,
        last_contacted: formData.status === 'Contacted' ? new Date().toISOString().split('T')[0] : null,
        created_date: new Date().toISOString()
      });

      setSuccess(true);
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          source: '',
          status: 'New',
          notes: '',
          interest_area: '',
          assigned_to: '',
          country: '',
          budget: ''
        });
        setSuccess(false);
        onSuccess?.();
        onOpenChange(false);
      }, 1500);

    } catch (error) {
      console.error('Error creating lead:', error);
      setError(error.message || 'Failed to create lead. Please try again.');
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Add New Lead
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
              ✅ Lead created successfully! Redirecting...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="country" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Current Country
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  placeholder="e.g., India, Philippines, Nigeria"
                />
              </div>
            </div>
          </div>

          {/* Immigration Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Immigration Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interest_area">Area of Interest *</Label>
                <Select value={formData.interest_area} onValueChange={(value) => handleChange('interest_area', value)}>
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
                    <SelectItem value="Other">❓ Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Select value={formData.budget} onValueChange={(value) => handleChange('budget', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under $2,000">Under $2,000</SelectItem>
                    <SelectItem value="$2,000 - $5,000">$2,000 - $5,000</SelectItem>
                    <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="$10,000+">$10,000+</SelectItem>
                    <SelectItem value="Not specified">Not specified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Lead Management Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Lead Management</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="source">Lead Source *</Label>
                <Select value={formData.source} onValueChange={(value) => handleChange('source', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">🌐 Website</SelectItem>
                    <SelectItem value="Facebook">📘 Facebook</SelectItem>
                    <SelectItem value="WhatsApp">💬 WhatsApp</SelectItem>
                    <SelectItem value="Referral">👥 Referral</SelectItem>
                    <SelectItem value="LinkedIn">💼 LinkedIn</SelectItem>
                    <SelectItem value="Instagram">📸 Instagram</SelectItem>
                    <SelectItem value="Walk-in">🚶 Walk-in</SelectItem>
                    <SelectItem value="Email">📧 Email</SelectItem>
                    <SelectItem value="Google Ads">🎯 Google Ads</SelectItem>
                    <SelectItem value="YouTube">📺 YouTube</SelectItem>
                    <SelectItem value="Other">❓ Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assigned_to">Assigned Consultant</Label>
                <Select value={formData.assigned_to} onValueChange={(value) => handleChange('assigned_to', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select consultant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Smith">John Smith</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Michael Brown">Michael Brown</SelectItem>
                    <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                    <SelectItem value="David Wilson">David Wilson</SelectItem>
                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="status">Initial Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">🆕 New</SelectItem>
                  <SelectItem value="Contacted">📞 Contacted</SelectItem>
                  <SelectItem value="Needs Follow-Up">⏰ Needs Follow-Up</SelectItem>
                  <SelectItem value="Qualified">✅ Qualified</SelectItem>
                  <SelectItem value="Converted">🎉 Converted</SelectItem>
                  <SelectItem value="Lost">❌ Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Additional Information</h3>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant notes about this lead's immigration goals, timeline, concerns, etc..."
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
              className="min-w-[120px]"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {success ? 'Created!' : loading ? 'Creating...' : 'Add Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
