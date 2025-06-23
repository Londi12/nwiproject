import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using mock data mode.')
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key')

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  // Check if environment variables exist and are not placeholder values
  const hasValidUrl = supabaseUrl &&
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseUrl !== 'your_supabase_project_url' &&
    supabaseUrl !== 'your-project-ref.supabase.co' &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseUrl.includes('placeholder');

  const hasValidKey = supabaseAnonKey &&
    supabaseAnonKey !== 'placeholder-key' &&
    supabaseAnonKey !== 'your_supabase_anon_key' &&
    !supabaseAnonKey.includes('placeholder') &&
    supabaseAnonKey.length > 20; // Real Supabase keys are much longer

  return !!(hasValidUrl && hasValidKey);
}

// Debug logging in development
if (import.meta.env.DEV) {
  console.log('Supabase config debug:', {
    url: supabaseUrl || 'Not set',
    key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'Not set',
    isConfigured: isSupabaseConfigured()
  });
}

export default supabase
