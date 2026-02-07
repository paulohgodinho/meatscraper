/**
 * Step 2: Extract readable content using Mozilla Readability
 * 
 * Identifies and extracts the main article/content from a webpage
 * using JSDOM and @mozilla/readability library.
 * Removes navigation, sidebars, ads, and other non-essential elements.
 */

import { JSDOM, VirtualConsole } from "jsdom";
import { Readability } from "@mozilla/readability";

/**
 * Extract readable content from HTML
 * 
 * @param htmlContent - Raw HTML string
 * @param url - Optional URL for context
 * @returns HTML string of main article content, or null if extraction fails
 */
export function step2ExtractReadableContent(
  htmlContent: string,
  url?: string
): string | null {
  try {
    // Create a virtual console to suppress warnings
    const virtualConsole = new VirtualConsole();

    // Parse HTML into DOM
    const dom = new JSDOM(htmlContent, {
      url: url || "about:blank",
      virtualConsole,
    });

    // Extract readable content using Mozilla Readability
    const readableContent = new Readability(dom.window.document).parse();

    // Clean up DOM
    dom.window.close();

    // Check if we got valid content
    if (!readableContent || typeof readableContent.content !== "string") {
      return null;
    }

    // Return the extracted HTML content
    return readableContent.content;
  } catch (error) {
    console.error("Error extracting readable content:", error);
    return null;
  }
}
