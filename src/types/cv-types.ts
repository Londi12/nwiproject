export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

// Alias for compatibility with enhanced parser
export interface Experience extends WorkExperience {}

export interface Project {
  title: string;
  description: string;
  technologies?: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
}

export interface Skill {
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[] | Skill[] | string;
  projects?: Project[];
}

export type TemplateType =
  | 'professional'
  | 'modern'
  | 'creative'
  | 'simple'
  | 'executive'
  | 'minimal'
  | 'technical'
  | 'graduate'
  | 'digital';

export interface CVTemplate {
  id: TemplateType;
  name: string;
  description: string;
  preview: string;
  features: string[];
  category: string;
  immigration_focus: string;
  color: string;
  icon: string;
  layout: string;
  sections: string[];
  atsScore: number;
}
