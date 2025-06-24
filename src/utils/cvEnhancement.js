// CV Enhancement System for Immigration Applications
// Provides specific improvements for better ATS scores and visa readiness

import { calculateATSScore, INDUSTRY_KEYWORDS, VISA_REQUIREMENTS } from './atsScoring.js';

/**
 * Generate enhanced CV suggestions based on ATS analysis
 */
export function generateCVEnhancements(cvData, targetVisa = 'Express Entry', targetIndustry = 'Software Engineering') {
  const atsAnalysis = calculateATSScore(cvData, targetVisa, targetIndustry);
  
  return {
    currentScore: atsAnalysis.totalScore,
    targetScore: 85, // Target for excellent rating
    improvements: generateSpecificImprovements(cvData, atsAnalysis, targetVisa, targetIndustry),
    enhancedSections: generateEnhancedSections(cvData, targetVisa, targetIndustry),
    keywordSuggestions: generateKeywordSuggestions(cvData, targetIndustry),
    templateRecommendation: getOptimalTemplate(cvData, targetVisa, targetIndustry),
    priorityActions: getPriorityActions(atsAnalysis),
    estimatedImpact: calculateImprovementImpact(atsAnalysis)
  };
}

/**
 * Generate enhanced sections for the CV
 */
function generateEnhancedSections(cvData, targetVisa, targetIndustry) {
  return {
    personalInfo: enhancePersonalInfo(cvData.personalInfo, targetVisa).enhanced,
    summary: enhanceSummary(cvData.summary, targetVisa, targetIndustry).enhanced,
    experience: enhanceExperience(cvData.experience, targetIndustry).enhanced,
    education: enhanceEducation(cvData.education, targetVisa).enhanced,
    skills: enhanceSkills(cvData.skills, targetIndustry).enhanced,
    additionalSections: suggestAdditionalSections(cvData, targetVisa)
  };
}

/**
 * Generate specific improvements for each CV section
 */
function generateSpecificImprovements(cvData, atsAnalysis, targetVisa, targetIndustry) {
  const improvements = {
    personalInfo: enhancePersonalInfo(cvData.personalInfo, targetVisa),
    summary: enhanceSummary(cvData.summary, targetVisa, targetIndustry),
    experience: enhanceExperience(cvData.experience, targetIndustry),
    education: enhanceEducation(cvData.education, targetVisa),
    skills: enhanceSkills(cvData.skills, targetIndustry),
    additionalSections: suggestAdditionalSections(cvData, targetVisa)
  };
  
  return improvements;
}

/**
 * Enhance personal information section
 */
function enhancePersonalInfo(personalInfo, targetVisa) {
  const suggestions = [];
  const enhanced = { ...personalInfo };
  
  // Professional email suggestion
  if (!personalInfo?.email || !personalInfo.email.includes('@')) {
    suggestions.push({
      type: 'missing',
      field: 'email',
      suggestion: 'Add a professional email address (firstname.lastname@domain.com)',
      priority: 'critical'
    });
    enhanced.email = 'firstname.lastname@email.com';
  } else if (personalInfo.email.includes('hotmail') || personalInfo.email.includes('yahoo')) {
    suggestions.push({
      type: 'improvement',
      field: 'email',
      suggestion: 'Consider using Gmail or professional domain email for better impression',
      priority: 'medium'
    });
  }
  
  // Phone number formatting
  if (!personalInfo?.phone) {
    suggestions.push({
      type: 'missing',
      field: 'phone',
      suggestion: 'Add phone number with country code (+1 for North America)',
      priority: 'critical'
    });
    enhanced.phone = '+1 (555) 123-4567';
  } else if (!personalInfo.phone.includes('+')) {
    suggestions.push({
      type: 'improvement',
      field: 'phone',
      suggestion: 'Include country code in phone number for international applications',
      priority: 'high'
    });
    enhanced.phone = `+1 ${personalInfo.phone}`;
  }
  
  // Location optimization
  if (!personalInfo?.location) {
    suggestions.push({
      type: 'missing',
      field: 'location',
      suggestion: 'Add current location (City, Province/State, Country)',
      priority: 'high'
    });
    enhanced.location = 'Toronto, ON, Canada';
  } else if (targetVisa === 'Express Entry' && !personalInfo.location.toLowerCase().includes('canada')) {
    suggestions.push({
      type: 'improvement',
      field: 'location',
      suggestion: 'Consider indicating "Open to relocation to Canada" for Express Entry',
      priority: 'medium'
    });
  }
  
  // Professional title enhancement
  if (!personalInfo?.jobTitle) {
    suggestions.push({
      type: 'missing',
      field: 'jobTitle',
      suggestion: 'Add a clear, professional job title that matches your target role',
      priority: 'high'
    });
    enhanced.jobTitle = 'Senior Software Engineer';
  } else {
    const titleSuggestions = enhanceJobTitle(personalInfo.jobTitle, targetVisa);
    if (titleSuggestions) {
      suggestions.push(titleSuggestions);
      enhanced.jobTitle = titleSuggestions.enhanced;
    }
  }
  
  return {
    suggestions,
    enhanced,
    impact: 'Improves first impression and ATS parsing accuracy'
  };
}

