/**
 * Output formatters for different modes and response types
 */

import { MeatExtractorResult } from "../index";

/**
 * Success response format with extracted data
 */
export interface SuccessResponse {
  success: true;
  url: string;
  data: {
    content: string;
    metadata: any;
  };
}

/**
 * Error response format
 */
export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse = SuccessResponse | ErrorResponse;

/**
 * Format a successful meatscraper result for API/file responses
 * 
 * @param result - The extraction result from meatExtractor
 * @param url - The URL that was crawled/processed
 */
export function formatSuccessResponse(
  result: MeatExtractorResult,
  url: string
): SuccessResponse {
  return {
    success: true,
    url: url,
    data: {
      content: result.content,
      metadata: result.metadata,
    },
  };
}

/**
 * Format an error response
 */
export function formatErrorResponse(
  error: Error | string,
  code?: string
): ErrorResponse {
  const message = typeof error === "string" ? error : error.message;
  return {
    success: false,
    error: message,
    ...(code && { code }),
  };
}

/**
 * Format response as pretty-printed JSON string (2 spaces)
 */
export function formatAsJson(response: ApiResponse): string {
  return JSON.stringify(response, null, 2);
}

/**
 * Get current timestamp in ISO format for logging
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Format log message with timestamp
 */
export function formatLogMessage(
  method: string,
  path: string,
  statusCode: number,
  durationMs: number,
  responseSize?: number,
  clientId?: string
): string {
  const timestamp = new Date().toLocaleString();
  let message = `[${timestamp}] ${method} ${path} - ${statusCode} (${durationMs}ms)`;
  if (responseSize) {
    message += ` - ${responseSize} bytes`;
  }
  if (clientId) {
    message += ` [${clientId}]`;
  }
  return message;
}
