/**
 * Metascraper configuration with all plugins
 * 
 * This sets up the complete metascraper parser with all plugins
 * in the correct order to extract comprehensive metadata from webpages
 */

import metascraper from "metascraper";
import metascraperAmazon from "metascraper-amazon";
import metascraperAuthor from "metascraper-author";
import metascraperDate from "metascraper-date";
import metascraperDescription from "metascraper-description";
import metascraperImage from "metascraper-image";
import metascraperLogo from "metascraper-logo-favicon";
import metascraperPublisher from "metascraper-publisher";
import metascraperTitle from "metascraper-title";
import metascraperUrl from "metascraper-url";
import metascraperX from "metascraper-x";
import metascraperYoutube from "metascraper-youtube";

import metascraperAmazonImproved from "./metascraper-plugins/metascraper-amazon-improved";
import metascraperReddit from "./metascraper-plugins/metascraper-reddit";

/**
 * Create and return the configured metascraper parser
 * 
 * Plugin order is important - some plugins must come before others
 * to ensure correct extraction priority
 */
export function createMetascraperParser() {
  return metascraper([
    // Date extraction must be early
    metascraperDate({
      dateModified: true,
      datePublished: true,
    }),

    // Amazon improved MUST come before base Amazon plugin
    metascraperAmazonImproved() as any,
    metascraperAmazon(),

    // Platform-specific extractors
    metascraperYoutube(),
    metascraperReddit() as any,

    // General metadata extractors
    metascraperAuthor(),
    metascraperPublisher(),
    metascraperTitle(),
    metascraperDescription(),
    metascraperX(),

    // Image extraction - PRIMARY image source
    metascraperImage(),

    // Logo/favicon as fallback image
    metascraperLogo(),

    // URL canonicalization - should be last
    metascraperUrl(),
  ] as any);
}

/**
 * Extract metadata from HTML content
 * 
 * @param htmlContent - The raw HTML string to extract metadata from
 * @param url - Optional URL for context (helps canonicalization)
 * @returns Promise resolving to metadata object
 */
export async function extractMetadata(
  htmlContent: string,
  url?: string
): Promise<Record<string, any>> {
  const parser = createMetascraperParser();

  const meta = await parser({
    html: htmlContent,
    url: url || "about:blank",
    // Don't validate URL - we're processing pre-fetched HTML
    validateUrl: false,
  });

  return meta;
}
