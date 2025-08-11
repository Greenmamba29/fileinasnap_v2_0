import React, { useState, useEffect } from 'react';

// Simple fade-in animation component
export const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Stagger children animations
export const StaggerContainer = ({ children, className = "", staggerDelay = 200 }) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeIn delay={index * staggerDelay}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
};

// Floating animation for cards
export const FloatingCard = ({ children, className = "" }) => {
  return (
    <div className={`transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${className}`}>
      {children}
    </div>
  );
};

// Photo gallery mockup component
export const PhotoGalleryDemo = () => {
  const mockPhotos = [
    { id: 1, src: '/api/placeholder/300/200', alt: 'Beach sunset', tags: ['vacation', 'beach', 'sunset'] },
    { id: 2, src: '/api/placeholder/300/250', alt: 'Family dinner', tags: ['family', 'dinner', 'home'] },
    { id: 3, src: '/api/placeholder/300/180', alt: 'City skyline', tags: ['travel', 'city', 'architecture'] },
    { id: 4, src: '/api/placeholder/300/220', alt: 'Mountain hike', tags: ['outdoor', 'hiking', 'nature'] },
    { id: 5, src: '/api/placeholder/300/200', alt: 'Birthday party', tags: ['celebration', 'birthday', 'friends'] },
    { id: 6, src: '/api/placeholder/300/240', alt: 'Garden flowers', tags: ['flowers', 'garden', 'spring'] }
  ];

  const [hoveredPhoto, setHoveredPhoto] = useState(null);

  return (
    <div className="relative p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border shadow-xl overflow-hidden">
      <div className="grid grid-cols-3 gap-3">
        {mockPhotos.map((photo, index) => (
          <FadeIn key={photo.id} delay={index * 150}>
            <div 
              className="relative group cursor-pointer transform transition-all duration-300 hover:scale-110 hover:z-10"
              onMouseEnter={() => setHoveredPhoto(photo.id)}
              onMouseLeave={() => setHoveredPhoto(null)}
            >
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-600 p-2 text-center">
                  {photo.alt}
                </div>
              </div>
              {hoveredPhoto === photo.id && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-20">
                  {photo.tags.join(' • ')}
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
      
      {/* AI tagging simulation */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            AI is organizing your photos...
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Found 6 photos • 3 locations • 5 people
          </div>
        </div>
      </div>
    </div>
  );
};

// Timeline component
export const TimelineDemo = () => {
  const timelineEvents = [
    { date: '2024', title: 'New Year Celebration', count: '24 photos' },
    { date: 'Dec', title: 'Holiday Gatherings', count: '156 photos' },
    { date: 'Nov', title: 'Autumn Adventures', count: '89 photos' },
    { date: 'Oct', title: 'Halloween Fun', count: '43 photos' },
  ];

  return (
    <div className="relative p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border shadow-xl">
      <div className="space-y-4">
        {timelineEvents.map((event, index) => (
          <FadeIn key={index} delay={index * 200}>
            <div className="flex items-center gap-4 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {event.date}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{event.title}</div>
                <div className="text-sm text-gray-600">{event.count}</div>
              </div>
              <div className="w-6 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
            </div>
          </FadeIn>
        ))}
      </div>
      
      {/* Timeline indicator */}
      <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full"></div>
    </div>
  );
};

// Search demo component - simplified and stable
export const SearchDemo = () => {
  const [searchTerm, setSearchTerm] = useState('beach sunset');
  const [showResults, setShowResults] = useState(true);

  return (
    <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border shadow-xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          readOnly
          placeholder="Search your photos, videos, and documents..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
        <div className="absolute right-3 top-3.5">
          <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {showResults && (
        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-600 mb-2">Instant results:</div>
          <div className="flex items-center gap-3 p-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded"></div>
            <div className="flex-1 text-sm text-gray-700">
              Found 24 photos matching "beach sunset"
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded"></div>
            <div className="flex-1 text-sm text-gray-700">
              Found 18 videos matching "beach sunset"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
