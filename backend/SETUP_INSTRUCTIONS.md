# 🚀 FileInASnap Supabase Setup Instructions

## ✅ Completed Steps:
- Backend code fully updated to use Supabase authentication
- Frontend integrated with Supabase Auth
- Environment variables configured with your credentials
- SQL setup script created

## 📋 Steps to Complete Setup:

### 1. Run the Database Schema
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/dyjkhnpdyejbwsggzhoq
2. Navigate to **SQL Editor** in the left sidebar
3. Copy the **entire contents** of `supabase_setup.sql` 
4. Paste it into a new SQL query
5. Click **RUN** to execute all the commands

### 2. Create Storage Bucket
1. In your Supabase Dashboard, go to **Storage** in the left sidebar
2. Click **New bucket**
3. Set the following:
   - **Name**: `user-files`
   - **Public**: ❌ **OFF** (keep it private for security)
   - **File size limit**: `50MB`
   - **Allowed MIME types**: Leave empty (we handle this in backend)
4. Click **Create bucket**

### 3. Test Your Setup

#### Test Backend:
```bash
cd backend
python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```
Visit: http://localhost:8001/api/ (should show "FileInASnap API - Powered by Supabase")

#### Test Frontend:
```bash
cd frontend
npm start
```
Visit: http://localhost:3000 (should show your landing page with working auth)

### 4. Verify Everything Works

1. **Register a new account** on your frontend
2. **Check Tables**: Go to Supabase Dashboard → Table Editor → you should see:
   - `user_profiles` table with your new user
   - `user_files` table (empty initially)
3. **Test file upload** (if you have that feature ready)

## 🔒 Security Features Enabled:

- ✅ Row Level Security (RLS) on all tables
- ✅ Users can only see their own data
- ✅ Automatic profile creation on signup
- ✅ Storage usage tracking
- ✅ Secure file storage with user-based access

## 🐛 Troubleshooting:

### Backend Issues:
- Make sure all Python dependencies are installed: `pip3 install -r requirements.txt`
- Check that your `.env` file has the correct Supabase credentials
- Verify the service role key is working by checking the `/api/health` endpoint

### Frontend Issues:
- Run `npm install` to ensure all dependencies are installed
- Check browser console for any authentication errors
- Make sure your frontend `.env` has the correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Authentication Issues:
- Check that the database tables were created successfully
- Verify that the RLS policies are working by trying to login
- Ensure the auth trigger is working (new users should automatically get profiles)

## 📞 Next Steps After Setup:

1. Test the complete user flow: signup → login → file operations
2. Deploy to production (Netlify for frontend, Railway/Render for backend)
3. Add additional features like file sharing, AI processing, etc.

Your Supabase FileInASnap app is now ready to go! 🎉
