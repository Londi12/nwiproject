# Supabase Setup Guide for NWI Visas CRM

This guide will help you set up Supabase authentication and database for the NWI Visas CRM system.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. The NWI Visas project cloned locally

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `nwi-visas-crm`
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://your-project-ref.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 3: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and replace the placeholder values:
   ```env
   # Replace with your actual Supabase credentials
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   
   # Environment
   NODE_ENV=development
   ```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database-schema.sql` from your project root
3. Paste it into the SQL Editor and click "Run"
4. This will create all the necessary tables, indexes, and security policies

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider:
   - Toggle "Enable Google provider" to ON
   - Add your Google OAuth credentials (optional for development)
   - For development, you can use the default settings

## Step 6: Set Up Row Level Security (RLS)

The database schema includes RLS policies, but you may want to customize them:

1. Go to **Authentication** → **Policies**
2. Review the policies for each table
3. Modify as needed for your security requirements

## Step 7: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:5174`
3. You should see:
   - No "Using Mock Data" warning (if Supabase is configured correctly)
   - Admin panel visible in development mode
   - Real-time data from Supabase

## Step 8: Deploy to Vercel (Production)

1. In your Vercel dashboard, go to your project settings
2. Add the environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `NODE_ENV`: `production`

3. Redeploy your application

## Features Enabled with Supabase

### ✅ Authentication
- Google OAuth login
- Secure session management
- User profile management

### ✅ Real-time Data
- Leads management with real database
- Applications tracking
- Tasks and calls management
- Document management

### ✅ Security
- Row Level Security (RLS) policies
- Secure API endpoints
- Environment-based configuration

### ✅ Admin Panel
- Visible in development mode
- Hidden in production (requires secret code)
- Real-time dashboard statistics

## Troubleshooting

### "Using Mock Data" Warning Appears
- Check that your `.env` file has the correct Supabase credentials
- Ensure the environment variables start with `VITE_`
- Restart your development server after changing `.env`

### Authentication Not Working
- Verify your Supabase project URL and anon key
- Check that Google OAuth is enabled in Supabase
- Ensure your domain is added to the allowed origins

### Database Errors
- Verify the database schema was created successfully
- Check the Supabase logs for any errors
- Ensure RLS policies are properly configured

### Admin Panel Not Visible
- In development: Admin panel should be visible by default
- In production: Type "admin123" to activate
- Check that `NODE_ENV` is set correctly

## Support

For issues with this setup:
1. Check the browser console for errors
2. Review Supabase logs in the dashboard
3. Ensure all environment variables are correctly set
4. Contact the development team for assistance

## Security Notes

- Never commit your `.env` file to version control
- Use different Supabase projects for development and production
- Regularly rotate your API keys
- Review and customize RLS policies for your security requirements
