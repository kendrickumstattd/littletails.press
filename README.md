# Little Tails Press

**Where the littlest adventures come to life.**

Little Tails Press publishes cozy, watercolor-illustrated storybooks starring Drizzy, a little chocolate-brindle French bulldog with big ears and a bigger heart. This repository holds the Little Tails website: a single illustrated "library" page where visitors can browse Drizzy's adventures and sit by a crackling fire.

🌐 **Live site:** https://cheerful-biscochitos-084463.netlify.app

![The Little Tails library](public/images/og-image.jpg)

## The books

| Title | The story |
|---|---|
| **Drizzy Goes Skiing** | A bunny hill, a brave little bulldog, and a very cozy lodge. |
| **Drizzy Explores the Woods** | A winding path, whispering pines, and a curious little explorer. |
| **Drizzy's Cozy Day** | A reminder that little moments can make the best stories. |

## What's on the site

- **The library.** A hand-painted watercolor room that is the whole interface. The artwork has separate versions for desktop, tablet, and mobile, so it never looks stretched.
- **Our Adventures.** Opens a "coming soon" note while the storybooks are being finished.
- **Hear the fire.** An optional fireplace soundscape of pops and crackles, generated live in the browser. It never plays automatically.
- **Privacy policy.** A short plain-language policy. The site has no accounts, forms, cookies, or analytics.

The site is built to be accessible. It supports keyboard navigation and screen readers, has visible focus outlines, respects reduced-motion settings, and meets WCAG AA contrast for text.

## Tech

- [Next.js](https://nextjs.org/) 15 and React 19, written in TypeScript
- [Lora](https://fonts.google.com/specimen/Lora) typeface, self-hosted via `next/font`
- Hosted on [Netlify](https://www.netlify.com/)
- No database, no third-party scripts, no tracking

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Project layout

```
app/
  page.tsx          The library homepage and the dialogs it opens
  useFireSound.ts   The opt-in fireplace sound (Web Audio API)
  layout.tsx        Page metadata and social sharing preview
  globals.css       All styles
  icon.png          Favicon (Drizzy, napping)
public/images/
  library-desktop.webp  1536 × 1024 homepage art (desktop)
  library-tablet.webp   772 × 1125 homepage art (641–1024px)
  library-mobile.webp   940 × 1672 homepage art (640px and below)
  book-*.webp           Cover art for each book
  og-image.jpg          Social sharing image
netlify.toml        Build settings, security headers, and redirects
```

### Updating the homepage artwork

Replace the three `library-*.webp` files in `public/images/`, keeping the same file names. The **Our Adventures** button is overlaid on each painting: just under the painted book on desktop, and on the book on tablet and mobile. If the book moves in new artwork, update the `.storybook-plaque` positions in `app/globals.css` (one per screen size) to match.

## License

© Little Tails Press. All rights reserved. The illustrations, characters, and story text are not licensed for reuse.
