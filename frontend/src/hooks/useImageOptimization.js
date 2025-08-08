import { useState, useEffect, useCallback } from 'react';

export const useImageOptimization = () => {
  const [isWebPSupported, setIsWebPSupported] = useState(false);
  const [isAVIFSupported, setIsAVIFSupported] = useState(false);

  useEffect(() => {
    // Check WebP support
    const webpTest = new Image();
    webpTest.onload = webpTest.onerror = () => {
      setIsWebPSupported(webpTest.height === 2);
    };
    webpTest.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

    // Check AVIF support
    const avifTest = new Image();
    avifTest.onload = avifTest.onerror = () => {
      setIsAVIFSupported(avifTest.height === 2);
    };
    avifTest.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  }, []);

  const getOptimizedImageUrl = useCallback((originalUrl, width, height, quality = 80) => {
    // If using a CDN service like Cloudinary, ImageKit, or similar
    // you would construct optimized URLs here
    
    // For now, return the original URL with query parameters for services that support it
    const url = new URL(originalUrl);
    
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    if (quality !== 80) url.searchParams.set('q', quality.toString());
    
    // Add format parameter based on browser support
    if (isAVIFSupported) {
      url.searchParams.set('f', 'avif');
    } else if (isWebPSupported) {
      url.searchParams.set('f', 'webp');
    }
    
    return url.toString();
  }, [isWebPSupported, isAVIFSupported]);

  const generateSrcSet = useCallback((baseUrl, sizes = [400, 800, 1200, 1600]) => {
    return sizes
      .map(size => `${getOptimizedImageUrl(baseUrl, size)} ${size}w`)
      .join(', ');
  }, [getOptimizedImageUrl]);

  return {
    isWebPSupported,
    isAVIFSupported,
    getOptimizedImageUrl,
    generateSrcSet
  };
};

export default useImageOptimization;