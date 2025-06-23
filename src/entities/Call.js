// Call Entity Class for NWI Visas Immigration Services
export class Call {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.call_number = data.call_number || this.generateCallNumber();
    this.client_name = data.client_name || '';
    this.client_contact = data.client_contact || '';
    this.client_email = data.client_email || '';
    this.client_id = data.client_id || '';
    
    // Call Scheduling
    this.scheduled_date = data.scheduled_date || null;
    this.scheduled_time = data.scheduled_time || null;
    this.duration_minutes = data.duration_minutes || 30;
    this.actual_duration = data.actual_duration || null;
    this.timezone = data.timezone || 'EST';
    this.call_type = data.call_type || 'Video Call';
    
    // Call Classification
    this.purpose = data.purpose || 'Initial Consultation';
    this.call_category = data.call_category || 'Client Consultation';
    this.priority = data.priority || 'Medium';
    this.urgency_level = data.urgency_level || 'Normal';
    
    // Status and Progress
    this.status = data.status || 'Scheduled';
    this.call_outcome = data.call_outcome || '';
    this.satisfaction_rating = data.satisfaction_rating || null;
    this.follow_up_required = data.follow_up_required || false;
    this.follow_up_date = data.follow_up_date || null;
    
    // Team Assignment
    this.consultant = data.consultant || '';
    this.secondary_consultant = data.secondary_consultant || '';
    this.call_host = data.call_host || '';
    this.attendees = data.attendees || [];
    
    // Relationships
    this.related_application_id = data.related_application_id || '';
    this.related_lead_id = data.related_lead_id || '';
    this.related_task_id = data.related_task_id || '';
    this.parent_call_id = data.parent_call_id || '';
    
    // Immigration Context
    this.case_number = data.case_number || '';
    this.visa_type = data.visa_type || '';
    this.target_country = data.target_country || '';
    this.immigration_stage = data.immigration_stage || '';
    this.application_status = data.application_status || '';
    
    // Call Details
    this.agenda = data.agenda || '';
    this.notes = data.notes || '';
    this.internal_notes = data.internal_notes || '';
    this.action_items = data.action_items || [];
    this.documents_discussed = data.documents_discussed || [];
    this.next_steps = data.next_steps || '';
    
    // Technical Details
    this.meeting_link = data.meeting_link || '';
    this.meeting_id = data.meeting_id || '';
    this.meeting_password = data.meeting_password || '';
    this.dial_in_number = data.dial_in_number || '';
    this.recording_url = data.recording_url || '';
    this.recording_available = data.recording_available || false;
    
    // Communication and Reminders
    this.reminder_sent = data.reminder_sent || false;
    this.reminder_date = data.reminder_date || null;
    this.confirmation_sent = data.confirmation_sent || false;
    this.confirmation_received = data.confirmation_received || false;
    this.rescheduled_from = data.rescheduled_from || null;
    this.rescheduled_to = data.rescheduled_to || null;
    this.rescheduled_reason = data.rescheduled_reason || '';
    
    // Billing and Time Tracking
    this.billable = data.billable || true;
    this.hourly_rate = data.hourly_rate || 0;
    this.total_cost = data.total_cost || 0;
    this.invoiced = data.invoiced || false;
    this.invoice_number = data.invoice_number || '';
    
    // Quality and Compliance
    this.call_quality_score = data.call_quality_score || null;
    this.compliance_notes = data.compliance_notes || '';
    this.confidentiality_level = data.confidentiality_level || 'Standard';
    this.consent_recorded = data.consent_recorded || false;
    
    // Tracking and Analytics
    this.created_date = data.created_date || new Date().toISOString();
    this.updated_date = data.updated_date || new Date().toISOString();
    this.actual_start_time = data.actual_start_time || null;
    this.actual_end_time = data.actual_end_time || null;
    this.tags = data.tags || [];
    this.custom_fields = data.custom_fields || {};
    
