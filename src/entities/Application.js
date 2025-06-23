// Application Entity Class for NWI Visas Immigration Services
export class Application {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.application_number = data.application_number || this.generateApplicationNumber();
    this.client_name = data.client_name || '';
    this.client_email = data.client_email || '';
    this.client_phone = data.client_phone || '';
    this.client_id = data.client_id || '';
    this.lead_id = data.lead_id || '';
    
    // Immigration Details
    this.country = data.country || 'Canada';
    this.visa_type = data.visa_type || 'Express Entry';
    this.visa_subtype = data.visa_subtype || '';
    this.processing_office = data.processing_office || '';
    this.application_stream = data.application_stream || '';
    
    // Status and Progress
    this.status = data.status || 'Draft';
    this.completion_percentage = data.completion_percentage || 0;
    this.priority = data.priority || 'Medium';
    this.next_action = data.next_action || '';
    this.next_action_date = data.next_action_date || null;
    
    // Timeline Management
    this.target_submission_date = data.target_submission_date || null;
    this.actual_submission_date = data.actual_submission_date || null;
    this.expected_decision_date = data.expected_decision_date || null;
    this.actual_decision_date = data.actual_decision_date || null;
    this.processing_time_estimate = data.processing_time_estimate || '';
    
    // Team Assignment
    this.assigned_consultant = data.assigned_consultant || '';
    this.secondary_consultant = data.secondary_consultant || '';
    this.case_manager = data.case_manager || '';
    
    // Document Management
    this.cv_status = data.cv_status || 'Not Uploaded';
    this.cv_file_url = data.cv_file_url || '';
    this.cv_last_updated = data.cv_last_updated || null;
    this.documents_required = data.documents_required || [];
    this.documents_submitted = data.documents_submitted || [];
    this.missing_documents = data.missing_documents || [];
    
    // Financial Information
    this.total_fee = data.total_fee || 0;
    this.paid_amount = data.paid_amount || 0;
    this.outstanding_amount = data.outstanding_amount || 0;
    this.payment_plan = data.payment_plan || [];
    this.invoice_numbers = data.invoice_numbers || [];
    this.currency = data.currency || 'USD';
    
    // Government Application Details
    this.government_application_id = data.government_application_id || '';
    this.uci_number = data.uci_number || '';
    this.file_number = data.file_number || '';
    this.biometrics_required = data.biometrics_required || false;
    this.biometrics_completed = data.biometrics_completed || false;
    this.biometrics_date = data.biometrics_date || null;
    this.medical_exam_required = data.medical_exam_required || false;
    this.medical_exam_completed = data.medical_exam_completed || false;
    this.medical_exam_date = data.medical_exam_date || null;
    
    // Family Information
    this.family_members = data.family_members || [];
    this.principal_applicant = data.principal_applicant || true;
    this.spouse_included = data.spouse_included || false;
    this.children_included = data.children_included || false;
    this.dependents_count = data.dependents_count || 0;
    
    // Communication and Notes
    this.notes = data.notes || '';
    this.internal_notes = data.internal_notes || '';
    this.client_communications = data.client_communications || [];
    this.government_communications = data.government_communications || [];
    
    // Tracking and Analytics
    this.created_date = data.created_date || new Date().toISOString();
    this.updated_date = data.updated_date || new Date().toISOString();
    this.submitted_date = data.submitted_date || null;
    this.decision_date = data.decision_date || null;
    this.tags = data.tags || [];
    this.risk_level = data.risk_level || 'Low';
    this.success_probability = data.success_probability || 'High';
    
    // Compliance and Legal
    this.compliance_checks = data.compliance_checks || [];
    this.legal_review_required = data.legal_review_required || false;
    this.legal_review_completed = data.legal_review_completed || false;
    this.quality_assurance_completed = data.quality_assurance_completed || false;
    
