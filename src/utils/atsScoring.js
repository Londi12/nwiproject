// Enhanced ATS Scoring System for Immigration Visa Applications
// Designed for HR and Visa Flow Associate perspectives

import { isSupabaseConfigured } from '../lib/supabase.js';

// Enhanced ATS scoring weights - HR + Immigration optimized
export const ATS_SCORING_WEIGHTS = {
  // Core ATS factors (70% of total score) - HR Priority
  FORMATTING: {
    weight: 20, // Increased - critical for ATS parsing
    factors: {
      standardFonts: 4,
      properHeadings: 4,
      consistentSpacing: 3,
      bulletPoints: 3,
      readableLayout: 3,
      noGraphics: 3
    }
  },
  KEYWORDS: {
    weight: 25, // Increased - most critical for ATS matching
    factors: {
      jobTitleMatch: 7,
      skillsMatch: 7,
      industryTerms: 5,
      certificationMatch: 3,
      softSkills: 3
    }
  },
  STRUCTURE: {
    weight: 10, // Reduced - less critical than keywords/formatting
    factors: {
      contactInfo: 3,
      workExperience: 3,
      education: 2,
      skills: 1,
      chronologicalOrder: 1
    }
  },
  CONTENT_QUALITY: {
    weight: 15, // Increased - critical for HR review
    factors: {
      quantifiedAchievements: 5,
      actionVerbs: 3,
      relevantExperience: 4,
      completeness: 3
    }
  },

  // Immigration-specific factors (30% of total score) - Balanced approach
  IMMIGRATION_READINESS: {
    weight: 20, // Reduced but still significant
    factors: {
      visaTypeAlignment: 6,
      occupationMatch: 5,
      experienceYears: 4,
      educationLevel: 3,
      languageSkills: 2
    }
  },
  COMPLIANCE: {
    weight: 10, // Reduced - important but not primary ATS factor
    factors: {
      documentationReady: 3,
      certificationValid: 3,
      workPermitEligible: 2,
      backgroundCheck: 2
    }
  }
};

// Visa-specific requirements and scoring criteria
export const VISA_REQUIREMENTS = {
  'Express Entry': {
    minExperience: 1,
    preferredEducation: ['Bachelor', 'Master', 'PhD'],
    keySkills: ['English', 'French', 'Leadership', 'Management'],
    occupationLists: ['NOC 0', 'NOC A', 'NOC B'],
    ageBonus: { min: 20, max: 29, bonus: 10 },
    languageWeight: 0.3
  },
  'Provincial Nominee': {
    minExperience: 2,
    preferredEducation: ['Diploma', 'Bachelor', 'Master'],
    keySkills: ['Trade Certification', 'Provincial Experience'],
    occupationLists: ['Provincial Priority', 'In-Demand'],
    locationBonus: 5,
    employerSupport: 15
  },
  'Family Sponsorship': {
    minExperience: 0,
    preferredEducation: ['Any'],
    keySkills: ['Language Skills', 'Integration'],
    relationshipProof: 20,
    financialSupport: 15
  },
  'Student Visa': {
    minExperience: 0,
    preferredEducation: ['High School', 'Bachelor'],
    keySkills: ['Academic Performance', 'Language Proficiency'],
    institutionAccreditation: 25,
    financialProof: 20
  },
  'Work Permit': {
    minExperience: 1,
    preferredEducation: ['Relevant to Job'],
    keySkills: ['Job-Specific Skills'],
    lmiaSupport: 30,
    employerOffer: 25
  },
  'Skilled Worker (UK)': {
    minExperience: 1,
    preferredEducation: ['Bachelor', 'Master'],
    keySkills: ['English', 'Sponsorship Eligible'],
    salaryThreshold: 26200, // Updated to current 2024 threshold
    sponsorshipRequired: 30,
    englishRequirement: 'B1 minimum',
    skillsShortageBonus: 10
  }
};

