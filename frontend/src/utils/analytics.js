// Use the globally initialized Mixpanel from the HTML script
// This ensures we don't double-initialize and cause conflicts
const getMixpanel = () => {
  if (typeof window !== 'undefined' && window.mixpanel) {
    return window.mixpanel;
  }
  console.warn('Mixpanel not found on window. Analytics will not be tracked.');
  return null;
};

// Initialize function (now just logs confirmation)
const initializeMixpanel = () => {
  const mixpanel = getMixpanel();
  if (mixpanel) {
    console.log('Mixpanel analytics utility ready');
    // Set debug mode for development
    if (process.env.NODE_ENV === 'development') {
      mixpanel.set_config({ debug: true });
    }
  }
};

// Analytics utility object
const analytics = {
  // Initialize analytics
  init: initializeMixpanel,

  // Identify a user
  identify: (userId, traits = {}) => {
    const mixpanel = getMixpanel();
    if (!mixpanel) return;
    
    mixpanel.identify(userId);
    mixpanel.people.set({
      ...traits,
      $last_seen: new Date().toISOString(),
    });
  },

  // Track an event
  track: (eventName, properties = {}) => {
    const mixpanel = getMixpanel();
    if (!mixpanel) return;
    
    // Add common properties
    const enrichedProperties = {
      ...properties,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer,
    };

    mixpanel.track(eventName, enrichedProperties);
    console.log('📊 Tracked event:', eventName, enrichedProperties);
  },

  // Track page view
  page: (pageName, properties = {}) => {
    const mixpanel = getMixpanel();
    if (!mixpanel) return;
    
    analytics.track('Page Viewed', {
      page_name: pageName,
      page_url: window.location.href,
      page_title: document.title,
      ...properties,
    });
  },

  // Set user properties
  setUserProperties: (properties) => {
    const mixpanel = getMixpanel();
    if (!mixpanel) return;
    
    mixpanel.people.set(properties);
  },

  // Increment a user property
  increment: (property, value = 1) => {
    const mixpanel = getMixpanel();
    if (!mixpanel) return;
    
    mixpanel.people.increment(property, value);
  },

  // Reset user data (for logout)
  reset: () => {
    const mixpanel = getMixpanel();
    if (!mixpanel) return;
    
    mixpanel.reset();
  },

  // Alias a user (for linking anonymous to identified)
  alias: (newId) => {
    const mixpanel = getMixpanel();
    if (!mixpanel) return;
    
    mixpanel.alias(newId);
  },

  // Register super properties (sent with every event)
  registerSuperProperties: (properties) => {
    const mixpanel = getMixpanel();
    if (!mixpanel) return;
    
    mixpanel.register(properties);
  },

  // Track timing events
  time: (eventName) => {
    const mixpanel = getMixpanel();
    if (!mixpanel) return;
    
    mixpanel.time_event(eventName);
  },

  // Event tracking methods for common actions
  events: {
    // Authentication events
    userSignedUp: (method, userId, traits = {}) => {
      analytics.track('User Signed Up', {
        method,
        user_id: userId,
        ...traits,
      });
    },

    userSignedIn: (method, userId, traits = {}) => {
      analytics.track('User Signed In', {
        method,
        user_id: userId,
        ...traits,
      });
    },

    userSignedOut: (userId) => {
      analytics.track('User Signed Out', {
        user_id: userId,
      });
    },

    // File management events
    fileUploaded: (fileType, fileSize, fileName) => {
      analytics.track('File Uploaded', {
        file_type: fileType,
        file_size: fileSize,
        file_name: fileName,
      });
    },

    fileDeleted: (fileType, fileName) => {
      analytics.track('File Deleted', {
        file_type: fileType,
        file_name: fileName,
      });
    },

    // Navigation events
    dashboardViewed: () => {
      analytics.track('Dashboard Viewed');
    },

    uploadModalOpened: () => {
      analytics.track('Upload Modal Opened');
    },

    uploadModalClosed: () => {
      analytics.track('Upload Modal Closed');
    },

    // Feature usage events
    searchPerformed: (query, resultsCount) => {
      analytics.track('Search Performed', {
        query,
        results_count: resultsCount,
      });
    },

    aiTaggingUsed: (numberOfFiles) => {
      analytics.track('AI Tagging Used', {
        number_of_files: numberOfFiles,
      });
    },

    // Engagement events
    featureClicked: (featureName) => {
      analytics.track('Feature Clicked', {
        feature_name: featureName,
      });
    },

    ctaClicked: (ctaText, ctaLocation) => {
      analytics.track('CTA Clicked', {
        cta_text: ctaText,
        cta_location: ctaLocation,
      });
    },

    testimonialViewed: (testimonialIndex) => {
      analytics.track('Testimonial Viewed', {
        testimonial_index: testimonialIndex,
      });
    },

    pricingViewed: () => {
      analytics.track('Pricing Viewed');
    },

    faqViewed: () => {
      analytics.track('FAQ Viewed');
    },

    // Error events
    errorOccurred: (errorMessage, errorLocation) => {
      analytics.track('Error Occurred', {
        error_message: errorMessage,
        error_location: errorLocation,
      });
    },

    // Performance events
    pageLoadTime: (duration) => {
      analytics.track('Page Load Time', {
        duration_ms: duration,
      });
    },
  },

  // Test function to send a test event
  test: () => {
    const mixpanel = getMixpanel();
    if (!mixpanel) {
      console.error('Mixpanel not available for testing');
      return false;
    }
    
    console.log('🧪 Sending test event to Mixpanel...');
    mixpanel.track('Test Event', {
      test: true,
      timestamp: new Date().toISOString(),
      source: 'analytics_utility_test',
    });
    console.log('✅ Test event sent!');
    return true;
  },
};

// Auto-initialize when the module loads
// This will work with the globally initialized Mixpanel
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      analytics.init();
    });
  } else {
    analytics.init();
  }
  
  // Expose analytics globally for debugging
  window.analytics = analytics;
  console.log('📊 Analytics utility available globally as window.analytics');
}

export default analytics;