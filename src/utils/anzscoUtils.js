// ANZSCO Utility Functions for Australian Skills Assessment Integration
import { 
  ANZSCO_OCCUPATIONS, 
  getOccupationByCode, 
  searchOccupationsByTitle,
  getOccupationsByCategory,
  getAllCategories,
  getSkillLevels,
  getAssessingAuthorities
} from '../data/anzscoOccupations.js';

// Skills Assessment Eligibility Checker
export const checkSkillsAssessmentEligibility = (clientData, occupationCode) => {
  const occupation = getOccupationByCode(occupationCode);
  if (!occupation) {
    return {
      eligible: false,
      reason: "Invalid occupation code",
      recommendations: []
    };
  }

  const eligibilityChecks = {
    qualification: false,
    experience: false,
    english: false,
    overall: false
  };

  const recommendations = [];

  // Check qualification requirements
  if (clientData.education_level) {
    const hasRequiredQualification = checkQualificationMatch(
      clientData.education_level, 
      occupation.qualifications.essential
    );
    eligibilityChecks.qualification = hasRequiredQualification;
    
    if (!hasRequiredQualification) {
      recommendations.push({
        type: "qualification",
        message: `Required: ${occupation.qualifications.essential.join(', ')}`,
        priority: "high"
      });
    }
  }

  // Check work experience
  if (clientData.work_experience_years) {
    const minExperience = parseInt(occupation.workExperience.minimum.split(' ')[0]);
    eligibilityChecks.experience = clientData.work_experience_years >= minExperience;
    
    if (!eligibilityChecks.experience) {
      recommendations.push({
        type: "experience",
        message: `Minimum ${occupation.workExperience.minimum} required`,
        priority: "high"
      });
    }
  }

  // Check English language requirements
  if (clientData.language_skills?.english) {
    eligibilityChecks.english = checkEnglishRequirements(
      clientData.language_skills.english,
      occupation.englishRequirements
    );
    
    if (!eligibilityChecks.english) {
      recommendations.push({
        type: "english",
        message: `English requirement: ${occupation.englishRequirements.IELTS}`,
        priority: "medium"
      });
    }
  }

  // Overall eligibility
  eligibilityChecks.overall = eligibilityChecks.qualification && 
                             eligibilityChecks.experience && 
                             eligibilityChecks.english;

  return {
    eligible: eligibilityChecks.overall,
    checks: eligibilityChecks,
    occupation: occupation,
    recommendations: recommendations,
    nextSteps: generateNextSteps(eligibilityChecks, occupation)
  };
};

// Check if qualification matches requirements
const checkQualificationMatch = (clientEducation, requiredQualifications) => {
  const educationLevels = {
    "High School": 1,
    "Diploma/Certificate": 2,
    "Bachelor's Degree": 3,
    "Master's Degree": 4,
    "PhD/Doctorate": 5,
    "Professional Degree": 4
  };

  const clientLevel = educationLevels[clientEducation] || 0;
  
  // Check if any required qualification is met
  return requiredQualifications.some(req => {
    if (req.includes("Certificate III")) return clientLevel >= 2;
    if (req.includes("Certificate IV")) return clientLevel >= 2;
    if (req.includes("Bachelor")) return clientLevel >= 3;
    if (req.includes("Postgraduate") || req.includes("Master")) return clientLevel >= 4;
    return true; // Default to true for other requirements
  });
};

// Check English language requirements
const checkEnglishRequirements = (clientEnglish, requirements) => {
  const englishLevels = {
    "None": 0,
    "Basic": 1,
    "Intermediate": 2,
    "Advanced": 3,
    "Native": 4
  };

  const clientLevel = englishLevels[clientEnglish] || 0;
  
  // For most occupations, Advanced or Native is required
  // Teachers require higher standards
  if (requirements.IELTS.includes("7.5")) {
    return clientLevel >= 4; // Native level required
  } else {
    return clientLevel >= 3; // Advanced level required
  }
};

// Generate next steps based on eligibility checks
const generateNextSteps = (checks, occupation) => {
  const steps = [];

  if (!checks.qualification) {
    steps.push({
      step: "Qualification Assessment",
      description: `Obtain required qualifications: ${occupation.qualifications.essential.join(', ')}`,
      priority: 1,
      timeframe: "6-24 months"
    });
  }

  if (!checks.experience) {
    steps.push({
      step: "Gain Work Experience",
      description: `Obtain ${occupation.workExperience.minimum} in relevant field`,
      priority: 2,
      timeframe: "1-3 years"
    });
  }

  if (!checks.english) {
    steps.push({
      step: "English Language Test",
      description: `Achieve required English scores: ${occupation.englishRequirements.IELTS}`,
      priority: 3,
      timeframe: "3-6 months"
    });
  }

  if (checks.overall) {
    steps.push({
      step: "Skills Assessment Application",
      description: `Apply through ${occupation.skillsAssessment.assessingAuthority}`,
      priority: 1,
      timeframe: occupation.skillsAssessment.processingTime
    });
  }

  return steps;
};

