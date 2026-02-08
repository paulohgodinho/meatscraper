#!/usr/bin/env node

/**
 * CLI entry point for meatscraper
 *
 * Usage:
 *   meatscraper <file-path>     # File mode: extract from HTML file
 *   meatscraper serve           # Server mode: start HTTP server on port 8676
 */

import { processFileMode } from "./modes/file-mode";
import { startHttpServer } from "./modes/http-mode";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // No arguments provided
  if (!command) {
    console.error("❌ No command provided");
    console.error("\nUsage:");
    console.error("  meatscraper <file-path> <url>     Extract content from an HTML file");
    console.error("  meatscraper serve                 Start HTTP server on port 8676");
    console.error("\nExamples:");
    console.error("  meatscraper ./example.html https://example.com/page");
    console.error("  meatscraper /path/to/file.html https://site.com/article");
    console.error("  meatscraper serve");
    process.exit(1);
  }

  // Server mode
  if (command === "serve") {
    try {
      startHttpServer(8676);
      // Keep the process running
      process.on("SIGINT", () => {
        console.log("\n\n👋 Server shutting down...");
        process.exit(0);
      });
    } catch (error) {
      console.error("❌ Failed to start server:");
      console.error(
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
    return;
  }

  // File mode - requires both file path and URL
  try {
    const filePath = args[0];
    const url = args[1];
    
    // Check if URL is provided
    if (!url) {
      console.error("❌ URL parameter is required");
      console.error("\nUsage:");
      console.error("  meatscraper <file-path> <url>");
      console.error("\nExample:");
      console.error("  meatscraper ./article.html https://example.com/article");
      console.error("\nThe URL should be the original web address where the HTML came from.");
      console.error("This is required for proper image and relative link resolution.");
      process.exit(1);
    }
    
    const result = await processFileMode(filePath, url);
    // Output to stdout for piping/redirection
    console.log(result);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error processing file:");
    console.error(
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

// Run the CLI
main().catch((error) => {
  console.error("❌ Unexpected error:");
  console.error(error);
  process.exit(1);
});