    // Client Satisfaction
    this.client_satisfaction_score = data.client_satisfaction_score || null;
    this.feedback_received = data.feedback_received || false;
    this.testimonial_provided = data.testimonial_provided || false;
  }

  generateId() {
    return 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateApplicationNumber() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `NWI-${year}${month}-${random}`;
  }

  // Static methods for CRUD operations
  static async create(applicationData) {
    try {
      const application = new Application(applicationData);
      application.updated_date = new Date().toISOString();
      
      // Calculate initial completion percentage
      application.completion_percentage = application.calculateCompletionPercentage();
      
      // Set initial outstanding amount
      application.outstanding_amount = application.total_fee - application.paid_amount;
      
      // Simulate API call
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(application),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create application');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  static async getAll(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/applications?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const data = await response.json();
      return data.map(appData => new Application(appData));
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Return mock data for development
      return Application.getMockData();
    }
  }

  static async getById(id) {
    try {
      const response = await fetch(`/api/applications/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch application');
      }
      
      const data = await response.json();
      return new Application(data);
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  }

  async update(updateData) {
    try {
      Object.assign(this, updateData);
      this.updated_date = new Date().toISOString();
      
      // Recalculate completion percentage
      this.completion_percentage = this.calculateCompletionPercentage();
      
      // Update outstanding amount
      this.outstanding_amount = this.total_fee - this.paid_amount;
      
      const response = await fetch(`/api/applications/${this.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update application');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  }

  async delete() {
    try {
      const response = await fetch(`/api/applications/${this.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete application');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }

  // Business logic methods
  calculateCompletionPercentage() {
    let totalSteps = 0;
    let completedSteps = 0;
    
    // Basic information (20%)
    totalSteps += 4;
    if (this.client_name) completedSteps++;
    if (this.client_email) completedSteps++;
    if (this.visa_type) completedSteps++;
    if (this.country) completedSteps++;
    
    // Documentation (40%)
    totalSteps += 4;
    if (this.cv_status === 'Approved') completedSteps++;
    if (this.documents_required.length > 0) completedSteps++;
    if (this.documents_submitted.length >= this.documents_required.length) completedSteps++;
    if (this.missing_documents.length === 0) completedSteps++;
    
    // Government requirements (25%)
    totalSteps += 3;
    if (!this.biometrics_required || this.biometrics_completed) completedSteps++;
    if (!this.medical_exam_required || this.medical_exam_completed) completedSteps++;
    if (this.government_application_id) completedSteps++;
    
    // Quality assurance (15%)
    totalSteps += 2;
    if (this.legal_review_completed || !this.legal_review_required) completedSteps++;
    if (this.quality_assurance_completed) completedSteps++;
    
    return Math.round((completedSteps / totalSteps) * 100);
  }

  getStatusColor() {
    const statusColors = {
      'Draft': 'gray',
      'In Progress': 'blue',
      'Submitted': 'yellow',
      'Under Review': 'orange',
      'Additional Info Required': 'red',
      'Approved': 'green',
      'Rejected': 'red'
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
    return priorityColors[this.priority] || 'gray';
  }

  isOverdue() {
    if (!this.target_submission_date) return false;
    return new Date(this.target_submission_date) < new Date() && this.status !== 'Submitted';
  }

  getDaysUntilSubmission() {
    if (!this.target_submission_date) return null;
    const submissionDate = new Date(this.target_submission_date);
    const today = new Date();
    const diffTime = submissionDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getPaymentStatus() {
    if (this.paid_amount === 0) return 'Unpaid';
    if (this.paid_amount >= this.total_fee) return 'Paid';
    return 'Partial';
  }

  getPaymentPercentage() {
    if (this.total_fee === 0) return 0;
    return Math.round((this.paid_amount / this.total_fee) * 100);
  }

  getFormattedCreatedDate() {
    return new Date(this.created_date).toLocaleDateString();
  }

  getFormattedSubmissionDate() {
    if (!this.target_submission_date) return 'Not set';
    return new Date(this.target_submission_date).toLocaleDateString();
  }

  getProcessingTimeRemaining() {
    if (!this.actual_submission_date || !this.expected_decision_date) return null;
    const decisionDate = new Date(this.expected_decision_date);
    const today = new Date();
    const diffTime = decisionDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Mock data for development
  static getMockData() {
    return [
      new Application({
        id: 'app_1',
        application_number: 'NWI-202401-1001',
        client_name: 'Michael Chen',
        client_email: 'michael.chen@email.com',
        client_phone: '+27 82 123 4567',
        country: 'Canada',
        visa_type: 'Express Entry',
        status: 'In Progress',
        completion_percentage: 75,
        assigned_consultant: 'Sarah Johnson',
        priority: 'High',
        next_action: 'Submit language test results',
        target_submission_date: '2024-02-15',
        cv_status: 'Approved',
        total_fee: 8500,
        paid_amount: 4250,
        outstanding_amount: 4250,
        government_application_id: 'EE123456789',
        biometrics_required: true,
        biometrics_completed: true,
        medical_exam_required: false,
        notes: 'Strong candidate with excellent qualifications',
        created_date: '2024-01-15T10:30:00Z'
      }),
      new Application({
        id: 'app_2',
        application_number: 'NWI-202401-1002',
        client_name: 'Sarah Williams',
        client_email: 'sarah.williams@email.com',
        client_phone: '+27 83 987 6543',
        country: 'Canada',
        visa_type: 'Family Sponsorship',
        status: 'Submitted',
        completion_percentage: 100,
        assigned_consultant: 'Mike Chen',
        priority: 'Medium',
        next_action: 'Await government response',
        target_submission_date: '2024-01-20',
        actual_submission_date: '2024-01-20',
        cv_status: 'Approved',
        total_fee: 5500,
        paid_amount: 5500,
        outstanding_amount: 0,
        government_application_id: 'F123456789',
        spouse_included: true,
        children_included: true,
        dependents_count: 2,
        notes: 'Family sponsorship case - spouse is Canadian citizen',
        created_date: '2024-01-10T14:20:00Z'
      }),
      new Application({
        id: 'app_3',
        application_number: 'NWI-202401-1003',
        client_name: 'David Thompson',
        client_email: 'david.thompson@email.com',
        client_phone: '+27 84 555 7890',
        country: 'Canada',
        visa_type: 'Student Visa',
        status: 'Draft',
        completion_percentage: 25,
        assigned_consultant: 'Emma Davis',
        priority: 'Medium',
        next_action: 'Upload academic transcripts',
        target_submission_date: '2024-03-01',
        cv_status: 'Not Uploaded',
        total_fee: 3500,
        paid_amount: 1000,
        outstanding_amount: 2500,
        medical_exam_required: true,
        medical_exam_completed: false,
        notes: 'Student visa application for Masters program',
        created_date: '2024-01-22T09:15:00Z'
      })
    ];
  }
}

// JSON Schema for validation
export const ApplicationSchema = {
  "name": "Application",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique application identifier"
    },
    "application_number": {
      "type": "string",
      "description": "Human-readable application number"
    },
    "client_name": {
      "type": "string",
      "description": "Client's full name",
      "minLength": 2,
      "maxLength": 100
    },
    "client_email": {
      "type": "string",
      "format": "email",
      "description": "Client's email address"
    },
    "client_phone": {
      "type": "string",
      "description": "Client's phone number"
    },
    "client_id": {
      "type": "string",
      "description": "Reference to client record"
    },
    "lead_id": {
      "type": "string",
      "description": "Reference to original lead"
    },
    "country": {
      "type": "string",
      "enum": [
        "Canada",
        "USA",
        "UK",
        "Australia",
        "New Zealand",
        "Germany",
        "Other"
      ],
      "description": "Target country for the application"
    },
    "visa_type": {
      "type": "string",
      "enum": [
        "Express Entry",
        "Provincial Nominee",
        "Family Sponsorship",
        "Student Visa",
        "Work Permit",
        "Visitor Visa",
        "Business Immigration",
        "Citizenship",
        "LMIA",
        "Study Permit Extension",
        "Work Permit Extension",
        "Permanent Residence Renewal",
        "Travel Document",
        "Other"
      ],
      "description": "Type of visa/immigration application"
    },
    "visa_subtype": {
      "type": "string",
      "description": "Specific subtype or stream within visa category"
    },
    "processing_office": {
      "type": "string",
      "description": "Government processing office"
    },
    "application_stream": {
      "type": "string",
      "description": "Specific application stream or program"
    },
    "status": {
      "type": "string",
      "enum": [
        "Draft",
        "In Progress",
        "Submitted",
        "Under Review",
        "Additional Info Required",
        "Interview Scheduled",
        "Decision Made",
        "Approved",
        "Rejected",
        "Withdrawn",
        "On Hold"
      ],
      "default": "Draft",
      "description": "Current application status"
    },
    "completion_percentage": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "default": 0,
      "description": "Application completion percentage"
    },
    "priority": {
      "type": "string",
      "enum": [
        "Low",
        "Medium",
        "High",
        "Urgent"
      ],
      "default": "Medium",
      "description": "Application priority level"
    },
    "next_action": {
      "type": "string",
      "description": "Next required action"
    },
    "next_action_date": {
      "type": "string",
      "format": "date-time",
      "description": "Date for next action"
    },
    "target_submission_date": {
      "type": "string",
      "format": "date",
      "description": "Target submission date"
    },
    "actual_submission_date": {
      "type": "string",
      "format": "date",
      "description": "Actual submission date"
    },
    "expected_decision_date": {
      "type": "string",
      "format": "date",
      "description": "Expected decision date"
    },
    "actual_decision_date": {
      "type": "string",
      "format": "date",
      "description": "Actual decision date"
    },
    "processing_time_estimate": {
      "type": "string",
      "description": "Estimated processing time"
    },
    "assigned_consultant": {
      "type": "string",
      "description": "Primary assigned consultant"
    },
    "secondary_consultant": {
      "type": "string",
      "description": "Secondary consultant"
    },
    "case_manager": {
      "type": "string",
      "description": "Case manager"
    },
    "cv_status": {
      "type": "string",
      "enum": [
        "Not Uploaded",
        "Uploaded",
        "Needs Update",
        "Updated",
        "Under Review",
        "Approved",
        "Rejected"
      ],
      "default": "Not Uploaded",
      "description": "CV/Resume status"
    },
    "cv_file_url": {
      "type": "string",
      "description": "URL to CV file"
    },
    "cv_last_updated": {
      "type": "string",
      "format": "date-time",
      "description": "Last CV update date"
    },
    "documents_required": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "type": { "type": "string" },
          "required": { "type": "boolean" },
          "deadline": { "type": "string", "format": "date" }
        }
      },
      "description": "List of required documents"
    },
    "documents_submitted": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "url": { "type": "string" },
          "submitted_date": { "type": "string", "format": "date-time" },
          "status": { "type": "string" }
        }
      },
      "description": "List of submitted documents"
    },
    "missing_documents": {
      "type": "array",
      "items": { "type": "string" },
      "description": "List of missing document names"
    },
    "total_fee": {
      "type": "number",
      "minimum": 0,
      "description": "Total application fee"
    },
    "paid_amount": {
      "type": "number",
      "minimum": 0,
      "default": 0,
      "description": "Amount paid"
    },
    "outstanding_amount": {
      "type": "number",
      "minimum": 0,
      "description": "Outstanding amount"
    },
    "payment_plan": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "amount": { "type": "number" },
          "due_date": { "type": "string", "format": "date" },
          "status": { "type": "string" }
        }
      },
      "description": "Payment plan details"
    },
    "invoice_numbers": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Associated invoice numbers"
    },
    "currency": {
      "type": "string",
      "default": "USD",
      "description": "Currency for fees"
    },
    "government_application_id": {
      "type": "string",
      "description": "Government application ID"
    },
    "uci_number": {
      "type": "string",
      "description": "Unique Client Identifier"
    },
    "file_number": {
      "type": "string",
      "description": "Government file number"
    },
    "biometrics_required": {
      "type": "boolean",
      "default": false,
      "description": "Whether biometrics are required"
    },
    "biometrics_completed": {
      "type": "boolean",
      "default": false,
      "description": "Whether biometrics are completed"
    },
    "biometrics_date": {
      "type": "string",
      "format": "date",
      "description": "Biometrics appointment date"
    },
    "medical_exam_required": {
      "type": "boolean",
      "default": false,
      "description": "Whether medical exam is required"
    },
    "medical_exam_completed": {
      "type": "boolean",
      "default": false,
      "description": "Whether medical exam is completed"
    },
    "medical_exam_date": {
      "type": "string",
      "format": "date",
      "description": "Medical exam date"
    },
    "family_members": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "relationship": { "type": "string" },
          "age": { "type": "integer" },
          "included": { "type": "boolean" }
        }
      },
      "description": "Family members information"
    },
    "principal_applicant": {
      "type": "boolean",
      "default": true,
      "description": "Whether this is the principal applicant"
    },
    "spouse_included": {
      "type": "boolean",
      "default": false,
      "description": "Whether spouse is included"
    },
    "children_included": {
      "type": "boolean",
      "default": false,
      "description": "Whether children are included"
    },
    "dependents_count": {
      "type": "integer",
      "minimum": 0,
      "default": 0,
      "description": "Number of dependents"
    },
    "notes": {
      "type": "string",
      "description": "Public notes"
    },
    "internal_notes": {
      "type": "string",
      "description": "Internal consultant notes"
    },
    "client_communications": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "date": { "type": "string", "format": "date-time" },
          "type": { "type": "string" },
          "message": { "type": "string" },
          "consultant": { "type": "string" }
        }
      },
      "description": "Client communication history"
    },
    "government_communications": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "date": { "type": "string", "format": "date-time" },
          "type": { "type": "string" },
          "message": { "type": "string" },
          "reference": { "type": "string" }
        }
      },
      "description": "Government communication history"
    },
    "created_date": {
      "type": "string",
      "format": "date-time",
      "description": "Application creation date"
    },
    "updated_date": {
      "type": "string",
      "format": "date-time",
      "description": "Last update date"
    },
    "submitted_date": {
      "type": "string",
      "format": "date-time",
      "description": "Submission date"
    },
    "decision_date": {
      "type": "string",
      "format": "date-time",
      "description": "Decision date"
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Application tags"
    },
    "risk_level": {
      "type": "string",
      "enum": ["Low", "Medium", "High"],
      "default": "Low",
      "description": "Risk assessment level"
    },
    "success_probability": {
      "type": "string",
      "enum": ["Very Low", "Low", "Medium", "High", "Very High"],
      "default": "High",
      "description": "Success probability assessment"
    },
    "compliance_checks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "check_name": { "type": "string" },
          "status": { "type": "string" },
          "completed_date": { "type": "string", "format": "date-time" },
          "notes": { "type": "string" }
        }
      },
      "description": "Compliance check results"
    },
    "legal_review_required": {
      "type": "boolean",
      "default": false,
      "description": "Whether legal review is required"
    },
    "legal_review_completed": {
      "type": "boolean",
      "default": false,
      "description": "Whether legal review is completed"
    },
    "quality_assurance_completed": {
      "type": "boolean",
      "default": false,
      "description": "Whether QA is completed"
    },
    "client_satisfaction_score": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10,
      "description": "Client satisfaction score"
    },
    "feedback_received": {
      "type": "boolean",
      "default": false,
      "description": "Whether feedback was received"
    },
    "testimonial_provided": {
      "type": "boolean",
      "default": false,
      "description": "Whether testimonial was provided"
    }
  },
  "required": [
    "client_name",
    "visa_type",
    "country"
  ],
  "additionalProperties": false
};