    // Automation and Workflow
    this.auto_scheduled = data.auto_scheduled || false;
    this.workflow_step = data.workflow_step || '';
    this.trigger_conditions = data.trigger_conditions || [];
    this.post_call_actions = data.post_call_actions || [];
  }

  generateId() {
    return 'call_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateCallNumber() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `CALL-${year}${month}${day}-${random}`;
  }

  // Static methods for CRUD operations
  static async create(callData) {
    try {
      const call = new Call(callData);
      call.updated_date = new Date().toISOString();
      
      // Set default reminder if scheduled date is provided
      if (call.scheduled_date && !call.reminder_date) {
        const scheduledDate = new Date(call.scheduled_date);
        const reminderDate = new Date(scheduledDate.getTime() - (24 * 60 * 60 * 1000)); // 1 day before
        call.reminder_date = reminderDate.toISOString();
      }
      
      // Calculate total cost if billable
      if (call.billable && call.hourly_rate && call.duration_minutes) {
        call.total_cost = (call.hourly_rate / 60) * call.duration_minutes;
      }
      
      // Simulate API call
      const response = await fetch('/api/calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(call),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create call');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating call:', error);
      throw error;
    }
  }

  static async getAll(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/calls?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch calls');
      }
      
      const data = await response.json();
      return data.map(callData => new Call(callData));
    } catch (error) {
      console.error('Error fetching calls:', error);
      // Return mock data for development
      return Call.getMockData();
    }
  }

  static async getById(id) {
    try {
      const response = await fetch(`/api/calls/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch call');
      }
      
      const data = await response.json();
      return new Call(data);
    } catch (error) {
      console.error('Error fetching call:', error);
      throw error;
    }
  }

  async update(updateData) {
    try {
      Object.assign(this, updateData);
      this.updated_date = new Date().toISOString();
      
      // Update status-specific fields
      if (updateData.status === 'Completed' && !this.actual_end_time) {
        this.actual_end_time = new Date().toISOString();
        
        // Calculate actual duration if start time is available
        if (this.actual_start_time) {
          const startTime = new Date(this.actual_start_time);
          const endTime = new Date(this.actual_end_time);
          this.actual_duration = Math.round((endTime - startTime) / (1000 * 60)); // minutes
        }
        
        // Recalculate cost if billable
        if (this.billable && this.hourly_rate && this.actual_duration) {
          this.total_cost = (this.hourly_rate / 60) * this.actual_duration;
        }
      }
      
      const response = await fetch(`/api/calls/${this.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update call');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating call:', error);
      throw error;
    }
  }

  async delete() {
    try {
      const response = await fetch(`/api/calls/${this.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete call');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting call:', error);
      throw error;
    }
  }

  // Business logic methods
  getStatusColor() {
    const statusColors = {
      'Scheduled': 'blue',
      'In Progress': 'green',
      'Completed': 'emerald',
      'Cancelled': 'red',
      'Rescheduled': 'yellow',
      'No Show': 'orange',
      'Overdue': 'red'
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
    if (!this.scheduled_date || this.status === 'Completed' || this.status === 'Cancelled') return false;
    return new Date(this.scheduled_date) < new Date();
  }

  isToday() {
    if (!this.scheduled_date) return false;
    const today = new Date().toDateString();
    const callDate = new Date(this.scheduled_date).toDateString();
    return today === callDate;
  }

  getTimeUntilCall() {
    if (!this.scheduled_date) return null;
    const callDate = new Date(this.scheduled_date);
    const now = new Date();
    const diffTime = callDate - now;
    
    if (diffTime < 0) return 'Overdue';
    
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  }

  getFormattedScheduledDate() {
    if (!this.scheduled_date) return 'Not scheduled';
    return new Date(this.scheduled_date).toLocaleString();
  }

  getFormattedDuration() {
    const duration = this.actual_duration || this.duration_minutes;
    if (!duration) return 'Unknown';
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  getFormattedCost() {
    if (!this.total_cost) return 'Free';
    return `$${this.total_cost.toFixed(2)}`;
  }

  addActionItem(item, assignee, dueDate) {
    const actionItem = {
      id: Date.now().toString(),
      item: item,
      assignee: assignee,
      due_date: dueDate,
      completed: false,
      created_date: new Date().toISOString()
    };
    this.action_items.push(actionItem);
  }

  markActionItemComplete(itemId) {
    const item = this.action_items.find(item => item.id === itemId);
    if (item) {
      item.completed = true;
      item.completed_date = new Date().toISOString();
    }
  }

  startCall() {
    this.status = 'In Progress';
    this.actual_start_time = new Date().toISOString();
    this.updated_date = new Date().toISOString();
  }

  endCall(outcome, notes) {
    this.status = 'Completed';
    this.actual_end_time = new Date().toISOString();
    this.call_outcome = outcome;
    if (notes) this.notes = notes;
    
    // Calculate actual duration
    if (this.actual_start_time) {
      const startTime = new Date(this.actual_start_time);
      const endTime = new Date(this.actual_end_time);
      this.actual_duration = Math.round((endTime - startTime) / (1000 * 60));
    }
    
    // Recalculate cost
    if (this.billable && this.hourly_rate && this.actual_duration) {
      this.total_cost = (this.hourly_rate / 60) * this.actual_duration;
    }
    
    this.updated_date = new Date().toISOString();
  }

  reschedule(newDate, reason) {
    this.rescheduled_from = this.scheduled_date;
    this.scheduled_date = newDate;
    this.rescheduled_to = newDate;
    this.rescheduled_reason = reason;
    this.status = 'Rescheduled';
    this.updated_date = new Date().toISOString();
    
    // Update reminder date
    if (newDate) {
      const scheduledDate = new Date(newDate);
      const reminderDate = new Date(scheduledDate.getTime() - (24 * 60 * 60 * 1000));
      this.reminder_date = reminderDate.toISOString();
      this.reminder_sent = false;
    }
  }

  // Mock data for development
  static getMockData() {
    return [
      new Call({
        id: 'call_1',
        call_number: 'CALL-20240115-0001',
        client_name: 'Michael Chen',
        client_contact: '+27 82 123 4567',
        client_email: 'michael.chen@email.com',
        scheduled_date: '2024-01-25T10:00:00Z',
        duration_minutes: 60,
        purpose: 'Initial Consultation',
        call_category: 'Client Consultation',
        status: 'Scheduled',
        priority: 'High',
        consultant: 'Sarah Johnson',
        related_application_id: 'app_1',
        related_lead_id: 'lead_1',
        case_number: 'NWI-202401-1001',
        visa_type: 'Express Entry',
        target_country: 'Canada',
        immigration_stage: 'Initial Consultation',
        call_type: 'Video Call',
        meeting_link: 'https://zoom.us/j/123456789',
        agenda: 'Discuss Express Entry eligibility and requirements',
        notes: 'Client interested in Express Entry program',
        billable: true,
        hourly_rate: 150,
        total_cost: 150,
        reminder_date: '2024-01-24T10:00:00Z',
        created_date: '2024-01-15T14:30:00Z'
      }),
      new Call({
        id: 'call_2',
        call_number: 'CALL-20240118-0002',
        client_name: 'Sarah Williams',
        client_contact: '+27 83 987 6543',
        client_email: 'sarah.williams@email.com',
        scheduled_date: '2024-01-22T14:00:00Z',
        duration_minutes: 45,
        actual_duration: 50,
        purpose: 'Document Review',
        call_category: 'Document Review',
        status: 'Completed',
        priority: 'Medium',
        consultant: 'Mike Chen',
        related_application_id: 'app_2',
        case_number: 'NWI-202401-1002',
        visa_type: 'Family Sponsorship',
        target_country: 'Canada',
        immigration_stage: 'Document Review',
        call_type: 'Phone Call',
        call_outcome: 'Documents approved, ready for submission',
        satisfaction_rating: 5,
        actual_start_time: '2024-01-22T14:00:00Z',
        actual_end_time: '2024-01-22T14:50:00Z',
        agenda: 'Review submitted documents for completeness',
        notes: 'All documents reviewed and approved. Application ready for submission.',
        action_items: [
          {
            id: '1',
            item: 'Submit application to IRCC',
            assignee: 'Mike Chen',
            due_date: '2024-01-25',
            completed: false,
            created_date: '2024-01-22T14:50:00Z'
          }
        ],
        billable: true,
        hourly_rate: 150,
        total_cost: 125,
        created_date: '2024-01-18T11:20:00Z'
      }),
      new Call({
        id: 'call_3',
        call_number: 'CALL-20240120-0003',
        client_name: 'David Thompson',
        client_contact: '+27 84 555 7890',
        client_email: 'david.thompson@email.com',
        scheduled_date: '2024-01-26T11:00:00Z',
        duration_minutes: 30,
        purpose: 'Follow-up',
        call_category: 'Client Consultation',
        status: 'Scheduled',
        priority: 'Medium',
        consultant: 'Emma Davis',
        related_lead_id: 'lead_3',
        visa_type: 'Student Visa',
        target_country: 'Canada',
        immigration_stage: 'Application Preparation',
        call_type: 'Video Call',
        meeting_link: 'https://zoom.us/j/987654321',
        agenda: 'Follow up on student visa application progress',
        notes: 'Check on document collection progress',
        billable: true,
        hourly_rate: 150,
        total_cost: 75,
        reminder_date: '2024-01-25T11:00:00Z',
        created_date: '2024-01-20T16:45:00Z'
      })
    ];
  }
}

// JSON Schema for validation
export const CallSchema = {
  "name": "Call",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique call identifier"
    },
    "call_number": {
      "type": "string",
      "description": "Human-readable call number"
    },
    "client_name": {
      "type": "string",
      "description": "Client's full name",
      "minLength": 2,
      "maxLength": 100
    },
    "client_contact": {
      "type": "string",
      "description": "Client's phone number"
    },
    "client_email": {
      "type": "string",
      "format": "email",
      "description": "Client's email address"
    },
    "client_id": {
      "type": "string",
      "description": "Related client ID"
    },
    "scheduled_date": {
      "type": "string",
      "format": "date-time",
      "description": "Scheduled call date and time"
    },
    "scheduled_time": {
      "type": "string",
      "format": "time",
      "description": "Scheduled call time"
    },
    "duration_minutes": {
      "type": "number",
      "minimum": 5,
      "maximum": 480,
      "default": 30,
      "description": "Planned call duration in minutes"
    },
    "actual_duration": {
      "type": "number",
      "minimum": 0,
      "description": "Actual call duration in minutes"
    },
    "timezone": {
      "type": "string",
      "default": "EST",
      "description": "Call timezone"
    },
    "call_type": {
      "type": "string",
      "enum": [
        "Video Call",
        "Phone Call",
        "In-Person",
        "Conference Call"
      ],
      "default": "Video Call",
      "description": "Type of call"
    },
    "purpose": {
      "type": "string",
      "enum": [
        "Initial Consultation",
        "Document Review",
        "Status Update",
        "Follow-up",
        "Technical Discussion",
        "Payment Discussion",
        "Interview Preparation",
        "Case Review",
        "Final Consultation",
        "Emergency Consultation",
        "Second Opinion",
        "Complaint Resolution",
        "Other"
      ],
      "description": "Purpose of the call"
    },
    "call_category": {
      "type": "string",
      "enum": [
        "Client Consultation",
        "Document Review",
        "Case Management",
        "Business Development",
        "Internal Meeting",
        "Training",
        "Support",
        "Other"
      ],
      "default": "Client Consultation",
      "description": "Call category"
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
      "description": "Call priority level"
    },
    "urgency_level": {
      "type": "string",
      "enum": [
        "Normal",
        "Rush",
        "Emergency"
      ],
      "default": "Normal",
      "description": "Urgency classification"
    },
    "status": {
      "type": "string",
      "enum": [
        "Scheduled",
        "In Progress",
        "Completed",
        "Cancelled",
        "Rescheduled",
        "No Show",
        "Overdue"
      ],
      "default": "Scheduled",
      "description": "Call status"
    },
    "call_outcome": {
      "type": "string",
      "description": "Call outcome or result"
    },
    "satisfaction_rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 5,
      "description": "Client satisfaction rating (1-5)"
    },
    "follow_up_required": {
      "type": "boolean",
      "default": false,
      "description": "Whether follow-up is required"
    },
    "follow_up_date": {
      "type": "string",
      "format": "date",
      "description": "Follow-up date"
    },
    "consultant": {
      "type": "string",
      "description": "Primary consultant"
    },
    "secondary_consultant": {
      "type": "string",
      "description": "Secondary consultant"
    },
    "call_host": {
      "type": "string",
      "description": "Call host"
    },
    "attendees": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "role": { "type": "string" },
          "email": { "type": "string", "format": "email" }
        }
      },
      "description": "Call attendees"
    },
    "related_application_id": {
      "type": "string",
      "description": "Related application ID"
    },
    "related_lead_id": {
      "type": "string",
      "description": "Related lead ID"
    },
    "related_task_id": {
      "type": "string",
      "description": "Related task ID"
    },
    "parent_call_id": {
      "type": "string",
      "description": "Parent call ID for follow-up calls"
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
    "application_status": {
      "type": "string",
      "description": "Application status for context"
    },
    "agenda": {
      "type": "string",
      "description": "Call agenda",
      "maxLength": 1000
    },
    "notes": {
      "type": "string",
      "description": "Call notes",
      "maxLength": 2000
    },
    "internal_notes": {
      "type": "string",
      "description": "Internal consultant notes",
      "maxLength": 2000
    },
    "action_items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "item": { "type": "string" },
          "assignee": { "type": "string" },
          "due_date": { "type": "string", "format": "date" },
          "completed": { "type": "boolean" },
          "created_date": { "type": "string", "format": "date-time" },
          "completed_date": { "type": "string", "format": "date-time" }
        }
      },
      "description": "Action items from the call"
    },
    "documents_discussed": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Documents discussed during call"
    },
    "next_steps": {
      "type": "string",
      "description": "Next steps after the call",
      "maxLength": 1000
    },
    "meeting_link": {
      "type": "string",
      "description": "Video meeting link"
    },
    "meeting_id": {
      "type": "string",
      "description": "Meeting ID"
    },
    "meeting_password": {
      "type": "string",
      "description": "Meeting password"
    },
    "dial_in_number": {
      "type": "string",
      "description": "Dial-in phone number"
    },
    "recording_url": {
      "type": "string",
      "description": "Call recording URL"
    },
    "recording_available": {
      "type": "boolean",
      "default": false,
      "description": "Whether recording is available"
    },
    "reminder_sent": {
      "type": "boolean",
      "default": false,
      "description": "Whether reminder was sent"
    },
    "reminder_date": {
      "type": "string",
      "format": "date-time",
      "description": "Reminder date and time"
    },
    "confirmation_sent": {
      "type": "boolean",
      "default": false,
      "description": "Whether confirmation was sent"
    },
    "confirmation_received": {
      "type": "boolean",
      "default": false,
      "description": "Whether confirmation was received"
    },
    "rescheduled_from": {
      "type": "string",
      "format": "date-time",
      "description": "Original scheduled date"
    },
    "rescheduled_to": {
      "type": "string",
      "format": "date-time",
      "description": "New scheduled date"
    },
    "rescheduled_reason": {
      "type": "string",
      "description": "Reason for rescheduling"
    },
    "billable": {
      "type": "boolean",
      "default": true,
      "description": "Whether call is billable"
    },
    "hourly_rate": {
      "type": "number",
      "minimum": 0,
      "description": "Hourly rate for billing"
    },
    "total_cost": {
      "type": "number",
      "minimum": 0,
      "description": "Total call cost"
    },
    "invoiced": {
      "type": "boolean",
      "default": false,
      "description": "Whether call has been invoiced"
    },
    "invoice_number": {
      "type": "string",
      "description": "Invoice number"
    },
    "call_quality_score": {
      "type": "number",
      "minimum": 1,
      "maximum": 10,
      "description": "Call quality score"
    },
    "compliance_notes": {
      "type": "string",
      "description": "Compliance notes"
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
      "description": "Call confidentiality level"
    },
    "consent_recorded": {
      "type": "boolean",
      "default": false,
      "description": "Whether consent for recording was obtained"
    },
    "created_date": {
      "type": "string",
      "format": "date-time",
      "description": "Call creation date"
    },
    "updated_date": {
      "type": "string",
      "format": "date-time",
      "description": "Last update date"
    },
    "actual_start_time": {
      "type": "string",
      "format": "date-time",
      "description": "Actual call start time"
    },
    "actual_end_time": {
      "type": "string",
      "format": "date-time",
      "description": "Actual call end time"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Call tags"
    },
    "custom_fields": {
      "type": "object",
      "description": "Custom field values"
    },
    "auto_scheduled": {
      "type": "boolean",
      "default": false,
      "description": "Whether call was auto-scheduled"
    },
    "workflow_step": {
      "type": "string",
      "description": "Current workflow step"
    },
    "trigger_conditions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "condition": { "type": "string" },
          "value": { "type": "string" },
          "action": { "type": "string" }
        }
      },
      "description": "Automation trigger conditions"
    },
    "post_call_actions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "action": { "type": "string" },
          "status": { "type": "string" },
          "completed_date": { "type": "string", "format": "date-time" }
        }
      },
      "description": "Post-call automated actions"
    }
  },
  "required": [
    "client_name",
    "scheduled_date",
    "purpose"
  ],
  "additionalProperties": false
};
