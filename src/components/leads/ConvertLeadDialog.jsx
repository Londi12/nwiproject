import React, { useState } from 'react';
import { Lead, Application } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { 
  UserPlus, CheckCircle, AlertCircle, Loader2, 
  User, Mail, Phone, MapPin, Briefcase, FileText 
} from 'lucide-react';

const VISA_TYPES = [
  'Express Entry',
  'Provincial Nominee',
  'Family Sponsorship',
  'Student Visa',
  'Work Permit',
  'Visitor Visa',
  'Business Immigration'
];

const TARGET_COUNTRIES = [
  'Canada',
  'USA',
  'UK',
  'Australia',
  'New Zealand',
  'Germany'
];

export default function ConvertLeadDialog({ lead, open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({
    client_name: lead?.name || '',
    client_email: lead?.email || '',
    client_phone: lead?.phone || '',
    client_location: lead?.location || '',
    visa_type: lead?.interest_area || 'Express Entry',
    target_country: 'Canada',
    priority: 'Medium',
    consultant: '',
    notes: lead?.notes || '',
    retainer_fee: '',
    contract_signed: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!lead) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.client_name || !formData.client_email || !formData.visa_type) {
        throw new Error('Please fill in all required fields');
      }

      // Generate case number
      const caseNumber = `NWI-${Date.now().toString().slice(-6)}`;

      // Create new application
      await Application.create({
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        client_location: formData.client_location,
        visa_type: formData.visa_type,
        target_country: formData.target_country,
        case_number: caseNumber,
        status: 'Draft',
        priority: formData.priority,
        consultant: formData.consultant,
        notes: formData.notes,
        retainer_fee: formData.retainer_fee,
        contract_signed: formData.contract_signed,
        completion_percentage: 5, // Initial setup
        created_date: new Date().toISOString(),
        lead_source: lead.source,
        converted_from_lead: lead.id
      });

      // Update lead status to converted
      await Lead.update(lead.id, {
        status: 'Converted',
        converted_date: new Date().toISOString(),
        application_case_number: caseNumber
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
      }, 2000);

    } catch (error) {
      console.error('Error converting lead:', error);
      setError(error.message || 'Failed to convert lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-600" />
            Convert Lead to Client
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
              ✅ Lead successfully converted to client! Creating application...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lead Information Summary */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">Converting Lead: {lead.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Source:</span> {lead.source}
              </div>
              <div>
                <span className="text-blue-700">Created:</span> {new Date(lead.created_date).toLocaleDateString()}
              </div>
              <div>
                <span className="text-blue-700">Status:</span> {lead.status}
              </div>
              <div>
                <span className="text-blue-700">Interest:</span> {lead.interest_area || 'Not specified'}
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div>
            <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Client Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Full Name *</Label>
                <Input
                  value={formData.client_name}
                  onChange={(e) => handleChange('client_name', e.target.value)}
                  placeholder="Client full name"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Email Address *</Label>
                <Input
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => handleChange('client_email', e.target.value)}
                  placeholder="client@email.com"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Phone Number</Label>
                <Input
                  value={formData.client_phone}
                  onChange={(e) => handleChange('client_phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <Input
                  value={formData.client_location}
                  onChange={(e) => handleChange('client_location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div>
            <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Application Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Visa Type *</Label>
                <Select value={formData.visa_type} onValueChange={(value) => handleChange('visa_type', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visa type" />
                  </SelectTrigger>
                  <SelectContent>
                    {VISA_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Target Country</Label>
                <Select value={formData.target_country} onValueChange={(value) => handleChange('target_country', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TARGET_COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="Low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Assigned Consultant</Label>
                <Input
                  value={formData.consultant}
                  onChange={(e) => handleChange('consultant', e.target.value)}
                  placeholder="Consultant name"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Service Agreement
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Retainer Fee</Label>
                <Input
                  value={formData.retainer_fee}
                  onChange={(e) => handleChange('retainer_fee', e.target.value)}
                  placeholder="$0.00"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="contract-signed"
                  checked={formData.contract_signed}
                  onChange={(e) => handleChange('contract_signed', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="contract-signed" className="text-sm">
                  Service contract signed
                </Label>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-sm font-medium">Additional Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any additional information about the client or application..."
              rows={3}
            />
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
              className="min-w-[160px] bg-green-600 hover:bg-green-700"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {success ? 'Converted!' : loading ? 'Converting...' : 'Convert to Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
