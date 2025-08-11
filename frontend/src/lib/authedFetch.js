import { supabase } from '../contexts/AuthContext';

/**
 * Safe, reusable authenticated fetch that handles tokens and 401s
 * @param {string} input - URL to fetch
 * @param {RequestInit} init - Fetch options
 * @returns {Promise<Response>} - Fetch response
 */
export async function authedFetch(input, init = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  
  if (!token) {
    const error = new Error("NOT_AUTHENTICATED");
    error.status = 401;
    throw error;
  }

  const res = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": init.body ? "application/json" : (init.headers?.["Content-Type"] || undefined),
    },
  });

  // Normalize errors so the UI can show a clean message
  if (!res.ok) {
    let detail = "";
    try { 
      const errorData = await res.json();
      detail = errorData.detail || errorData.message || "";
    } catch {}
    
    const error = new Error(detail || `HTTP ${res.status}`);
    error.status = res.status;
    throw error;
  }
  
  // caller decides json/text
  return res;
}
