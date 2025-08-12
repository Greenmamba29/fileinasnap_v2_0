import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const ThemeContext = createContext({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: (t) => {},
});

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system');
  const [resolvedTheme, setResolvedTheme] = useState(getSystemTheme());

  // Load saved preference from Supabase profile if logged in, else from localStorage
  useEffect(() => {
    async function loadPref() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const localPref = localStorage.getItem('fias.theme') || 'system';
        if (user?.id) {
          const { data, error } = await supabase
            .from('profiles')
            .select('theme_preference')
            .eq('id', user.id)
            .single();
          if (!error && data?.theme_preference) {
            setTheme(data.theme_preference);
            return;
          }
        }
        setTheme(localPref);
      } catch (e) {
        setTheme(localStorage.getItem('fias.theme') || 'system');
      }
    }
    loadPref();
  }, []);

  // Apply theme to html element
  useEffect(() => {
    const root = document.documentElement;
    const effective = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(effective);
    if (effective === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  }, [theme]);

  // Persist preference to localStorage and Supabase when changed
  useEffect(() => {
    localStorage.setItem('fias.theme', theme);
    async function persist() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) {
          await supabase.from('profiles').update({ theme_preference: theme }).eq('id', user.id);
        }
      } catch {}
    }
    persist();
  }, [theme]);

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

