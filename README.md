# meatscraper
Extract content from webpages! Perfect for bookmarking tools and AI ;)

Clean text content, metadata, and primary images from any webpage using [Metascraper](https://github.com/microlinkhq/metascraper), [Readability](https://github.com/mozilla/readability), [DOMPurify](https://github.com/cure53/DOMPurify) and custom logic.

*Disclaimer: This project was vibe coded.*

## Inspiration
This project is based on [Karakeep](https://github.com/karakeep/karakeep). They have done an amazing job building a content extraction pipeline. I wanted to use that functionality in other projects, so I pulled it from them and the created this library/CLI/server around it.

## Quick Example

**Input HTML:**
```html
<html>
  <head><title>My Article</title></head>
  <body>
    <h1>Hello World</h1>
    <p>This is the actual content you want to keep.</p>
  </body>
</html>
```

**Output JSON:**
```json
{
  "success": true,
  "data": {
    "content": "Hello World\nThis is the actual content you want to keep.",
    "image": null,
    "metadata": {
      "title": "My Article"
    }
  }
}
```

## Usage

### As a Library (TypeScript/JavaScript)

```typescript
import { meatExtractor } from 'meatscraper';

const result = await meatExtractor(htmlString);
console.log(result.content);    // Clean text only
console.log(result.image);      // Primary image URL
console.log(result.metadata);   // {title, author, date, ...}
```

### CLI - Process Local File

```bash
npm run start ./article.html
```

Output is printed as JSON to stdout.

### CLI - Start HTTP Server

```bash
npm run start serve
```

Server runs on port 8676. Send HTML via POST:

```bash
curl -X POST http://localhost:8676/extract \
  -H "Content-Type: application/json" \
  -d '{"html":"<html>...</html>"}'
```

Endpoints:
- `POST /extract` - Extract content from HTML
- `GET /health` - Health check
- `GET /stats` - Server statistics

### Docker

Pull and run the latest published image:

```bash
# Server mode
docker run -p 8676:8676 ghcr.io/paulohgodinho/meatscraper:main serve

# File mode (requires mounted volume)
docker run -v $(pwd):/data ghcr.io/paulohgodinho/meatscraper:main /data/article.html
```

## API Response

Complete response structure:

```json
{
  "success": true,
  "data": {
    "content": "Hello World\nThis is the actual content you want to keep.",
    "image": "https://example.com/image.jpg",
    "metadata": {
      "title": "My Article",
      "description": "Article description here",
      "author": "John Doe",
      "publisher": "Example Publication",
      "datePublished": "2024-01-15T10:30:00Z",
      "dateModified": "2024-01-15T12:00:00Z",
      "url": "https://example.com/article",
      "logo": "https://example.com/logo.png",
      "youtubeVideoId": null,
      "youtubeChannelName": null,
      "youtubeChannelId": null,
      "twitterHandle": null,
      "twitterCreator": null,
      "amazonPrice": null,
      "amazonProductTitle": null,
      "redditSubreddit": null,
      "redditAuthor": null
    }
  }
}
```

## Features

- **5-step processing pipeline** - Metadata extraction, readability analysis, sanitization, plain text conversion, image selection
- **Rich metadata extraction** - Extracts 20+ fields including title, author, publish date, image, and platform-specific data
- **Multiple platforms** - Special handling for YouTube, Twitter, Amazon, Reddit
- **HTML sanitization** - Removes scripts, styles, and dangerous content
- **Plain text output** - No HTML tags, clean readable text
- **Image selection** - Finds and returns the best primary image
- **Three usage modes** - Library, CLI, or HTTP server

## License

MIT