// Enhanced industry-specific ATS keywords - 2024 updated
export const INDUSTRY_KEYWORDS = {
  'Software Engineering': {
    technical: [
      // Modern Frontend
      'React', 'TypeScript', 'Next.js', 'Vue.js', 'Angular', 'JavaScript', 'HTML5', 'CSS3',
      // Backend & Cloud
      'Node.js', 'Python', 'Java', 'C#', 'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
      // Data & AI
      'GraphQL', 'REST API', 'MongoDB', 'PostgreSQL', 'Redis', 'Machine Learning', 'AI',
      // DevOps & Tools
      'CI/CD', 'Jenkins', 'Git', 'Terraform', 'Microservices', 'Agile', 'Scrum'
    ],
    soft: ['Problem Solving', 'Team Collaboration', 'Code Review', 'Technical Leadership', 'Mentoring', 'Cross-functional'],
    certifications: ['AWS Certified', 'Google Cloud Professional', 'Microsoft Azure', 'Scrum Master', 'PMP', 'Kubernetes Certified'],
    immigration: ['NOC 21231', 'NOC 21230', 'Software Engineer', 'Full Stack Developer', 'Tech Lead', 'Senior Developer']
  },
  'Healthcare': {
    technical: [
      // Clinical Skills
      'Patient Care', 'Clinical Assessment', 'Treatment Planning', 'Medication Administration',
      // Technology
      'EMR', 'Epic', 'Cerner', 'MEDITECH', 'Electronic Health Records', 'Telehealth',
      // Specializations
      'ICU', 'Emergency Medicine', 'Surgical', 'Pediatric', 'Geriatric', 'Mental Health',
      // Compliance
      'HIPAA', 'Joint Commission', 'Quality Assurance', 'Infection Control'
    ],
    soft: ['Compassion', 'Communication', 'Critical Thinking', 'Attention to Detail', 'Empathy', 'Cultural Sensitivity'],
    certifications: ['RN License', 'BLS', 'ACLS', 'PALS', 'Medical License', 'CCRN', 'CNA', 'LPN'],
    immigration: ['NOC 31301', 'NOC 32101', 'Registered Nurse', 'Healthcare Professional', 'Licensed Practical Nurse']
  },
  'Skilled Trades': {
    technical: [
      // Electrical
      'Electrical Systems', 'Wiring', 'Circuit Design', 'Motor Control', 'PLC Programming',
      // Mechanical
      'Plumbing', 'HVAC', 'Welding', 'Fabrication', 'Hydraulics', 'Pneumatics',
      // Safety & Standards
      'OSHA', 'Safety Protocols', 'Blueprint Reading', 'Code Compliance', 'Quality Control',
      // Modern Tech
      'Building Automation', 'Smart Systems', 'Energy Efficiency', 'Renewable Energy'
    ],
    soft: ['Problem Solving', 'Physical Stamina', 'Attention to Detail', 'Safety Conscious', 'Team Coordination'],
    certifications: ['Red Seal', 'Trade License', 'OSHA 30', 'Apprenticeship', 'Journeyman', 'Master Electrician'],
    immigration: ['NOC 72200', 'NOC 72310', 'NOC 72400', 'Skilled Tradesperson', 'Journeyman', 'Master Tradesperson']
  },
  'Business Management': {
    technical: [
      // Financial
      'P&L Management', 'Budget Management', 'Financial Analysis', 'Cost Control', 'ROI Analysis',
      // Strategy
      'Strategic Planning', 'Business Development', 'Market Analysis', 'Competitive Intelligence',
      // Operations
      'Process Improvement', 'Supply Chain', 'Vendor Management', 'Quality Management',
      // Technology
      'ERP', 'CRM', 'Business Intelligence', 'Data Analytics', 'Digital Transformation'
    ],
    soft: ['Leadership', 'Communication', 'Decision Making', 'Negotiation', 'Change Management', 'Stakeholder Management'],
    certifications: ['MBA', 'PMP', 'Six Sigma', 'CPA', 'CFA', 'SHRM', 'Lean Six Sigma'],
    immigration: ['NOC 10010', 'NOC 10011', 'NOC 10020', 'Manager', 'Executive', 'Director', 'Senior Manager']
  }
};

/**
 * Calculate comprehensive ATS score for immigration applications
 */
export function calculateATSScore(cvData, targetVisa = 'Express Entry', targetIndustry = 'Software Engineering') {
  let totalScore = 0;
  let maxScore = 100;
  let breakdown = {};

  // 1. Formatting Score (15 points)
  const formattingScore = calculateFormattingScore(cvData);
  breakdown.formatting = formattingScore;
  totalScore += formattingScore.score;

  // 2. Keywords Score (20 points)
  const keywordsScore = calculateKeywordsScore(cvData, targetIndustry);
  breakdown.keywords = keywordsScore;
  totalScore += keywordsScore.score;

  // 3. Structure Score (15 points)
  const structureScore = calculateStructureScore(cvData);
  breakdown.structure = structureScore;
  totalScore += structureScore.score;

  // 4. Content Quality Score (10 points)
  const contentScore = calculateContentQualityScore(cvData);
  breakdown.content = contentScore;
  totalScore += contentScore.score;

  // 5. Immigration Readiness Score (25 points)
  const immigrationScore = calculateImmigrationReadinessScore(cvData, targetVisa);
  breakdown.immigration = immigrationScore;
  totalScore += immigrationScore.score;

  // 6. Compliance Score (15 points)
  const complianceScore = calculateComplianceScore(cvData, targetVisa);
  breakdown.compliance = complianceScore;
  totalScore += complianceScore.score;

  return {
    totalScore: Math.round(totalScore),
    maxScore,
    percentage: Math.round((totalScore / maxScore) * 100),
    breakdown,
    recommendations: generateRecommendations(breakdown, targetVisa, targetIndustry),
    visaReadiness: assessVisaReadiness(totalScore, targetVisa),
    competitiveAnalysis: getCompetitiveAnalysis(totalScore, targetIndustry)
  };
}

/**
 * Enhanced formatting score - ATS parsing accuracy focused
 */
function calculateFormattingScore(cvData) {
  let score = 0;
  let feedback = [];
  const maxScore = ATS_SCORING_WEIGHTS.FORMATTING.weight;

  // ATS-friendly structure validation (4 points)
  const hasStandardSections = ['personalInfo', 'experience', 'education', 'skills'].every(section =>
    cvData[section] && (Array.isArray(cvData[section]) ? cvData[section].length > 0 : Object.keys(cvData[section]).length > 0)
  );

  if (hasStandardSections) {
    score += 4;
    feedback.push("Standard ATS sections detected");
  } else {
    feedback.push("Missing standard sections - ensure Personal Info, Experience, Education, Skills are present");
  }

  // Contact information formatting (4 points)
  const contactScore = validateContactFormatting(cvData.personalInfo);
  score += contactScore.score;
  feedback.push(...contactScore.feedback);

  // Experience formatting quality (3 points)
  const experienceFormatting = validateExperienceFormatting(cvData.experience);
  score += experienceFormatting.score;
  feedback.push(...experienceFormatting.feedback);

  // Consistent date formatting (3 points)
  const dateFormatting = validateDateFormatting(cvData);
  score += dateFormatting.score;
  feedback.push(...dateFormatting.feedback);

  // Professional summary structure (3 points)
  if (cvData.summary && cvData.summary.length >= 100 && cvData.summary.length <= 300) {
    score += 3;
    feedback.push("Professional summary length optimal for ATS");
  } else if (cvData.summary && cvData.summary.length > 0) {
    score += 1.5;
    feedback.push("Professional summary present but consider 100-300 character range");
  } else {
    feedback.push("Add professional summary (100-300 characters optimal)");
  }

  // Skills formatting (3 points)
  const skillsFormatting = validateSkillsFormatting(cvData.skills);
  score += skillsFormatting.score;
  feedback.push(...skillsFormatting.feedback);

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    feedback,
    atsCompatibility: score >= (maxScore * 0.8) ? 'High' : score >= (maxScore * 0.6) ? 'Medium' : 'Low'
  };
}

