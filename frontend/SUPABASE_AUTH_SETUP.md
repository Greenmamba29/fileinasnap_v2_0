# Supabase Authentication Setup Guide

## Current Issues Identified:
1. **Sign-ups disabled**: "Signups not allowed for this instance"
2. **No valid test users**: "Invalid login credentials"

## Solutions:

### Option 1: Enable Public Sign-ups (Recommended for Development)

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to your project**: `dyjkhnpdyejbwsggzhoq`
3. **Go to Authentication > Settings**
4. **Enable "Enable email confirmations"** (if you want email verification)
5. **Enable "Enable sign up"** under Site URL settings
6. **Set Site URL to**: `http://localhost:3000` (for development)
7. **Add redirect URLs**: 
   - `http://localhost:3000`
   - `http://localhost:3000/auth-test`
   - Your production domain when ready

### Option 2: Create Test User Manually

1. **Go to Supabase Dashboard > Authentication > Users**
2. **Click "Create User"**
3. **Add user with credentials**:
   - Email: `test@example.com`
   - Password: `testpassword123`
   - Auto-confirm user: ✅ (check this box)

### Option 3: Enable Sign-ups via SQL (Advanced)

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable sign-ups temporarily for testing
UPDATE auth.config 
SET enable_signup = true 
WHERE id = 1;

-- Check current auth settings
SELECT * FROM auth.config;
```

## Recommended Next Steps:

1. **Fix Supabase Settings**: Use Option 1 or 2 above
2. **Test Authentication**: Return to http://localhost:3000/auth-test
3. **Verify All Flows Work**: Sign up, sign in, sign out, password reset
4. **Move to Next Step**: Add hero image and protected routes

## Configuration Check:

Your current `.env` file shows:
- ✅ Supabase URL: `https://dyjkhnpdyejbwsggzhoq.supabase.co`
- ✅ Anon Key: Present and valid
- ✅ Backend URL: `http://localhost:8001`

The connection to Supabase is working (password reset emails are being sent), but user registration/login is blocked by Supabase settings.
