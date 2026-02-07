#!/usr/bin/env node

/**
 * CLI entry point for meatscraper
 *
 * Usage:
 *   npm run start <file-path>     # File mode: extract from HTML file
 *   npm run start serve           # Server mode: start HTTP server on port 8676
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
    console.error("  npm run start <file-path>     Extract content from an HTML file");
    console.error("  npm run start serve           Start HTTP server on port 8676");
    console.error("\nExamples:");
    console.error("  npm run start ./example.html");
    console.error("  npm run start /path/to/file.html");
    console.error("  npm run start serve");
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

  // File mode
  try {
    const result = await processFileMode(command);
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