/**
 * Enhance job title for better ATS matching
 */
function enhanceJobTitle(currentTitle, targetVisa) {
  const titleEnhancements = {
    'Express Entry': {
      'developer': 'Senior Software Developer',
      'programmer': 'Software Engineer',
      'coder': 'Software Developer',
      'nurse': 'Registered Nurse (RN)',
      'manager': 'Senior Manager',
      'analyst': 'Senior Business Analyst'
    },
    'Skilled Worker (UK)': {
      'developer': 'Software Developer',
      'engineer': 'Senior Engineer',
      'consultant': 'Senior Consultant'
    }
  };
  
  const enhancements = titleEnhancements[targetVisa] || titleEnhancements['Express Entry'];
  const lowerTitle = currentTitle.toLowerCase();
  
  for (const [key, enhanced] of Object.entries(enhancements)) {
    if (lowerTitle.includes(key)) {
      return {
        type: 'improvement',
        field: 'jobTitle',
        suggestion: `Consider using "${enhanced}" for better ATS matching`,
        priority: 'medium',
        enhanced
      };
    }
  }
  
  return null;
}

/**
 * Enhance professional summary
 */
function enhanceSummary(currentSummary, targetVisa, targetIndustry) {
  const suggestions = [];
  let enhanced = currentSummary || '';
  
  if (!currentSummary || currentSummary.length < 50) {
    const templateSummary = generateSummaryTemplate(targetVisa, targetIndustry);
    suggestions.push({
      type: 'missing',
      field: 'summary',
      suggestion: 'Add a compelling professional summary (3-4 sentences)',
      priority: 'critical',
      template: templateSummary
    });
    enhanced = templateSummary;
  } else {
    // Analyze current summary for improvements
    const summaryAnalysis = analyzeSummary(currentSummary, targetVisa, targetIndustry);
    suggestions.push(...summaryAnalysis.suggestions);
    enhanced = summaryAnalysis.enhanced;
  }
  
  return {
    suggestions,
    enhanced,
    impact: 'Significantly improves recruiter engagement and ATS keyword matching'
  };
}

/**
 * Generate professional summary template
 */
function generateSummaryTemplate(targetVisa, targetIndustry) {
  const templates = {
    'Software Engineering': {
      'Express Entry': 'Experienced Software Engineer with 5+ years developing scalable web applications using modern technologies. Proven track record of leading cross-functional teams and delivering high-quality solutions. Seeking to contribute technical expertise to Canadian technology sector through Express Entry program.',
      'Skilled Worker (UK)': 'Senior Software Engineer with expertise in full-stack development and cloud technologies. Strong background in agile methodologies and team leadership. Eligible for UK Skilled Worker visa sponsorship.',
      'default': 'Results-driven Software Engineer with extensive experience in software development and system architecture. Passionate about creating innovative solutions and mentoring development teams.'
    },
    'Healthcare': {
      'Express Entry': 'Registered Nurse with 7+ years of clinical experience in acute care settings. Demonstrated expertise in patient assessment, care planning, and interdisciplinary collaboration. Committed to providing exceptional healthcare services in Canada.',
      'Provincial Nominee': 'Experienced Healthcare Professional with specialized training and proven clinical outcomes. Strong commitment to patient care and professional development in Canadian healthcare system.',
      'default': 'Dedicated Healthcare Professional with comprehensive clinical experience and commitment to patient-centered care. Proven ability to work effectively in fast-paced medical environments.'
    },
    'Business Management': {
      'Express Entry': 'Strategic Business Manager with 8+ years leading high-performing teams and driving operational excellence. Proven track record of increasing revenue and improving efficiency. Ready to contribute leadership skills to Canadian business landscape.',
      'default': 'Results-oriented Business Manager with expertise in strategic planning, team leadership, and operational optimization. Strong analytical skills and proven ability to drive business growth.'
    }
  };
  
  const industryTemplates = templates[targetIndustry] || templates['Software Engineering'];
  return industryTemplates[targetVisa] || industryTemplates['default'];
}

