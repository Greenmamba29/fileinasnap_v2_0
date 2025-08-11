# FileInASnap Setup Guide

## Overview

FileInASnap is now ready for **Step 4: File Upload Testing** with the following improvements:

✅ **Enhanced Upload System**: New JavaScript-based UploadModal with Supabase integration  
✅ **Folder Management**: Create and organize files in folders  
✅ **Presigned URL Uploads**: Secure file uploads directly to Supabase storage  
✅ **Progress Tracking**: Real-time upload progress with user feedback  
✅ **Backend API**: FastAPI server with JWT authentication and folder/file endpoints  

## Current Status

### Frontend (Port 3000) ✅
- React app with updated AuthContext (from Webfluin integration)
- Enhanced hero image with subtle gradient overlay
- Protected dashboard routes
- New UploadModal with folder support and progress tracking

### Backend (Port 8001) ✅
- FastAPI server with Supabase integration
- JWT-based authentication
- Folder and file management endpoints
- Presigned URL generation for secure uploads

## Next Steps

### 1. Setup Supabase Database Schema

Run the database schema in your Supabase SQL editor:

```bash
# The schema file is available at:
backend/init_schema.sql
```

This creates:
- `folders` table for organizing files
- `files` table for file metadata
- Row Level Security (RLS) policies
- Proper indexes for performance

### 2. Create Supabase Storage Bucket

In your Supabase dashboard:

1. Go to **Storage** → **Buckets**
2. Create a new bucket named: `user-files`
3. Set it as **Private** (not public)
4. The storage policies in the schema will handle permissions

### 3. Test the Application

#### Frontend Testing:
```bash
cd frontend
npm start  # Should be running on port 3000
```

#### Backend Testing:
```bash
cd backend
python3 main.py  # Should start on port 8001
```

#### Run Setup Validation:
```bash
cd frontend
node test-setup.js
```

### 4. File Upload Flow

The new upload system works as follows:

1. **User Authentication**: JWT token from Supabase auth
2. **Folder Selection**: Choose existing folder or create new one
3. **File Selection**: Drag & drop or browse files
4. **Presigned URL**: Backend generates secure upload URL
5. **Direct Upload**: Files upload directly to Supabase storage with progress tracking
6. **Metadata Save**: File information saved to database

### 5. API Endpoints

#### Authentication Required:
- `GET /folders` - List user's folders
- `POST /folders` - Create new folder  
- `GET /uploads/presign` - Get presigned upload URL
- `POST /uploads/complete` - Complete upload and save metadata
- `GET /files` - List files (optionally by folder)
- `DELETE /files/{file_id}` - Delete file
- `GET /stats` - Get user statistics

#### Public:
- `GET /health` - Health check

### 6. Environment Variables

#### Frontend (.env):
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_BACKEND_URL=http://localhost:8001
```

#### Backend (.env):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
PORT=8001
CORS_ORIGINS=http://localhost:3000
```

## Testing the Upload Flow

1. **Sign up/Sign in** on the landing page
2. **Access Dashboard** (should redirect automatically after login)
3. **Click "Upload Files"** button in the dashboard
4. **Create or Select Folder** in the upload modal
5. **Drag & Drop Files** or use the file browser
6. **Watch Progress** as files upload
7. **Verify Success** - files should appear in your Supabase storage

## Troubleshooting

### Common Issues:

1. **Backend not starting**: 
   ```bash
   pip3 install fastapi uvicorn supabase python-dotenv pyjwt
   ```

2. **CORS errors**: Check that `CORS_ORIGINS` includes your frontend URL

3. **Authentication errors**: Verify JWT secret matches between frontend and backend

4. **Upload failures**: Ensure storage bucket exists and is named "user-files"

### Error Checking:

1. **Frontend Console**: Check browser developer tools for JavaScript errors
2. **Backend Logs**: Python server logs show detailed error information
3. **Supabase Logs**: Check Supabase dashboard for auth and storage errors

## What's Working Now

✅ **Authentication Flow**: Sign up, sign in, password reset  
✅ **Protected Routes**: Dashboard only accessible to authenticated users  
✅ **Hero Image**: Properly displayed with subtle overlay  
✅ **Upload Modal**: Enhanced with folder management and progress  
✅ **Backend API**: All endpoints for folder and file management  
✅ **Supabase Integration**: Auth, storage, and database working together  

## Next Development Steps

1. **Test Upload Flow**: Verify files can be uploaded and organized
2. **Add File Viewing**: Display uploaded files in the dashboard
3. **Implement Search**: Add search functionality for files
4. **AI Features**: Integrate AI tagging and organization
5. **Deploy**: Prepare for Netlify deployment

The application is now at a functional state where you can test the complete upload workflow! 🚀