/**
 * Validate contact information formatting for ATS
 */
function validateContactFormatting(personalInfo) {
  let score = 0;
  let feedback = [];
  const maxScore = 4;

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (personalInfo?.email && emailRegex.test(personalInfo.email)) {
    score += 1.5;
    feedback.push("Valid email format");
  } else {
    feedback.push("Add valid email address");
  }

  // Phone number validation
  const phoneRegex = /[\+]?[\d\s\-\(\)]{10,}/;
  if (personalInfo?.phone && phoneRegex.test(personalInfo.phone)) {
    score += 1.5;
    feedback.push("Valid phone format");
  } else {
    feedback.push("Add properly formatted phone number");
  }

  // Location formatting
  if (personalInfo?.location && personalInfo.location.includes(',')) {
    score += 1;
    feedback.push("Location properly formatted");
  } else if (personalInfo?.location) {
    score += 0.5;
    feedback.push("Consider format: City, Province/State, Country");
  } else {
    feedback.push("Add location information");
  }

  return { score: Math.min(score, maxScore), feedback };
}

/**
 * Validate experience section formatting
 */
function validateExperienceFormatting(experiences) {
  let score = 0;
  let feedback = [];
  const maxScore = 3;

  if (!experiences || experiences.length === 0) {
    feedback.push("Add work experience entries");
    return { score: 0, feedback };
  }

  // Check for bullet point formatting
  const hasBulletPoints = experiences.some(exp =>
    exp.description && (exp.description.includes('•') || exp.description.includes('-') || exp.description.includes('*'))
  );

  if (hasBulletPoints) {
    score += 1.5;
    feedback.push("Bullet points detected in experience");
  } else {
    feedback.push("Use bullet points for experience descriptions");
  }

  // Check for consistent structure
  const wellStructured = experiences.filter(exp =>
    exp.title && exp.company && exp.startDate && exp.description
  ).length;

  if (wellStructured === experiences.length) {
    score += 1.5;
    feedback.push("All experience entries well-structured");
  } else if (wellStructured > 0) {
    score += 0.75;
    feedback.push("Some experience entries missing details");
  } else {
    feedback.push("Ensure all experience entries have title, company, dates, description");
  }

  return { score: Math.min(score, maxScore), feedback };
}

/**
 * Validate date formatting consistency
 */
function validateDateFormatting(cvData) {
  let score = 0;
  let feedback = [];
  const maxScore = 3;

  const allDates = [];

  // Collect dates from experience
  if (cvData.experience) {
    cvData.experience.forEach(exp => {
      if (exp.startDate) allDates.push(exp.startDate);
      if (exp.endDate) allDates.push(exp.endDate);
    });
  }

  // Collect dates from education
  if (cvData.education) {
    cvData.education.forEach(edu => {
      if (edu.graduationDate) allDates.push(edu.graduationDate);
    });
  }

  if (allDates.length === 0) {
    feedback.push("Add dates to experience and education");
    return { score: 0, feedback };
  }

  // Check for consistent date format
  const dateFormats = {
    year: /^\d{4}$/,
    monthYear: /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}$/i,
    fullDate: /^\d{1,2}\/\d{1,2}\/\d{4}$/
  };

  let formatConsistency = 0;
  Object.values(dateFormats).forEach(format => {
    const matchingDates = allDates.filter(date => format.test(date)).length;
    if (matchingDates > formatConsistency) {
      formatConsistency = matchingDates;
    }
  });

  const consistencyRatio = formatConsistency / allDates.length;

  if (consistencyRatio >= 0.8) {
    score += 3;
    feedback.push("Consistent date formatting");
  } else if (consistencyRatio >= 0.6) {
    score += 2;
    feedback.push("Mostly consistent date formatting");
  } else {
    score += 1;
    feedback.push("Improve date formatting consistency (use YYYY or Mon YYYY format)");
  }

  return { score: Math.min(score, maxScore), feedback };
}

/**
 * Validate skills section formatting
 */
