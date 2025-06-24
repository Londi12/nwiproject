// Enhanced ATS Scoring System for Immigration Visa Applications
// Designed for HR and Visa Flow Associate perspectives

import { isSupabaseConfigured } from '../lib/supabase.js';

// Immigration-specific ATS scoring weights
export const ATS_SCORING_WEIGHTS = {
  // Core ATS factors (60% of total score)
  FORMATTING: {
    weight: 15,
    factors: {
      standardFonts: 3,
      properHeadings: 3,
      consistentSpacing: 2,
      bulletPoints: 2,
      readableLayout: 3,
      noGraphics: 2
    }
  },
  KEYWORDS: {
    weight: 20,
    factors: {
      jobTitleMatch: 5,
      skillsMatch: 5,
      industryTerms: 4,
      certificationMatch: 3,
      softSkills: 3
    }
  },
  STRUCTURE: {
    weight: 15,
    factors: {
      contactInfo: 4,
      workExperience: 4,
      education: 3,
      skills: 2,
      chronologicalOrder: 2
    }
  },
  CONTENT_QUALITY: {
    weight: 10,
    factors: {
      quantifiedAchievements: 3,
      actionVerbs: 2,
      relevantExperience: 3,
      completeness: 2
    }
  },

  // Immigration-specific factors (40% of total score)
  IMMIGRATION_READINESS: {
    weight: 25,
    factors: {
      visaTypeAlignment: 8,
      occupationMatch: 6,
      experienceYears: 5,
      educationLevel: 3,
      languageSkills: 3
    }
  },
  COMPLIANCE: {
    weight: 15,
    factors: {
      documentationReady: 5,
      certificationValid: 4,
      workPermitEligible: 3,
      backgroundCheck: 3
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
    salaryThreshold: 25600,
    sponsorshipRequired: 30
  }
};

// Industry-specific ATS keywords for immigration
export const INDUSTRY_KEYWORDS = {
  'Software Engineering': {
    technical: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'Agile', 'Scrum'],
    soft: ['Problem Solving', 'Team Collaboration', 'Code Review', 'Technical Leadership'],
    certifications: ['AWS Certified', 'Google Cloud', 'Microsoft Azure', 'Scrum Master'],
    immigration: ['NOC 2173', 'Software Engineer', 'Full Stack Developer', 'Tech Lead']
  },
  'Healthcare': {
    technical: ['Patient Care', 'Medical Records', 'Clinical Assessment', 'Treatment Planning'],
    soft: ['Compassion', 'Communication', 'Critical Thinking', 'Attention to Detail'],
    certifications: ['RN License', 'BLS', 'ACLS', 'Medical License'],
    immigration: ['NOC 3012', 'Registered Nurse', 'Healthcare Professional']
  },
  'Skilled Trades': {
    technical: ['Electrical Systems', 'Plumbing', 'HVAC', 'Safety Protocols', 'Blueprint Reading'],
    soft: ['Problem Solving', 'Physical Stamina', 'Attention to Detail', 'Safety Conscious'],
    certifications: ['Trade License', 'Safety Certification', 'Apprenticeship', 'Red Seal'],
    immigration: ['NOC 7241', 'NOC 7251', 'Skilled Tradesperson', 'Journeyman']
  },
  'Business Management': {
    technical: ['P&L Management', 'Strategic Planning', 'Budget Management', 'Team Leadership'],
    soft: ['Leadership', 'Communication', 'Decision Making', 'Negotiation'],
    certifications: ['MBA', 'PMP', 'Six Sigma', 'CPA'],
    immigration: ['NOC 0011', 'NOC 0111', 'Manager', 'Executive']
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
 * Calculate formatting score based on ATS-friendly formatting
 */
function calculateFormattingScore(cvData) {
  let score = 0;
  let feedback = [];
  const maxScore = ATS_SCORING_WEIGHTS.FORMATTING.weight;

  // Check for standard fonts (simulated - in real implementation would check actual formatting)
  if (cvData.personalInfo?.fullName && cvData.personalInfo.fullName.length > 0) {
    score += 3;
  } else {
    feedback.push("Add clear contact information with full name");
  }

  // Check for proper headings structure
  if (cvData.experience?.length > 0 && cvData.education?.length > 0) {
    score += 3;
    feedback.push("Good section organization detected");
  } else {
    feedback.push("Ensure clear section headings for Experience and Education");
  }

  // Check for bullet points in experience
  if (cvData.experience?.some(exp => exp.description && exp.description.length > 20)) {
    score += 2;
    feedback.push("Experience descriptions present");
  } else {
    feedback.push("Add detailed bullet points for work experience");
  }

  // Check for consistent contact info
  if (cvData.personalInfo?.email && cvData.personalInfo?.phone) {
    score += 2;
    feedback.push("Complete contact information provided");
  } else {
    feedback.push("Include email and phone number");
  }

  // Readable layout check
  if (cvData.summary && cvData.summary.length > 50) {
    score += 3;
    feedback.push("Professional summary included");
  } else {
    feedback.push("Add a compelling professional summary");
  }

  // No graphics penalty (assume good if structured data exists)
  if (Object.keys(cvData).length >= 4) {
    score += 2;
  }

  return {
    score: Math.min(score, maxScore),
    maxScore,
    percentage: Math.round((Math.min(score, maxScore) / maxScore) * 100),
    feedback
  };
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
 * Get competitive analysis based on industry benchmarks
 */
function getCompetitiveAnalysis(totalScore, targetIndustry) {
  const industryBenchmarks = {
    'Software Engineering': { excellent: 85, good: 75, average: 65 },
    'Healthcare': { excellent: 88, good: 78, average: 68 },
    'Skilled Trades': { excellent: 82, good: 72, average: 62 },
    'Business Management': { excellent: 87, good: 77, average: 67 }
  };

  const benchmark = industryBenchmarks[targetIndustry] || industryBenchmarks['Software Engineering'];

  let competitiveness = 'Below Average';
  let marketPosition = 'Bottom 25%';

  if (totalScore >= benchmark.excellent) {
    competitiveness = 'Excellent';
    marketPosition = 'Top 10%';
  } else if (totalScore >= benchmark.good) {
    competitiveness = 'Good';
    marketPosition = 'Top 25%';
  } else if (totalScore >= benchmark.average) {
    competitiveness = 'Average';
    marketPosition = 'Middle 50%';
  }

  return {
    level: competitiveness,
    marketPosition,
    industryBenchmark: benchmark,
    recommendation: getCompetitiveRecommendation(competitiveness, targetIndustry)
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
