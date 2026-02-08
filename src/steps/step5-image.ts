/**
 * Step 5: Select the primary image
 * 
 * Extracts the best primary image URL from metadata.
 * Uses metascraperImage result as primary, falls back to logo if needed.
 */

import { MetadataResult } from "../types";
import { JSDOM } from "jsdom";
import { URL } from "url";

export interface ImageSelectionResult {
  extracted: string | null;
  selected: string | null;
  reason: string;
}

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
 * Select the best primary image from metadata
 * 
 * @param metadata - Metadata object from step 1
 * @param htmlContent - Raw HTML content for favicon extraction fallback
 * @param url - Base URL for resolving relative favicon paths
 * @returns Object with extracted image, selected image, and reason
 */
export function step5SelectImage(
  metadata: MetadataResult,
  htmlContent?: string,
  url?: string
): ImageSelectionResult {
  // Helper to extract first string from image (handles array or string)
  const getImageUrl = (img: any): string | null => {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (Array.isArray(img) && img.length > 0) {
      return typeof img[0] === "string" ? img[0] : null;
    }
    return null;
  };

  // Primary source: metascraperImage result
  const imageUrl = getImageUrl(metadata.image);
  if (imageUrl) {
    // Don't use data URIs - they're typically very large and not useful for external reference
    if (!imageUrl.startsWith("data:")) {
      return {
        extracted: imageUrl,
        selected: imageUrl,
        reason: "Primary image from metascraper",
      };
    }
  }

  // Fallback 1: Logo/favicon
  const logoUrl = getImageUrl(metadata.logo);
  if (logoUrl && !logoUrl.startsWith("data:")) {
    return {
      extracted: imageUrl,
      selected: logoUrl,
      reason: "Fallback to logo/favicon",
    };
  }

  // Fallback 2: Search HTML for favicon <link> tags
  if (htmlContent) {
    // Prefer metadata.url (from og:url) over passed url parameter
    const baseUrl = metadata.url || url;
    
    if (baseUrl) {
      const htmlFavicon = extractFaviconFromHtml(htmlContent, baseUrl);
      if (htmlFavicon) {
        return {
          extracted: imageUrl,
          selected: htmlFavicon,
          reason: "Favicon extracted from HTML <link> tags",
        };
      }
    }
  }

  // No suitable image found
  return {
    extracted: imageUrl,
    selected: null,
    reason: "No suitable image found",
  };
}

