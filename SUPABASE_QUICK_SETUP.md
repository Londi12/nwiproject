# 🚀 Quick Supabase Setup - Why You See Demo Data

## 🔍 Current Situation

Your NWI Visas CRM is currently showing **demo/mock data** because Supabase is not configured. Here's why:

### Environment Variables Not Set
```env
# Current .env file has placeholders:
VITE_SUPABASE_URL=https://your-project-ref.supabase.co  # ❌ Placeholder
VITE_SUPABASE_ANON_KEY=your-anon-key-here              # ❌ Placeholder
```

### App Detects This and Falls Back to Mock Data
The app automatically detects invalid Supabase config and uses demo data instead of crashing.

## ⚡ Quick Fix (5 Minutes)

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Sign up/login
- Click "New Project"
- Name: `nwi-visas-crm`
- Set password, choose region
- Wait for project creation

### 2. Get Your Credentials
- In Supabase dashboard: **Settings → API**
- Copy:
  - **Project URL**: `https://abcdefgh.supabase.co`
  - **Anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Update Environment Variables

#### Local Development:
Edit your `.env` file:
```env
VITE_SUPABASE_URL=https://your-actual-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

#### Vercel Production:
1. Go to Vercel dashboard
2. Your project → **Settings → Environment Variables**
3. Add:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
4. **Redeploy** your application

### 4. Set Up Database
- In Supabase: **SQL Editor**
- Copy and paste the entire `setup-supabase.sql` file
- Click **Run**

## ✅ Verification

### Check if Working:
1. **Yellow banner disappears** (no more "Using Mock Data")
2. **Console shows**: `Supabase configured: true`
3. **Real data persists** between page refreshes
4. **No more demo data**

### Development Mode Diagnostic:
The app automatically runs a diagnostic in development mode. Check your browser console for:
```
🔍 Running NWI Visas CRM Configuration Diagnostic...
✅ Configuration Status:
  Configured: ✅
  Connected: ✅
  Tables Exist: ✅
  Can Insert: ✅
```

## 🎯 What Changes After Setup

### Before (Demo Mode):
- ❌ Yellow "Using Mock Data" banner
- ❌ Demo data that resets on refresh
- ❌ No real persistence
- ❌ Same data for all users

### After (Supabase Mode):
- ✅ Real database persistence
- ✅ Data survives page refreshes
- ✅ Multi-user support
- ✅ Production-ready
- ✅ Automatic backups

## 🔧 Files You Need

1. **`setup-supabase.sql`** - Database schema (run in Supabase SQL Editor)
2. **`.env`** - Environment variables (update with your credentials)
3. **Vercel Environment Variables** - For production deployment

## 🚨 Common Issues

### Still Seeing Demo Data?
1. **Check environment variables** are set correctly
2. **Restart development server** (`npm run dev`)
3. **Clear browser cache**
4. **Check console** for error messages

### Connection Errors?
1. **Verify URL and key** are correct
2. **Check Supabase project** is active
3. **Run database setup** script

### Permission Errors?
1. **Check RLS policies** in Supabase
2. **Verify table creation** was successful

## 📞 Quick Test

After setup, try:
1. **Create a new lead** in the app
2. **Refresh the page**
3. **Lead should still be there** (not demo data)
4. **Check Supabase dashboard** - data should appear in tables

## 🎉 That's It!

Once configured, your NWI Visas CRM will be using real Supabase data instead of demo data. The transition is automatic - no code changes needed!

---

**Need help?** Check the browser console for diagnostic information or refer to the detailed `SUPABASE_SETUP.md` guide.