// Generate document checklist for skills assessment
export const generateDocumentChecklist = (occupationCode) => {
  const occupation = getOccupationByCode(occupationCode);
  if (!occupation) return [];

  const baseDocuments = [
    {
      name: "Passport",
      type: "Identity",
      required: true,
      description: "Current passport with at least 6 months validity"
    },
    {
      name: "Birth Certificate",
      type: "Identity", 
      required: true,
      description: "Certified copy of birth certificate"
    },
    {
      name: "Academic Transcripts",
      type: "Education",
      required: true,
      description: "Official transcripts from all educational institutions"
    },
    {
      name: "Degree/Diploma Certificates",
      type: "Education",
      required: true,
      description: "Certified copies of all qualification certificates"
    },
    {
      name: "Employment References",
      type: "Experience",
      required: true,
      description: "Detailed employment references covering required experience period"
    },
    {
      name: "CV/Resume",
      type: "Experience",
      required: true,
      description: "Detailed CV highlighting relevant experience and skills"
    }
  ];

  // Add occupation-specific documents
  const occupationSpecific = [];

  if (occupation.category === "Education") {
    occupationSpecific.push(
      {
        name: "Teaching Registration",
        type: "Professional",
        required: true,
        description: "Current teaching registration/license"
      },
      {
        name: "English Language Test Results",
        type: "Language",
        required: true,
        description: `${occupation.englishRequirements.IELTS} - IELTS Academic results`
      },
      {
        name: "Curriculum Vitae (Teaching)",
        type: "Professional",
        required: true,
        description: "Detailed teaching CV with lesson plans and student outcomes"
      }
    );
  }

  if (occupation.category === "Trades") {
    occupationSpecific.push(
      {
        name: "Trade Qualification Certificate",
        type: "Professional",
        required: true,
        description: "Certificate III/IV in relevant trade"
      },
      {
        name: "Trade License",
        type: "Professional",
        required: true,
        description: "Current trade license (if applicable)"
      },
      {
        name: "Apprenticeship Records",
        type: "Training",
        required: true,
        description: "Records of apprenticeship completion"
      },
      {
        name: "Skills Logbook",
        type: "Professional",
        required: false,
        description: "Detailed record of skills and competencies"
      }
    );
  }

  return [...baseDocuments, ...occupationSpecific];
};

// Calculate skills assessment timeline and costs
export const calculateAssessmentTimeline = (occupationCode, clientReadiness) => {
  const occupation = getOccupationByCode(occupationCode);
  if (!occupation) return null;

  const baseTimeline = {
    preparation: "4-8 weeks",
    assessment: occupation.skillsAssessment.processingTime,
    total: "16-24 weeks"
  };

  const costs = {
    assessment: occupation.skillsAssessment.cost,
    englishTest: "AUD $300-400",
    documentTranslation: "AUD $200-500",
    total: "AUD $1,700-2,700"
  };

  // Adjust timeline based on client readiness
  if (clientReadiness?.hasDocuments) {
    baseTimeline.preparation = "2-4 weeks";
    baseTimeline.total = "14-20 weeks";
  }

  if (clientReadiness?.hasEnglishTest) {
    costs.englishTest = "AUD $0";
    costs.total = "AUD $1,400-2,300";
  }

  return {
    timeline: baseTimeline,
    costs: costs,
    milestones: [
      {
        phase: "Document Preparation",
        duration: baseTimeline.preparation,
        tasks: ["Gather required documents", "Obtain translations", "Get certifications"]
      },
      {
        phase: "Application Submission",
        duration: "1-2 weeks",
        tasks: ["Complete application forms", "Pay assessment fees", "Submit application"]
      },
      {
        phase: "Assessment Processing",
        duration: occupation.skillsAssessment.processingTime,
        tasks: ["Document review", "Qualification verification", "Experience assessment"]
      },
      {
        phase: "Outcome",
        duration: "1 week",
        tasks: ["Receive assessment result", "Plan next steps"]
      }
    ]
  };
};

// Match client occupation to ANZSCO codes
export const matchClientToANZSCO = (clientOccupation, clientEducation, clientExperience) => {
  const matches = [];
  
  // Search by occupation title
  const titleMatches = searchOccupationsByTitle(clientOccupation);
  
  titleMatches.forEach(occupation => {
    const eligibility = checkSkillsAssessmentEligibility({
      education_level: clientEducation,
      work_experience_years: clientExperience,
      language_skills: { english: "Advanced" } // Assume advanced for matching
    }, occupation.code);
    
    matches.push({
      occupation: occupation,
      matchScore: calculateMatchScore(clientOccupation, occupation),
      eligibility: eligibility.eligible,
      recommendations: eligibility.recommendations
    });
  });

  // Sort by match score and eligibility
  return matches.sort((a, b) => {
    if (a.eligibility !== b.eligibility) {
      return b.eligibility - a.eligibility; // Eligible first
    }
    return b.matchScore - a.matchScore; // Higher score first
  });
};

// Calculate match score between client occupation and ANZSCO occupation
const calculateMatchScore = (clientOccupation, anzscoOccupation) => {
  const clientWords = clientOccupation.toLowerCase().split(' ');
  const anzscoWords = anzscoOccupation.title.toLowerCase().split(' ');
  
  let matchCount = 0;
  clientWords.forEach(word => {
    if (anzscoWords.some(anzscoWord => anzscoWord.includes(word) || word.includes(anzscoWord))) {
      matchCount++;
    }
  });
  
  return (matchCount / Math.max(clientWords.length, anzscoWords.length)) * 100;
};

// Export all utility functions
export {
  getOccupationByCode,
  searchOccupationsByTitle,
  getOccupationsByCategory,
  getAllCategories,
  getSkillLevels,
  getAssessingAuthorities,
  ANZSCO_OCCUPATIONS
};
