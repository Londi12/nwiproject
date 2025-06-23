import React, { useState } from 'react';
import { Document } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, Download, Eye, CheckCircle, XCircle, Clock, 
  AlertTriangle, User, Calendar, FileIcon, MessageSquare 
} from 'lucide-react';
import { format } from 'date-fns';

export default function DocumentDetailsDialog({ document, open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [newStatus, setNewStatus] = useState(document?.status || '');

  if (!document) return null;

  const getStatusIcon = (status) => {
    const icons = {
      'Required': <Clock className="w-4 h-4 text-orange-500" />,
      'Requested': <AlertTriangle className="w-4 h-4 text-yellow-500" />,
      'Received': <FileText className="w-4 h-4 text-blue-500" />,
      'Under Review': <Eye className="w-4 h-4 text-purple-500" />,
      'Approved': <CheckCircle className="w-4 h-4 text-green-500" />,
      'Needs Correction': <XCircle className="w-4 h-4 text-red-500" />,
      'Verified': <CheckCircle className="w-4 h-4 text-green-600" />
    };
    return icons[status] || <FileIcon className="w-4 h-4 text-gray-500" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Required': 'bg-orange-100 text-orange-800 border-orange-200',
      'Requested': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Received': 'bg-blue-100 text-blue-800 border-blue-200',
      'Under Review': 'bg-purple-100 text-purple-800 border-purple-200',
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Needs Correction': 'bg-slate-100 text-slate-800 border-slate-200',
      'Verified': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleDownload = () => {
    // Create a mock file download
    const element = document.createElement('a');
    const file = new Blob([`Mock content for ${document.document_type} - ${document.client_name}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${document.document_type.replace(/ /g, '_')}_${document.client_name.replace(/ /g, '_')}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === document.status) return;
    
    setLoading(true);
    try {
      await Document.update(document.id, { 
        status: newStatus,
        review_notes: reviewNotes,
        reviewed_date: new Date().toISOString()
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating document status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // In a real implementation, this would open a document viewer
    alert(`Opening preview for ${document.document_type}...\n\nThis would typically open a PDF viewer or image preview.`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Document Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Header */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg text-slate-900">{document.document_type}</h3>
                <p className="text-sm text-slate-600">Application ID: {document.application_id}</p>
              </div>
              <Badge className={`${getStatusColor(document.status)} border`}>
                {getStatusIcon(document.status)}
                <span className="ml-1">{document.status}</span>
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <span className="font-medium">Client:</span>
                <span>{document.client_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="font-medium">Requested:</span>
                <span>{document.date_requested}</span>
              </div>
              {document.date_received && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">Received:</span>
                  <span>{document.date_received}</span>
                </div>
              )}
              {document.file_size && (
                <div className="flex items-center gap-2">
                  <FileIcon className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">Size:</span>
                  <span>{document.file_size}</span>
                </div>
              )}
            </div>
          </div>

          {/* Document Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePreview} className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              Preview Document
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          {/* Status Update Section */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Review & Status Update
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Update Status
                </label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Received">Received</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Needs Correction">Needs Correction</SelectItem>
                    <SelectItem value="Verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Review Notes
                </label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about the document review..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Previous Review History */}
          {document.review_notes && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-slate-900 mb-2">Previous Review Notes</h4>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm text-slate-700">{document.review_notes}</p>
                {document.reviewed_date && (
                  <p className="text-xs text-slate-500 mt-2">
                    Reviewed on {format(new Date(document.reviewed_date), 'MMM d, yyyy')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {newStatus && newStatus !== document.status && (
              <Button 
                onClick={handleStatusUpdate} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Updating...' : 'Update Status'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
