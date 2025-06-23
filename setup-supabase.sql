-- NWI Visas CRM Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'New',
  priority VARCHAR(20) DEFAULT 'Medium',
  interest_area VARCHAR(255),
  target_country VARCHAR(100),
  current_country VARCHAR(100),
  nationality VARCHAR(100),
  age INTEGER,
  education_level VARCHAR(255),
  work_experience_years INTEGER,
  occupation VARCHAR(255),
  language_skills JSONB,
  budget_range VARCHAR(100),
  timeline VARCHAR(100),
  notes TEXT,
  assigned_to VARCHAR(255),
  last_contacted TIMESTAMP,
  next_follow_up TIMESTAMP,
  conversion_probability INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_number VARCHAR(50) UNIQUE,
  client_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  visa_type VARCHAR(100) NOT NULL,
  target_country VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'Draft',
  cv_status VARCHAR(50) DEFAULT 'Not Uploaded',
  payment_status VARCHAR(50) DEFAULT 'Pending',
  payment_amount DECIMAL(10,2),
  notes TEXT,
  lead_id UUID REFERENCES leads(id),
  assigned_to VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_number VARCHAR(50) UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100),
  category VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'Medium',
  status VARCHAR(50) DEFAULT 'Pending',
  due_date DATE,
  assigned_to VARCHAR(255),
  related_lead_id UUID REFERENCES leads(id),
  related_application_id UUID REFERENCES applications(id),
  client_name VARCHAR(255),
  case_number VARCHAR(100),
  visa_type VARCHAR(100),
  country VARCHAR(100),
  immigration_stage VARCHAR(255),
  notes TEXT,
  client_visible BOOLEAN DEFAULT false,
  estimated_hours INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Calls Table
CREATE TABLE IF NOT EXISTS calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  call_number VARCHAR(50) UNIQUE,
  client_name VARCHAR(255) NOT NULL,
  client_contact VARCHAR(100),
  client_email VARCHAR(255),
  scheduled_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER,
  purpose VARCHAR(255) NOT NULL,
  call_category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Scheduled',
  priority VARCHAR(20) DEFAULT 'Medium',
  consultant VARCHAR(255),
  related_application_id UUID REFERENCES applications(id),
  related_lead_id UUID REFERENCES leads(id),
  case_number VARCHAR(100),
  visa_type VARCHAR(100),
  target_country VARCHAR(100),
  immigration_stage VARCHAR(255),
  call_type VARCHAR(50),
  meeting_link VARCHAR(500),
  agenda TEXT,
  notes TEXT,
  outcome TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  recording_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_number VARCHAR(50) UNIQUE,
  application_id UUID REFERENCES applications(id),
  client_id VARCHAR(100),
  document_type VARCHAR(255) NOT NULL,
  document_category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Required',
  review_status VARCHAR(50),
  approval_status VARCHAR(50),
  is_mandatory BOOLEAN DEFAULT false,
  priority_level VARCHAR(20) DEFAULT 'Medium',
  file_url VARCHAR(500),
  file_name VARCHAR(255),
  file_size INTEGER,
  file_type VARCHAR(100),
  date_requested DATE,
  date_received DATE,
  date_reviewed DATE,
  date_approved DATE,
  deadline_date DATE,
  client_name VARCHAR(255),
  case_number VARCHAR(100),
  visa_type VARCHAR(100),
  target_country VARCHAR(100),
  immigration_stage VARCHAR(255),
  notes TEXT,
  reviewer VARCHAR(255),
  rejection_reason TEXT,
  version_number INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Enable read access for all users" ON leads FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON leads FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON leads FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON applications FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON applications FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON applications FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON tasks FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON tasks FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON calls FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON calls FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON calls FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON calls FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON documents FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON documents FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON documents FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at);

CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_visa_type ON applications(visa_type);
CREATE INDEX idx_applications_created_at ON applications(created_at);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);

CREATE INDEX idx_calls_status ON calls(status);
CREATE INDEX idx_calls_scheduled_date ON calls(scheduled_date);
CREATE INDEX idx_calls_consultant ON calls(consultant);

CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_documents_document_type ON documents(document_type);
