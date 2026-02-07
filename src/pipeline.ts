/**
 * Pipeline orchestrator
 * 
 * Chains all 5 extraction steps together in sequence.
 * Each step's output feeds into the next step where applicable.
 */

import { MeatExtractorResult, MeatExtractorOptions, DebugInfo } from "./types";
import { step1ExtractMetadata } from "./steps/step1-metadata";
import { step2ExtractReadableContent } from "./steps/step2-readable";
import { step3SanitizeHtml } from "./steps/step3-sanitize";
import { step4ConvertToPlainText } from "./steps/step4-plaintext";
import {
  step5SelectImage,
  ImageSelectionResult,
} from "./steps/step5-image";

/**
 * Execute the complete extraction pipeline
 * 
 * Flow:
 * 1. Extract metadata from raw HTML (all plugins)
 * 2. Extract readable/main content from raw HTML (Readability)
 * 3. Sanitize the readable content (DOMPurify)
 * 4. Convert sanitized HTML to plain text
 * 5. Select the best primary image from metadata
 * 
 * @param htmlContent - Raw HTML string
 * @param options - Configuration options
 * @returns Complete extraction result
 */
export async function executePipeline(
  htmlContent: string,
  options?: MeatExtractorOptions
): Promise<MeatExtractorResult> {
  // ===== STEP 1: Extract Metadata =====
  const metadata = await step1ExtractMetadata(htmlContent, options?.url);

  // ===== STEP 2: Extract Readable Content =====
  const readableContent = step2ExtractReadableContent(
    htmlContent,
    options?.url
  );

  // ===== STEP 3: Sanitize HTML =====
  const sanitizedContent = step3SanitizeHtml(readableContent);

  // ===== STEP 4: Convert to Plain Text =====
  const plaintext = step4ConvertToPlainText(sanitizedContent);

  // ===== STEP 5: Select Image =====
  const imageSelection = step5SelectImage(metadata);

  // ===== Build Result =====
  const result: MeatExtractorResult = {
    content: plaintext,
    image: imageSelection.selected,
    metadata: metadata,
  };

  // ===== Add Debug Info if Requested =====
  if (options?.debug) {
    const debug: DebugInfo = {
      step1_metadata: metadata,
      step2_readableContent: readableContent || "",
      step3_sanitizedContent: sanitizedContent || "",
      step4_plaintext: plaintext,
      step5_imageSelection: imageSelection,
    };

    result.debug = debug;
  }

  return result;
}
