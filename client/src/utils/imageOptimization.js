// src/utils/imageOptimization.js
export const optimizeImageUrl = (url, width = 800, quality = 80) => {
  if (!url) return '/placeholder-image.jpg';
  
  // If using Cloudinary or similar service
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
  }
  
  return url;
};