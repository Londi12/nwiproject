// ANZSCO Occupation Database for Australian Skills Assessment
// Australian and New Zealand Standard Classification of Occupations

export const ANZSCO_OCCUPATIONS = {
  // Early Childhood Teachers
  "241111": {
    code: "241111",
    title: "Early Childhood (Pre-primary School) Teacher",
    category: "Education",
    skillLevel: 1,
    description: "Plans and conducts educational activities for children prior to their entry to formal schooling.",
    keyTasks: [
      "Planning and implementing developmentally appropriate programs",
      "Observing and assessing children's development",
      "Maintaining records of children's progress",
      "Communicating with parents and caregivers",
      "Creating safe and stimulating learning environments"
    ],
    qualifications: {
      essential: [
        "Bachelor degree in Early Childhood Education or equivalent",
        "Teaching registration/certification as required by state/territory"
      ],
      desirable: [
        "Postgraduate qualification in Early Childhood Education",
        "Experience in early childhood settings"
      ]
    },
    skillsAssessment: {
      assessingAuthority: "AITSL (Australian Institute for Teaching and School Leadership)",
      requirements: [
        "Qualification assessment",
        "English language proficiency",
        "Teaching experience verification"
      ],
      processingTime: "10-12 weeks",
      cost: "AUD $500-800"
    },
    workExperience: {
      minimum: "1 year post-qualification experience",
      preferred: "2+ years in early childhood education"
    },
    englishRequirements: {
      IELTS: "Overall 7.5 (Reading 7, Writing 7, Speaking 8, Listening 8)",
      PTE: "Overall 79 (Reading 65, Writing 65, Speaking 79, Listening 79)",
      TOEFL: "Overall 102 (Reading 24, Writing 24, Speaking 27, Listening 24)"
    }
  },

  // Primary School Teachers
  "241213": {
    code: "241213",
    title: "Primary School Teacher",
    category: "Education",
    skillLevel: 1,
    description: "Teaches one or more subjects within a prescribed curriculum to primary school students.",
    keyTasks: [
      "Planning and delivering curriculum-based lessons",
      "Assessing student progress and providing feedback",
      "Managing classroom behavior and learning environment",
      "Collaborating with colleagues and parents",
      "Participating in professional development"
    ],
    qualifications: {
      essential: [
        "Bachelor degree in Primary Education or equivalent",
        "Teaching registration as required by state/territory"
      ],
      desirable: [
        "Postgraduate qualification in Education",
        "Specialization in specific subject areas"
      ]
    },
    skillsAssessment: {
      assessingAuthority: "AITSL (Australian Institute for Teaching and School Leadership)",
      requirements: [
        "Qualification assessment",
        "English language proficiency",
        "Teaching experience verification"
      ],
      processingTime: "10-12 weeks",
      cost: "AUD $500-800"
    },
    workExperience: {
      minimum: "1 year post-qualification experience",
      preferred: "2+ years in primary education"
    },
    englishRequirements: {
      IELTS: "Overall 7.5 (Reading 7, Writing 7, Speaking 8, Listening 8)",
      PTE: "Overall 79 (Reading 65, Writing 65, Speaking 79, Listening 79)",
      TOEFL: "Overall 102 (Reading 24, Writing 24, Speaking 27, Listening 24)"
    }
  },

  // Secondary School Teachers
  "241411": {
    code: "241411",
    title: "Secondary School Teacher",
    category: "Education",
    skillLevel: 1,
    description: "Teaches one or more subjects within a prescribed curriculum to secondary school students.",
    keyTasks: [
      "Planning and delivering subject-specific lessons",
      "Assessing and reporting on student achievement",
      "Managing classroom discipline and student welfare",
      "Participating in curriculum development",
      "Engaging in professional learning communities"
    ],
    qualifications: {
      essential: [
        "Bachelor degree in Education (Secondary) or relevant subject area plus teaching qualification",
        "Teaching registration as required by state/territory"
      ],
      desirable: [
        "Postgraduate qualification in Education or subject specialization",
        "Additional teaching method qualifications"
      ]
    },
    skillsAssessment: {
      assessingAuthority: "AITSL (Australian Institute for Teaching and School Leadership)",
      requirements: [
        "Qualification assessment",
        "English language proficiency",
        "Teaching experience verification"
      ],
      processingTime: "10-12 weeks",
      cost: "AUD $500-800"
    },
    workExperience: {
      minimum: "1 year post-qualification experience",
      preferred: "2+ years in secondary education"
    },
    englishRequirements: {
      IELTS: "Overall 7.5 (Reading 7, Writing 7, Speaking 8, Listening 8)",
      PTE: "Overall 79 (Reading 65, Writing 65, Speaking 79, Listening 79)",
      TOEFL: "Overall 102 (Reading 24, Writing 24, Speaking 27, Listening 24)"
    }
  },

  // Plumbers
  "334111": {
    code: "334111",
    title: "Plumber (General)",
    category: "Trades",
    skillLevel: 3,
    description: "Installs, maintains and repairs pipes, fixtures and other plumbing equipment used for water distribution and waste water disposal.",
    keyTasks: [
      "Installing and maintaining water supply systems",
      "Installing and repairing drainage and sewerage systems",
      "Installing and maintaining gas supply systems",
      "Reading and interpreting plans and specifications",
      "Testing plumbing systems for leaks and defects"
    ],
    qualifications: {
      essential: [
        "Certificate III in Plumbing or equivalent",
        "Plumbing license as required by state/territory"
      ],
      desirable: [
        "Certificate IV in Plumbing and Services",
        "Gas fitting qualifications",
        "Backflow prevention certification"
      ]
    },
    skillsAssessment: {
      assessingAuthority: "TRA (Trades Recognition Australia)",
      requirements: [
        "Trade qualification assessment",
        "Employment verification",
        "Skills assessment interview/practical test"
      ],
      processingTime: "12-16 weeks",
      cost: "AUD $1,200-1,500"
    },
    workExperience: {
      minimum: "3 years post-qualification experience",
      preferred: "5+ years in plumbing trade"
    },
    englishRequirements: {
      IELTS: "Overall 6.0 (each band 5.0)",
      PTE: "Overall 50 (each band 36)",
      TOEFL: "Overall 64 (Reading 13, Writing 12, Speaking 18, Listening 13)"
    }
  },

  // Fitters and Turners
  "323211": {
    code: "323211",
    title: "Fitter (General)",
    category: "Trades",
    skillLevel: 3,
    description: "Fits, assembles, grinds and shapes metal parts and subassemblies to fabricate production machines and other equipment.",
    keyTasks: [
      "Reading and interpreting engineering drawings",
      "Measuring and marking out metal stock",
      "Cutting, shaping and finishing metal components",
      "Assembling and fitting metal parts",
      "Testing and adjusting completed assemblies"
    ],
    qualifications: {
      essential: [
        "Certificate III in Engineering - Mechanical Trade (Fitting and Machining) or equivalent",
        "Trade certification as required"
      ],
      desirable: [
        "Certificate IV in Engineering",
        "CNC machining qualifications",
        "Welding certifications"
      ]
    },
    skillsAssessment: {
      assessingAuthority: "TRA (Trades Recognition Australia)",
      requirements: [
        "Trade qualification assessment",
        "Employment verification",
        "Skills assessment interview/practical test"
      ],
      processingTime: "12-16 weeks",
      cost: "AUD $1,200-1,500"
    },
    workExperience: {
      minimum: "3 years post-qualification experience",
      preferred: "5+ years in fitting and turning"
    },
    englishRequirements: {
      IELTS: "Overall 6.0 (each band 5.0)",
      PTE: "Overall 50 (each band 36)",
      TOEFL: "Overall 64 (Reading 13, Writing 12, Speaking 18, Listening 13)"
    }
  },

  // Electricians
  "341111": {
    code: "341111",
    title: "Electrician (General)",
    category: "Trades",
    skillLevel: 3,
    description: "Installs, maintains, tests and repairs electrical equipment, machinery and systems.",
    keyTasks: [
      "Installing and maintaining electrical wiring and equipment",
      "Testing electrical systems and equipment",
      "Diagnosing and repairing electrical faults",
      "Reading and interpreting electrical drawings",
      "Ensuring compliance with electrical codes and safety standards"
    ],
    qualifications: {
      essential: [
        "Certificate III in Electrotechnology Electrician or equivalent",
        "Electrical license as required by state/territory"
      ],
      desirable: [
        "Certificate IV in Electrical",
        "Instrumentation qualifications",
        "High voltage switching qualifications"
      ]
    },
    skillsAssessment: {
      assessingAuthority: "TRA (Trades Recognition Australia)",
      requirements: [
        "Trade qualification assessment",
        "Employment verification",
        "Skills assessment interview/practical test"
      ],
      processingTime: "12-16 weeks",
      cost: "AUD $1,200-1,500"
    },
    workExperience: {
      minimum: "3 years post-qualification experience",
      preferred: "5+ years in electrical trade"
    },
    englishRequirements: {
      IELTS: "Overall 6.0 (each band 5.0)",
      PTE: "Overall 50 (each band 36)",
      TOEFL: "Overall 64 (Reading 13, Writing 12, Speaking 18, Listening 13)"
    }
  },

  // Metal Fabricators
  "322311": {
    code: "322311",
    title: "Metal Fabricator",
    category: "Trades",
    skillLevel: 3,
    description: "Marks out, cuts, shapes, assembles and repairs metal sections, plates and structures.",
    keyTasks: [
      "Reading and interpreting engineering drawings and specifications",
      "Marking out and cutting metal sections and plates",
      "Shaping and forming metal using various techniques",
      "Welding and joining metal components",
      "Assembling and installing metal structures"
    ],
    qualifications: {
      essential: [
        "Certificate III in Engineering - Fabrication Trade (Metal Fabrication) or equivalent",
        "Trade certification as required"
      ],
      desirable: [
        "Certificate IV in Engineering",
        "Advanced welding qualifications",
        "Crane operation licenses"
      ]
    },
    skillsAssessment: {
      assessingAuthority: "TRA (Trades Recognition Australia)",
      requirements: [
        "Trade qualification assessment",
        "Employment verification",
        "Skills assessment interview/practical test"
      ],
      processingTime: "12-16 weeks",
      cost: "AUD $1,200-1,500"
    },
    workExperience: {
      minimum: "3 years post-qualification experience",
      preferred: "5+ years in metal fabrication"
    },
    englishRequirements: {
      IELTS: "Overall 6.0 (each band 5.0)",
      PTE: "Overall 50 (each band 36)",
      TOEFL: "Overall 64 (Reading 13, Writing 12, Speaking 18, Listening 13)"
    }
  }
};

