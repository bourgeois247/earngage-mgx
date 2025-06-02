// This utility script helps create placeholder SVG images for the EarnGage platform.
// It maps file paths to their corresponding placeholder SVG content.
// It also provides a utility function to modify image paths in components.

/**
 * Generate a simple SVG placeholder with custom text
 * @param {string} text - Text to display in the placeholder
 * @param {string} bgColor - Background color of the SVG
 * @param {string} textColor - Text color
 * @returns {string} - SVG content
 */
const generateSvgPlaceholder = (text, bgColor = '#f3f4f6', textColor = '#6b7280') => {
  // Encode special characters
  text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Create SVG content
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 400 200">
    <rect width="400" height="200" fill="${bgColor}"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="${textColor}">
      ${text}
    </text>
  </svg>`;
};

/**
 * Get the appropriate SVG content based on the file path
 * @param {string} imagePath - Path to the image
 * @returns {string} - SVG content or default placeholder
 */
export const getSvgForPath = (imagePath) => {
  // Extract filename from path
  const filename = imagePath.split('/').pop().split('.')[0];
  
  // Brand logos
  if (imagePath.includes('brand-logo') || imagePath.includes('brands/')) {
    const brandName = filename.replace('brand-logo-', '');
    return generateSvgPlaceholder(`Brand: ${brandName}`, '#e6f7ff', '#0284c7');
  }
  
  // Campaign images
  if (imagePath.includes('campaigns/')) {
    return generateSvgPlaceholder(`Campaign: ${filename}`, '#f0fdf4', '#16a34a');
  }
  
  // Hero image
  if (imagePath.includes('hero-image')) {
    return generateSvgPlaceholder('EarnGage Hero Image', '#ede9fe', '#7c3aed');
  }
  
  // Dashboard images
  if (imagePath.includes('dashboard')) {
    return generateSvgPlaceholder(`${filename.replace('-', ' ')}`, '#fef3c7', '#d97706');
  }
  
  // Default placeholder
  return generateSvgPlaceholder('Image Placeholder', '#f3f4f6', '#6b7280');
};

/**
 * Fix image paths to ensure they exist
 * @param {string} imagePath - Original image path
 * @returns {string} - Corrected image path
 */
export const getFixedImagePath = (imagePath) => {
  // Check if path is using .png extension
  if (imagePath.endsWith('.png')) {
    // Convert to data URL with SVG content
    const svgContent = getSvgForPath(imagePath);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  }
  
  // Return original path if not a PNG
  return imagePath;
};

// Example of how to use:
/*
import { getFixedImagePath } from '../utils/generatePlaceholders';

// In a component:
<img src={getFixedImagePath('/assets/images/brand-logo-1.png')} alt="Brand" />
*/

export default {
  getSvgForPath,
  getFixedImagePath,
};