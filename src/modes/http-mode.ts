/**
 * HTTP server mode - starts an Express server on port 8676
 * Accepts POST requests with JSON body containing HTML content
 * Dead simple - just extract and return
 */

import express, { Express, Request, Response, NextFunction } from "express";
import { meatExtractor } from "../index";
import {
  formatSuccessResponse,
  formatErrorResponse,
} from "../utils/formatters";
import { validateUrl } from "../utils/validate-url";

interface ExtractRequest extends Request {
  body: {
    html?: string;
    url?: string;
  };
}

/**
 * Start the HTTP server
 * @param port - Port to listen on (default: 8676)
 */
export function startHttpServer(port: number = 8676): Express {
  const app = express();

  // Middleware: parse JSON bodies
  app.use(express.json({ limit: "50mb" })); // Allow larger HTML documents

  // Middleware: logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    // Capture the original send function
    const originalSend = res.send;

    // Override res.send to capture response size and log
    res.send = function (data: any) {
      const duration = Date.now() - startTime;
      const method = req.method;
      const path = req.path;
      const status = res.statusCode;
      const responseSize = JSON.stringify(data).length;

      console.log(`[${status}] ${method} ${path} - ${duration}ms - ${responseSize}B`);

      // Call original send
      return originalSend.call(this, data);
    };

    next();
  });

  // Health check endpoint
  app.get("/health", (req: Request, res: Response) => {
    const health = {
      status: "ok",
       message: "meatscraper server is running",
      timestamp: new Date().toISOString(),
    };
    res.json(health);
  });

  // Main extraction endpoint
  app.post("/extract", async (req: ExtractRequest, res: Response) => {
    try {
      const { html, url } = req.body;

      // Validate html field exists
      if (!html) {
        const errorResponse = formatErrorResponse(
          "Missing required field: 'html'",
          "MISSING_HTML_FIELD"
        );
        res.status(400).json(errorResponse);
        return;
      }

      // Validate html is a string
      if (typeof html !== "string") {
        const errorResponse = formatErrorResponse(
          "Field 'html' must be a string",
          "INVALID_HTML_TYPE"
        );
        res.status(400).json(errorResponse);
        return;
      }

      // Validate html is not empty
      if (html.trim().length === 0) {
        const errorResponse = formatErrorResponse(
          "Field 'html' cannot be empty",
          "EMPTY_HTML"
        );
        res.status(400).json(errorResponse);
        return;
      }

      // Validate url field exists
      if (!url) {
        const errorResponse = formatErrorResponse(
          "Missing required field: 'url'",
          "MISSING_URL_FIELD"
        );
        res.status(400).json(errorResponse);
        return;
      }

      // Validate url is a string
      if (typeof url !== "string") {
        const errorResponse = formatErrorResponse(
          "Field 'url' must be a string",
          "INVALID_URL_TYPE"
        );
        res.status(400).json(errorResponse);
        return;
      }

      // Validate url format
      try {
        validateUrl(url, "HTTP request");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorResponse = formatErrorResponse(
          errorMessage,
          "INVALID_URL_FORMAT"
        );
        res.status(400).json(errorResponse);
        return;
      }

      // Process with meatExtractor
      const result = await meatExtractor(html, { url });
      const successResponse = formatSuccessResponse(result, url);
      res.status(200).json(successResponse);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorResponse = formatErrorResponse(
        errorMessage,
        "EXTRACTION_ERROR"
      );
      res.status(500).json(errorResponse);
    }
  });

  // Server stats endpoint
  app.get("/stats", (req: Request, res: Response) => {
    const stats = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    res.json({ success: true, stats });
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    const errorResponse = formatErrorResponse(
      `Endpoint not found: ${req.method} ${req.path}`,
      "NOT_FOUND"
    );
    res.status(404).json(errorResponse);
  });

  // Start server
  app.listen(port, () => {
     console.log(`\n🚀 meatscraper server started on http://localhost:${port}`);
    console.log(`📍 Extract endpoint: POST http://localhost:${port}/extract`);
    console.log(`💓 Health check: GET http://localhost:${port}/health`);
    console.log(`📊 Server stats: GET http://localhost:${port}/stats`);

    console.log(`\n📝 Request format:`);
    console.log(`   POST /extract`);
    console.log(`   Content-Type: application/json`);
    console.log(`   Body: { "html": "<html>...</html>", "url": "https://example.com/page" }\n`);

    console.log(`📊 Server is listening for requests...\n`);
  });

  return app;
}
