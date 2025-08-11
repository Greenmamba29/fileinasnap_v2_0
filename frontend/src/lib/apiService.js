/**
 * Advanced API Service for FileInASnap Dashboard
 * Handles all backend integration, Supabase connections, and AI features
 */

import { supabase } from './supabaseClient';

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '/api';
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  // Generic request wrapper with retry logic
  async request(url, options = {}) {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(fullUrl, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          ...options
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error(`API request failed (attempt ${attempt}):`, error);
        
        if (attempt === this.retryAttempts) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
  }

  // Authentication helper
  getAuthHeaders() {
    const token = localStorage.getItem('supabase.auth.token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // ========================================
  // FOLDER MANAGEMENT
  // ========================================

  async getFolders() {
    try {
      // First try Supabase direct
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('folders')
        .select(`
          id,
          name,
          created_at,
          updated_at,
          user_id,
          files (count)
        `)
        .eq('user_id', user.user.id)
        .order('name', { ascending: true });

      if (error) throw error;

      // Transform to include file count
      return data.map(folder => ({
        ...folder,
        file_count: folder.files?.[0]?.count || 0
      }));
    } catch (error) {
      console.warn('Supabase direct access failed, falling back to API:', error);
      
      // Fallback to API endpoint
      try {
        return await this.request('/folders', {
          headers: this.getAuthHeaders()
        });
      } catch (apiError) {
        console.error('API fallback also failed:', apiError);
        
        // Return mock data for development
        return [
          {
            id: 'mock-1',
            name: 'Quick Uploads',
            file_count: 0,
            created_at: new Date().toISOString()
          },
          {
            id: 'mock-2', 
            name: 'Vacation Photos',
            file_count: 12,
            created_at: new Date().toISOString()
          }
        ];
      }
    }
  }

  async createFolder(name) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('folders')
        .insert({
          name,
          user_id: user.user.id
        })
        .select()
        .single();

      if (error) throw error;
      return { ...data, file_count: 0 };
    } catch (error) {
      console.warn('Supabase folder creation failed, falling back to API:', error);
      
      return await this.request('/folders', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ name })
      });
    }
  }

  async deleteFolder(folderId) {
    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return await this.request(`/folders/${folderId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
    }
  }

  // ========================================
  // FILE MANAGEMENT
  // ========================================

  async getFiles(folderId = null, limit = 50, offset = 0) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        throw new Error('Not authenticated');
      }

      let query = supabase
        .from('files')
        .select(`
          id,
          name,
          size,
          type,
          path,
          public_url,
          thumbnail_url,
          folder_id,
          created_at,
          updated_at,
          metadata,
          tags
        `)
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (folderId) {
        query = query.eq('folder_id', folderId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Supabase file fetch failed, falling back to API:', error);
      
      const url = `/files${folderId ? `?folder_id=${folderId}` : ''}`;
      return await this.request(url, {
        headers: this.getAuthHeaders()
      });
    }
  }

  async uploadFile(file, folderId, onProgress = null) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        throw new Error('Not authenticated');
      }

      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.user.id}/${folderId}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(filePath);

      // Determine file type
      const fileType = this.getFileType(file);

      // Save metadata to database
      const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .insert({
          name: file.name,
          size: file.size,
          type: fileType,
          path: filePath,
          public_url: publicUrl,
          folder_id: folderId,
          user_id: user.user.id,
          metadata: {
            originalName: file.name,
            mimeType: file.type,
            uploadedAt: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Trigger AI processing in background
      this.triggerAIProcessing(fileRecord.id, publicUrl, fileType);

      return fileRecord;
    } catch (error) {
      console.warn('Supabase upload failed, falling back to API:', error);
      
      // Fallback to traditional form upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder_id', folderId);

      return await this.request('/uploads', {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          // Don't set Content-Type for FormData
        },
        body: formData
      });
    }
  }

  async deleteFile(fileId) {
    try {
      // Get file info first
      const { data: file } = await supabase
        .from('files')
        .select('path')
        .eq('id', fileId)
        .single();

      if (file?.path) {
        // Delete from storage
        await supabase.storage
          .from('files')
          .remove([file.path]);
      }

      // Delete from database
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return await this.request(`/files/${fileId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
    }
  }

  // ========================================
  // SEARCH & AI FEATURES
  // ========================================

  async searchFiles(query, filters = {}) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        throw new Error('Not authenticated');
      }

      // Build search query
      let dbQuery = supabase
        .from('files')
        .select(`
          id,
          name,
          size,
          type,
          path,
          public_url,
          thumbnail_url,
          folder_id,
          created_at,
          metadata,
          tags,
          folders (name)
        `)
        .eq('user_id', user.user.id);

      // Text search in name and tags
      if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%, tags.cs.{${query}}`);
      }

      // Apply filters
      if (filters.type) {
        dbQuery = dbQuery.eq('type', filters.type);
      }
      
      if (filters.folder_id) {
        dbQuery = dbQuery.eq('folder_id', filters.folder_id);
      }

      if (filters.date_from) {
        dbQuery = dbQuery.gte('created_at', filters.date_from);
      }

      if (filters.date_to) {
        dbQuery = dbQuery.lte('created_at', filters.date_to);
      }

      dbQuery = dbQuery.order('created_at', { ascending: false }).limit(100);

      const { data, error } = await dbQuery;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.warn('Supabase search failed, falling back to API:', error);
      
      const params = new URLSearchParams({ 
        q: query,
        ...filters 
      });
      
      return await this.request(`/search?${params}`, {
        headers: this.getAuthHeaders()
      });
    }
  }

  async getAIInsights() {
    try {
      return await this.request('/ai/insights', {
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      // Return mock insights for development
      return {
        total_files: 1247,
        faces_detected: 156,
        locations_identified: 45,
        events_discovered: 23,
        top_tags: ['vacation', 'family', 'nature', 'birthday', 'travel'],
        processing_status: 'complete'
      };
    }
  }

  async triggerAIProcessing(fileId, fileUrl, fileType) {
    try {
      // Only process images and videos
      if (!['image', 'video'].includes(fileType)) return;

      await this.request('/ai/process', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          file_id: fileId,
          file_url: fileUrl,
          file_type: fileType
        })
      });
    } catch (error) {
      console.warn('AI processing failed:', error);
      // Non-blocking - don't throw
    }
  }

  // ========================================
  // STATISTICS & ANALYTICS
  // ========================================

  async getStats() {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        throw new Error('Not authenticated');
      }

      // Get folder count
      const { count: folderCount } = await supabase
        .from('folders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.user.id);

      // Get file count and size
      const { data: fileStats, error: fileError } = await supabase
        .from('files')
        .select('size')
        .eq('user_id', user.user.id);

      if (fileError) throw fileError;

      const totalBytes = fileStats.reduce((sum, file) => sum + (file.size || 0), 0);
      const totalMB = totalBytes / (1024 * 1024);

      return {
        folders: folderCount || 0,
        files: fileStats.length || 0,
        total_bytes: totalBytes,
        total_mb: Math.round(totalMB * 100) / 100
      };
    } catch (error) {
      console.warn('Supabase stats failed, falling back to API:', error);
      
      try {
        return await this.request('/stats', {
          headers: this.getAuthHeaders()
        });
      } catch (apiError) {
        // Return mock stats for development
        return {
          folders: 8,
          files: 1247,
          total_bytes: 2147483648, // 2GB
          total_mb: 2048
        };
      }
    }
  }

  async getRecentActivity(limit = 10) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('files')
        .select(`
          id,
          name,
          type,
          created_at,
          folders (name)
        `)
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(file => ({
        id: file.id,
        action: 'uploaded',
        item_name: file.name,
        item_type: file.type,
        folder_name: file.folders?.name,
        timestamp: file.created_at,
        description: `Uploaded ${file.name} to ${file.folders?.name || 'Unknown Folder'}`
      }));
    } catch (error) {
      console.warn('Recent activity fetch failed:', error);
      
      // Return mock activity
      return [
        {
          id: '1',
          action: 'uploaded',
          item_name: '12 vacation photos',
          item_type: 'image',
          folder_name: 'Vacation 2024',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          description: 'Uploaded 12 photos from vacation'
        },
        {
          id: '2',
          action: 'organized',
          item_name: 'Beach photos',
          item_type: 'ai_processing',
          folder_name: 'AI Organized',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          description: 'AI organized beach photos'
        }
      ];
    }
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  getFileType(file) {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type === 'application/pdf' || 
        file.type.includes('document') || 
        file.type.includes('text/')) return 'document';
    return 'other';
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // ========================================
  // HEALTH CHECK
  // ========================================

  async healthCheck() {
    try {
      // Check Supabase connection
      const { data, error } = await supabase.from('folders').select('count').limit(1);
      const supabaseOk = !error;

      // Check API endpoint
      let apiOk = false;
      try {
        await this.request('/health');
        apiOk = true;
      } catch (e) {
        // API might not exist yet
      }

      return {
        ok: supabaseOk || apiOk,
        bucket_ok: supabaseOk,
        rpc_ok: supabaseOk,
        api_ok: apiOk,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        ok: false,
        bucket_ok: false,
        rpc_ok: false,
        api_ok: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
