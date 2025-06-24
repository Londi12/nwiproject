

-- Knowledge Base indexes
CREATE INDEX idx_knowledge_base_country ON knowledge_base(country);
CREATE INDEX idx_knowledge_base_visa_type ON knowledge_base(visa_type);
CREATE INDEX idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX idx_knowledge_base_search ON knowledge_base USING gin(to_tsvector('english', search_keywords));

-- Occupation Knowledge indexes
CREATE INDEX idx_occupation_knowledge_country ON occupation_knowledge(country);
CREATE INDEX idx_occupation_knowledge_anzsco ON occupation_knowledge(anzsco_code);
CREATE INDEX idx_occupation_knowledge_category ON occupation_knowledge(occupation_category);
CREATE INDEX idx_occupation_knowledge_skill_level ON occupation_knowledge(skill_level);
CREATE INDEX idx_occupation_knowledge_search ON occupation_knowledge USING gin(to_tsvector('english', search_keywords));



-- Enable RLS for knowledge base
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Knowledge base policies
CREATE POLICY "Enable read access for all users" ON knowledge_base FOR SELECT USING (true);
CREATE POLICY "Enable insert for admins" ON knowledge_base FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);
CREATE POLICY "Enable update for admins" ON knowledge_base FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);
CREATE POLICY "Enable delete for admins" ON knowledge_base FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- Knowledge base indexes
CREATE INDEX idx_knowledge_base_country ON knowledge_base(country);
CREATE INDEX idx_knowledge_base_visa_type ON knowledge_base(visa_type);
CREATE INDEX idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX idx_knowledge_base_status ON knowledge_base(status);
CREATE INDEX idx_knowledge_base_search ON knowledge_base USING gin(to_tsvector('english', search_keywords));

-- Enable RLS for occupation knowledge
ALTER TABLE occupation_knowledge ENABLE ROW LEVEL SECURITY;

-- Occupation knowledge policies
CREATE POLICY "Enable read access for all users" ON occupation_knowledge FOR SELECT USING (true);
CREATE POLICY "Enable insert for admins" ON occupation_knowledge FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);
CREATE POLICY "Enable update for admins" ON occupation_knowledge FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);
CREATE POLICY "Enable delete for admins" ON occupation_knowledge FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- Occupation knowledge indexes
CREATE INDEX idx_occupation_knowledge_country ON occupation_knowledge(country);
CREATE INDEX idx_occupation_knowledge_anzsco ON occupation_knowledge(anzsco_code);
CREATE INDEX idx_occupation_knowledge_category ON occupation_knowledge(occupation_category);
CREATE INDEX idx_occupation_knowledge_skill_level ON occupation_knowledge(skill_level);
CREATE INDEX idx_occupation_knowledge_status ON occupation_knowledge(status);
CREATE INDEX idx_occupation_knowledge_search ON occupation_knowledge USING gin(to_tsvector('english', search_keywords));

-- Function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'associate'  -- Default role for new users
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile for new users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON calls FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON knowledge_base FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON occupation_knowledge FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
