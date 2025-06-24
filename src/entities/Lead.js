import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

// Lead Entity Class for Visa Flow Immigration Services
export class Lead {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.name = data.name || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.secondary_phone = data.secondary_phone || '';
    this.source = data.source || 'Website';
    this.source_details = data.source_details || '';
    this.status = data.status || 'New';
    this.priority = data.priority || 'Medium';
    this.notes = data.notes || '';
    this.last_contacted = data.last_contacted || null;
    this.next_follow_up = data.next_follow_up || null;
    this.assigned_to = data.assigned_to || '';
    this.interest_area = data.interest_area || 'Express Entry';
    this.secondary_interests = data.secondary_interests || [];
    this.target_country = data.target_country || 'Canada';
    this.current_country = data.current_country || '';
    this.nationality = data.nationality || '';
    this.age = data.age || null;
    this.education_level = data.education_level || '';
    this.work_experience_years = data.work_experience_years || null;
    this.occupation = data.occupation || '';
    this.language_skills = data.language_skills || {
      english: 'Intermediate',
      french: 'None',
      other_languages: []
    };
    this.budget_range = data.budget_range || 'Not Specified';
    this.timeline = data.timeline || 'Not Specified';
    this.family_members = data.family_members || 0;
    this.spouse_details = data.spouse_details || {
      has_spouse: false,
      spouse_education: '',
      spouse_work_experience: null,
      spouse_occupation: ''
    };
    this.consultation_requested = data.consultation_requested || false;
    this.consultation_date = data.consultation_date || null;
    this.lead_score = data.lead_score || 0;
    this.conversion_probability = data.conversion_probability || 'Medium';
    this.referral_source_name = data.referral_source_name || '';
    this.marketing_campaign = data.marketing_campaign || '';
    this.utm_source = data.utm_source || '';
    this.utm_medium = data.utm_medium || '';
    this.utm_campaign = data.utm_campaign || '';
    this.created_date = data.created_date || new Date().toISOString();
    this.updated_date = data.updated_date || new Date().toISOString();
    this.tags = data.tags || [];
    this.communication_preferences = data.communication_preferences || {
      preferred_method: 'Email',
      preferred_time: 'Flexible',
      timezone: 'EST'
    };
    this.gdpr_consent = data.gdpr_consent || false;
    this.marketing_consent = data.marketing_consent || false;
  }

  generateId() {
    return 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Static methods for CRUD operations
  static async create(leadData) {
    const lead = new Lead(leadData);
    lead.updated_date = new Date().toISOString();

    // Calculate lead score
    lead.lead_score = lead.calculateLeadScore();

    // Use Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .insert([{
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            secondary_phone: lead.secondary_phone,
            source: lead.source,
            source_details: lead.source_details,
            status: lead.status,
            priority: lead.priority,
            notes: lead.notes,
            last_contacted: lead.last_contacted,
            next_follow_up: lead.next_follow_up,
            assigned_to: lead.assigned_to,
            interest_area: lead.interest_area,
            secondary_interests: lead.secondary_interests,
            target_country: lead.target_country,
            current_country: lead.current_country,
            nationality: lead.nationality,
            age: lead.age,
            education_level: lead.education_level,
            work_experience_years: lead.work_experience_years,
            occupation: lead.occupation,
            language_skills: lead.language_skills,
            budget_range: lead.budget_range,
            timeline: lead.timeline,
            family_members: lead.family_members,
            spouse_details: lead.spouse_details,
            consultation_requested: lead.consultation_requested,
            consultation_date: lead.consultation_date,
            referral_source_name: lead.referral_source_name,
            lead_score: lead.lead_score,
            created_date: lead.created_date,
            updated_date: lead.updated_date
          }])
          .select()
          .single();

        if (error) throw error;

        return new Lead(data);
      } catch (error) {
        console.error('Error creating lead in Supabase:', error);
        throw error;
      }
    } else {
      // Development mode - simulate success
      console.log('Development mode: Lead created locally', lead);
      return lead;
    }
  }

  static async getAll(filters = {}) {
    // Use Supabase if configured, otherwise fall back to mock data
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        // Apply filters if provided
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== 'all') {
            query = query.eq(key, value);
          }
        });

        const { data, error } = await query;

        if (error) throw error;

        return data.map(leadData => new Lead(leadData));
      } catch (error) {
        console.error('Error fetching leads from Supabase:', error);
        // Fall back to mock data on error
        return Lead.getMockData();
      }
    } else {
      // Development mode - use mock data
      return Lead.getMockData();
    }
  }

  static async list(sortBy = '-created_date') {
    try {
      const leads = await this.getAll();

      // Simple sorting logic
      if (sortBy.startsWith('-')) {
        const field = sortBy.substring(1);
        return leads.sort((a, b) => new Date(b[field]) - new Date(a[field]));
      } else {
        return leads.sort((a, b) => new Date(a[sortBy]) - new Date(b[sortBy]));
      }
    } catch (error) {
      console.error('Error listing leads:', error);
      return Lead.getMockData();
    }
  }

  static async getById(id) {
    try {
      const response = await fetch(`/api/leads/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch lead');
      }

      const data = await response.json();
      return new Lead(data);
    } catch (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
  }

  async update(updateData) {
    try {
      Object.assign(this, updateData);
      this.updated_date = new Date().toISOString();

      // Recalculate lead score
      this.lead_score = this.calculateLeadScore();

      const response = await fetch(`/api/leads/${this.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this),
      });

      if (!response.ok) {
        throw new Error('Failed to update lead');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  }

  async delete() {
    try {
      const response = await fetch(`/api/leads/${this.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete lead');
      }

      return true;
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }

  // Business logic methods
  calculateLeadScore() {
    let score = 0;

    // Contact information completeness (20 points)
    if (this.email) score += 10;
    if (this.phone) score += 10;

    // Immigration readiness (30 points)
    if (this.education_level && this.education_level !== 'High School') score += 10;
    if (this.work_experience_years && this.work_experience_years >= 2) score += 10;
    if (this.language_skills.english === 'Advanced' || this.language_skills.english === 'Native') score += 10;

    // Engagement level (25 points)
    if (this.consultation_requested) score += 15;
    if (this.notes && this.notes.length > 50) score += 10;

    // Budget and timeline (25 points)
    if (this.budget_range && !this.budget_range.includes('Not Specified')) score += 10;
    if (this.timeline && !this.timeline.includes('Not Specified')) score += 15;

    return Math.min(score, 100);
  }

  getStatusColor() {
    const statusColors = {
      'New': 'blue',
      'Contacted': 'yellow',
      'Needs Follow-Up': 'orange',
      'Qualified': 'green',
      'Proposal Sent': 'purple',
      'Negotiating': 'indigo',
      'Converted': 'emerald',
      'Lost': 'red',
      'On Hold': 'gray'
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
    if (!this.next_follow_up) return false;
    return new Date(this.next_follow_up) < new Date();
  }

  getDaysUntilFollowUp() {
    if (!this.next_follow_up) return null;
    const followUpDate = new Date(this.next_follow_up);
    const today = new Date();
    const diffTime = followUpDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getFormattedCreatedDate() {
    return new Date(this.created_date).toLocaleDateString();
  }

  getFormattedLastContacted() {
    if (!this.last_contacted) return 'Never';
    return new Date(this.last_contacted).toLocaleDateString();
  }

  // Mock data for development
  static getMockData() {
    return [
      new Lead({
        id: 'lead_1',
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+27 82 123 4567',
        source: 'Website',
        status: 'New',
        priority: 'High',
        interest_area: 'Express Entry',
        target_country: 'Canada',
        current_country: 'South Africa',
        nationality: 'South African',
        age: 28,
        education_level: "Bachelor's Degree",
        work_experience_years: 5,
        occupation: 'Software Developer',
        language_skills: {
          english: 'Advanced',
          french: 'Basic',
          other_languages: ['Mandarin']
        },
        budget_range: '$5,000 - $10,000',
        timeline: 'Short-term (3-6 months)',
        consultation_requested: true,
        assigned_to: 'Sarah Johnson',
        notes: 'Interested in Express Entry. Has strong technical background.',
        created_date: '2024-01-15T10:30:00Z'
      }),
      new Lead({
        id: 'lead_2',
        name: 'Sarah Williams',
        email: 'sarah.williams@email.com',
        phone: '+27 83 987 6543',
        source: 'Facebook',
        status: 'Contacted',
        priority: 'Medium',
        interest_area: 'Family Sponsorship',
        target_country: 'Canada',
        current_country: 'South Africa',
        nationality: 'South African',
        age: 32,
        education_level: "Master's Degree",
        work_experience_years: 8,
        occupation: 'Marketing Manager',
        language_skills: {
          english: 'Native',
          french: 'None',
          other_languages: ['Afrikaans']
        },
        budget_range: '$2,000 - $5,000',
        timeline: 'Medium-term (6-12 months)',
        family_members: 2,
        spouse_details: {
          has_spouse: true,
          spouse_education: "Bachelor's Degree",
          spouse_work_experience: 6,
          spouse_occupation: 'Engineer'
        },
        assigned_to: 'Mike Chen',
        notes: 'Spouse is Canadian citizen. Looking to sponsor family.',
        last_contacted: '2024-01-20T14:15:00Z',
        created_date: '2024-01-18T09:45:00Z'
      }),
      new Lead({
        id: 'lead_3',
        name: 'David Thompson',
        email: 'david.thompson@email.com',
        phone: '+27 84 555 7890',
        source: 'Referral',
        status: 'Qualified',
        priority: 'High',
        interest_area: 'Student Visa',
        target_country: 'Canada',
        current_country: 'South Africa',
        nationality: 'South African',
        age: 24,
        education_level: "Bachelor's Degree",
        work_experience_years: 2,
        occupation: 'Recent Graduate',
        language_skills: {
          english: 'Advanced',
          french: 'Intermediate',
          other_languages: []
        },
        budget_range: '$10,000 - $20,000',
        timeline: 'Immediate (1-3 months)',
        consultation_requested: true,
        consultation_date: '2024-01-25T11:00:00Z',
        assigned_to: 'Emma Davis',
        referral_source_name: 'John Smith',
        notes: 'Referred by existing client. Ready to proceed with application.',
        last_contacted: '2024-01-22T16:30:00Z',
        next_follow_up: '2024-01-26T10:00:00Z',
        created_date: '2024-01-20T13:20:00Z'
      })
    ];
  }
}

// JSON Schema for validation
export const LeadSchema = {
  "name": "Lead",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique lead identifier"
    },
    "name": {
      "type": "string",
      "description": "Lead's full name",
      "minLength": 2,
      "maxLength": 100
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "Primary email address"
    },
    "phone": {
      "type": "string",
      "description": "Primary phone number with country code",
      "pattern": "^\\+?[1-9]\\d{1,14}$"
    },
    "secondary_phone": {
      "type": "string",
      "description": "Secondary/WhatsApp phone number",
      "pattern": "^\\+?[1-9]\\d{1,14}$"
    },
    "source": {
      "type": "string",
      "enum": [
        "Website",
        "Facebook",
        "WhatsApp",
        "Referral",
        "LinkedIn",
        "Instagram",
        "Walk-in",
        "Email",
        "Google Ads",
        "YouTube",
        "TikTok",
        "Radio",
        "Print Media",
        "Immigration Fair",
        "Partner Agency",
        "Other"
      ],
      "description": "How the lead found us"
    },
    "source_details": {
      "type": "string",
      "description": "Additional details about the lead source"
    },
    "status": {
      "type": "string",
      "enum": [
        "New",
        "Contacted",
        "Needs Follow-Up",
        "Qualified",
        "Proposal Sent",
        "Negotiating",
        "Converted",
        "Lost",
        "On Hold"
      ],
      "default": "New",
      "description": "Current lead status in the pipeline"
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
      "description": "Lead priority level"
    },
    "notes": {
      "type": "string",
      "description": "Consultant notes about the lead",
      "maxLength": 2000
    },
    "last_contacted": {
      "type": "string",
      "format": "date-time",
      "description": "Last contact date and time"
    },
    "next_follow_up": {
      "type": "string",
      "format": "date-time",
      "description": "Scheduled next follow-up date"
    },
    "assigned_to": {
      "type": "string",
      "description": "Name of assigned consultant"
    },
    "interest_area": {
      "type": "string",
      "enum": [
        "Express Entry",
        "Provincial Nominee Program",
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
      "description": "Primary immigration service interest"
    },
    "secondary_interests": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "Express Entry",
          "Provincial Nominee Program", 
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
          "Travel Document"
        ]
      },
      "description": "Additional immigration interests"
    },
    "target_country": {
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
      "default": "Canada",
      "description": "Desired immigration destination"
    },
    "current_country": {
      "type": "string",
      "description": "Lead's current country of residence"
    },
    "nationality": {
      "type": "string",
      "description": "Lead's nationality/citizenship"
    },
    "age": {
      "type": "integer",
      "minimum": 16,
      "maximum": 80,
      "description": "Lead's age"
    },
    "education_level": {
      "type": "string",
      "enum": [
        "High School",
        "Diploma/Certificate",
        "Bachelor's Degree",
        "Master's Degree",
        "PhD/Doctorate",
        "Professional Degree",
        "Other"
      ],
      "description": "Highest education level"
    },
    "work_experience_years": {
      "type": "integer",
      "minimum": 0,
      "maximum": 50,
      "description": "Years of work experience"
    },
    "occupation": {
      "type": "string",
      "description": "Current or primary occupation"
    },
    "language_skills": {
      "type": "object",
      "properties": {
        "english": {
          "type": "string",
          "enum": ["None", "Basic", "Intermediate", "Advanced", "Native"]
        },
        "french": {
          "type": "string", 
          "enum": ["None", "Basic", "Intermediate", "Advanced", "Native"]
        },
        "other_languages": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "description": "Language proficiency levels"
    },
    "budget_range": {
      "type": "string",
      "enum": [
        "Under $2,000",
        "$2,000 - $5,000",
        "$5,000 - $10,000",
        "$10,000 - $20,000",
        "Over $20,000",
        "Not Specified"
      ],
      "description": "Expected budget for immigration services"
    },
    "timeline": {
      "type": "string",
      "enum": [
        "Immediate (1-3 months)",
        "Short-term (3-6 months)",
        "Medium-term (6-12 months)",
        "Long-term (1-2 years)",
        "Flexible",
        "Not Specified"
      ],
      "description": "Desired immigration timeline"
    },
    "family_members": {
      "type": "integer",
      "minimum": 0,
      "maximum": 20,
      "description": "Number of family members to include"
    },
    "spouse_details": {
      "type": "object",
      "properties": {
        "has_spouse": {
          "type": "boolean"
        },
        "spouse_education": {
          "type": "string",
          "enum": [
            "High School",
            "Diploma/Certificate", 
            "Bachelor's Degree",
            "Master's Degree",
            "PhD/Doctorate",
            "Professional Degree",
            "Other"
          ]
        },
        "spouse_work_experience": {
          "type": "integer",
          "minimum": 0,
          "maximum": 50
        },
        "spouse_occupation": {
          "type": "string"
        }
      },
      "description": "Spouse information for family applications"
    },
    "consultation_requested": {
      "type": "boolean",
      "default": false,
      "description": "Whether lead has requested a consultation"
    },
    "consultation_date": {
      "type": "string",
      "format": "date-time",
      "description": "Scheduled consultation date"
    },
    "lead_score": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "description": "Calculated lead quality score"
    },
    "conversion_probability": {
      "type": "string",
      "enum": [
        "Very Low",
        "Low", 
        "Medium",
        "High",
        "Very High"
      ],
      "description": "Estimated probability of conversion"
    },
    "referral_source_name": {
      "type": "string",
      "description": "Name of person who referred this lead"
    },
    "marketing_campaign": {
      "type": "string",
      "description": "Marketing campaign that generated this lead"
    },
    "utm_source": {
      "type": "string",
      "description": "UTM source for digital marketing tracking"
    },
    "utm_medium": {
      "type": "string", 
      "description": "UTM medium for digital marketing tracking"
    },
    "utm_campaign": {
      "type": "string",
      "description": "UTM campaign for digital marketing tracking"
    },
    "created_date": {
      "type": "string",
      "format": "date-time",
      "description": "Lead creation timestamp"
    },
    "updated_date": {
      "type": "string",
      "format": "date-time",
      "description": "Last update timestamp"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Custom tags for lead categorization"
    },
    "communication_preferences": {
      "type": "object",
      "properties": {
        "preferred_method": {
          "type": "string",
          "enum": ["Email", "Phone", "WhatsApp", "SMS", "Video Call"]
        },
        "preferred_time": {
          "type": "string",
          "enum": ["Morning", "Afternoon", "Evening", "Flexible"]
        },
        "timezone": {
          "type": "string",
          "description": "Lead's timezone"
        }
      },
      "description": "Communication preferences"
    },
    "gdpr_consent": {
      "type": "boolean",
      "description": "GDPR consent for data processing"
    },
    "marketing_consent": {
      "type": "boolean", 
      "description": "Consent for marketing communications"
    }
  },
  "required": [
    "name",
    "source",
    "interest_area",
    "target_country"
  ],
  "additionalProperties": false
}
