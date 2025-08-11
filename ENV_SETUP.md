# Environment Variables Setup Guide

## Frontend (.env)
Create a `.env` file in the `frontend/` directory with:

```bash
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Backend (.env)
Create a `.env` file in the `backend/` directory with:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
```

## Where to find these values:

1. **Supabase Project URL & Anon Key**: 
   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Copy the "URL" and "anon public" key

2. **Service Role Key**:
   - Same location (Settings → API)
   - Copy the "service_role" key (⚠️ Keep this secret!)

3. **JWT Secret**:
   - Same location (Settings → API)
   - Copy the "JWT Secret" (⚠️ Keep this secret!)

## Security Note
- Never commit these values to version control
- The service role and JWT secret provide admin access to your database
- In production, use environment variable management services
