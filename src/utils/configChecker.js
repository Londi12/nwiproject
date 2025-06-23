import { isSupabaseConfigured, supabase } from '../lib/supabase';

/**
 * Configuration checker utility
 */
export class ConfigChecker {
  static async checkSupabaseConnection() {
    const results = {
      configured: false,
      connected: false,
      tablesExist: false,
      canInsert: false,
      errors: []
    };

    try {
      // Check if Supabase is configured
      results.configured = isSupabaseConfigured();
      
      if (!results.configured) {
        results.errors.push('Supabase environment variables not configured');
        return results;
      }

      // Test connection
      try {
        const { data, error } = await supabase.from('leads').select('count', { count: 'exact', head: true });
        if (error) {
          results.errors.push(`Connection error: ${error.message}`);
        } else {
          results.connected = true;
          results.tablesExist = true;
        }
      } catch (error) {
        results.errors.push(`Connection failed: ${error.message}`);
      }

      // Test insert capability (if connected)
      if (results.connected) {
        try {
          const testLead = {
            name: 'Test Lead',
            email: 'test@example.com',
            source: 'Test',
            status: 'New'
          };

          const { data, error } = await supabase
            .from('leads')
            .insert([testLead])
            .select()
            .single();

          if (error) {
            results.errors.push(`Insert test failed: ${error.message}`);
          } else {
            results.canInsert = true;
            
            // Clean up test data
            await supabase.from('leads').delete().eq('id', data.id);
          }
        } catch (error) {
          results.errors.push(`Insert test error: ${error.message}`);
        }
      }

    } catch (error) {
      results.errors.push(`General error: ${error.message}`);
    }

    return results;
  }

  static async getEnvironmentInfo() {
    return {
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'Not set',
      supabaseKeySet: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      supabaseConfigured: isSupabaseConfigured(),
      nodeEnv: import.meta.env.NODE_ENV || 'Not set'
    };
  }

  static async runFullDiagnostic() {
    console.log('🔍 Running NWI Visas CRM Configuration Diagnostic...\n');

    // Environment info
    const envInfo = await this.getEnvironmentInfo();
    console.log('📊 Environment Information:');
    console.table(envInfo);

    // Supabase connection test
    console.log('\n🔗 Testing Supabase Connection...');
    const supabaseResults = await this.checkSupabaseConnection();
    
    console.log('✅ Configuration Status:');
    console.log(`  Configured: ${supabaseResults.configured ? '✅' : '❌'}`);
    console.log(`  Connected: ${supabaseResults.connected ? '✅' : '❌'}`);
    console.log(`  Tables Exist: ${supabaseResults.tablesExist ? '✅' : '❌'}`);
    console.log(`  Can Insert: ${supabaseResults.canInsert ? '✅' : '❌'}`);

    if (supabaseResults.errors.length > 0) {
      console.log('\n❌ Errors Found:');
      supabaseResults.errors.forEach(error => console.log(`  - ${error}`));
    }

    // Recommendations
    console.log('\n💡 Recommendations:');
    if (!supabaseResults.configured) {
      console.log('  1. Set up Supabase project and configure environment variables');
      console.log('  2. Copy .env.example to .env and fill in your Supabase credentials');
      console.log('  3. For Vercel: Add environment variables in project settings');
    } else if (!supabaseResults.connected) {
      console.log('  1. Check your Supabase URL and API key');
      console.log('  2. Verify your Supabase project is active');
      console.log('  3. Check network connectivity');
    } else if (!supabaseResults.tablesExist) {
      console.log('  1. Run the setup-supabase.sql script in your Supabase SQL editor');
      console.log('  2. Verify table creation was successful');
    } else if (!supabaseResults.canInsert) {
      console.log('  1. Check Row Level Security policies');
      console.log('  2. Verify table permissions');
    } else {
      console.log('  🎉 Everything looks good! Your Supabase is properly configured.');
    }

    return {
      environment: envInfo,
      supabase: supabaseResults
    };
  }
}

// Auto-run diagnostic in development
if (import.meta.env.DEV) {
  // Run diagnostic after a short delay to avoid blocking app startup
  setTimeout(() => {
    ConfigChecker.runFullDiagnostic();
  }, 2000);
}
