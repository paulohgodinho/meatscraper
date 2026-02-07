/**
 * Metascraper plugin for improved Amazon product image extraction
 * 
 * Fixes image extraction bug in standard metascraperAmazon by prioritizing
 * high-quality product images over generic site logos.
 * 
 * MUST be used before metascraperAmazon() in the plugin chain
 */

import { toRule, image } from '@metascraper/helpers'

export default function metascraperAmazonImproved(opts?: any) {
  const toImage = toRule(image, opts)

  const rules: any = {
    image: [
      // Amazon product main image (most specific selector)
      toImage(
        ($: any) =>
          $('img[data-a-dynamic-image]')
            .first()
            .attr('src') ||
          $('img[data-a-dynamic-image]').first().attr('data-src')
      ),
      // Amazon product landing page images
      toImage(
        ($ : any) =>
          $('.a-dynamic-image img')
            .first()
            .attr('src') ||
          $('.a-dynamic-image img').first().attr('data-src')
      ),
      // Amazon image container
      toImage(
        ($ : any) =>
          $('img.a-dynamic-image')
            .first()
            .attr('src') ||
          $('img.a-dynamic-image').first().attr('data-src')
      ),
      // Generic product image
      toImage(
        ($ : any) =>
          $('img[alt*="product"]')
            .first()
            .attr('src') ||
          $('img[alt*="product"]').first().attr('data-src')
      ),
      // Fallback to og:image
      toImage(($ : any) => $('meta[property="og:image"]').attr('content')),
    ],
  }

  rules.pkgName = 'metascraper-amazon-improved'

  return rules
}