/**
 * Analyze and enhance existing summary
 */
function analyzeSummary(summary, targetVisa, targetIndustry) {
  const suggestions = [];
  let enhanced = summary;
  
  // Check for quantified achievements
  const hasNumbers = /\d+/.test(summary);
  if (!hasNumbers) {
    suggestions.push({
      type: 'improvement',
      field: 'summary',
      suggestion: 'Add specific numbers and achievements (years of experience, team size, etc.)',
      priority: 'high'
    });
  }
  
  // Check for industry keywords
  const industryKeywords = INDUSTRY_KEYWORDS[targetIndustry]?.technical || [];
  const keywordMatches = industryKeywords.filter(keyword => 
    summary.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  
  if (keywordMatches < 2) {
    suggestions.push({
      type: 'improvement',
      field: 'summary',
      suggestion: `Include more ${targetIndustry} keywords: ${industryKeywords.slice(0, 5).join(', ')}`,
      priority: 'high'
    });
  }
  
  // Check for visa-specific language
  const visaKeywords = {
    'Express Entry': ['canada', 'canadian', 'express entry', 'immigration'],
    'Skilled Worker (UK)': ['uk', 'united kingdom', 'sponsorship', 'skilled worker'],
    'Provincial Nominee': ['provincial', 'canada', 'immigration']
  };
  
  const visaTerms = visaKeywords[targetVisa] || [];
  const hasVisaLanguage = visaTerms.some(term => 
    summary.toLowerCase().includes(term.toLowerCase())
  );
  
  if (!hasVisaLanguage && targetVisa !== 'Work Permit') {
    suggestions.push({
      type: 'improvement',
      field: 'summary',
      suggestion: `Consider mentioning immigration intent for ${targetVisa}`,
      priority: 'medium'
    });
  }
  
  return { suggestions, enhanced };
}

/**
 * Enhance work experience section
 */
function enhanceExperience(experiences, targetIndustry) {
  const suggestions = [];
  const enhanced = [];
  
  if (!experiences || experiences.length === 0) {
    suggestions.push({
      type: 'missing',
      field: 'experience',
      suggestion: 'Add work experience with detailed accomplishments',
      priority: 'critical'
    });
    return { suggestions, enhanced: [], impact: 'Critical for visa eligibility' };
  }
  
  experiences.forEach((exp, index) => {
    const expSuggestions = [];
    const enhancedExp = { ...exp };
    
    // Enhance job descriptions
    if (!exp.description || exp.description.length < 50) {
      expSuggestions.push({
        type: 'improvement',
        field: 'description',
        suggestion: 'Add detailed bullet points with quantified achievements',
        priority: 'high',
        template: generateExperienceTemplate(exp.title, targetIndustry)
      });
      enhancedExp.description = generateExperienceTemplate(exp.title, targetIndustry);
    }
    
    // Check for action verbs
    const actionVerbs = ['led', 'managed', 'developed', 'implemented', 'created', 'optimized'];
    const hasActionVerbs = actionVerbs.some(verb => 
      exp.description?.toLowerCase().includes(verb)
    );
    
    if (!hasActionVerbs) {
      expSuggestions.push({
        type: 'improvement',
        field: 'description',
        suggestion: 'Start bullet points with strong action verbs (Led, Managed, Developed)',
        priority: 'medium'
      });
    }
    
    // Check for quantified results
    const hasNumbers = /\d+/.test(exp.description || '');
    if (!hasNumbers) {
      expSuggestions.push({
        type: 'improvement',
        field: 'description',
        suggestion: 'Add specific metrics and percentages to demonstrate impact',
        priority: 'high'
      });
    }
    
    suggestions.push({
      position: index + 1,
      title: exp.title,
      suggestions: expSuggestions
    });
    
    enhanced.push(enhancedExp);
  });
  
  return {
    suggestions,
    enhanced,
    impact: 'Demonstrates professional competency and career progression'
  };
}

/**
 * Generate experience description template
 */
function generateExperienceTemplate(jobTitle, targetIndustry) {
  const templates = {
    'Software Engineering': [
      '• Developed and maintained scalable web applications serving 10,000+ users using React, Node.js, and AWS',
      '• Led cross-functional team of 5 developers to deliver projects 20% ahead of schedule',
      '• Implemented automated testing procedures, reducing bug reports by 40%',
      '• Collaborated with product managers and designers to define technical requirements and user stories'
    ],
    'Healthcare': [
      '• Provided direct patient care for 15-20 patients per shift in acute care setting',
      '• Collaborated with interdisciplinary team to develop and implement patient care plans',
      '• Mentored 3 new graduate nurses, improving team efficiency by 25%',
      '• Maintained 98% patient satisfaction scores through compassionate, evidence-based care'
    ],
    'Business Management': [
      '• Managed team of 12 professionals, achieving 95% employee retention rate',
      '• Increased department revenue by 30% through strategic planning and process optimization',
      '• Implemented new workflow systems, reducing operational costs by $50,000 annually',
      '• Led cross-departmental initiatives resulting in 25% improvement in customer satisfaction'
    ]
  };
  
  const industryTemplates = templates[targetIndustry] || templates['Software Engineering'];
  return industryTemplates.join('\n');
}

/**
 * Enhance education section
 */
function enhanceEducation(education, targetVisa) {
  const suggestions = [];
  const enhanced = [];

  if (!education || education.length === 0) {
    suggestions.push({
      type: 'missing',
      field: 'education',
      suggestion: 'Add education history with degrees and institutions',
      priority: 'critical'
    });
    return { suggestions, enhanced: [], impact: 'Required for most visa applications' };
  }

  education.forEach((edu, index) => {
    const eduSuggestions = [];
    const enhancedEdu = { ...edu };

    // Check for credential evaluation
    if (targetVisa === 'Express Entry' && !edu.degree?.toLowerCase().includes('canadian')) {
      eduSuggestions.push({
        type: 'improvement',
        field: 'credential',
        suggestion: 'Consider adding Educational Credential Assessment (ECA) for foreign degrees',
        priority: 'high'
      });
    }

    // Add graduation year if missing
    if (!edu.graduationDate) {
      eduSuggestions.push({
        type: 'missing',
        field: 'graduationDate',
        suggestion: 'Add graduation year',
        priority: 'medium'
      });
      enhancedEdu.graduationDate = '2020';
    }

    // Add relevant coursework for recent graduates
    if (!edu.coursework && (targetVisa === 'Student Visa' || edu.graduationDate >= '2020')) {
      eduSuggestions.push({
        type: 'improvement',
        field: 'coursework',
        suggestion: 'Add relevant coursework or academic achievements',
        priority: 'medium'
      });
    }

    suggestions.push({
      position: index + 1,
      degree: edu.degree,
      suggestions: eduSuggestions
    });

    enhanced.push(enhancedEdu);
  });

  return {
    suggestions,
    enhanced,
    impact: 'Demonstrates educational qualifications for visa requirements'
  };
}

/**
 * Enhance skills section
 */
function enhanceSkills(skills, targetIndustry) {
  const suggestions = [];
  let enhanced = skills;

  const industryKeywords = INDUSTRY_KEYWORDS[targetIndustry] || INDUSTRY_KEYWORDS['Software Engineering'];
  const recommendedSkills = [
    ...industryKeywords.technical.slice(0, 8),
    ...industryKeywords.soft.slice(0, 4)
  ];

  // Convert skills to array if it's a string
  let skillsArray = [];
  if (typeof skills === 'string') {
    skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
  } else if (Array.isArray(skills)) {
    skillsArray = skills.map(skill => typeof skill === 'string' ? skill : skill.name);
  }

  if (skillsArray.length === 0) {
    suggestions.push({
      type: 'missing',
      field: 'skills',
      suggestion: `Add relevant ${targetIndustry} skills`,
      priority: 'critical',
      recommended: recommendedSkills
    });
    enhanced = recommendedSkills;
  } else {
    // Check for missing key skills
    const missingSkills = recommendedSkills.filter(skill =>
      !skillsArray.some(userSkill =>
        userSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    if (missingSkills.length > 0) {
      suggestions.push({
        type: 'improvement',
        field: 'skills',
        suggestion: `Consider adding these in-demand skills: ${missingSkills.slice(0, 5).join(', ')}`,
        priority: 'medium',
        recommended: missingSkills.slice(0, 8)
      });
    }

    // Suggest skill categorization
    if (skillsArray.length > 8) {
      suggestions.push({
        type: 'improvement',
        field: 'organization',
        suggestion: 'Organize skills into categories (Technical, Soft Skills, Languages)',
        priority: 'low'
      });
    }
  }

  return {
    suggestions,
    enhanced,
    impact: 'Improves keyword matching and demonstrates relevant competencies'
  };
}

/**
 * Suggest additional sections for visa applications
 */
function suggestAdditionalSections(cvData, targetVisa) {
  const suggestions = [];

  // Language proficiency section
  const hasLanguageSection = JSON.stringify(cvData).toLowerCase().includes('language');
  if (!hasLanguageSection) {
    suggestions.push({
      type: 'addition',
      section: 'Languages',
      suggestion: 'Add language proficiency section with test scores (IELTS, CELPIP, TEF)',
      priority: 'high',
      template: {
        title: 'Language Proficiency',
        content: [
          'English: Native/Fluent (IELTS: 8.0)',
          'French: Intermediate (TEF: B2)',
          'Spanish: Conversational'
        ]
      }
    });
  }

  // Certifications section
  const hasCertifications = JSON.stringify(cvData).toLowerCase().includes('certification');
  if (!hasCertifications) {
    suggestions.push({
      type: 'addition',
      section: 'Certifications',
      suggestion: 'Add professional certifications and licenses',
      priority: 'medium',
      template: {
        title: 'Professional Certifications',
        content: [
          'AWS Certified Solutions Architect (2023)',
          'Project Management Professional (PMP) (2022)',
          'Certified Scrum Master (CSM) (2021)'
        ]
      }
    });
  }

  // Volunteer experience for immigration
  if (targetVisa === 'Express Entry' || targetVisa === 'Provincial Nominee') {
    suggestions.push({
      type: 'addition',
      section: 'Volunteer Experience',
      suggestion: 'Add volunteer work to demonstrate community involvement',
      priority: 'low',
      template: {
        title: 'Volunteer Experience',
        content: [
          'Community Technology Mentor - Local Library (2022-Present)',
          'Youth Coding Instructor - Non-profit Organization (2021-2022)'
        ]
      }
    });
  }

  return suggestions;
}

/**
 * Generate keyword suggestions based on industry analysis
 */
function generateKeywordSuggestions(cvData, targetIndustry) {
  const industryKeywords = INDUSTRY_KEYWORDS[targetIndustry] || INDUSTRY_KEYWORDS['Software Engineering'];
  const allText = JSON.stringify(cvData).toLowerCase();

  const missingKeywords = {
    technical: industryKeywords.technical.filter(keyword =>
      !allText.includes(keyword.toLowerCase())
    ),
    soft: industryKeywords.soft.filter(keyword =>
      !allText.includes(keyword.toLowerCase())
    ),
    certifications: industryKeywords.certifications.filter(keyword =>
      !allText.includes(keyword.toLowerCase())
    )
  };

  return {
    priority: missingKeywords.technical.slice(0, 5),
    secondary: missingKeywords.soft.slice(0, 3),
    certifications: missingKeywords.certifications.slice(0, 3),
    usage: {
      summary: 'Include 2-3 priority keywords in your professional summary',
      experience: 'Naturally integrate keywords into job descriptions',
      skills: 'Add missing technical skills if you have experience with them'
    }
  };
}

/**
 * Get optimal template recommendation
 */
function getOptimalTemplate(cvData, targetVisa, targetIndustry) {
  const templateScores = {
    'SoftwareEngineer': { score: 0, reasons: [] },
    'Healthcare': { score: 0, reasons: [] },
    'BusinessManager': { score: 0, reasons: [] },
    'SkilledTrades': { score: 0, reasons: [] },
    'Academic': { score: 0, reasons: [] }
  };

  // Score based on industry alignment
  if (targetIndustry === 'Software Engineering') {
    templateScores.SoftwareEngineer.score += 40;
    templateScores.SoftwareEngineer.reasons.push('Perfect match for software engineering roles');
  } else if (targetIndustry === 'Healthcare') {
    templateScores.Healthcare.score += 40;
    templateScores.Healthcare.reasons.push('Optimized for healthcare professionals');
  } else if (targetIndustry === 'Business Management') {
    templateScores.BusinessManager.score += 40;
    templateScores.BusinessManager.reasons.push('Designed for management and executive roles');
  }

  // Score based on visa type
  if (targetVisa === 'Express Entry') {
    templateScores.SoftwareEngineer.score += 20;
    templateScores.Healthcare.score += 20;
    templateScores.BusinessManager.score += 15;
  } else if (targetVisa === 'Skilled Worker (UK)') {
    templateScores.SoftwareEngineer.score += 15;
    templateScores.Academic.score += 20;
  }

  // Score based on experience level
  const experienceYears = calculateExperienceYears(cvData.experience);
  if (experienceYears >= 5) {
    templateScores.SoftwareEngineer.score += 10;
    templateScores.BusinessManager.score += 15;
    templateScores.Healthcare.score += 10;
  }

  // Find the best template
  const bestTemplate = Object.entries(templateScores).reduce((best, [template, data]) =>
    data.score > best.score ? { template, ...data } : best
  , { template: 'SoftwareEngineer', score: 0, reasons: [] });

  return {
    recommended: bestTemplate.template,
    score: bestTemplate.score,
    reasons: bestTemplate.reasons,
    alternatives: Object.entries(templateScores)
      .filter(([template]) => template !== bestTemplate.template)
      .sort(([,a], [,b]) => b.score - a.score)
      .slice(0, 2)
      .map(([template, data]) => ({ template, score: data.score }))
  };
}

/**
 * Calculate years of experience from experience array
 */
function calculateExperienceYears(experiences) {
  if (!experiences || experiences.length === 0) return 0;

  let totalYears = 0;
  experiences.forEach(exp => {
    if (exp.startDate && exp.endDate) {
      const start = new Date(exp.startDate);
      const end = exp.endDate.toLowerCase().includes('present') ? new Date() : new Date(exp.endDate);
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
      totalYears += Math.max(0, years);
    }
  });

  return Math.round(totalYears * 10) / 10;
}

/**
 * Get priority actions based on ATS analysis
 */
function getPriorityActions(atsAnalysis) {
  const actions = [];

  // Critical actions (score < 60%)
  Object.entries(atsAnalysis.breakdown).forEach(([category, data]) => {
    if (data.percentage < 60) {
      actions.push({
        category,
        priority: 'critical',
        action: `Improve ${category.toLowerCase()} section`,
        impact: 'high',
        timeEstimate: '30-60 minutes'
      });
    }
  });

  // High priority actions (score < 75%)
  Object.entries(atsAnalysis.breakdown).forEach(([category, data]) => {
    if (data.percentage >= 60 && data.percentage < 75) {
      actions.push({
        category,
        priority: 'high',
        action: `Enhance ${category.toLowerCase()} section`,
        impact: 'medium',
        timeEstimate: '15-30 minutes'
      });
    }
  });

  return actions.slice(0, 5); // Limit to top 5 actions
}

/**
 * Calculate estimated impact of improvements
 */
function calculateImprovementImpact(atsAnalysis) {
  const currentScore = atsAnalysis.totalScore;
  let potentialIncrease = 0;

  // Calculate potential score increase for each category
  Object.entries(atsAnalysis.breakdown).forEach(([category, data]) => {
    const currentPercentage = data.percentage;
    const maxImprovement = Math.min(95, currentPercentage + 30); // Cap at 95%
    const improvement = (maxImprovement - currentPercentage) / 100 * data.maxScore;
    potentialIncrease += improvement;
  });

  const projectedScore = Math.min(95, currentScore + potentialIncrease);

  return {
    currentScore,
    projectedScore: Math.round(projectedScore),
    potentialIncrease: Math.round(potentialIncrease),
    timeToImprove: '2-4 hours',
    confidenceLevel: projectedScore >= 85 ? 'High' : projectedScore >= 75 ? 'Medium' : 'Low'
  };
}
