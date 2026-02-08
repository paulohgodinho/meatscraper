/**
 * URL validation utility
 * 
 * Validates that URLs are properly formatted and use http/https protocols
 */

/**
 * Validate a URL string
 * 
 * @param url - The URL to validate
 * @param context - Context string for error messages (e.g., "CLI file mode", "HTTP request")
 * @throws Error if URL is invalid
 */
export function validateUrl(url: string | undefined, context: string): void {
  if (!url || typeof url !== "string") {
    throw new Error(`${context}: URL is required and must be a string`);
  }

  if (url.trim().length === 0) {
    throw new Error(`${context}: URL cannot be empty`);
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error(
        `${context}: URL must use http:// or https:// protocol (got: ${parsed.protocol})`
      );
    }
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(`${context}: Invalid URL format - ${url}`);
    }
    // Re-throw our own error messages
    throw e;
  }
}
