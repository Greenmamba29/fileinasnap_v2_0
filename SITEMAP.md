# FileInASnap Application - Site Map & Routing Structure

## Public Routes (No Authentication Required)

### Landing Page
- **Route**: `/`
- **Component**: `FileInASnapLanding` in `App.js`
- **Sections**: 
  - Hero Section with background image
  - Features Section (`#features`)
  - Pricing Section (`#pricing`) 
  - About Section (`#about`)
  - CTA Section
  - Footer
- **Navigation**: 
  - Header: Features, Pricing, About, Sign Up
  - Hero CTAs: Start Free, Watch Demo
  - Video Demo Modal

### Error Handling
- **Route**: `*` (catch-all)
- **Component**: `NotFound` from `pages/NotFound.tsx`
- **Purpose**: 404 error page for invalid routes

## Protected Routes (Authentication Required)

### Dashboard
- **Route**: `/dashboard`
- **Component**: `DashboardPage` from `pages/DashboardPage.tsx`
- **Protection**: `ProtectedRoute` wrapper
- **Features**: 
  - Quick actions panel
  - Recent activity feed
  - File management overview
  - Upload functionality integration

### Journal
- **Route**: `/journal`
- **Component**: `JournalPage` from `pages/JournalPage.tsx`
- **Protection**: `ProtectedRoute` wrapper
- **Features**:
  - Journal entry creation and editing
  - AI-powered memory organization
  - Timeline integration

### Memory Timeline
- **Route**: `/timeline`
- **Component**: `MemoryTimelinePage` from `pages/MemoryTimelinePage.tsx`
- **Protection**: `ProtectedRoute` wrapper
- **Features**:
  - Visual timeline of memories
  - Date-based organization
  - Memory search and filtering

## Authentication Flow

### Auth0 Integration
- **Provider**: Auth0 (fileinasnap.us.auth0.com)
- **Wrapper**: `Auth0ProviderWithHistory` in `auth/Auth0ProviderWithHistory.js`
- **Login Flow**: 
  1. User clicks Login/Sign Up button
  2. Redirects to Auth0 hosted login
  3. After authentication, returns to `window.location.origin`
  4. Auth state managed by `@auth0/auth0-react`

### Route Protection
- **Component**: `ProtectedRoute` in `components/auth/ProtectedRoute.js`
- **Logic**:
  - Shows loading spinner while checking auth
  - Displays error page if authentication fails
  - Redirects to `/` if not authenticated
  - Renders protected content if authenticated

## Navigation Structure

### Header Navigation (Desktop)
```
Logo [FileInASnap] | Features | Pricing | About | [Sign Up Button]
```

### Mobile Navigation
- Responsive overlay with hero content
- Stacked CTA buttons
- Simplified navigation

### Internal Navigation (Authenticated)
- Dashboard → Journal (`/journal`)
- Dashboard → Timeline (`/timeline`) 
- Dashboard → Profile settings
- Logout → Returns to Landing (`/`)

## API Endpoints Integration

### Public Endpoints
- `GET /api/` - Health check
- `GET /api/health` - Service status
- `GET /api/plans` - Subscription plans (for pricing section)

### Protected Endpoints (Auth0 JWT Required)
- `GET /api/auth/profile` - User profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/files/upload` - File upload
- `GET /api/files` - List user files
- `DELETE /api/files/{id}` - Delete file
- `GET /api/analytics/usage` - Usage analytics (Pro+)

## File Upload System

### Frontend Components
- **Main Upload**: `FileUpload.js` in `components/`
- **Upload Modal**: `UploadModal.tsx` in `components/upload/`
- **Integration**: Available in Dashboard and other authenticated pages

### Backend Integration
- **Storage**: Supabase Storage (`user-files` bucket)
- **Database**: File metadata in Supabase `user_files` table
- **Validation**: File type, size limits based on subscription tier

## Subscription Tiers & Feature Gating

### Plan-Based Access
- **Free**: 5 files, 1GB storage, basic features
- **Pro**: 100 files, 10GB storage, advanced AI
- **Team**: 500 files, 50GB storage, collaboration
- **Enterprise**: Unlimited files, unlimited storage, custom features

### Feature Gating
- File upload limits enforced server-side
- Premium features (analytics) require appropriate tier
- UI components show/hide based on user subscription

## Error Handling & Fallbacks

### Authentication Errors
- Auth0 connection failures → Error page with retry
- Token expiration → Automatic redirect to login
- Network issues → Loading states with retry options

### Route Errors  
- Invalid routes → 404 NotFound page
- Protected route access without auth → Redirect to home
- Component load failures → Error boundaries

### API Errors
- Network failures → Toast notifications
- Authorization errors → Login prompt
- Server errors → User-friendly error messages

## Development & Testing

### Local Development URLs
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:8001`
- **API Base**: `http://localhost:8001/api`

### Production URLs
- **Frontend**: Via Emergent preview URL
- **Backend**: Via Emergent backend URL (REACT_APP_BACKEND_URL)
- **API Base**: `${REACT_APP_BACKEND_URL}/api`

## Security Considerations

### Auth0 Configuration
- Domain validation
- Audience verification  
- Scope management
- Token refresh handling

### Route Protection
- JWT validation on all protected endpoints
- Role-based access control
- Subscription tier enforcement
- CORS configuration

---

**Last Updated**: 2025-01-02
**Status**: Active Implementation
**Authentication**: Auth0 Migration Complete
**File Storage**: Supabase Storage Integrated