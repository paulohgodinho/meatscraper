/**
 * Step 5: Select the primary image
 * 
 * Extracts the best primary image URL from metadata.
 * Uses metascraperImage result as primary, falls back to logo if needed.
 */

import { MetadataResult } from "../types";

export interface ImageSelectionResult {
  extracted: string | null;
  selected: string | null;
  reason: string;
}

/**
 * Select the best primary image from metadata
 * 
 * @param metadata - Metadata object from step 1
 * @returns Object with extracted image, selected image, and reason
 */
export function step5SelectImage(
  metadata: MetadataResult
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

  // No suitable image found
  return {
    extracted: imageUrl,
    selected: null,
    reason: "No suitable image found",
  };
}

