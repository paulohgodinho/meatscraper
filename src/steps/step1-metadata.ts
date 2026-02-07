/**
 * Step 1: Extract metadata from HTML
 * 
 * Uses metascraper with 12+ plugins to extract comprehensive metadata
 * including title, description, author, images, dates, and more
 */

import { MetadataResult } from "../types";
import { extractMetadata } from "../metascraper-setup";

export async function step1ExtractMetadata(
  htmlContent: string,
  url?: string
): Promise<MetadataResult> {
  const metadata = await extractMetadata(htmlContent, url);

  return {
    title: metadata.title,
    description: metadata.description,
    image: metadata.image,
    logo: metadata.logo,
    author: metadata.author,
    publisher: metadata.publisher,
    datePublished: metadata.datePublished,
    dateModified: metadata.dateModified,
    url: metadata.url,
    // YouTube fields
    youtubeVideoId: metadata.youtubeVideoId,
    youtubeChannelName: metadata.youtubeChannelName,
    youtubeChannelId: metadata.youtubeChannelId,
    // Twitter/X fields
    twitterHandle: metadata.twitterHandle,
    twitterCreator: metadata.twitterCreator,
    // Amazon fields
    amazonPrice: metadata.amazonPrice,
    amazonProductTitle: metadata.amazonProductTitle,
    // Reddit fields (from custom plugin)
    redditSubreddit: metadata.subreddit,
    redditAuthor: metadata.author,
    // Other available metadata
    readableContentHtml: metadata.readableContentHtml,
    // Pass through any other fields metascraper extracted
    ...metadata,
  };
}
