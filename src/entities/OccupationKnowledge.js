import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

// OccupationKnowledge Entity Class for Visa Flow Immigration Services
export class OccupationKnowledge {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.occupation_title = data.occupation_title || '';
    this.anzsco_code = data.anzsco_code || '';
    this.occupation_category = data.occupation_category || '';
    this.skill_level = data.skill_level || 1;
    this.country = data.country || '';
    this.visa_types = data.visa_types || [];
    this.occupation_list = data.occupation_list || '';
    
    // Structured content
    this.eligibility_factors = data.eligibility_factors || {};
    this.application_steps = data.application_steps || {};
    this.skills_assessment = data.skills_assessment || {};
    this.experience_requirements = data.experience_requirements || {};
    this.education_requirements = data.education_requirements || {};
    this.english_requirements = data.english_requirements || {};
    this.licensing_requirements = data.licensing_requirements || {};
    this.salary_benchmarks = data.salary_benchmarks || {};
    this.job_outlook = data.job_outlook || {};
    this.related_occupations = data.related_occupations || {};
    this.assessment_authorities = data.assessment_authorities || {};
    this.special_conditions = data.special_conditions || {};
    this.success_tips = data.success_tips || {};
    this.common_issues = data.common_issues || {};
    
    // Additional details
    this.processing_notes = data.processing_notes || '';
    
    // Management
    this.status = data.status || 'Active';
    this.last_updated = data.last_updated || new Date().toISOString();
    this.updated_by = data.updated_by || '';
    this.version_number = data.version_number || 1;
    this.tags = data.tags || [];
    this.search_keywords = data.search_keywords || '';
    