function validateSkillsFormatting(skills) {
  let score = 0;
  let feedback = [];
  const maxScore = 3;

  if (!skills) {
    feedback.push("Add skills section");
    return { score: 0, feedback };
  }

  let skillsArray = [];
  if (typeof skills === 'string') {
    skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
  } else if (Array.isArray(skills)) {
    skillsArray = skills;
  }

  if (skillsArray.length === 0) {
    feedback.push("Add skills to skills section");
    return { score: 0, feedback };
  }

  // Check skills count (optimal 8-15 skills)
  if (skillsArray.length >= 8 && skillsArray.length <= 15) {
    score += 1.5;
    feedback.push("Optimal number of skills listed");
  } else if (skillsArray.length >= 5) {
    score += 1;
    feedback.push("Good number of skills - consider 8-15 for optimal ATS matching");
  } else {
    score += 0.5;
    feedback.push("Add more skills (8-15 recommended)");
  }

  // Check for skill categorization indicators
  const hasCategories = typeof skills === 'string' &&
    (skills.includes(':') || skills.includes('Technical:') || skills.includes('Soft:'));

  if (hasCategories) {
    score += 1.5;
    feedback.push("Skills categorization detected");
  } else {
    feedback.push("Consider categorizing skills (Technical, Soft Skills, Languages)");
  }

  return { score: Math.min(score, maxScore), feedback };
}

/**
 * Calculate keywords score based on industry and visa requirements
 */
function calculateKeywordsScore(cvData, targetIndustry) {
  let score = 0;
  let feedback = [];
  const maxScore = ATS_SCORING_WEIGHTS.KEYWORDS.weight;
  
  const industryKeywords = INDUSTRY_KEYWORDS[targetIndustry] || INDUSTRY_KEYWORDS['Software Engineering'];
  const allText = JSON.stringify(cvData).toLowerCase();

  // Job title match
  const jobTitle = cvData.personalInfo?.jobTitle?.toLowerCase() || '';
  const titleKeywords = industryKeywords.immigration.map(k => k.toLowerCase());
  const titleMatches = titleKeywords.filter(keyword => 
    jobTitle.includes(keyword.toLowerCase()) || allText.includes(keyword.toLowerCase())
  ).length;
  
  if (titleMatches > 0) {
    score += Math.min(5, titleMatches * 2);
    feedback.push(`Job title alignment: ${titleMatches} matches found`);
  } else {
    feedback.push("Consider aligning job title with target occupation");
  }

  // Technical skills match
  const technicalMatches = industryKeywords.technical.filter(skill => 
    allText.includes(skill.toLowerCase())
  ).length;
  
  score += Math.min(5, technicalMatches * 0.5);
  if (technicalMatches > 0) {
    feedback.push(`Technical skills: ${technicalMatches} relevant skills found`);
  } else {
    feedback.push("Add more industry-specific technical skills");
  }

  // Soft skills match
  const softMatches = industryKeywords.soft.filter(skill => 
    allText.includes(skill.toLowerCase())
  ).length;
  
  score += Math.min(3, softMatches * 0.5);
  
  // Certifications match
  const certMatches = industryKeywords.certifications.filter(cert => 
    allText.includes(cert.toLowerCase())
  ).length;
  
  score += Math.min(3, certMatches * 1);
  if (certMatches > 0) {
    feedback.push(`Certifications: ${certMatches} relevant certifications found`);
  } else {
    feedback.push("Consider adding relevant professional certifications");
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    feedback,
    matches: {
      technical: technicalMatches,
      soft: softMatches,
      certifications: certMatches,
      jobTitle: titleMatches
    }
  };
}

/**
 * Calculate structure score based on CV organization
 */
function calculateStructureScore(cvData) {
  let score = 0;
  let feedback = [];
  const maxScore = ATS_SCORING_WEIGHTS.STRUCTURE.weight;

  // Contact information completeness
  const contactFields = ['fullName', 'email', 'phone'];
  const contactComplete = contactFields.filter(field =>
    cvData.personalInfo?.[field] && cvData.personalInfo[field].length > 0
  ).length;

  score += Math.min(4, contactComplete * 1.3);
  if (contactComplete === contactFields.length) {
    feedback.push("Complete contact information provided");
  } else {
    feedback.push(`Missing contact fields: ${contactFields.filter(field =>
      !cvData.personalInfo?.[field] || cvData.personalInfo[field].length === 0
    ).join(', ')}`);
  }

  // Work experience structure
  if (cvData.experience?.length > 0) {
    score += 2;
    const experienceQuality = cvData.experience.filter(exp =>
      exp.title && exp.company && (exp.startDate || exp.endDate)
    ).length;

    if (experienceQuality === cvData.experience.length) {
      score += 2;
      feedback.push("Well-structured work experience entries");
    } else {
      feedback.push("Some experience entries missing key details (title, company, dates)");
    }
  } else {
    feedback.push("Add work experience section");
  }

  // Education structure
  if (cvData.education?.length > 0) {
    score += 1.5;
    const educationQuality = cvData.education.filter(edu =>
      edu.degree && edu.institution
    ).length;

    if (educationQuality === cvData.education.length) {
      score += 1.5;
      feedback.push("Complete education information");
    } else {
      feedback.push("Some education entries missing details");
    }
  } else {
    feedback.push("Add education section");
  }

  // Skills section
  if (cvData.skills && (Array.isArray(cvData.skills) ? cvData.skills.length > 0 : cvData.skills.length > 0)) {
    score += 2;
    feedback.push("Skills section included");
  } else {
    feedback.push("Add skills section");
  }

  // Chronological order check (simplified)
  if (cvData.experience?.length >= 2) {
    const hasValidDates = cvData.experience.filter(exp => exp.startDate || exp.endDate).length >= 2;
    if (hasValidDates) {
      score += 2;
      feedback.push("Chronological work history maintained");
    } else {
      feedback.push("Ensure chronological order with proper dates");
    }
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    feedback
  };
}

/**
 * Calculate content quality score
 */
