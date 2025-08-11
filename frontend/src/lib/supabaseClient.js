/**
 * Supabase Client Configuration
 * Handles all database and storage connections
 */

import { createClient } from '@supabase/supabase-js';

// Get configuration from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key';

// Create Supabase client with configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  realtime: {
    enabled: true
  },
  global: {
    headers: {
      'X-Client-Info': 'fileinasnap-frontend'
    }
  }
});

// Auth helper functions
export const auth = {
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName || '',
          avatar_url: '',
          ...userData
        }
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with Google
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Reset password
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) throw error;
    return data;
  },

  // Update password
  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateProfile(updates) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });
    
    if (error) throw error;
    return data;
  }
};

// Storage helper functions
export const storage = {
  // Upload file to storage
  async uploadFile(bucket, path, file, options = {}) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        ...options
      });
    
    if (error) throw error;
    return data;
  },

  // Get public URL for file
  getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  // Get signed URL for private file
  async getSignedUrl(bucket, path, expiresIn = 3600) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    
    if (error) throw error;
    return data.signedUrl;
  },

  // Delete file from storage
  async deleteFile(bucket, paths) {
    const pathArray = Array.isArray(paths) ? paths : [paths];
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove(pathArray);
    
    if (error) throw error;
    return data;
  },

  // List files in bucket
  async listFiles(bucket, path = '', options = {}) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
        ...options
      });
    
    if (error) throw error;
    return data;
  }
};

// Database helper functions
export const db = {
  // Generic select query
  async select(table, columns = '*', filters = {}) {
    let query = supabase.from(table).select(columns);
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key.includes('.')) {
        // Handle nested filters like 'user.eq.123'
        const [column, operator] = key.split('.');
        query = query[operator](column, value);
      } else {
        query = query.eq(key, value);
      }
    });
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Generic insert
  async insert(table, data) {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    
    if (error) throw error;
    return result;
  },

  // Generic update
  async update(table, id, updates) {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  },

  // Generic delete
  async delete(table, id) {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return data;
  },

  // Count records
  async count(table, filters = {}) {
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { count, error } = await query;
    if (error) throw error;
    return count;
  }
};

// Real-time subscriptions
export const realtime = {
  // Subscribe to table changes
  subscribeToTable(table, callback, filters = {}) {
    let subscription = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: table,
        ...filters
      }, callback);
    
    subscription.subscribe();
    return subscription;
  },

  // Subscribe to user's data changes
  subscribeToUserData(userId, callback) {
    const subscription = supabase
      .channel('user-data')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'folders',
        filter: `user_id=eq.${userId}`
      }, callback)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'files',
        filter: `user_id=eq.${userId}`
      }, callback);
    
    subscription.subscribe();
    return subscription;
  },

  // Unsubscribe from channel
  unsubscribe(subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }
};

// Health check function
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('folders')
      .select('count')
      .limit(1);
    
    return {
      connected: !error,
      error: error?.message,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Initialize auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.email);
  
  // Handle auth events
  switch (event) {
    case 'SIGNED_IN':
      console.log('User signed in:', session?.user?.email);
      break;
    case 'SIGNED_OUT':
      console.log('User signed out');
      // Clear any cached data
      localStorage.removeItem('cached-folders');
      localStorage.removeItem('cached-files');
      break;
    case 'TOKEN_REFRESHED':
      console.log('Token refreshed');
      break;
    default:
      break;
  }
});

export default supabase;
