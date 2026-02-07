/**
 * Utility functions for meatscraper
 */

/**
 * Normalize a Content-Type header by stripping parameters (e.g., charset)
 * and lowercasing the media type
 */
export function normalizeContentType(header: string | null): string | null {
  if (!header) {
    return null;
  }
  return header.split(";", 1)[0]?.trim().toLowerCase() || null;
}

/**
 * Check if a string is empty or whitespace only
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Truncate a string to a maximum length
 */
export function truncate(
  str: string,
  maxLength: number = 100,
  suffix: string = "..."
): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + suffix;
}
