// Document Entity Class for NWI Visas Immigration Services
export class Document {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.document_number = data.document_number || this.generateDocumentNumber();
    this.application_id = data.application_id || '';
    this.client_id = data.client_id || '';
    this.lead_id = data.lead_id || '';
    
    // Document Classification
    this.document_type = data.document_type || 'Other';
    this.document_category = data.document_category || 'Personal';
    this.document_subtype = data.document_subtype || '';
    this.is_mandatory = data.is_mandatory || true;
    this.priority_level = data.priority_level || 'Medium';
    
    // Status and Progress
    this.status = data.status || 'Required';
    this.review_status = data.review_status || 'Pending';
    this.approval_status = data.approval_status || 'Pending';
    this.quality_score = data.quality_score || null;
    
    // File Management
    this.file_url = data.file_url || '';
    this.file_name = data.file_name || '';
    this.file_size = data.file_size || null;
    this.file_type = data.file_type || '';
    this.file_hash = data.file_hash || '';
    this.version_number = data.version_number || 1;
    this.previous_versions = data.previous_versions || [];
    
    // Timeline Management
    this.date_requested = data.date_requested || null;
    this.date_received = data.date_received || null;
    this.date_reviewed = data.date_reviewed || null;
    this.date_approved = data.date_approved || null;
    this.deadline_date = data.deadline_date || null;
    this.reminder_date = data.reminder_date || null;
    
    // Assignment and Review
    this.requested_by = data.requested_by || '';
    this.reviewed_by = data.reviewed_by || '';
    this.approved_by = data.approved_by || '';
    this.assigned_reviewer = data.assigned_reviewer || '';
    
    // Document Details
    this.issuing_authority = data.issuing_authority || '';
    this.issue_date = data.issue_date || null;
    this.expiry_date = data.expiry_date || null;
    this.document_country = data.document_country || '';
    this.language = data.language || 'English';
    this.translation_required = data.translation_required || false;
    this.notarization_required = data.notarization_required || false;
    this.apostille_required = data.apostille_required || false;
    
    // Immigration Context
    this.client_name = data.client_name || '';
    this.case_number = data.case_number || '';
    this.visa_type = data.visa_type || '';
    this.target_country = data.target_country || '';
    this.immigration_stage = data.immigration_stage || '';
    
    // Communication and Notes
    this.notes = data.notes || '';
    this.internal_notes = data.internal_notes || '';
    this.client_instructions = data.client_instructions || '';
    this.rejection_reason = data.rejection_reason || '';
    this.correction_notes = data.correction_notes || '';
    
    // Compliance and Security
    this.confidentiality_level = data.confidentiality_level || 'Standard';
    this.retention_period = data.retention_period || '7 years';
    this.gdpr_compliant = data.gdpr_compliant || true;
    this.encryption_status = data.encryption_status || 'Encrypted';
    this.access_log = data.access_log || [];
    
    // Tracking and Analytics
    this.created_date = data.created_date || new Date().toISOString();
    this.updated_date = data.updated_date || new Date().toISOString();
    this.last_accessed_date = data.last_accessed_date || null;
    this.download_count = data.download_count || 0;
    this.tags = data.tags || [];
    this.custom_fields = data.custom_fields || {};
    
    // Workflow and Automation
    this.auto_requested = data.auto_requested || false;
    this.workflow_step = data.workflow_step || '';
    this.next_action = data.next_action || '';
    this.escalation_level = data.escalation_level || 0;
    