function calculateContentQualityScore(cvData) {
  let score = 0;
  let feedback = [];
  const maxScore = ATS_SCORING_WEIGHTS.CONTENT_QUALITY.weight;

  // Quantified achievements check
  const allText = JSON.stringify(cvData).toLowerCase();
  const quantifiers = ['%', 'percent', 'increased', 'decreased', 'improved', 'reduced', 'saved', '$', 'million', 'thousand'];
  const quantifiedCount = quantifiers.filter(q => allText.includes(q)).length;

  if (quantifiedCount >= 3) {
    score += 3;
    feedback.push("Good use of quantified achievements");
  } else if (quantifiedCount > 0) {
    score += 1.5;
    feedback.push("Some quantified achievements present - add more metrics");
  } else {
    feedback.push("Add quantified achievements with specific numbers and percentages");
  }

  // Action verbs check
  const actionVerbs = ['managed', 'led', 'developed', 'implemented', 'created', 'designed', 'optimized', 'achieved', 'delivered'];
  const actionVerbCount = actionVerbs.filter(verb => allText.includes(verb)).length;

  if (actionVerbCount >= 5) {
    score += 2;
    feedback.push("Strong use of action verbs");
  } else if (actionVerbCount > 0) {
    score += 1;
    feedback.push("Add more action verbs to strengthen impact");
  } else {
    feedback.push("Use strong action verbs to describe accomplishments");
  }

  // Relevant experience assessment
  if (cvData.experience?.length >= 2) {
    const experienceWithDescriptions = cvData.experience.filter(exp =>
      exp.description && exp.description.length > 50
    ).length;

    if (experienceWithDescriptions >= 2) {
      score += 3;
      feedback.push("Detailed experience descriptions provided");
    } else if (experienceWithDescriptions > 0) {
      score += 1.5;
      feedback.push("Add more detailed descriptions to work experience");
    } else {
      feedback.push("Provide detailed descriptions for all work experience");
    }
  }

  // Completeness check
  const requiredSections = ['personalInfo', 'experience', 'education', 'skills'];
  const completeSections = requiredSections.filter(section => {
    if (section === 'personalInfo') {
      return cvData[section]?.fullName && cvData[section]?.email;
    }
    if (section === 'skills') {
      return cvData[section] && (Array.isArray(cvData[section]) ? cvData[section].length > 0 : cvData[section].length > 0);
    }
    return cvData[section] && cvData[section].length > 0;
  }).length;

  if (completeSections === requiredSections.length) {
    score += 2;
    feedback.push("All essential sections completed");
  } else {
    feedback.push(`Complete missing sections: ${requiredSections.filter(section => {
      if (section === 'personalInfo') {
        return !cvData[section]?.fullName || !cvData[section]?.email;
      }
      if (section === 'skills') {
        return !cvData[section] || (Array.isArray(cvData[section]) ? cvData[section].length === 0 : cvData[section].length === 0);
      }
      return !cvData[section] || cvData[section].length === 0;
    }).join(', ')}`);
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    feedback
  };
}

/**
 * Calculate immigration readiness score based on visa requirements
 */
function calculateImmigrationReadinessScore(cvData, targetVisa) {
  let score = 0;
  let feedback = [];
  const maxScore = ATS_SCORING_WEIGHTS.IMMIGRATION_READINESS.weight;

  const visaReqs = VISA_REQUIREMENTS[targetVisa] || VISA_REQUIREMENTS['Express Entry'];

  // Visa type alignment (8 points)
  const jobTitle = cvData.personalInfo?.jobTitle?.toLowerCase() || '';
  const allText = JSON.stringify(cvData).toLowerCase();

  if (targetVisa === 'Express Entry') {
    const nocMatches = ['noc 0', 'noc a', 'noc b', 'manager', 'engineer', 'analyst', 'specialist'].filter(noc =>
      allText.includes(noc)
    ).length;

    if (nocMatches >= 2) {
      score += 8;
      feedback.push("Strong alignment with Express Entry NOC categories");
    } else if (nocMatches > 0) {
      score += 4;
      feedback.push("Some alignment with Express Entry requirements - strengthen NOC classification");
    } else {
      feedback.push("Ensure job title aligns with Express Entry NOC categories (0, A, B)");
    }
  } else if (targetVisa === 'Skilled Worker (UK)') {
    if (allText.includes('sponsor') || allText.includes('uk') || jobTitle.includes('engineer') || jobTitle.includes('manager')) {
      score += 6;
      feedback.push("Good alignment with UK Skilled Worker requirements");
    } else {
      feedback.push("Highlight skills relevant to UK Skilled Worker visa");
    }
  }

  // Occupation match (6 points)
  const occupationKeywords = {
    'Express Entry': ['software', 'engineer', 'manager', 'analyst', 'consultant', 'specialist'],
    'Provincial Nominee': ['trade', 'technician', 'skilled', 'certified'],
    'Skilled Worker (UK)': ['professional', 'graduate', 'skilled', 'qualified']
  };

  const relevantOccupations = occupationKeywords[targetVisa] || occupationKeywords['Express Entry'];
  const occupationMatches = relevantOccupations.filter(occ => allText.includes(occ)).length;

  score += Math.min(6, occupationMatches * 1.5);
  if (occupationMatches >= 3) {
    feedback.push("Excellent occupation alignment for target visa");
  } else {
    feedback.push("Strengthen occupation-specific keywords and experience");
  }

  // Experience years (5 points)
  const experienceYears = calculateTotalExperience(cvData.experience);
  const minRequired = visaReqs.minExperience || 1;

  if (experienceYears >= minRequired + 3) {
    score += 5;
    feedback.push(`Excellent experience: ${experienceYears} years (exceeds minimum)`);
  } else if (experienceYears >= minRequired) {
    score += 3;
    feedback.push(`Good experience: ${experienceYears} years (meets minimum)`);
  } else {
    feedback.push(`Insufficient experience: ${experienceYears} years (minimum: ${minRequired})`);
  }

  // Education level (3 points)
  const educationLevel = assessEducationLevel(cvData.education);
  const preferredEducation = visaReqs.preferredEducation || ['Bachelor'];

  if (preferredEducation.some(level => educationLevel.includes(level))) {
    score += 3;
    feedback.push(`Education level aligns with visa requirements: ${educationLevel}`);
  } else if (educationLevel !== 'Unknown') {
    score += 1.5;
    feedback.push(`Education present but may not fully align with preferred levels: ${preferredEducation.join(', ')}`);
  } else {
    feedback.push(`Add education details - preferred levels: ${preferredEducation.join(', ')}`);
  }

  // Language skills (3 points)
  const languageSkills = assessLanguageSkills(cvData, allText);
  if (languageSkills.score >= 2) {
    score += 3;
    feedback.push("Strong language skills demonstrated");
  } else if (languageSkills.score > 0) {
    score += 1.5;
    feedback.push("Some language skills present - consider highlighting language proficiency");
  } else {
    feedback.push("Add language skills and proficiency levels (especially English/French for Canada)");
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    feedback,
    details: {
      experienceYears,
      educationLevel,
      languageSkills: languageSkills.skills
    }
  };
}

