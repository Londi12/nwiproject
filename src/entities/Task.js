// Task Entity Class for NWI Visas Immigration Services
export class Task {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.task_number = data.task_number || this.generateTaskNumber();
    this.title = data.title || '';
    this.description = data.description || '';
    
    // Task Classification
    this.type = data.type || 'Follow-up';
    this.category = data.category || 'Client Management';
    this.subcategory = data.subcategory || '';
    this.priority = data.priority || 'Medium';
    this.urgency_level = data.urgency_level || 'Normal';
    
    // Status and Progress
    this.status = data.status || 'Pending';
    this.completion_percentage = data.completion_percentage || 0;
    this.is_recurring = data.is_recurring || false;
    this.recurrence_pattern = data.recurrence_pattern || '';
    
    // Timeline Management
    this.due_date = data.due_date || null;
    this.due_time = data.due_time || null;
    this.reminder_date = data.reminder_date || null;
    this.start_date = data.start_date || null;
    this.completed_date = data.completed_date || null;
    this.estimated_hours = data.estimated_hours || null;
    this.actual_hours = data.actual_hours || null;
    
    // Assignment and Team
    this.assigned_to = data.assigned_to || '';
    this.created_by = data.created_by || '';
    this.assigned_team = data.assigned_team || '';
    this.collaborators = data.collaborators || [];
    
    // Relationships
    this.related_lead_id = data.related_lead_id || '';
    this.related_application_id = data.related_application_id || '';
    this.related_client_id = data.related_client_id || '';
    this.parent_task_id = data.parent_task_id || '';
    this.subtasks = data.subtasks || [];
    this.dependencies = data.dependencies || [];
    
    // Immigration Context
    this.client_name = data.client_name || '';
    this.case_number = data.case_number || '';
    this.visa_type = data.visa_type || '';
    this.country = data.country || '';
    this.immigration_stage = data.immigration_stage || '';
    
    // Communication and Documentation
    this.notes = data.notes || '';
    this.internal_notes = data.internal_notes || '';
    this.client_visible = data.client_visible || false;
    this.attachments = data.attachments || [];
    this.comments = data.comments || [];
    
    // Tracking and Analytics
    this.created_date = data.created_date || new Date().toISOString();
    this.updated_date = data.updated_date || new Date().toISOString();
    this.last_activity_date = data.last_activity_date || null;
    this.tags = data.tags || [];
    this.custom_fields = data.custom_fields || {};
    
    // Automation and Workflow
    this.auto_created = data.auto_created || false;
    this.workflow_step = data.workflow_step || '';
    this.next_task_id = data.next_task_id || '';
    this.trigger_conditions = data.trigger_conditions || [];
    
    // Quality and Compliance
    this.requires_approval = data.requires_approval || false;
    this.approved_by = data.approved_by || '';
    this.approval_date = data.approval_date || null;
    this.compliance_required = data.compliance_required || false;
    this.quality_checked = data.quality_checked || false;
    