    // Timestamps
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  generateId() {
    return 'occ_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Static methods for CRUD operations
  static async create(occData) {
    try {
      const occ = new OccupationKnowledge(occData);
      occ.updated_at = new Date().toISOString();
      occ.search_keywords = occ.generateSearchKeywords();
      
      // Simulate API call
      const response = await fetch('/api/occupation-knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(occ),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create occupation knowledge entry');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating occupation knowledge entry:', error);
      throw error;
    }
  }

  static async getAll(filters = {}) {
    // Check if we're in development mode and should use mock data
    const isDevelopment = import.meta.env.DEV || !isSupabaseConfigured();

    if (isDevelopment) {
      // In development without Supabase, use mock data directly
      return OccupationKnowledge.getMockData();
    }

    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/occupation-knowledge?${queryParams}`);

      if (!response.ok) {
        // API endpoint doesn't exist, fall back to mock data silently
        return OccupationKnowledge.getMockData();
      }

      const data = await response.json();
      return data.map(occData => new OccupationKnowledge(occData));
    } catch (error) {
      // Silently fall back to mock data for development
      return OccupationKnowledge.getMockData();
    }
  }

  static async list(sortBy = '-updated_at') {
    try {
      const entries = await this.getAll();

      // Simple sorting logic
      if (sortBy.startsWith('-')) {
        const field = sortBy.substring(1);
        return entries.sort((a, b) => new Date(b[field]) - new Date(a[field]));
      } else {
        return entries.sort((a, b) => new Date(a[sortBy]) - new Date(b[sortBy]));
      }
    } catch (error) {
      // Silently fall back to mock data
      return OccupationKnowledge.getMockData();
    }
  }

  static async getById(id) {
    try {
      const response = await fetch(`/api/occupation-knowledge/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch occupation knowledge entry');
      }
      
      const data = await response.json();
      return new OccupationKnowledge(data);
    } catch (error) {
      console.error('Error fetching occupation knowledge entry:', error);
      throw error;
    }
  }

  async update(updateData) {
    try {
      Object.assign(this, updateData);
      this.updated_at = new Date().toISOString();
      this.version_number++;
      this.search_keywords = this.generateSearchKeywords();
      
      const response = await fetch(`/api/occupation-knowledge/${this.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update occupation knowledge entry');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating occupation knowledge entry:', error);
      throw error;
    }
  }

  async delete() {
    try {
      const response = await fetch(`/api/occupation-knowledge/${this.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete occupation knowledge entry');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting occupation knowledge entry:', error);
      throw error;
    }
  }

  // Business logic methods
  generateSearchKeywords() {
    const keywords = [
      this.occupation_title,
      this.anzsco_code,
      this.occupation_category,
      this.country,
      this.occupation_list,
      ...(this.tags || []),
      ...(this.visa_types || [])
    ].filter(Boolean).join(' ').toLowerCase();
    
    return keywords;
  }

  getCountryFlag() {
    const flags = {
      'Australia': '🇦🇺',
      'New Zealand': '🇳🇿',
      'Canada': '🇨🇦',
      'United Kingdom': '🇬🇧',
      'UK': '🇬🇧'
    };
    return flags[this.country] || '🌍';
  }

  getSkillLevelDescription() {
    const levels = {
      1: 'Highly Skilled (Bachelor degree or higher)',
      2: 'Skilled (Diploma or Advanced Diploma)',
      3: 'Skilled (Certificate III/IV)',
      4: 'Semi-skilled (Certificate II)',
      5: 'Unskilled (Certificate I or secondary education)'
    };
    return levels[this.skill_level] || 'Not specified';
  }

  getOccupationIcon() {
    const category = this.occupation_category?.toLowerCase() || '';
    if (category.includes('trade')) return '🔧';
    if (category.includes('health')) return '⚕️';
    if (category.includes('education')) return '👨‍🏫';
    if (category.includes('engineering')) return '👷‍♂️';
    if (category.includes('it') || category.includes('technology')) return '💻';
    if (category.includes('business')) return '💼';
    if (category.includes('hospitality')) return '🍽️';
    return '👨‍💼';
  }

  getFormattedLastUpdated() {
    return new Date(this.last_updated).toLocaleDateString();
  }

  isRecent() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return new Date(this.last_updated) > sixMonthsAgo;
  }

  // Mock data for development
  static getMockData() {
    return [
      new OccupationKnowledge({
        id: 'occ_1',
        occupation_title: 'Plumber (General)',
        anzsco_code: '334111',
        occupation_category: 'Trades',
        skill_level: 3,
        country: 'Australia',
        visa_types: ['Skilled Independent (189)', 'Skilled Nominated (190)', 'Skilled Work Regional (491)'],
        occupation_list: 'MLTSSL',
        eligibility_factors: {
          occupation: 'Plumber (General), ANZSCO 334111, on MLTSSL',
          points_test_minimum: '65 points, based on age, English, experience, education',
          age_range: '18–44 years, with points decreasing for older applicants',
          english_proficiency: 'Competent English, e.g., IELTS 6.0+',
          skills_assessment_authority: 'TRA or VETASSESS, depending on country of origin',
          health_character: 'Must pass medical exam, provide police clearance'
        },
        application_steps: {
          skills_assessment: 'Obtain OTSR from TRA/VETASSESS, may involve interviews/tests',
          expression_of_interest: 'Submit via SkillSelect, ranked by points',
          invitation_to_apply: 'Receive invitation based on points and government needs',
          visa_application: 'Lodge with documents, pay fee (approx. AUD 4,115)'
        },
        skills_assessment: {
          authority: 'Trades Recognition Australia (TRA)',
          process: 'Offshore Technical Skills Record (OTSR)',
          requirements: 'Trade qualification + work experience evidence',
          duration: '12-16 weeks',
          cost: 'AUD $300-$500'
        },
        experience_requirements: {
          minimum: '2 years full-time post-qualification experience',
          preferred: '5+ years for higher points',
          documentation: 'Employment references, payslips, tax records'
        },
        education_requirements: {
          minimum: 'Certificate III in Plumbing or equivalent',
          recognition: 'Skills assessment required for overseas qualifications',
          additional: 'Australian apprenticeship preferred'
        },
        english_requirements: {
          minimum: 'IELTS 6.0 each band (Competent English)',
          preferred: 'IELTS 7.0+ for additional points',
          alternatives: 'PTE, TOEFL iBT, OET accepted'
        },
        licensing_requirements: {
          australia: 'Plumbing license required in each state/territory',
          process: 'Apply after arrival, may need bridging course',
          cost: 'Varies by state, typically AUD $200-$500'
        },
        salary_benchmarks: {
          entry_level: 'AUD $50,000-$65,000',
          experienced: 'AUD $65,000-$85,000',
          senior: 'AUD $85,000-$120,000',
          self_employed: 'AUD $80,000-$150,000+'
        },
        job_outlook: {
          demand: 'Strong demand due to construction boom',
          growth: '10% growth expected over 5 years',
          locations: 'High demand in Sydney, Melbourne, Brisbane, Perth'
        },
        assessment_authorities: {
          primary: 'Trades Recognition Australia (TRA)',
          alternative: 'VETASSESS (for some qualifications)',
          contact: 'www.tradesrecognitionaustralia.gov.au'
        },
        success_tips: {
          tip1: 'Gather comprehensive work experience documentation',
          tip2: 'Consider Australian apprenticeship for easier recognition',
          tip3: 'Research state licensing requirements early',
          tip4: 'Network with Australian plumbing associations'
        },
        common_issues: {
          issue1: 'Insufficient work experience documentation',
          issue2: 'Qualification not recognized by TRA',
          issue3: 'English test scores below requirements',
          issue4: 'Confusion about state licensing requirements'
        },
        last_updated: '2024-06-24T00:00:00Z',
        updated_by: 'System',
        tags: ['Trades', 'Plumbing', 'MLTSSL', 'TRA', 'High Demand'],
        search_keywords: 'plumber general 334111 trades australia mltssl tra skilled'
      }),

      new OccupationKnowledge({
        id: 'occ_2',
        occupation_title: 'Software Engineer',
        anzsco_code: '261313',
        occupation_category: 'ICT',
        skill_level: 1,
        country: 'Australia',
        visa_types: ['Skilled Independent (189)', 'Skilled Nominated (190)', 'Temporary Skill Shortage (482)'],
        occupation_list: 'MLTSSL',
        eligibility_factors: {
          occupation: 'Software Engineer, ANZSCO 261313, on MLTSSL',
          points_test_minimum: '65 points, based on age, English, experience, education',
          age_range: '18–44 years, with points decreasing for older applicants',
          english_proficiency: 'Competent English, e.g., IELTS 6.0+',
          skills_assessment_authority: 'ACS (Australian Computer Society)',
          health_character: 'Must pass medical exam, provide police clearance'
        },
        application_steps: {
          skills_assessment: 'Obtain positive skills assessment from ACS',
          expression_of_interest: 'Submit via SkillSelect, ranked by points',
          invitation_to_apply: 'Receive invitation based on points and government needs',
          visa_application: 'Lodge with documents, pay fee (approx. AUD 4,115)'
        },
        skills_assessment: {
          authority: 'Australian Computer Society (ACS)',
          process: 'Skills Assessment for Migration',
          requirements: 'ICT qualification + work experience evidence',
          duration: '12-16 weeks',
          cost: 'AUD $500-$600'
        },
        salary_benchmarks: {
          entry_level: 'AUD $70,000-$90,000',
          experienced: 'AUD $90,000-$130,000',
          senior: 'AUD $130,000-$180,000',
          lead_architect: 'AUD $180,000-$250,000+'
        },
        job_outlook: {
          demand: 'Very strong demand across all states',
          growth: '25% growth expected over 5 years',
          locations: 'High demand in Sydney, Melbourne, Brisbane, Perth, Adelaide'
        },
        last_updated: '2024-06-24T00:00:00Z',
        updated_by: 'System',
        tags: ['ICT', 'Software', 'MLTSSL', 'ACS', 'High Demand'],
        search_keywords: 'software engineer 261313 ict australia mltssl acs programming'
      }),

      new OccupationKnowledge({
        id: 'occ_3',
        occupation_title: 'Registered Nurse',
        anzsco_code: '254411',
        occupation_category: 'Healthcare',
        skill_level: 1,
        country: 'Australia',
        visa_types: ['Skilled Independent (189)', 'Skilled Nominated (190)', 'Skilled Work Regional (491)'],
        occupation_list: 'MLTSSL',
        eligibility_factors: {
          occupation: 'Registered Nurse, ANZSCO 254411, on MLTSSL',
          points_test_minimum: '65 points, based on age, English, experience, education',
          age_range: '18–44 years, with points decreasing for older applicants',
          english_proficiency: 'Competent English, e.g., IELTS 7.0+ (higher requirement)',
          skills_assessment_authority: 'AHPRA (Australian Health Practitioner Regulation Agency)',
          health_character: 'Must pass medical exam, provide police clearance'
        },
        application_steps: {
          skills_assessment: 'Obtain registration with AHPRA',
          expression_of_interest: 'Submit via SkillSelect, ranked by points',
          invitation_to_apply: 'Receive invitation based on points and government needs',
          visa_application: 'Lodge with documents, pay fee (approx. AUD 4,115)'
        },
        skills_assessment: {
          authority: 'Australian Health Practitioner Regulation Agency (AHPRA)',
          process: 'Nursing Registration Assessment',
          requirements: 'Nursing qualification + clinical experience + English test',
          duration: '8-12 weeks',
          cost: 'AUD $300-$400'
        },
        english_requirements: {
          minimum: 'IELTS 7.0 each band (higher than standard)',
          alternatives: 'OET Grade B, PTE Academic 65+',
          exemptions: 'Qualified in certain English-speaking countries'
        },
        salary_benchmarks: {
          graduate: 'AUD $65,000-$75,000',
          experienced: 'AUD $75,000-$95,000',
          senior: 'AUD $95,000-$120,000',
          nurse_manager: 'AUD $120,000-$150,000+'
        },
        job_outlook: {
          demand: 'Critical shortage across all states',
          growth: '15% growth expected over 5 years',
          locations: 'High demand everywhere, especially regional areas'
        },
        last_updated: '2024-06-24T00:00:00Z',
        updated_by: 'System',
        tags: ['Healthcare', 'Nursing', 'MLTSSL', 'AHPRA', 'Critical Shortage'],
        search_keywords: 'registered nurse 254411 healthcare australia mltssl ahpra nursing'
      })
    ];
  }
}

export default OccupationKnowledge;
