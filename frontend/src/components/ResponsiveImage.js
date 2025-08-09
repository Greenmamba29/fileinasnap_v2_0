import React from 'react';
import LazyImage from './LazyImage';
import useImageOptimization from '../hooks/useImageOptimization';

const ResponsiveImage = ({ 
  src, 
  alt, 
  sizes = "100vw",
  className = "",
  width,
  height,
  quality = 80,
  priority = false,
  ...props 
}) => {
  const { generateSrcSet, getOptimizedImageUrl } = useImageOptimization();

  // Generate responsive image URLs
  const optimizedSrc = getOptimizedImageUrl(src, width, height, quality);
  const srcSet = generateSrcSet(src);

  if (priority) {
    // For above-the-fold images, load immediately
    return (
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading="eager"
        {...props}
      />
    );
  }

  // For below-the-fold images, use lazy loading
  return (
    <LazyImage
      src={optimizedSrc}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

export default ResponsiveImage;