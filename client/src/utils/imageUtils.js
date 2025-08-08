// Utility functions for handling images
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL (starts with http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /uploads, add the API base URL
  if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseURL}${cleanPath}`;
  }
  
  // If it's a relative path, add the uploads prefix
  if (!imagePath.startsWith('/')) {
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return `${baseURL}/uploads/${imagePath}`;
  }
  
  return imagePath;
};

export const getPlaceholderImage = (width = 400, height = 250) => {
  return `https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=${width}&h=${height}&q=80`;
};

export const getPGImageUrl = (pg, index = 0) => {
  if (!pg || !pg.images || !Array.isArray(pg.images) || pg.images.length === 0) {
    return getPlaceholderImage();
  }
  
  const image = pg.images[index];
  const imageUrl = getImageUrl(image);
  
  return imageUrl || getPlaceholderImage();
};