/**
 * Utility functions for handling image paths in the application
 */

/**
 * Base path for artwork images in the public directory
 */
export const ARTWORK_IMAGES_PATH = '/images/artworks';

/**
 * Get the full path for an artwork image
 * @param filename The filename of the artwork image
 * @returns The full path to the artwork image
 */
export function getArtworkImagePath(filename: string): string {
  // If the filename is already a full URL, return it as is
  if (filename.startsWith('http')) {
    return filename;
  }
  
  // If the filename already starts with /images, return it as is
  if (filename.startsWith('/images')) {
    return filename;
  }
  
  // Otherwise, construct the full path
  return `${ARTWORK_IMAGES_PATH}/${filename}`;
}

/**
 * Get the optimized image URL for an artwork
 * @param url The original image URL
 * @param width Desired width of the image
 * @param quality Image quality (1-100)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(url: string, width: number = 800, quality: number = 80): string {
  // If it's an Unsplash image, use their optimization parameters
  if (url.includes('images.unsplash.com')) {
    return `${url}?w=${width}&q=${quality}&fit=crop`;
  }
  
  // For local images, return as is (Next.js Image component will handle optimization)
  return url;
} 