/**
 * File mode handler - reads HTML from disk and extracts content
 */

import fs from "fs";
import path from "path";
import { meatExtractor, MeatExtractorOptions } from "../index";
import {
  formatSuccessResponse,
  formatErrorResponse,
  formatAsJson,
} from "../utils/formatters";

/**
 * Process an HTML file from disk
 * @param filePath - Path to HTML file
 * @param options - meatscraper options
 * @returns JSON string with extraction result
 */
export async function processFileMode(
  filePath: string,
  options?: MeatExtractorOptions
): Promise<string> {
  try {
    // Validate file path is provided
    if (!filePath) {
      const errorResponse = formatErrorResponse(
        "No file path provided. Usage: npm run start <file-path>"
      );
      return formatAsJson(errorResponse);
    }

    // Resolve absolute path
    const absolutePath = path.resolve(filePath);

    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      const errorResponse = formatErrorResponse(
        `File not found: ${absolutePath}`,
        "FILE_NOT_FOUND"
      );
      return formatAsJson(errorResponse);
    }

    // Check if it's a file (not a directory)
    const stats = fs.statSync(absolutePath);
    if (!stats.isFile()) {
      const errorResponse = formatErrorResponse(
        `Path is not a file: ${absolutePath}`,
        "NOT_A_FILE"
      );
      return formatAsJson(errorResponse);
    }

    // Read file content
    console.error(
      `📖 Reading HTML file: ${absolutePath} (${(stats.size / 1024).toFixed(2)} KB)`
    );
    const htmlContent = fs.readFileSync(absolutePath, "utf-8");

    // Process with meatExtractor
     console.error(`⚙️  Processing HTML with meatscraper...`);
    const startTime = Date.now();
    const result = await meatExtractor(htmlContent, {
      ...options,
      url: options?.url || `file://${absolutePath}`,
    });
    const duration = Date.now() - startTime;

    console.error(
      `✅ Processing completed in ${duration}ms - Extracted ${result.content.length} characters`
    );

    // Format and return success response
    const successResponse = formatSuccessResponse(result);
    return formatAsJson(successResponse);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error(`❌ Error: ${errorMessage}`);

    const errorResponse = formatErrorResponse(errorMessage, "PROCESSING_ERROR");
    return formatAsJson(errorResponse);
  }
}
