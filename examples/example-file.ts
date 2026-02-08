/**
 * Example: Process HTML file with meatscraper (TypeScript version)
 * 
 * This example reads an HTML file and extracts its content and metadata
 * using the meatscraper package
 * 
 * Run with: npx ts-node examples/example-file.ts
 */

import fs from "fs";
import path from "path";
import { meatExtractor } from "../src/index";

async function processHtmlFile() {
  try {
    // Read the test HTML file
    const htmlFilePath = path.join(__dirname, "../tests/test-article.html");

    console.log("📖 Reading HTML file:", htmlFilePath);
    const htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
    console.log(`✓ File read successfully (${htmlContent.length} bytes)\n`);

    // Process the HTML with meatExtractor
     console.log("⚙️  Processing HTML with meatscraper...\n");
    const result = await meatExtractor(htmlContent, {
      debug: false,
      url: "https://example.com/article",
    });

    // Display results
    console.log("═══════════════════════════════════════════════════════════");
    console.log("📄 EXTRACTION RESULTS");
    console.log("═══════════════════════════════════════════════════════════\n");

    console.log("📌 METADATA");
    console.log("───────────────────────────────────────────────────────────");
    console.log(`Title:        ${result.metadata.title}`);
    console.log(`Description:  ${result.metadata.description}`);
    console.log(`Author:       ${result.metadata.author || "Not found"}`);
    console.log(`Published:    ${result.metadata.datePublished || "Not found"}`);
    console.log(`Modified:     ${result.metadata.dateModified || "Not found"}`);
    console.log(`Image:        ${result.metadata.image || "Not found"}`);
    console.log(`Logo:         ${result.metadata.logo || "Not found"}`);
    console.log(`URL:          ${result.metadata.url}`);
    console.log();

    console.log("📝 EXTRACTED TEXT CONTENT");
    console.log("───────────────────────────────────────────────────────────");
    console.log(result.content);
    console.log();

    console.log("📊 STATISTICS");
    console.log("───────────────────────────────────────────────────────────");
    console.log(`Content length:           ${result.content.length} characters`);
    console.log(
      `Content word count:       ${result.content.split(/\s+/).length} words`
    );
    console.log(
      `Compression ratio:        ${(
        (result.content.length / htmlContent.length) *
        100
      ).toFixed(2)}%`
    );
    console.log();

    console.log("═══════════════════════════════════════════════════════════");
    console.log("✅ Processing completed successfully!");
    console.log("═══════════════════════════════════════════════════════════");
  } catch (error) {
    console.error("❌ Error processing HTML file:");
    console.error((error as Error).message);
    process.exit(1);
  }
}

// Run the example
processHtmlFile();