    // Client Communication
    this.communication_method = data.communication_method || 'Email';
    this.client_response_required = data.client_response_required || false;
    this.client_response_received = data.client_response_received || false;
    this.follow_up_required = data.follow_up_required || false;
    this.follow_up_date = data.follow_up_date || null;
  }

  generateId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateTaskNumber() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    return `TSK-${year}${month}${day}-${random}`;
  }

  // Static methods for CRUD operations
  static async create(taskData) {
    try {
      const task = new Task(taskData);
      task.updated_date = new Date().toISOString();
      task.last_activity_date = new Date().toISOString();
      
      // Set default reminder if due date is provided
      if (task.due_date && !task.reminder_date) {
        const dueDate = new Date(task.due_date);
        const reminderDate = new Date(dueDate.getTime() - (24 * 60 * 60 * 1000)); // 1 day before
        task.reminder_date = reminderDate.toISOString();
      }
      
      // Simulate API call
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  static async getAll(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/tasks?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      return data.map(taskData => new Task(taskData));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Return mock data for development
      return Task.getMockData();
    }
  }

  static async getById(id) {
    try {
      const response = await fetch(`/api/tasks/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      
      const data = await response.json();
      return new Task(data);
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  async update(updateData) {
    try {
      Object.assign(this, updateData);
      this.updated_date = new Date().toISOString();
      this.last_activity_date = new Date().toISOString();
      
      // Set completion date if status changed to completed
      if (updateData.status === 'Completed' && !this.completed_date) {
        this.completed_date = new Date().toISOString();
        this.completion_percentage = 100;
      }
      
      // Clear completion date if status changed from completed
      if (updateData.status !== 'Completed' && this.completed_date) {
        this.completed_date = null;
        if (this.completion_percentage === 100) {
          this.completion_percentage = 0;
        }
      }
      
      const response = await fetch(`/api/tasks/${this.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async delete() {
    try {
      const response = await fetch(`/api/tasks/${this.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // Business logic methods
  getStatusColor() {
    const statusColors = {
      'Pending': 'yellow',
      'In Progress': 'blue',
      'Completed': 'green',
      'Cancelled': 'red',
      'On Hold': 'gray',
      'Waiting for Client': 'orange',
      'Waiting for Government': 'purple'
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
    if (!this.due_date || this.status === 'Completed') return false;
    return new Date(this.due_date) < new Date();
  }

  isDueToday() {
    if (!this.due_date) return false;
    const today = new Date().toDateString();
    const dueDate = new Date(this.due_date).toDateString();
    return today === dueDate;
  }

  getDaysUntilDue() {
    if (!this.due_date) return null;
    const dueDate = new Date(this.due_date);
    const today = new Date();
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getFormattedDueDate() {
    if (!this.due_date) return 'No due date';
    return new Date(this.due_date).toLocaleDateString();
  }

  getFormattedCreatedDate() {
    return new Date(this.created_date).toLocaleDateString();
  }

  getFormattedCompletedDate() {
    if (!this.completed_date) return 'Not completed';
    return new Date(this.completed_date).toLocaleDateString();
  }

  getTimeSpent() {
    if (!this.actual_hours) return 'Not tracked';
    return `${this.actual_hours} hours`;
  }

  getEfficiencyRatio() {
    if (!this.estimated_hours || !this.actual_hours) return null;
    return Math.round((this.estimated_hours / this.actual_hours) * 100);
  }

  addComment(comment, author) {
    const newComment = {
      id: Date.now().toString(),
      text: comment,
      author: author,
      date: new Date().toISOString()
    };
    this.comments.push(newComment);
    this.last_activity_date = new Date().toISOString();
  }

  addAttachment(attachment) {
    const newAttachment = {
      id: Date.now().toString(),
      name: attachment.name,
      url: attachment.url,
      type: attachment.type,
      size: attachment.size,
      uploaded_date: new Date().toISOString()
    };
    this.attachments.push(newAttachment);
  }

  markAsCompleted(completedBy) {
    this.status = 'Completed';
    this.completion_percentage = 100;
    this.completed_date = new Date().toISOString();
    this.updated_date = new Date().toISOString();
    this.last_activity_date = new Date().toISOString();
    
    // Add completion comment
    this.addComment(`Task completed by ${completedBy}`, completedBy);
  }

  // Mock data for development
  static getMockData() {
    return [
      new Task({
        id: 'task_1',
        task_number: 'TSK-20240115-001',
        title: 'Follow up with Michael Chen',
        description: 'Contact client regarding Express Entry application status and next steps',
        type: 'Follow-up',
        category: 'Client Management',
        priority: 'High',
        status: 'Pending',
        due_date: '2024-01-25',
        assigned_to: 'Sarah Johnson',
        related_lead_id: 'lead_1',
        related_application_id: 'app_1',
        client_name: 'Michael Chen',
        case_number: 'NWI-202401-1001',
        visa_type: 'Express Entry',
        country: 'Canada',
        immigration_stage: 'Document Collection',
        notes: 'Client needs to submit language test results',
        client_visible: true,
        estimated_hours: 1,
        created_date: '2024-01-15T10:30:00Z'
      }),
      new Task({
        id: 'task_2',
        task_number: 'TSK-20240116-002',
        title: 'Review CV for Sarah Williams',
        description: 'Review and optimize CV for Provincial Nominee Program application',
        type: 'CV Update',
        category: 'Document Preparation',
        priority: 'Medium',
        status: 'In Progress',
        due_date: '2024-01-22',
        assigned_to: 'Mike Chen',
        related_application_id: 'app_2',
        client_name: 'Sarah Williams',
        case_number: 'NWI-202401-1002',
        visa_type: 'Provincial Nominee',
        country: 'Canada',
        immigration_stage: 'Application Preparation',
        notes: 'Focus on highlighting relevant work experience',
        client_visible: false,
        estimated_hours: 3,
        actual_hours: 2,
        completion_percentage: 60,
        created_date: '2024-01-16T14:20:00Z'
      }),
      new Task({
        id: 'task_3',
        task_number: 'TSK-20240118-003',
        title: 'Schedule consultation with David Thompson',
        description: 'Schedule initial consultation for student visa application',
        type: 'Meeting',
        category: 'Client Management',
        priority: 'Medium',
        status: 'Completed',
        due_date: '2024-01-20',
        completed_date: '2024-01-19T11:00:00Z',
        assigned_to: 'Emma Davis',
        related_lead_id: 'lead_3',
        client_name: 'David Thompson',
        visa_type: 'Student Visa',
        country: 'Canada',
        immigration_stage: 'Initial Consultation',
        notes: 'Consultation scheduled for January 25th at 11:00 AM',
        client_visible: true,
        estimated_hours: 0.5,
        actual_hours: 0.5,
        completion_percentage: 100,
        created_date: '2024-01-18T09:15:00Z'
      })
    ];
  }
}

// JSON Schema for validation
export const TaskSchema = {
  "name": "Task",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique task identifier"
    },
    "task_number": {
      "type": "string",
      "description": "Human-readable task number"
    },
    "title": {
      "type": "string",
      "description": "Task title",
      "minLength": 3,
      "maxLength": 200
    },
    "description": {
      "type": "string",
      "description": "Detailed task description",
      "maxLength": 2000
    },
    "type": {
      "type": "string",
      "enum": [
        "Follow-up",
        "Document Request",
        "Call",
        "CV Update",
        "Application Review",
        "Payment Follow-up",
        "Meeting",
        "Interview Preparation",
        "Document Translation",
        "Medical Exam",
        "Biometrics",
        "Government Correspondence",
        "Quality Assurance",
        "Client Onboarding",
        "Case Closure",
        "Other"
      ],
      "description": "Type of task"
    },
    "category": {
      "type": "string",
      "enum": [
        "Client Management",
        "Document Preparation",
        "Government Relations",
        "Quality Assurance",
        "Administrative",
        "Marketing",
        "Business Development",
        "Training",
        "Compliance",
        "Other"
      ],
      "description": "Task category"
    },
    "subcategory": {
      "type": "string",
      "description": "Task subcategory"
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
      "description": "Task priority level"
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
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled",
        "On Hold",
        "Waiting for Client",
        "Waiting for Government",
        "Blocked"
      ],
      "default": "Pending",
      "description": "Current task status"
    },
    "completion_percentage": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "default": 0,
      "description": "Task completion percentage"
    },
    "is_recurring": {
      "type": "boolean",
      "default": false,
      "description": "Whether task is recurring"
    },
    "recurrence_pattern": {
      "type": "string",
      "description": "Recurrence pattern (daily, weekly, monthly, etc.)"
    },
    "due_date": {
      "type": "string",
      "format": "date",
      "description": "Task due date"
    },
    "due_time": {
      "type": "string",
      "format": "time",
      "description": "Task due time"
    },
    "reminder_date": {
      "type": "string",
      "format": "date-time",
      "description": "Reminder date and time"
    },
    "start_date": {
      "type": "string",
      "format": "date",
      "description": "Task start date"
    },
    "completed_date": {
      "type": "string",
      "format": "date-time",
      "description": "Task completion date"
    },
    "estimated_hours": {
      "type": "number",
      "minimum": 0,
      "description": "Estimated hours to complete"
    },
    "actual_hours": {
      "type": "number",
      "minimum": 0,
      "description": "Actual hours spent"
    },
    "assigned_to": {
      "type": "string",
      "description": "Primary assignee"
    },
    "created_by": {
      "type": "string",
      "description": "Task creator"
    },
    "assigned_team": {
      "type": "string",
      "description": "Assigned team"
    },
    "collaborators": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Task collaborators"
    },
    "related_lead_id": {
      "type": "string",
      "description": "Related lead ID"
    },
    "related_application_id": {
      "type": "string",
      "description": "Related application ID"
    },
    "related_client_id": {
      "type": "string",
      "description": "Related client ID"
    },
    "parent_task_id": {
      "type": "string",
      "description": "Parent task ID for subtasks"
    },
    "subtasks": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Subtask IDs"
    },
    "dependencies": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "task_id": { "type": "string" },
          "dependency_type": { "type": "string" }
        }
      },
      "description": "Task dependencies"
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
    "country": {
      "type": "string",
      "description": "Target country for context"
    },
    "immigration_stage": {
      "type": "string",
      "enum": [
        "Initial Consultation",
        "Document Collection",
        "Application Preparation",
        "Application Submission",
        "Government Review",
        "Additional Information",
        "Interview Preparation",
        "Decision Received",
        "Post-Decision",
        "Case Closure"
      ],
      "description": "Current immigration process stage"
    },
    "notes": {
      "type": "string",
      "description": "Public task notes",
      "maxLength": 2000
    },
    "internal_notes": {
      "type": "string",
      "description": "Internal consultant notes",
      "maxLength": 2000
    },
    "client_visible": {
      "type": "boolean",
      "default": false,
      "description": "Whether task is visible to client"
    },
    "attachments": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "url": { "type": "string" },
          "type": { "type": "string" },
          "size": { "type": "number" },
          "uploaded_date": { "type": "string", "format": "date-time" }
        }
      },
      "description": "Task attachments"
    },
    "comments": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "text": { "type": "string" },
          "author": { "type": "string" },
          "date": { "type": "string", "format": "date-time" }
        }
      },
      "description": "Task comments"
    },
    "created_date": {
      "type": "string",
      "format": "date-time",
      "description": "Task creation date"
    },
    "updated_date": {
      "type": "string",
      "format": "date-time",
      "description": "Last update date"
    },
    "last_activity_date": {
      "type": "string",
      "format": "date-time",
      "description": "Last activity date"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Task tags"
    },
    "custom_fields": {
      "type": "object",
      "description": "Custom field values"
    },
    "auto_created": {
      "type": "boolean",
      "default": false,
      "description": "Whether task was auto-created"
    },
    "workflow_step": {
      "type": "string",
      "description": "Current workflow step"
    },
    "next_task_id": {
      "type": "string",
      "description": "Next task in workflow"
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
    "requires_approval": {
      "type": "boolean",
      "default": false,
      "description": "Whether task requires approval"
    },
    "approved_by": {
      "type": "string",
      "description": "Approver name"
    },
    "approval_date": {
      "type": "string",
      "format": "date-time",
      "description": "Approval date"
    },
    "compliance_required": {
      "type": "boolean",
      "default": false,
      "description": "Whether compliance check is required"
    },
    "quality_checked": {
      "type": "boolean",
      "default": false,
      "description": "Whether quality check is completed"
    },
    "communication_method": {
      "type": "string",
      "enum": [
        "Email",
        "Phone",
        "WhatsApp",
        "SMS",
        "Video Call",
        "In-Person",
        "Letter",
        "Other"
      ],
      "default": "Email",
      "description": "Preferred communication method"
    },
    "client_response_required": {
      "type": "boolean",
      "default": false,
      "description": "Whether client response is required"
    },
    "client_response_received": {
      "type": "boolean",
      "default": false,
      "description": "Whether client response was received"
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
    }
  },
  "required": [
    "title",
    "type"
  ],
  "additionalProperties": false
};
