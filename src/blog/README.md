# Writing posts

Add an `.mdx` file to `src/blog/posts/`. Its filename becomes its URL:
`my-post.mdx` → `/blog/posts/my-post/`. Posts automatically appear on the
homepage and `/blog/`, newest first. Rebuild and deploy to publish live changes.

```mdx
---
title: "Your post title"
description: "A short summary for the listing and search engines."
pubDate: 2026-11-10
category: "Design"
author: "Sean Merriam"
draft: false
---

Your article in Markdown. MDX also supports imported Astro components.
```

Only `title`, `description` and a publication date are required. Use either
`pubDate` or `publishDate`; if both are present, `pubDate` takes precedence. Optional `image` (a public
path such as `/images/my-post.webp`, or a URL) and `imageAlt` add a thumbnail.
`author` defaults to Sean Merriam and `category` to Notes. Set `draft: true` to
exclude a post from listings and generated routes. Future dates do not schedule
publication: use drafts until you are ready. Reading time is estimated automatically.
