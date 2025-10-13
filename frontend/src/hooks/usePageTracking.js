import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../utils/analytics';

// Map of route paths to user-friendly page names
const PAGE_NAME_MAP = {
  '/': 'Landing Page',
  '/dashboard': 'Dashboard',
  '/auth-test': 'Auth Test Page',
};

// Get a user-friendly page name from the current path
const getPageName = (pathname) => {
  return PAGE_NAME_MAP[pathname] || `Page: ${pathname}`;
};

// Custom hook for tracking page views automatically
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const pageName = getPageName(location.pathname);
    
    // Track page view with analytics
    analytics.page(pageName, {
      path: location.pathname,
      search: location.search,
      hash: location.hash,
    });

    // Also track as a regular event for more detailed analytics
    analytics.track('Page View', {
      page_name: pageName,
      page_path: location.pathname,
      page_search: location.search,
      page_hash: location.hash,
      page_url: window.location.href,
      page_title: document.title,
    });

  }, [location.pathname, location.search, location.hash]);
};

// Higher-order component to automatically add page tracking to any component
export const withPageTracking = (WrappedComponent) => {
  return function TrackedComponent(props) {
    usePageTracking();
    return <WrappedComponent {...props} />;
  };
};

export default usePageTracking;