# My Cute Blog

This repository contains a cute, experience-focused personal blog built with plain HTML, CSS, and JavaScript.

## What It Includes

- Rich post editor with bold/italic/underline, headings, lists, fonts, colors, and highlights.
- Uploadable images, attachments, PDF/doc support, and video embedding.
- Banner image, customizable logo slot, and owner-only background image upload.
- Categories, tags, dates, locations, comments, notes, and post filtering.
- Cute pastel styling with soft borders, shadows, and responsive layout.
- Local storage persistence for posts, settings, and quick notes.

## Recommended Technology Approach

### Static HTML + JavaScript
- Best for a simple personal blog with full design control.
- Easy to host on GitHub Pages, Netlify, or Vercel.
- Great for speed, security, and low maintenance.
- This repo uses a static page with client-side rich editing and persistence.

### Static Site Generator (SSG)
- Good when you want markdown-based posts and automated builds.
- Examples: Jekyll, Hugo, Eleventy, 11ty, Gatsby.
- Pros: fast pre-rendered pages, Git-friendly, clean content structure.
- Cons: requires rebuild after updates and typically uses markdown or front-matter.

### Headless CMS / Flat-file CMS
- Useful for an editor-friendly admin UI while still using a static front end.
- Examples: Sanity, Strapi, Netlify CMS, Forestry.
- Pros: visual authoring, media uploads, structured content.
- Cons: more setup and potential paid tiers.

### Traditional CMS
- Full-featured option for frequent publishing, comments, and user management.
- Examples: WordPress, Ghost, Drupal.
- Pros: built-in admin panel, media uploads, plugins.
- Cons: higher maintenance, hosting cost, and performance overhead.

## Editor Comparison

- **Markdown**: simple, Git-friendly, great for developers, but requires markup knowledge.
- **WYSIWYG**: intuitive visual editing for non-technical authors, but can generate less clean HTML.
- **Hybrid**: combines Markdown with visual editing; ideal when you want both author control and ease.

## Recommended File Structure

```
my-blog/
├─ index.html            # Main blog interface and home page
├─ styles.css            # Site styling and theme definitions
├─ app.js                # Editor, storage, and UI logic
├─ README.md             # Project documentation and usage guide
├─ images/               # Banner, logo, and post images
└─ assets/               # Optional fonts, icons, or additional files
```

## Deployment Choices

- **GitHub Pages**: free and ideal for static HTML/CSS/JS.
- **Netlify**: free tier with continuous deployment, forms, and serverless support.
- **Vercel**: great for static sites and quick Git integration.

## Design Notes

- Uses semantic HTML such as `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, and `<footer>`.
- Includes a meta description and JSON-LD blog schema for better SEO.
- Uses Google Fonts for clean typography and a playful heading style.
- Includes a customizable hero banner and logo placeholder.
- Adds cute pastel gradients, rounded borders, and soft shadows.

## How to Use

1. Open `index.html` in a browser.
2. Click **New Post** to create a post.
3. Use the toolbar or right-click inside the editor for styling options.
4. Upload your banner, logo, or background in Customize.
5. Add categories, tags, dates, locations, comments, and attachments.

## Adding Categories, Archives, and Search

- Categories are visible in the sidebar and clickable for filtering.
- Search filters posts by title, category, tags, and location.
- To add archives or category pages in a static build, create separate HTML pages or use an SSG.
- For a richer search experience, consider integrating a small JS search library like Fuse.js.

## Notes

This project is a great starting point for a personal cute blog. It is designed to be easy to edit and extend while keeping the experience aesthetic, responsive, and functional.
