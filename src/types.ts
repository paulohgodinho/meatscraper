/**
 * Metadata extracted from webpage by metascraper
 */
export interface MetadataResult {
  // Core metadata
  title?: string;
  description?: string;
  image?: string; // Primary banner image URL
  logo?: string; // Site favicon/logo
  author?: string;
  publisher?: string;
  datePublished?: string; // ISO date string
  dateModified?: string; // ISO date string
  url?: string; // Canonical URL

  // Platform-specific metadata
  youtubeVideoId?: string;
  youtubeChannelName?: string;
  youtubeChannelId?: string;
  twitterHandle?: string;
  twitterCreator?: string;
  amazonPrice?: string;
  amazonProductTitle?: string;
  redditSubreddit?: string;
  redditAuthor?: string;

  // Alternative content
  readableContentHtml?: string;

  // Catch-all for any other fields
  [key: string]: any;
}

/**
 * Debug information from each pipeline step
 */
export interface DebugInfo {
  step1_metadata: MetadataResult;
  step2_readableContent: string; // HTML before sanitization
  step3_sanitizedContent: string; // HTML after sanitization
  step4_plaintext: string; // Final plain text
  step5_imageSelection: {
    extracted: string | null;
    selected: string | null;
    reason: string;
  };
}

/**
 * Final result from meatscraper extraction
 */
export interface MeatExtractorResult {
  // Main outputs
  content: string; // Plain text (NO HTML tags)
  metadata: MetadataResult; // Full metadata object (metadata.image contains best image with fallbacks)

  // Optional debug pipeline output
  debug?: DebugInfo;
}

/**
 * Options for meatscraper function
 */
export interface MeatExtractorOptions {
  debug?: boolean; // Enable step-by-step debug output
  url: string; // REQUIRED: Base URL for resolving relative paths and metadata extraction (must be http:// or https://)
}