// Helper functions for ANZSCO operations
export const getOccupationByCode = (code) => {
  return ANZSCO_OCCUPATIONS[code] || null;
};

export const searchOccupationsByTitle = (searchTerm) => {
  const results = [];
  const term = searchTerm.toLowerCase();
  
  Object.values(ANZSCO_OCCUPATIONS).forEach(occupation => {
    if (occupation.title.toLowerCase().includes(term)) {
      results.push(occupation);
    }
  });
  
  return results;
};

export const getOccupationsByCategory = (category) => {
  return Object.values(ANZSCO_OCCUPATIONS).filter(
    occupation => occupation.category === category
  );
};

export const getAllCategories = () => {
  const categories = new Set();
  Object.values(ANZSCO_OCCUPATIONS).forEach(occupation => {
    categories.add(occupation.category);
  });
  return Array.from(categories);
};

export const getSkillLevels = () => {
  return {
    1: "Professional",
    2: "Associate Professional", 
    3: "Skilled",
    4: "Semi-skilled",
    5: "Unskilled"
  };
};

export const getAssessingAuthorities = () => {
  const authorities = new Set();
  Object.values(ANZSCO_OCCUPATIONS).forEach(occupation => {
    authorities.add(occupation.skillsAssessment.assessingAuthority);
  });
  return Array.from(authorities);
};