/**
 * Calculate compliance score for immigration requirements
 */
function calculateComplianceScore(cvData, targetVisa) {
  let score = 0;
  let feedback = [];
  const maxScore = ATS_SCORING_WEIGHTS.COMPLIANCE.weight;

  // Documentation readiness (5 points)
  const hasCompleteContact = cvData.personalInfo?.fullName && cvData.personalInfo?.email && cvData.personalInfo?.phone;
  const hasWorkHistory = cvData.experience?.length >= 1;
  const hasEducation = cvData.education?.length >= 1;

  if (hasCompleteContact && hasWorkHistory && hasEducation) {
    score += 5;
    feedback.push("Documentation appears complete for application");
  } else {
    const missing = [];
    if (!hasCompleteContact) missing.push("complete contact information");
    if (!hasWorkHistory) missing.push("work experience");
    if (!hasEducation) missing.push("education history");
    feedback.push(`Complete missing documentation: ${missing.join(', ')}`);
    score += Math.max(0, 5 - missing.length * 1.5);
  }

  // Certification validity (4 points)
  const allText = JSON.stringify(cvData).toLowerCase();
  const certificationKeywords = ['certified', 'license', 'certification', 'accredited', 'qualified', 'registered'];
  const certificationCount = certificationKeywords.filter(cert => allText.includes(cert)).length;

  if (certificationCount >= 3) {
    score += 4;
    feedback.push("Multiple certifications/licenses mentioned");
  } else if (certificationCount > 0) {
    score += 2;
    feedback.push("Some certifications present - ensure they are current and relevant");
  } else {
    feedback.push("Add relevant professional certifications or licenses");
  }

  // Work permit eligibility (3 points)
  if (targetVisa === 'Work Permit' || targetVisa === 'Skilled Worker (UK)') {
    const sponsorshipKeywords = ['sponsor', 'offer', 'employer', 'job offer'];
    const sponsorshipMentioned = sponsorshipKeywords.some(keyword => allText.includes(keyword));

    if (sponsorshipMentioned) {
      score += 3;
      feedback.push("Employer sponsorship/job offer indicated");
    } else {
      feedback.push("Highlight employer sponsorship or job offer if available");
    }
  } else {
    score += 2; // Default points for other visa types
  }

  // Background check readiness (3 points)
  const professionalHistory = cvData.experience?.filter(exp =>
    exp.title && exp.company && exp.description
  ).length || 0;

  if (professionalHistory >= 2) {
    score += 3;
    feedback.push("Professional history suitable for background verification");
  } else if (professionalHistory > 0) {
    score += 1.5;
    feedback.push("Add more detailed work history for background verification");
  } else {
    feedback.push("Provide comprehensive work history for background checks");
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    feedback
  };
}

// Helper Functions

/**
 * Calculate total years of experience from experience array
 */
function calculateTotalExperience(experiences) {
  if (!experiences || experiences.length === 0) return 0;

  let totalMonths = 0;
  const currentYear = new Date().getFullYear();

  experiences.forEach(exp => {
    let startYear = currentYear;
    let endYear = currentYear;

    // Parse start date
    if (exp.startDate) {
      const startMatch = exp.startDate.match(/(\d{4})/);
      if (startMatch) startYear = parseInt(startMatch[1]);
    }

    // Parse end date
    if (exp.endDate && !exp.endDate.toLowerCase().includes('present') && !exp.endDate.toLowerCase().includes('current')) {
      const endMatch = exp.endDate.match(/(\d{4})/);
      if (endMatch) endYear = parseInt(endMatch[1]);
    }

    // Calculate months for this experience
    const months = Math.max(0, (endYear - startYear) * 12);
    totalMonths += months;
  });

  return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal place
}

/**
 * Assess education level from education array
 */
function assessEducationLevel(education) {
  if (!education || education.length === 0) return 'Unknown';

  const degrees = education.map(edu => edu.degree?.toLowerCase() || '').join(' ');

  if (degrees.includes('phd') || degrees.includes('doctorate')) return 'PhD';
  if (degrees.includes('master') || degrees.includes('mba')) return 'Master';
  if (degrees.includes('bachelor') || degrees.includes('degree')) return 'Bachelor';
  if (degrees.includes('diploma') || degrees.includes('certificate')) return 'Diploma';
  if (degrees.includes('high school') || degrees.includes('secondary')) return 'High School';

  return 'Other';
}

