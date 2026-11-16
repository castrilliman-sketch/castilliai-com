# How to add a post

Add a note under `posts/` only. The index lists posts newest first. The RSS feed at `posts/feed.xml` is what the ActiveCampaign campaign sends at 7am Europe/London, so the newest `<item>` has to be first and its `pubDate` has to be earlier that morning.

## Steps

1. Fetch the latest `main` and branch from it. Copy `posts/2026-11-16-which-interest-rate-applies.html` to `posts/YYYY-MM-DD-short-slug.html`. Keep the same header, navigation, footer, styles and the RSS `<link rel="alternate" type="application/rss+xml" href="https://www.castilliai.com/posts/feed.xml">`. Change the `<title>`, meta description, canonical URL (`https://www.castilliai.com/posts/YYYY-MM-DD-short-slug.html`) and the visible date (for example `17 November 2026`).
2. Replace the heading and the body. Keep the sign-off as Daniel, then NexusAI t/a CastilliAI.
3. Prepend the new post to `posts/index.html`, as the first `<article class="card">` inside `.post-list`, above every older post. Link the title to the new page and show the date.
4. Prepend a new `<item>` in `posts/feed.xml` as the first item in `<channel>`, above every older item. Set `title`, `link`, `guid` with `isPermaLink="true"` (the same absolute URL as `link`), and `pubDate` in RFC 822 form at `06:00:00 +0000` on the post date (`Tue, 17 Nov 2026 06:00:00 +0000`). Put the full post body HTML, including the sign-off, in `description` inside `<![CDATA[ ... ]]>`. Set `lastBuildDate` to that same timestamp.
5. Check the feed parses before you commit:

   ```bash
   python3 -c "import xml.etree.ElementTree as ET; ET.parse('posts/feed.xml')"
   ```

6. Commit only files under `posts/`.

## Rules

- Commit only under `/posts/`. Do not edit any other file in the repository.
- Fetch the latest `main` before each commit (`git fetch origin main`) and rebase your branch onto it. Never force-push. Never force-push `main`.
- Any statutory interest figure is 8% plus the six-monthly reference rate (11.75% for interest starting Jul-Dec 2026, never 12%).
- Link only to `/late-payment-calculator/` and `/get-paid-uk/`, never a Stripe checkout URL.
- Posts under 150 words, UK English, not legal advice.
