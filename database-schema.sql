-- NWI Visas CRM Database Schema for Supabase
-- Run these commands in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'associate' CHECK (role IN ('associate', 'admin', 'manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT NOT NULL CHECK (source IN ('Website', 'Facebook', 'WhatsApp', 'Referral', 'LinkedIn', 'Instagram', 'Walk-in', 'Email', 'Other')),
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Needs Follow-Up', 'Qualified', 'Converted', 'Lost')),
  interest_area TEXT,
  notes TEXT,
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  visa_type TEXT NOT NULL CHECK (visa_type IN ('Express Entry', 'Provincial Nominee', 'Family Sponsorship', 'Student Visa', 'Work Permit', 'Visitor Visa', 'Business Immigration')),
  target_country TEXT NOT NULL CHECK (target_country IN ('Canada', 'USA', 'UK', 'Australia', 'New Zealand', 'Germany')),
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'In Progress', 'Submitted', 'Under Review', 'Additional Info Required', 'Approved', 'Rejected')),
  cv_status TEXT DEFAULT 'Not Uploaded' CHECK (cv_status IN ('Not Uploaded', 'Uploaded', 'Under Review', 'Approved', 'Needs Update')),
  payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Partial', 'Paid', 'Refunded')),
  payment_amount DECIMAL(10,2),
  notes TEXT,
  lead_id UUID REFERENCES public.leads(id),
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('Follow-up', 'Document Request', 'Call', 'CV Update', 'Application Review', 'Payment Follow-up', 'Meeting')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
  due_date TIMESTAMP WITH TIME ZONE,
  lead_id UUID REFERENCES public.leads(id),
  application_id UUID REFERENCES public.applications(id),
  assigned_to UUID REFERENCES public.profiles(id),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Passport', 'Birth Certificate', 'Marriage Certificate', 'Education Certificates', 'Experience Letters', 'IELTS Results', 'Police Clearance', 'Medical Exam', 'Bank Statements', 'Tax Documents', 'Reference Letters', 'Photos')),
  status TEXT DEFAULT 'Required' CHECK (status IN ('Required', 'Requested', 'Received', 'Under Review', 'Approved', 'Needs Correction')),
  is_mandatory BOOLEAN DEFAULT false,
  file_url TEXT,
  file_size INTEGER,
  mime_type TEXT,
  application_id UUID REFERENCES public.applications(id),
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calls table
CREATE TABLE public.calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  purpose TEXT NOT NULL CHECK (purpose IN ('Initial Consultation', 'Document Review', 'Status Update', 'Follow-up', 'Technical Discussion', 'Payment Discussion')),
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled', 'No Show')),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  notes TEXT,
  lead_id UUID REFERENCES public.leads(id),
  application_id UUID REFERENCES public.applications(id),
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_applications_assigned_to ON public.applications(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_documents_application_id ON public.documents(application_id);
CREATE INDEX idx_calls_scheduled_date ON public.calls(scheduled_date);
CREATE INDEX idx_calls_assigned_to ON public.calls(assigned_to);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic - can be customized based on requirements)
-- Profiles: Users can read all profiles, update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Leads: All authenticated users can CRUD
CREATE POLICY "Authenticated users can view leads" ON public.leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create leads" ON public.leads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update leads" ON public.leads FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete leads" ON public.leads FOR DELETE USING (auth.role() = 'authenticated');

-- Applications: All authenticated users can CRUD
CREATE POLICY "Authenticated users can view applications" ON public.applications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create applications" ON public.applications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update applications" ON public.applications FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete applications" ON public.applications FOR DELETE USING (auth.role() = 'authenticated');

-- Tasks: All authenticated users can CRUD
CREATE POLICY "Authenticated users can view tasks" ON public.tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create tasks" ON public.tasks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update tasks" ON public.tasks FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete tasks" ON public.tasks FOR DELETE USING (auth.role() = 'authenticated');

-- Documents: All authenticated users can CRUD
CREATE POLICY "Authenticated users can view documents" ON public.documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create documents" ON public.documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update documents" ON public.documents FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete documents" ON public.documents FOR DELETE USING (auth.role() = 'authenticated');

-- Calls: All authenticated users can CRUD
CREATE POLICY "Authenticated users can view calls" ON public.calls FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create calls" ON public.calls FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update calls" ON public.calls FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete calls" ON public.calls FOR DELETE USING (auth.role() = 'authenticated');

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.calls FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
