/**
 * Example: Basic usage of meatscraper
 * 
 * This demonstrates how to use the meatExtractor function
 * to extract content and metadata from HTML
 * 
 * Run with: npx ts-node examples/example.ts
 */

import { meatExtractor } from "../src/index";
import fs from "fs";
import path from "path";

// Read the test HTML file
const htmlFilePath = path.join(__dirname, "../tests/test-article.html");
const exampleHtml = fs.readFileSync(htmlFilePath, "utf-8");

async function example() {
  console.log("=== meatscraper Example ===\n");

  try {
    // Basic usage (URL is now required)
    console.log("1. Basic Usage (URL is required):");
    const result = await meatExtractor(exampleHtml, {
      url: "https://example.com/article",
    });
    console.log("Title:", result.metadata.title);
    console.log("Description:", result.metadata.description);
    console.log("Author:", result.metadata.author);
    console.log("Image:", result.metadata.image);
    console.log("Logo:", result.metadata.logo);
    console.log("Content:", result.content.substring(0, 100) + "...");
    console.log();

    // With debug mode
    console.log("2. With Debug Mode:");
    const debugResult = await meatExtractor(exampleHtml, {
      url: "https://example.com/article",
      debug: true,
    });
    console.log("Canonical URL:", debugResult.metadata.url);
    console.log("Debug info available:", !!debugResult.debug);
    console.log();

    // Display full metadata
    console.log("3. Full Metadata:");
    console.log(JSON.stringify(result.metadata, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the example
example().catch(console.error);
