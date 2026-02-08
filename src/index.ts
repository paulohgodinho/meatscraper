/**
 * meatscraper - Extract text content and primary image from webpages
 * 
 * A comprehensive web scraping package that processes HTML through multiple
 * cleaning and extraction steps to produce clean text and metadata.
 * 
 * @example
 * ```typescript
 * import { meatExtractor } from 'meatscraper';
 * 
 * const result = await meatExtractor(htmlString);
 * console.log(result.content);    // Plain text
 * console.log(result.image);      // Image URL
 * console.log(result.metadata);   // Full metadata
 * ```
 */

import { MeatExtractorResult, MeatExtractorOptions } from "./types";
import { executePipeline } from "./pipeline";
import { validateUrl } from "./utils/validate-url";

/**
 * Extract text content and metadata from HTML
 * 
 * Processes HTML through a 5-step pipeline:
 * 1. Metadata extraction (metascraper with 12+ plugins)
 * 2. Readable content extraction (Mozilla Readability)
 * 3. HTML sanitization (DOMPurify)
 * 4. Plain text conversion (html-to-text)
 * 5. Image selection (best primary image)
 * 
 * @param htmlString - Raw HTML content to process
 * @param options - Configuration options (url is REQUIRED)
 * @returns Promise resolving to extraction result with content, image, and metadata
 * 
 * @example
 * ```typescript
 * // Basic usage (URL is required)
 * const result = await meatExtractor(html, {
 *   url: 'https://example.com/article'
 * });
 * console.log(result.content);   // Plain text
 * console.log(result.image);     // Image URL or null
 * console.log(result.metadata);  // {title, description, author, ...}
 * 
 * // With debugging
 * const result = await meatExtractor(html, { 
 *   url: 'https://example.com/article',
 *   debug: true 
 * });
 * console.log(result.debug?.step1_metadata);
 * console.log(result.debug?.step2_readableContent);
 * console.log(result.debug?.step3_sanitizedContent);
 * ```
 */
export async function meatExtractor(
  htmlString: string,
  options: MeatExtractorOptions
): Promise<MeatExtractorResult> {
  // Validate URL is provided and properly formatted
  validateUrl(options.url, "meatExtractor");
  
  return executePipeline(htmlString, options);
}

// Re-export types for external use
export type {
  MeatExtractorResult,
  MeatExtractorOptions,
  MetadataResult,
  DebugInfo,
} from "./types";

// Re-export individual step functions for advanced usage
export { step1ExtractMetadata } from "./steps/step1-metadata";
export { step2ExtractReadableContent } from "./steps/step2-readable";
export { step3SanitizeHtml } from "./steps/step3-sanitize";
export { step4ConvertToPlainText } from "./steps/step4-plaintext";
export { step5EnhanceMetadataImage } from "./steps/step5-image";

// Re-export metascraper utilities
export { extractMetadata, createMetascraperParser } from "./metascraper-setup";
