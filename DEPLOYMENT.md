# 🚀 Visa Flow CRM - Production Deployment Guide

## 📋 Overview

This guide covers deploying the Visa Flow CRM to production with Supabase database integration and Vercel hosting.

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Choose your region (closest to your users)
4. Set a strong database password

### 2. Run Database Schema
Execute the complete SQL schema provided in your database. The schema includes:

**Core Tables:**
- `user_profiles` - User authentication and profiles
- `leads` - Lead management system
- `applications` - Immigration applications
- `tasks` - Task management
- `documents` - Document tracking
- `calls` - Call scheduling and logs
- `knowledge_base` - Visa information
- `occupation_knowledge` - Occupation-specific guidance

**Key Features:**
- ✅ Row Level Security (RLS) enabled
- ✅ Automatic timestamps with triggers
- ✅ UUID primary keys
- ✅ JSONB fields for flexible data
- ✅ Proper indexes for performance
- ✅ Foreign key relationships

### 3. Configure Authentication
1. In Supabase Dashboard → Authentication → Settings
2. Enable Email authentication
3. Configure email templates (optional)
4. Set up redirect URLs for your domain

### 4. Set Row Level Security Policies
The schema includes RLS policies, but verify they're active:
```sql
-- Example: Users can only see their own data
CREATE POLICY "Users can view own data" ON leads
  FOR SELECT USING (auth.uid()::text = assigned_to_id);
```

## 🌐 Vercel Deployment

### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Choose "Vite" as the framework preset
4. Set build command: `npm run build`
5. Set output directory: `dist`

### 2. Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Analytics
VITE_ANALYTICS_ID=your-analytics-id
```

**Important:** 
- Get these values from Supabase Dashboard → Settings → API
- Use the "anon/public" key, not the service role key
- The URL format is: `https://[project-ref].supabase.co`

### 3. Deploy
1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Test the deployment URL

## 🔧 Configuration Verification

### 1. Check Environment Variables
The app will show configuration status:
- ✅ Green: Supabase configured correctly
- ⚠️ Yellow: Using mock data (development mode)
- ❌ Red: Configuration error

### 2. Test Database Connection
1. Try creating a lead
2. Check if data appears in Supabase dashboard
3. Test user authentication (if enabled)

### 3. Verify Features
- ✅ Lead management
- ✅ Application tracking
- ✅ Task management
- ✅ Document uploads
- ✅ Knowledge base
- ✅ CV parsing tools

## 🔐 Security Checklist

### Database Security
- ✅ RLS enabled on all tables
- ✅ Policies restrict data access
- ✅ No service role key in frontend
- ✅ Sensitive data encrypted

### Application Security
- ✅ Environment variables secured
- ✅ No hardcoded secrets
- ✅ HTTPS enforced
- ✅ Input validation implemented

## 📊 Monitoring & Analytics

### 1. Supabase Monitoring
- Database performance metrics
- API usage statistics
- Error logs and alerts

### 2. Vercel Analytics
- Page load times
- User engagement metrics
- Error tracking

### 3. Application Metrics
- Lead conversion rates
- Task completion rates
- Document processing times

## 🚀 Post-Deployment Steps

### 1. Initial Data Setup
1. Create admin user account
2. Add initial knowledge base entries
3. Set up user roles and permissions
4. Configure email templates

### 2. User Training
1. Train associates on the system
2. Provide user documentation
3. Set up support channels

### 3. Backup Strategy
1. Enable Supabase automated backups
2. Export critical data regularly
3. Test restore procedures

## 🔄 Updates & Maintenance

### Deploying Updates
1. Push changes to Git repository
2. Vercel automatically deploys from main branch
3. Test in staging environment first
4. Monitor for any issues

### Database Migrations
1. Test schema changes in development
2. Use Supabase migration tools
3. Backup before major changes
4. Update application code accordingly

## 📞 Support & Troubleshooting

### Common Issues
1. **Environment variables not loading**
   - Check Vercel environment settings
   - Ensure variables start with `VITE_`
   - Redeploy after adding variables

2. **Database connection errors**
   - Verify Supabase URL and key
   - Check RLS policies
   - Review network settings

3. **Build failures**
   - Check Node.js version compatibility
   - Verify all dependencies installed
   - Review build logs for errors

### Getting Help
- Supabase Documentation: [docs.supabase.com](https://docs.supabase.com)
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vite Documentation: [vitejs.dev](https://vitejs.dev)

## 🎉 Success Metrics

Your deployment is successful when:
- ✅ Application loads without errors
- ✅ Database operations work correctly
- ✅ Users can authenticate (if enabled)
- ✅ All features function as expected
- ✅ Performance meets requirements
- ✅ Security measures are active

---

**Ready for Production!** 🚀

Your Visa Flow CRM is now ready to help immigration consultants manage their clients efficiently with a professional, scalable, and secure platform.
