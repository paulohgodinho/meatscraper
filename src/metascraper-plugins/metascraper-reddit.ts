/**
 * Metascraper plugin for Reddit post metadata extraction
 * 
 * Extracts Reddit-specific metadata including subreddit, author,
 * upvote count, and other post information
 */

import { toRule, $filter } from '@metascraper/helpers'

// Identity processor for custom fields that don't need special handling
const identity = (value: any) => value

export default function metascraperReddit(opts?: any) {
  const toCustom = toRule(identity, opts)

  const rules: any = {
    // Extract subreddit from the og:url meta tag
    subreddit: [
      toCustom(($ : any) => {
        const ogUrl = $('meta[property="og:url"]').attr('content')
        const match = ogUrl?.match(/\/r\/([^/]+)/)
        return match ? match[1] : undefined
      }),
    ],

    // Extract author from meta tags
    author: [
      toCustom(($ : any) => $('meta[name="author"]').attr('content')),
      toCustom(($ : any) =>
        $filter(
          $ ,
          $(
            '[data-testid="post_author_by_line"] a[href*="/user/"]'
          )
        )
      ),
    ],

    // Extract description from og:description
    description: [
      toCustom(($ : any) =>
        $('meta[property="og:description"]').attr('content')
      ),
    ],

    // Extract Reddit-specific metadata (upvotes)
    redditUpvotes: [
      toCustom(($ : any) => {
        const upvoteText = $('._1rZjMh_0').text()
        const match = upvoteText?.match(/([\d.,]+)/)
        return match
          ? parseInt(match[1].replace(/[,.']/g, ''), 10)
          : undefined
      }),
    ],
  }

  rules.pkgName = 'metascraper-reddit'

  return rules
}
