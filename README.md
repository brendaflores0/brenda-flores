# brendaflores.co

Personal portfolio site, built with vanilla HTML, CSS and JavaScript.
Live at: **[brendaflores.co](https://brendaflores.co)**

## Features
- Dynamic CV: scroll-driven experience timeline with a progress-filled line
- 4 project case studies with real product screenshots (carousels)
- EN/ES language toggle, shareable per language: `brendaflores.co/es` and `brendaflores.co/en` (or `?lang=es` / `?lang=en` on any URL)
- Smooth scroll navigation
- Scroll-triggered animations
- Fully responsive
- SEO basics: sitemap, robots.txt, Open Graph/Twitter cards, favicon

## Stack
HTML · CSS · Vanilla JS · Tailwind CSS (precompiled) · Google Fonts · GitHub Pages

## Analytics
Centralized in `analytics.js` (GA4 + Microsoft Clarity), loaded by every page. IDs and behavior are documented in the file's header comment, the only place they get edited.

## Run locally
Just open `index.html` in your browser, no build step needed to view it.

## Tailwind
`tailwind.css` is compiled from the classes used in `index.html` (config in `tailwind.config.js`), instead of loading the Tailwind CDN, which compiles in the browser and is not meant for production. If you add a Tailwind class that is not used anywhere yet, regenerate it:

```
npx tailwindcss@3.4.17 -c ./tailwind.config.js -o ./tailwind.css --minify
```
