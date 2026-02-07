/**
 * Step 4: Convert HTML to plain text
 * 
 * Converts cleaned HTML to plain text format suitable for searching
 * and display. Strips all HTML tags while preserving text structure.
 */

import { compile } from "html-to-text";

// Pre-compile the converter for reuse
const htmlToTextConverter = compile({
  selectors: [
    // Skip image tags (no alt text preserved)
    { selector: "img", format: "skip" },
    // Preserve links as plain text
    { selector: "a", options: { baseUrl: null as any } },
  ],
  wordwrap: false, // Don't wrap lines
});

/**
 * Convert HTML to plain text
 * 
 * @param htmlContent - HTML string to convert
 * @returns Plain text string with no HTML tags
 */
export function step4ConvertToPlainText(
  htmlContent: string | null
): string {
  if (!htmlContent) {
    return "";
  }

  try {
    // Convert HTML to plain text
    const plaintext = htmlToTextConverter(htmlContent);

    // Clean up excessive whitespace
    const cleaned = plaintext
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .join("\n");

    return cleaned;
  } catch (error) {
    console.error("Error converting HTML to plain text:", error);
    return htmlContent.replace(/<[^>]*>/g, ""); // Fallback: basic tag removal
  }
}