/**
 * Assess language skills from CV data
 */
function assessLanguageSkills(cvData, allText) {
  const languageKeywords = {
    english: ['english', 'ielts', 'toefl', 'native english', 'fluent english'],
    french: ['french', 'tef', 'tcf', 'delf', 'dalf', 'fluent french'],
    other: ['bilingual', 'multilingual', 'language', 'fluent', 'proficient']
  };

  let score = 0;
  let skills = [];

  // Check for English
  const englishMatches = languageKeywords.english.filter(keyword => allText.includes(keyword)).length;
  if (englishMatches > 0) {
    score += 1;
    skills.push('English');
  }

  // Check for French (bonus for Canada)
  const frenchMatches = languageKeywords.french.filter(keyword => allText.includes(keyword)).length;
  if (frenchMatches > 0) {
    score += 1;
    skills.push('French');
  }

  // Check for other language indicators
  const otherMatches = languageKeywords.other.filter(keyword => allText.includes(keyword)).length;
  if (otherMatches > 0) {
    score += 0.5;
    skills.push('Multilingual');
  }

  return { score, skills };
}

/**
 * Generate personalized recommendations based on scoring breakdown
 */
function generateRecommendations(breakdown, targetVisa, targetIndustry) {
  const recommendations = [];

  // Priority recommendations based on lowest scores
  const scores = [
    { category: 'Formatting', score: breakdown.formatting?.percentage || 0, weight: 'High' },
    { category: 'Keywords', score: breakdown.keywords?.percentage || 0, weight: 'Critical' },
    { category: 'Structure', score: breakdown.structure?.percentage || 0, weight: 'High' },
    { category: 'Content Quality', score: breakdown.content?.percentage || 0, weight: 'Medium' },
    { category: 'Immigration Readiness', score: breakdown.immigration?.percentage || 0, weight: 'Critical' },
    { category: 'Compliance', score: breakdown.compliance?.percentage || 0, weight: 'High' }
  ];

  // Sort by score (lowest first) and prioritize critical/high weight items
  scores.sort((a, b) => {
    if (a.weight === 'Critical' && b.weight !== 'Critical') return -1;
    if (b.weight === 'Critical' && a.weight !== 'Critical') return 1;
    return a.score - b.score;
  });

  // Generate top 5 recommendations
  scores.slice(0, 5).forEach(item => {
    if (item.score < 80) {
      recommendations.push(getSpecificRecommendation(item.category, targetVisa, targetIndustry));
    }
  });

  // Add visa-specific recommendations
  recommendations.push(...getVisaSpecificRecommendations(targetVisa, breakdown));

  return recommendations.filter(Boolean).slice(0, 8); // Limit to 8 recommendations
}

/**
 * Get specific recommendations for each category
 */
function getSpecificRecommendation(category, targetVisa, targetIndustry) {
  const recommendations = {
    'Formatting': {
      title: 'Improve ATS-Friendly Formatting',
      description: 'Use standard fonts (Arial, Calibri), clear headings, and bullet points. Avoid graphics, tables, and complex formatting.',
      priority: 'High',
      impact: 'Ensures your CV passes initial ATS screening'
    },
    'Keywords': {
      title: `Add ${targetIndustry} Keywords`,
      description: `Include industry-specific terms, technical skills, and job titles relevant to ${targetIndustry}. Match keywords from job postings.`,
      priority: 'Critical',
      impact: 'Significantly improves ATS matching and recruiter interest'
    },
    'Structure': {
      title: 'Optimize CV Structure',
      description: 'Ensure clear sections: Contact Info, Summary, Experience, Education, Skills. Use consistent formatting and chronological order.',
      priority: 'High',
      impact: 'Makes your CV easy to scan for both ATS and human reviewers'
    },
    'Content Quality': {
      title: 'Enhance Content with Metrics',
      description: 'Add quantified achievements, use strong action verbs, and provide specific examples of your impact.',
      priority: 'Medium',
      impact: 'Demonstrates your value and results to potential employers'
    },
    'Immigration Readiness': {
      title: `Align with ${targetVisa} Requirements`,
      description: `Highlight experience, education, and skills that match ${targetVisa} criteria. Include relevant NOC codes or occupation classifications.`,
      priority: 'Critical',
      impact: 'Essential for visa application success and employer confidence'
    },
    'Compliance': {
      title: 'Ensure Documentation Completeness',
      description: 'Include all required information for background checks, certification details, and work authorization status.',
      priority: 'High',
      impact: 'Prevents delays in application processing and hiring decisions'
    }
  };

  return recommendations[category];
}

/**
 * Get visa-specific recommendations
 */
function getVisaSpecificRecommendations(targetVisa, breakdown) {
  const recommendations = [];

  switch (targetVisa) {
    case 'Express Entry':
      recommendations.push({
        title: 'Express Entry Optimization',
        description: 'Highlight NOC classification, language test scores (IELTS/CELPIP), and Canadian work experience if available.',
        priority: 'Critical',
        impact: 'Maximizes Comprehensive Ranking System (CRS) score'
      });
      break;

    case 'Provincial Nominee':
      recommendations.push({
        title: 'Provincial Alignment',
        description: 'Emphasize skills and experience relevant to specific provincial needs and in-demand occupations.',
        priority: 'Critical',
        impact: 'Increases chances of provincial nomination'
      });
      break;

    case 'Skilled Worker (UK)':
      recommendations.push({
        title: 'UK Skilled Worker Requirements',
        description: 'Ensure job offer meets salary threshold (£25,600+), highlight sponsorship eligibility, and include English proficiency.',
        priority: 'Critical',
        impact: 'Meets mandatory visa requirements'
      });
      break;
  }

  return recommendations;
}

