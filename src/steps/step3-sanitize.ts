/**
 * Step 3: Sanitize HTML using DOMPurify
 * 
 * Removes potentially dangerous HTML/JavaScript while preserving
 * safe semantic HTML structure. Strips script tags, event handlers,
 * and dangerous attributes to prevent XSS attacks.
 */

import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

/**
 * Sanitize HTML content using DOMPurify
 * 
 * @param htmlContent - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function step3SanitizeHtml(htmlContent: string | null): string | null {
  if (!htmlContent) {
    return null;
  }

  try {
    // Create a virtual DOM window for DOMPurify
    const purifyWindow = new JSDOM("").window;
    const purify = DOMPurify(purifyWindow);

    // Sanitize the HTML with default DOMPurify config
    // Default config allows safe tags (p, div, span, a, img, etc.)
    // and removes script tags, event handlers, and dangerous attributes
    const sanitizedHtml = purify.sanitize(htmlContent);

    // Clean up the window
    (purifyWindow as any).close?.();

    return sanitizedHtml;
  } catch (error) {
    console.error("Error sanitizing HTML:", error);
    return htmlContent; // Return original if sanitization fails
  }
}