    // Validation and Quality
    this.validation_rules = data.validation_rules || [];
    this.quality_checks = data.quality_checks || [];
    this.ocr_extracted_text = data.ocr_extracted_text || '';
    this.ai_analysis_results = data.ai_analysis_results || {};
  }

  generateId() {
    return 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateDocumentNumber() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `DOC-${year}${month}${day}-${random}`;
  }

  // Static methods for CRUD operations
  static async create(documentData) {
    try {
      const document = new Document(documentData);
      document.updated_date = new Date().toISOString();
      
      // Set default deadline if not provided
      if (!document.deadline_date && document.date_requested) {
        const requestDate = new Date(document.date_requested);
        const deadlineDate = new Date(requestDate.getTime() + (14 * 24 * 60 * 60 * 1000)); // 14 days
        document.deadline_date = deadlineDate.toISOString().split('T')[0];
      }
      
      // Set reminder date
      if (document.deadline_date && !document.reminder_date) {
        const deadlineDate = new Date(document.deadline_date);
        const reminderDate = new Date(deadlineDate.getTime() - (3 * 24 * 60 * 60 * 1000)); // 3 days before
        document.reminder_date = reminderDate.toISOString();
      }
      
      // Simulate API call
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(document),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create document');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  static async getAll(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/documents?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      
      const data = await response.json();
      return data.map(docData => new Document(docData));
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Return mock data for development
      return Document.getMockData();
    }
  }

  static async getById(id) {
    try {
      const response = await fetch(`/api/documents/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }
      
      const data = await response.json();
      return new Document(data);
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }

  async update(updateData) {
    try {
      Object.assign(this, updateData);
      this.updated_date = new Date().toISOString();
      
      // Update status-specific dates
      if (updateData.status === 'Received' && !this.date_received) {
        this.date_received = new Date().toISOString().split('T')[0];
      }
      
      if (updateData.status === 'Approved' && !this.date_approved) {
        this.date_approved = new Date().toISOString().split('T')[0];
      }
      
      if (updateData.review_status === 'Completed' && !this.date_reviewed) {
        this.date_reviewed = new Date().toISOString().split('T')[0];
      }
      
      const response = await fetch(`/api/documents/${this.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update document');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  async delete() {
    try {
      const response = await fetch(`/api/documents/${this.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Business logic methods
  getStatusColor() {
    const statusColors = {
      'Required': 'red',
      'Requested': 'yellow',
      'Received': 'blue',
      'Under Review': 'orange',
      'Approved': 'green',
      'Needs Correction': 'red',
      'Rejected': 'red',
      'Expired': 'gray'
    };
    return statusColors[this.status] || 'gray';
  }

  getPriorityColor() {
    const priorityColors = {
      'Low': 'green',
      'Medium': 'yellow',
      'High': 'orange',
      'Urgent': 'red'
    };
    return priorityColors[this.priority_level] || 'gray';
  }

  isOverdue() {
    if (!this.deadline_date || this.status === 'Approved') return false;
    return new Date(this.deadline_date) < new Date();
  }

  isDueToday() {
    if (!this.deadline_date) return false;
    const today = new Date().toDateString();
    const dueDate = new Date(this.deadline_date).toDateString();
    return today === dueDate;
  }

  getDaysUntilDeadline() {
    if (!this.deadline_date) return null;
    const deadlineDate = new Date(this.deadline_date);
    const today = new Date();
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isExpired() {
    if (!this.expiry_date) return false;
    return new Date(this.expiry_date) < new Date();
  }

  getDaysUntilExpiry() {
    if (!this.expiry_date) return null;
    const expiryDate = new Date(this.expiry_date);
    const today = new Date();
    const diffTime = expiryDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getFormattedFileSize() {
    if (!this.file_size) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(this.file_size) / Math.log(1024));
    return Math.round(this.file_size / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  getFormattedDeadline() {
    if (!this.deadline_date) return 'No deadline';
    return new Date(this.deadline_date).toLocaleDateString();
  }

  getFormattedCreatedDate() {
    return new Date(this.created_date).toLocaleDateString();
  }

  getFormattedReceivedDate() {
    if (!this.date_received) return 'Not received';
    return new Date(this.date_received).toLocaleDateString();
  }

  addAccessLog(user, action) {
    const logEntry = {
      user: user,
      action: action,
      timestamp: new Date().toISOString(),
      ip_address: 'Unknown' // Would be populated by backend
    };
    this.access_log.push(logEntry);
    this.last_accessed_date = new Date().toISOString();
    
    if (action === 'download') {
      this.download_count++;
    }
  }

  createNewVersion(fileData) {
    // Archive current version
    if (this.file_url) {
      this.previous_versions.push({
        version: this.version_number,
        file_url: this.file_url,
        file_name: this.file_name,
        file_size: this.file_size,
        created_date: this.updated_date
      });
    }
    
    // Update to new version
    this.version_number++;
    this.file_url = fileData.url;
    this.file_name = fileData.name;
    this.file_size = fileData.size;
    this.file_type = fileData.type;
    this.file_hash = fileData.hash;
    this.updated_date = new Date().toISOString();
    
    // Reset review status for new version
    this.review_status = 'Pending';
    this.approval_status = 'Pending';
    this.date_reviewed = null;
    this.date_approved = null;
  }

  // Mock data for development
  static getMockData() {
    return [
      new Document({
        id: 'doc_1',
        document_number: 'DOC-20240115-0001',
        application_id: 'app_1',
        client_id: 'client_1',
        document_type: 'Passport',
        document_category: 'Personal',
        status: 'Approved',
        review_status: 'Completed',
        approval_status: 'Approved',
        is_mandatory: true,
        priority_level: 'High',
        file_url: '/documents/passport_michael_chen.pdf',
        file_name: 'passport_michael_chen.pdf',
        file_size: 2048576,
        file_type: 'application/pdf',
        date_requested: '2024-01-10',
        date_received: '2024-01-12',
        date_reviewed: '2024-01-13',
        date_approved: '2024-01-14',
        deadline_date: '2024-01-24',
        client_name: 'Michael Chen',
        case_number: 'NWI-202401-1001',
        visa_type: 'Express Entry',
        target_country: 'Canada',
        immigration_stage: 'Document Collection',
        issuing_authority: 'Department of Home Affairs',
        issue_date: '2019-03-15',
        expiry_date: '2029-03-15',
        document_country: 'South Africa',
        reviewed_by: 'Sarah Johnson',
        approved_by: 'Sarah Johnson',
        notes: 'Valid passport with sufficient validity period',
        created_date: '2024-01-10T09:00:00Z'
      }),
      new Document({
        id: 'doc_2',
        document_number: 'DOC-20240116-0002',
        application_id: 'app_1',
        client_id: 'client_1',
        document_type: 'IELTS Results',
        document_category: 'Language',
        status: 'Under Review',
        review_status: 'In Progress',
        approval_status: 'Pending',
        is_mandatory: true,
        priority_level: 'High',
        file_url: '/documents/ielts_michael_chen.pdf',
        file_name: 'ielts_michael_chen.pdf',
        file_size: 1024768,
        file_type: 'application/pdf',
        date_requested: '2024-01-12',
        date_received: '2024-01-16',
        deadline_date: '2024-01-26',
        client_name: 'Michael Chen',
        case_number: 'NWI-202401-1001',
        visa_type: 'Express Entry',
        target_country: 'Canada',
        immigration_stage: 'Document Collection',
        issuing_authority: 'British Council',
        issue_date: '2023-11-20',
        expiry_date: '2025-11-20',
        assigned_reviewer: 'Mike Chen',
        notes: 'IELTS Academic results - Overall band 7.5',
        created_date: '2024-01-12T14:30:00Z'
      }),
      new Document({
        id: 'doc_3',
        document_number: 'DOC-20240118-0003',
        application_id: 'app_2',
        client_id: 'client_2',
        document_type: 'Marriage Certificate',
        document_category: 'Personal',
        status: 'Required',
        review_status: 'Pending',
        approval_status: 'Pending',
        is_mandatory: true,
        priority_level: 'Medium',
        date_requested: '2024-01-18',
        deadline_date: '2024-02-01',
        client_name: 'Sarah Williams',
        case_number: 'NWI-202401-1002',
        visa_type: 'Family Sponsorship',
        target_country: 'Canada',
        immigration_stage: 'Document Collection',
        requested_by: 'Mike Chen',
        client_instructions: 'Please provide certified copy of marriage certificate',
        notes: 'Required for family sponsorship application',
        created_date: '2024-01-18T11:15:00Z'
      })
    ];
  }
}

// JSON Schema for validation
export const DocumentSchema = {
  "name": "Document",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique document identifier"
    },
    "document_number": {
      "type": "string",
      "description": "Human-readable document number"
    },
    "application_id": {
      "type": "string",
      "description": "Related application ID"
    },
    "client_id": {
      "type": "string",
      "description": "Related client ID"
    },
    "lead_id": {
      "type": "string",
      "description": "Related lead ID"
    },
    "document_type": {
      "type": "string",
      "enum": [
        "Passport",
        "Birth Certificate",
        "Marriage Certificate",
        "Divorce Certificate",
        "Death Certificate",
        "Education Certificates",
        "Transcripts",
        "Degree Certificates",
        "Professional Licenses",
        "Experience Letters",
        "Employment Contracts",
        "Salary Certificates",
        "IELTS Results",
        "TOEFL Results",
        "French Test Results",
        "Police Clearance",
        "Medical Exam",
        "Vaccination Records",
        "Bank Statements",
        "Tax Documents",
        "Income Tax Returns",
        "Property Documents",
        "Investment Certificates",
        "Reference Letters",
        "Character References",
        "Photos",
        "Passport Photos",
        "Family Photos",
        "CV/Resume",
        "Cover Letter",
        "Statement of Purpose",
        "Study Plan",
        "Research Proposal",
        "Sponsorship Letter",
        "Invitation Letter",
        "Travel Itinerary",
        "Insurance Documents",
        "Accommodation Proof",
        "Relationship Proof",
        "Communication Records",
        "Joint Documents",
        "Other"
      ],
      "description": "Type of document"
    },
    "document_category": {
      "type": "string",
      "enum": [
        "Personal",
        "Educational",
        "Professional",
        "Financial",
        "Medical",
        "Legal",
        "Language",
        "Travel",
        "Relationship",
        "Government",
        "Other"
      ],
      "description": "Document category"
    },
    "document_subtype": {
      "type": "string",
      "description": "Document subtype or specific variant"
    },
    "is_mandatory": {
      "type": "boolean",
      "default": true,
      "description": "Whether document is mandatory"
    },
    "priority_level": {
      "type": "string",
      "enum": [
        "Low",
        "Medium",
        "High",
        "Urgent"
      ],
      "default": "Medium",
      "description": "Document priority level"
    },
    "status": {
      "type": "string",
      "enum": [
        "Required",
        "Requested",
        "Received",
        "Under Review",
        "Approved",
        "Needs Correction",
        "Rejected",
        "Expired",
        "Not Applicable"
      ],
      "default": "Required",
      "description": "Document status"
    },
    "review_status": {
      "type": "string",
      "enum": [
        "Pending",
        "In Progress",
        "Completed",
        "On Hold"
      ],
      "default": "Pending",
      "description": "Review status"
    },
    "approval_status": {
      "type": "string",
      "enum": [
        "Pending",
        "Approved",
        "Rejected",
        "Conditional"
      ],
      "default": "Pending",
      "description": "Approval status"
    },
    "quality_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Document quality score"
    },
    "file_url": {
      "type": "string",
      "description": "File URL or path"
    },
    "file_name": {
      "type": "string",
      "description": "Original file name"
    },
    "file_size": {
      "type": "number",
      "minimum": 0,
      "description": "File size in bytes"
    },
    "file_type": {
      "type": "string",
      "description": "MIME type of file"
    },
    "file_hash": {
      "type": "string",
      "description": "File hash for integrity verification"
    },
    "version_number": {
      "type": "number",
      "minimum": 1,
      "default": 1,
      "description": "Document version number"
    },
    "previous_versions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "version": { "type": "number" },
          "file_url": { "type": "string" },
          "file_name": { "type": "string" },
          "file_size": { "type": "number" },
          "created_date": { "type": "string", "format": "date-time" }
        }
      },
      "description": "Previous document versions"
    },
    "date_requested": {
      "type": "string",
      "format": "date",
      "description": "Date document was requested"
    },
    "date_received": {
      "type": "string",
      "format": "date",
      "description": "Date document was received"
    },
    "date_reviewed": {
      "type": "string",
      "format": "date",
      "description": "Date document was reviewed"
    },
    "date_approved": {
      "type": "string",
      "format": "date",
      "description": "Date document was approved"
    },
    "deadline_date": {
      "type": "string",
      "format": "date",
      "description": "Document submission deadline"
    },
    "reminder_date": {
      "type": "string",
      "format": "date-time",
      "description": "Reminder date for follow-up"
    },
    "requested_by": {
      "type": "string",
      "description": "Who requested the document"
    },
    "reviewed_by": {
      "type": "string",
      "description": "Who reviewed the document"
    },
    "approved_by": {
      "type": "string",
      "description": "Who approved the document"
    },
    "assigned_reviewer": {
      "type": "string",
      "description": "Assigned reviewer"
    },
    "issuing_authority": {
      "type": "string",
      "description": "Authority that issued the document"
    },
    "issue_date": {
      "type": "string",
      "format": "date",
      "description": "Date document was issued"
    },
    "expiry_date": {
      "type": "string",
      "format": "date",
      "description": "Document expiry date"
    },
    "document_country": {
      "type": "string",
      "description": "Country where document was issued"
    },
    "language": {
      "type": "string",
      "default": "English",
      "description": "Document language"
    },
    "translation_required": {
      "type": "boolean",
      "default": false,
      "description": "Whether translation is required"
    },
    "notarization_required": {
      "type": "boolean",
      "default": false,
      "description": "Whether notarization is required"
    },
    "apostille_required": {
      "type": "boolean",
      "default": false,
      "description": "Whether apostille is required"
    },
    "client_name": {
      "type": "string",
      "description": "Client name for context"
    },
    "case_number": {
      "type": "string",
      "description": "Case number for context"
    },
    "visa_type": {
      "type": "string",
      "description": "Visa type for context"
    },
    "target_country": {
      "type": "string",
      "description": "Target country for context"
    },
    "immigration_stage": {
      "type": "string",
      "description": "Current immigration stage"
    },
    "notes": {
      "type": "string",
      "description": "Public document notes",
      "maxLength": 2000
    },
    "internal_notes": {
      "type": "string",
      "description": "Internal consultant notes",
      "maxLength": 2000
    },
    "client_instructions": {
      "type": "string",
      "description": "Instructions for client",
      "maxLength": 1000
    },
    "rejection_reason": {
      "type": "string",
      "description": "Reason for rejection",
      "maxLength": 1000
    },
    "correction_notes": {
      "type": "string",
      "description": "Notes for corrections needed",
      "maxLength": 1000
    },
    "confidentiality_level": {
      "type": "string",
      "enum": [
        "Public",
        "Standard",
        "Confidential",
        "Highly Confidential"
      ],
      "default": "Standard",
      "description": "Document confidentiality level"
    },
    "retention_period": {
      "type": "string",
      "default": "7 years",
      "description": "Document retention period"
    },
    "gdpr_compliant": {
      "type": "boolean",
      "default": true,
      "description": "GDPR compliance status"
    },
    "encryption_status": {
      "type": "string",
      "enum": [
        "Not Encrypted",
        "Encrypted",
        "Highly Encrypted"
      ],
      "default": "Encrypted",
      "description": "File encryption status"
    },
    "access_log": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "user": { "type": "string" },
          "action": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" },
          "ip_address": { "type": "string" }
        }
      },
      "description": "Document access log"
    },
    "created_date": {
      "type": "string",
      "format": "date-time",
      "description": "Document creation date"
    },
    "updated_date": {
      "type": "string",
      "format": "date-time",
      "description": "Last update date"
    },
    "last_accessed_date": {
      "type": "string",
      "format": "date-time",
      "description": "Last access date"
    },
    "download_count": {
      "type": "number",
      "minimum": 0,
      "default": 0,
      "description": "Number of downloads"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Document tags"
    },
    "custom_fields": {
      "type": "object",
      "description": "Custom field values"
    },
    "auto_requested": {
      "type": "boolean",
      "default": false,
      "description": "Whether document was auto-requested"
    },
    "workflow_step": {
      "type": "string",
      "description": "Current workflow step"
    },
    "next_action": {
      "type": "string",
      "description": "Next required action"
    },
    "escalation_level": {
      "type": "number",
      "minimum": 0,
      "default": 0,
      "description": "Escalation level"
    },
    "validation_rules": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "rule": { "type": "string" },
          "status": { "type": "string" },
          "message": { "type": "string" }
        }
      },
      "description": "Document validation rules"
    },
    "quality_checks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "check_name": { "type": "string" },
          "status": { "type": "string" },
          "score": { "type": "number" },
          "notes": { "type": "string" }
        }
      },
      "description": "Quality check results"
    },
    "ocr_extracted_text": {
      "type": "string",
      "description": "OCR extracted text content"
    },
    "ai_analysis_results": {
      "type": "object",
      "description": "AI analysis results"
    }
  },
  "required": [
    "application_id",
    "document_type"
  ],
  "additionalProperties": false
};