/**
 * Assess overall visa readiness based on total score
 */
function assessVisaReadiness(totalScore, targetVisa) {
  let readiness = 'Not Ready';
  let confidence = 'Low';
  let nextSteps = [];

  if (totalScore >= 85) {
    readiness = 'Excellent';
    confidence = 'Very High';
    nextSteps = ['Submit application', 'Prepare for interviews', 'Gather supporting documents'];
  } else if (totalScore >= 75) {
    readiness = 'Good';
    confidence = 'High';
    nextSteps = ['Minor improvements needed', 'Review application requirements', 'Prepare documentation'];
  } else if (totalScore >= 65) {
    readiness = 'Fair';
    confidence = 'Medium';
    nextSteps = ['Significant improvements needed', 'Focus on key weaknesses', 'Consider professional review'];
  } else if (totalScore >= 50) {
    readiness = 'Poor';
    confidence = 'Low';
    nextSteps = ['Major overhaul required', 'Professional CV writing recommended', 'Address fundamental issues'];
  } else {
    readiness = 'Not Ready';
    confidence = 'Very Low';
    nextSteps = ['Complete CV rewrite needed', 'Professional consultation required', 'Build missing qualifications'];
  }

  return {
    level: readiness,
    confidence,
    nextSteps,
    recommendation: getReadinessRecommendation(totalScore, targetVisa)
  };
}

/**
 * Get readiness-specific recommendations
 */
function getReadinessRecommendation(score, targetVisa) {
  if (score >= 85) {
    return `Your CV is excellent for ${targetVisa} applications. You're ready to apply with confidence.`;
  } else if (score >= 75) {
    return `Your CV is good for ${targetVisa}. Minor improvements will maximize your chances.`;
  } else if (score >= 65) {
    return `Your CV needs improvement for ${targetVisa}. Focus on the key recommendations to strengthen your application.`;
  } else if (score >= 50) {
    return `Your CV requires significant work for ${targetVisa}. Consider professional assistance to improve your chances.`;
  } else {
    return `Your CV is not ready for ${targetVisa} applications. A complete overhaul is recommended before applying.`;
  }
}

/**
 * Get competitive analysis based on realistic industry benchmarks
 */
function getCompetitiveAnalysis(totalScore, targetIndustry) {
  // Updated realistic benchmarks based on HR industry standards
  const industryBenchmarks = {
    'Software Engineering': {
      excellent: 82, good: 72, average: 62,
      context: 'Highly competitive field with emphasis on technical skills'
    },
    'Healthcare': {
      excellent: 80, good: 70, average: 60,
      context: 'Focus on certifications and clinical experience'
    },
    'Skilled Trades': {
      excellent: 78, good: 68, average: 58,
      context: 'Emphasis on certifications and hands-on experience'
    },
    'Business Management': {
      excellent: 84, good: 74, average: 64,
      context: 'Leadership experience and quantified achievements critical'
    }
  };

  const benchmark = industryBenchmarks[targetIndustry] || industryBenchmarks['Software Engineering'];

  let competitiveness = 'Below Average';
  let marketPosition = 'Bottom 30%';
  let percentile = Math.round((totalScore / 100) * 100);

  if (totalScore >= benchmark.excellent) {
    competitiveness = 'Excellent';
    marketPosition = 'Top 15%';
    percentile = Math.min(95, 85 + Math.round((totalScore - benchmark.excellent) / 2));
  } else if (totalScore >= benchmark.good) {
    competitiveness = 'Good';
    marketPosition = 'Top 35%';
    percentile = Math.round(60 + ((totalScore - benchmark.good) / (benchmark.excellent - benchmark.good)) * 25);
  } else if (totalScore >= benchmark.average) {
    competitiveness = 'Average';
    marketPosition = 'Middle 50%';
    percentile = Math.round(35 + ((totalScore - benchmark.average) / (benchmark.good - benchmark.average)) * 25);
  } else {
    percentile = Math.round((totalScore / benchmark.average) * 35);
  }

  return {
    level: competitiveness,
    marketPosition,
    percentile,
    industryBenchmark: benchmark,
    context: benchmark.context,
    recommendation: getCompetitiveRecommendation(competitiveness, targetIndustry),
    improvementNeeded: Math.max(0, benchmark.good - totalScore)
  };
}

/**
 * Get competitive recommendations
 */
function getCompetitiveRecommendation(competitiveness, targetIndustry) {
  switch (competitiveness) {
    case 'Excellent':
      return `Your CV is in the top tier for ${targetIndustry}. You're well-positioned for competitive opportunities.`;
    case 'Good':
      return `Your CV is above average for ${targetIndustry}. Small improvements can move you to the top tier.`;
    case 'Average':
      return `Your CV is average for ${targetIndustry}. Focus on differentiation and key improvements.`;
    default:
      return `Your CV needs significant improvement to be competitive in ${targetIndustry}. Consider professional development.`;
  }
}

// Export additional utility functions
export {
  calculateTotalExperience,
  assessEducationLevel,
  assessLanguageSkills,
  generateRecommendations,
  assessVisaReadiness,
  getCompetitiveAnalysis
};
