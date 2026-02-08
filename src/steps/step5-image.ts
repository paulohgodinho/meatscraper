/**
 * Step 5: Enhance metadata.image with fallback logic
 * 
 * Ensures metadata.image contains the best available image by applying fallbacks:
 * 1. If metadata.image exists and is valid, keep it
 * 2. Fallback to metadata.logo (favicon from metascraper-logo-favicon)
 * 3. Fallback to parsing HTML for favicon <link> tags
 * 4. If nothing found, metadata.image remains null
 * 
 * Modifies metadata object in place.
 */

import { MetadataResult } from "../types";
import { JSDOM } from "jsdom";
import { URL } from "url";

/**
 * Extract favicon URL from HTML <link> tags
 * 
 * @param htmlContent - Raw HTML string to parse
 * @param baseUrl - Base URL for resolving relative paths
 * @returns Favicon URL or null if not found
 */
function extractFaviconFromHtml(htmlContent: string, baseUrl: string): string | null {
  try {
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    
    // Search for favicon link tags in order of preference
    const faviconSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]',
    ];
    
    for (const selector of faviconSelectors) {
      const linkElement = document.querySelector(selector);
      if (linkElement) {
        const href = linkElement.getAttribute('href');
        if (href) {
          // Skip data URIs
          if (href.startsWith('data:')) {
            continue;
          }
          
          // Resolve relative URLs to absolute
          try {
            const resolvedUrl = new URL(href, baseUrl);
            return resolvedUrl.href;
          } catch (e) {
            // Invalid URL, try next
            continue;
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    // HTML parsing failed
    return null;
  }
}

/**
 * Enhance metadata.image with fallback logic
 * 
 * @param metadata - Metadata object from step 1 (MODIFIED IN PLACE)
 * @param htmlContent - Raw HTML content for favicon extraction fallback
 * @param url - Base URL for resolving relative favicon paths (REQUIRED)
 */
export function step5EnhanceMetadataImage(
  metadata: MetadataResult,
  htmlContent: string,
  url: string
): void {
  // Helper to check if an image URL is valid (not null, not empty, not data URI)
  const isValidImage = (img: any): boolean => {
    return img && typeof img === 'string' && !img.startsWith('data:');
  };

  // If we already have a valid primary image, we're done
  if (isValidImage(metadata.image)) {
    return;
  }

  // Fallback 1: Use logo/favicon from metascraper-logo-favicon plugin
  if (isValidImage(metadata.logo)) {
    metadata.image = metadata.logo;
    return;
  }

  // Fallback 2: Search HTML for favicon <link> tags
  const baseUrl = metadata.url || url;
  const htmlFavicon = extractFaviconFromHtml(htmlContent, baseUrl);
  if (htmlFavicon) {
    metadata.image = htmlFavicon;
    return;
  }

  // No suitable image found - metadata.image remains null
}

