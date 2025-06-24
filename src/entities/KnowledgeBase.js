import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

// KnowledgeBase Entity Class for Visa Flow Immigration Services
export class KnowledgeBase {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.title = data.title || '';
    this.visa_code = data.visa_code || '';
    this.country = data.country || '';
    this.visa_type = data.visa_type || '';
    this.category = data.category || 'Work Visa';
    this.icon = data.icon || '🌍';
    
    // Structured content
    this.eligibility_criteria = data.eligibility_criteria || {};
    this.application_process = data.application_process || {};
    this.key_requirements = data.key_requirements || {};
    this.official_links = data.official_links || {};
    this.points_system = data.points_system || {};
    this.occupation_lists = data.occupation_lists || {};
    this.language_requirements = data.language_requirements || {};
    this.salary_thresholds = data.salary_thresholds || {};
    
    // Additional details
    this.processing_times = data.processing_times || '';
    this.fees = data.fees || {};
    this.validity_period = data.validity_period || '';
    this.pathway_to_pr = data.pathway_to_pr || false;
    this.family_inclusion = data.family_inclusion || false;
    
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
    return 'kb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Static methods for CRUD operations
  static async create(kbData) {
    try {
      const kb = new KnowledgeBase(kbData);
      kb.updated_at = new Date().toISOString();
      kb.search_keywords = kb.generateSearchKeywords();
      
      // Simulate API call
      const response = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kb),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create knowledge base entry');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating knowledge base entry:', error);
      throw error;
    }
  }

  static async getAll(filters = {}) {
    // Check if we're in development mode and should use mock data
    const isDevelopment = import.meta.env.DEV || !isSupabaseConfigured();

    if (isDevelopment) {
      // In development without Supabase, use mock data directly
      return KnowledgeBase.getMockData();
    }

    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/knowledge-base?${queryParams}`);

      if (!response.ok) {
        // API endpoint doesn't exist, fall back to mock data silently
        return KnowledgeBase.getMockData();
      }

      const data = await response.json();
      return data.map(kbData => new KnowledgeBase(kbData));
    } catch (error) {
      // Silently fall back to mock data for development
      return KnowledgeBase.getMockData();
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
      return KnowledgeBase.getMockData();
    }
  }

  static async getById(id) {
    try {
      const response = await fetch(`/api/knowledge-base/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch knowledge base entry');
      }
      
      const data = await response.json();
      return new KnowledgeBase(data);
    } catch (error) {
      console.error('Error fetching knowledge base entry:', error);
      throw error;
    }
  }

  async update(updateData) {
    try {
      Object.assign(this, updateData);
      this.updated_at = new Date().toISOString();
      this.version_number++;
      this.search_keywords = this.generateSearchKeywords();
      
      const response = await fetch(`/api/knowledge-base/${this.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update knowledge base entry');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating knowledge base entry:', error);
      throw error;
    }
  }

  async delete() {
    try {
      const response = await fetch(`/api/knowledge-base/${this.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete knowledge base entry');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting knowledge base entry:', error);
      throw error;
    }
  }

  // Business logic methods
  generateSearchKeywords() {
    const keywords = [
      this.title,
      this.visa_type,
      this.country,
      this.visa_code,
      this.category,
      ...(this.tags || [])
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
      new KnowledgeBase({
        id: 'kb_1',
        title: 'Skilled Independent Visa (189)',
        visa_code: '189',
        country: 'Australia',
        visa_type: 'Skilled Independent Visa',
        category: 'Work Visa',
        icon: '🇦🇺',
        eligibility_criteria: {
          overview: 'Points-based system for skilled workers who are not sponsored by an employer, state, or family member.',
          minimum_points: 65,
          age_limit: 'Under 45 years at time of invitation',
          occupation_requirement: 'Occupation must be on the Medium and Long-term Strategic Skills List (MLTSSL)',
          skills_assessment: 'Positive skills assessment from relevant assessing authority',
          english_requirement: 'Competent English (IELTS 6.0 each band or equivalent)'
        },
        application_process: {
          step1: 'Submit Expression of Interest (EOI) through SkillSelect',
          step2: 'Receive invitation to apply (if selected)',
          step3: 'Lodge visa application within 60 days of invitation',
          step4: 'Provide biometrics and health examinations',
          step5: 'Wait for visa decision'
        },
        key_requirements: {
          points_test: 'Minimum 65 points (higher scores increase chances)',
          skills_assessment: 'Valid positive skills assessment',
          english_proficiency: 'Competent English minimum (IELTS 6.0 each band)',
          age: 'Under 45 years at time of invitation',
          health_character: 'Meet health and character requirements',
          occupation: 'Nominated occupation on MLTSSL'
        },
        official_links: {
          main_page: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189',
          skillselect: 'https://www.skillselect.gov.au/',
          mltssl: 'https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list',
          points_calculator: 'https://immi.homeaffairs.gov.au/help-support/tools/points-calculator'
        },
        points_system: {
          age_18_24: 25,
          age_25_32: 30,
          age_33_39: 25,
          age_40_44: 15,
          english_competent: 0,
          english_proficient: 10,
          english_superior: 20,
          bachelor_degree: 15,
          masters_degree: 15,
          doctorate: 20,
          work_experience_3_5_years: 5,
          work_experience_5_8_years: 10,
          work_experience_8_plus_years: 15
        },
        processing_times: '5 to 8 months',
        fees: {
          main_applicant: 4640,
          additional_applicant_18_plus: 2320,
          additional_applicant_under_18: 1160,
          currency: 'AUD'
        },
        validity_period: 'Permanent residence',
        pathway_to_pr: true,
        family_inclusion: true,
        last_updated: '2024-06-24T00:00:00Z',
        updated_by: 'System',
        tags: ['Australia', 'Skilled', 'Independent', 'Points-based', 'Permanent'],
        search_keywords: 'australia skilled independent visa 189 permanent residence points'
      }),

      new KnowledgeBase({
        id: 'kb_2',
        title: 'Accredited Employer Work Visa',
        visa_code: 'AEWV',
        country: 'New Zealand',
        visa_type: 'Accredited Employer Work Visa',
        category: 'Work Visa',
        icon: '🇳🇿',
        eligibility_criteria: {
          overview: 'For skilled workers with a job offer from an accredited New Zealand employer.',
          employer_requirement: 'Job offer from Immigration New Zealand accredited employer',
          skill_level: 'Job must be skilled (ANZSCO skill levels 1-3)',
          salary_requirement: 'Meet median wage threshold (NZ$29.66 per hour as of 2024)',
          english_requirement: 'Meet English language requirements',
          health_character: 'Meet health and character requirements'
        },
        application_process: {
          step1: 'Employer obtains accreditation with Immigration New Zealand',
          step2: 'Employer makes job offer and supports visa application',
          step3: 'Submit visa application online with required documents',
          step4: 'Provide biometrics if required',
          step5: 'Complete medical examinations if required',
          step6: 'Wait for visa decision'
        },
        key_requirements: {
          job_offer: 'Valid job offer from accredited employer',
          skill_level: 'Job at ANZSCO skill levels 1, 2, or 3',
          salary: 'Minimum NZ$29.66 per hour (median wage)',
          english: 'IELTS 6.5 overall (no band less than 6.0) or equivalent',
          qualifications: 'Relevant qualifications for the role',
          experience: 'Relevant work experience'
        },
        official_links: {
          main_page: 'https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/accredited-employer-work-visa',
          employer_accreditation: 'https://www.immigration.govt.nz/employ-migrants/accredited-employer-work-visa',
          skill_shortage_list: 'https://www.immigration.govt.nz/employ-migrants/explore-your-options/long-term-skill-shortage-list',
          wage_rates: 'https://www.employment.govt.nz/hours-and-wages/pay/minimum-wage/minimum-wage-rates/'
        },
        salary_thresholds: {
          median_wage: 29.66,
          currency: 'NZD',
          per: 'hour',
          updated: '2024-04-01'
        },
        processing_times: '1 to 6 months',
        fees: {
          main_applicant: 645,
          partner: 645,
          dependent_child: 345,
          currency: 'NZD'
        },
        validity_period: 'Up to 5 years (depends on job offer)',
        pathway_to_pr: true,
        family_inclusion: true,
        last_updated: '2024-06-24T00:00:00Z',
        updated_by: 'System',
        tags: ['New Zealand', 'Employer Sponsored', 'Skilled', 'Work Visa'],
        search_keywords: 'new zealand accredited employer work visa aewv skilled worker'
      }),

      new KnowledgeBase({
        id: 'kb_3',
        title: 'Express Entry (Skilled Worker)',
        visa_code: 'Express Entry',
        country: 'Canada',
        visa_type: 'Federal Skilled Worker Program',
        category: 'Work Visa',
        icon: '🇨🇦',
        eligibility_criteria: {
          overview: 'Points-based system for skilled workers seeking permanent residence in Canada.',
          work_experience: 'At least 1 year continuous full-time skilled work experience',
          language_requirement: 'CLB 7 in English and/or French',
          education: 'Canadian secondary credential or foreign credential with ECA',
          funds: 'Proof of funds to support yourself and family',
          admissibility: 'No criminal record, pass medical exam'
        },
        application_process: {
          step1: 'Complete language tests (IELTS/CELPIP for English, TEF/TCF for French)',
          step2: 'Get Educational Credential Assessment (ECA) if educated outside Canada',
          step3: 'Create Express Entry profile online',
          step4: 'Receive Invitation to Apply (ITA) if selected',
          step5: 'Submit complete application within 60 days',
          step6: 'Provide biometrics and medical exams'
        },
        key_requirements: {
          crs_score: 'Competitive Comprehensive Ranking System (CRS) score',
          language: 'CLB 7 minimum (IELTS 6.0 each band)',
          work_experience: '1+ years skilled work experience (NOC TEER 0, 1, 2, 3)',
          education: 'Secondary education minimum',
          funds: 'CAD $13,757 for single applicant (2024)',
          age: 'No age limit but points decrease after 29'
        },
        official_links: {
          main_page: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html',
          crs_calculator: 'https://www.cic.gc.ca/english/immigrate/skilled/crs-tool.asp',
          noc_finder: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/find-national-occupation-classification.html',
          proof_of_funds: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/proof-funds.html'
        },
        points_system: {
          age_max: 100,
          education_max: 150,
          language_first_max: 136,
          language_second_max: 24,
          work_experience_max: 80,
          arranged_employment_max: 200,
          adaptability_max: 600,
          total_max: 1200
        },
        processing_times: '6 months after receiving complete application',
        fees: {
          main_applicant: 1365,
          spouse_partner: 1365,
          dependent_child: 230,
          right_of_permanent_residence_fee: 515,
          currency: 'CAD'
        },
        validity_period: 'Permanent residence',
        pathway_to_pr: true,
        family_inclusion: true,
        last_updated: '2024-06-24T00:00:00Z',
        updated_by: 'System',
        tags: ['Canada', 'Express Entry', 'Skilled Worker', 'Permanent', 'Points-based'],
        search_keywords: 'canada express entry skilled worker federal program permanent residence'
      }),

      new KnowledgeBase({
        id: 'kb_4',
        title: 'Skilled Worker Visa',
        visa_code: 'Skilled Worker',
        country: 'United Kingdom',
        visa_type: 'Skilled Worker Visa',
        category: 'Work Visa',
        icon: '🇬🇧',
        eligibility_criteria: {
          overview: 'For skilled workers with a job offer from a UK employer with a sponsor licence.',
          job_offer: 'Job offer from approved UK sponsor',
          skill_level: 'Job at RQF level 3 or above (equivalent to A level)',
          salary_requirement: 'Minimum £26,200 or going rate for occupation, whichever is higher',
          english_requirement: 'English language requirement at B1 level',
          sponsor_licence: 'Employer must have valid sponsor licence'
        },
        application_process: {
          step1: 'Employer obtains sponsor licence from UK Visas and Immigration',
          step2: 'Employer issues Certificate of Sponsorship (CoS)',
          step3: 'Apply online for Skilled Worker visa',
          step4: 'Pay visa fee and immigration health surcharge',
          step5: 'Provide biometrics and documents',
          step6: 'Wait for decision'
        },
        key_requirements: {
          certificate_of_sponsorship: 'Valid CoS from licensed sponsor',
          salary: 'Minimum £26,200 or going rate for job',
          skill_level: 'Job at RQF level 3 or above',
          english: 'B1 level English (IELTS 4.0 overall minimum)',
          maintenance_funds: '£1,270 for 28 days before applying',
          criminal_record: 'Criminal record certificate if required'
        },
        official_links: {
          main_page: 'https://www.gov.uk/skilled-worker-visa',
          sponsor_licence: 'https://www.gov.uk/uk-visa-sponsorship-employers',
          salary_requirements: 'https://www.gov.uk/skilled-worker-visa/your-job',
          english_requirements: 'https://www.gov.uk/skilled-worker-visa/knowledge-of-english'
        },
        salary_thresholds: {
          general_minimum: 26200,
          going_rate: 'Varies by occupation',
          currency: 'GBP',
          per: 'year',
          updated: '2024-04-04'
        },
        processing_times: '3 weeks (outside UK), 8 weeks (inside UK)',
        fees: {
          up_to_3_years: 719,
          more_than_3_years: 1420,
          immigration_health_surcharge: 1035,
          currency: 'GBP',
          per: 'year'
        },
        validity_period: 'Up to 5 years',
        pathway_to_pr: true,
        family_inclusion: true,
        last_updated: '2024-06-24T00:00:00Z',
        updated_by: 'System',
        tags: ['United Kingdom', 'Skilled Worker', 'Sponsored', 'Work Visa'],
        search_keywords: 'uk united kingdom skilled worker visa sponsored employment'
      }),

      new KnowledgeBase({
        id: 'kb_5',
        title: 'Skilled Nominated Visa (190)',
        visa_code: '190',
        country: 'Australia',
        visa_type: 'Skilled Nominated Visa',
        category: 'Work Visa',
        icon: '🇦🇺',
        eligibility_criteria: {
          overview: 'Points-based system for skilled workers nominated by an Australian state or territory.',
          minimum_points: '65 points (including 5 points for nomination)',
          age_limit: 'Under 45 years at time of invitation',
          occupation_requirement: 'Occupation must be on the relevant state occupation list',
          skills_assessment: 'Positive skills assessment from relevant assessing authority',
          english_requirement: 'Competent English (IELTS 6.0 each band or equivalent)',
          state_nomination: 'Must be nominated by an Australian state or territory'
        },
        application_process: {
          step1: 'Check state/territory occupation lists and requirements',
          step2: 'Submit Expression of Interest (EOI) through SkillSelect',
          step3: 'Apply for state/territory nomination',
          step4: 'Receive invitation to apply (if nominated and selected)',
          step5: 'Lodge visa application within 60 days of invitation',
          step6: 'Provide biometrics and health examinations'
        },
        key_requirements: {
          points_test: 'Minimum 65 points (including 5 points for nomination)',
          skills_assessment: 'Valid positive skills assessment',
          english_proficiency: 'Competent English minimum (IELTS 6.0 each band)',
          age: 'Under 45 years at time of invitation',
          health_character: 'Meet health and character requirements',
          occupation: 'Nominated occupation on relevant state list',
          commitment: 'Commitment to live and work in nominating state for 2 years'
        },
        processing_times: '6 to 9 months',
        fees: {
          main_applicant: 4640,
          additional_applicant_18_plus: 2320,
          additional_applicant_under_18: 1160,
          currency: 'AUD'
        },
        validity_period: 'Permanent residence',
        pathway_to_pr: true,
        family_inclusion: true,
        last_updated: '2024-06-24T00:00:00Z',
        updated_by: 'System',
        tags: ['Australia', 'Skilled', 'Nominated', 'State Sponsored', 'Permanent'],
        search_keywords: 'australia skilled nominated visa 190 state territory permanent residence'
      })
    ];
  }
}

export default KnowledgeBase;
