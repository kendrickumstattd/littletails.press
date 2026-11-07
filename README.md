# Little Tails Press

**Where the littlest adventures come to life.**

Little Tails Press publishes cozy, watercolor-illustrated storybooks starring Drizzy, a little chocolate-brindle French bulldog with big ears and a bigger heart. This repository holds the Little Tails website: a single illustrated "library" page where visitors can browse Drizzy's adventures and sit by a crackling fire.

🌐 **Live site:** https://littletails.press

![The Little Tails library](public/images/og-image.jpg)

## The books (coming soon)

The storybooks are still being finished. Until they're ready, the site shows a "coming soon" note instead of the book list. The planned titles are:

| Title | The story |
|---|---|
| **Drizzy Goes Skiing** | A bunny hill, a brave little bulldog, and a very cozy lodge. |
| **Drizzy Explores the Woods** | A winding path, whispering pines, and a curious little explorer. |
| **Drizzy's Cozy Day** | A reminder that little moments can make the best stories. |

## What's on the site

- **The library.** A hand-painted watercolor room that is the whole interface. The artwork has separate versions for desktop, tablet, and mobile, so it never looks stretched.
- **Our Adventures.** A parchment button laid over the painted storybook. It opens a "Shhh…a little adventure is in the making!" note while the storybooks are being finished.
- **Hear the fire.** An optional fireplace soundscape of pops and crackles, generated live in the browser. It never plays automatically. It works on phones too, including iPhones with the silent switch on, and picks back up when you return to the tab.
- **Privacy policy.** "A Little Note About Privacy": a short, friendly policy. The site has no accounts, forms, cookies, analytics, or ads.

The site is built to be accessible. It supports keyboard navigation and screen readers, has visible focus outlines, respects reduced-motion settings, meets WCAG AA contrast for text, and gives every button a touch target of at least 44 × 44 px on phones.

## Tech

- [Next.js](https://nextjs.org/) 15 and React 19, written in TypeScript
- [Lucide](https://lucide.dev/) icons
- [Lora](https://fonts.google.com/specimen/Lora) typeface, self-hosted via `next/font`
- Hosted on [Netlify](https://www.netlify.com/)
- No database, no third-party scripts, no tracking

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Run `npm run typecheck` to check types.

## Project layout

```
app/
  page.tsx          The library homepage and the dialogs it opens
  useFireSound.ts   The opt-in fireplace sound (Web Audio API)
  layout.tsx        Page metadata and social sharing preview
  globals.css       All styles
  icon.png          Favicon (Drizzy, napping)
  apple-icon.png    Home-screen icon for iOS
public/images/
  library-desktop.webp  1535 × 1024 homepage art (desktop, above 1024px)
  library-tablet.webp   1086 × 1448 homepage art (641–1024px)
  library-mobile.webp   941 × 1672 homepage art (640px and below)
  book-*.webp           Cover art for each book (480 × 480)
  og-image.jpg          Social sharing image
netlify.toml        Build settings, security headers, image caching, and
                    redirects (old /studio links go to the homepage)
```

### Updating the homepage artwork

Replace the three `library-*.webp` files in `public/images/`, keeping the same file names. The **Our Adventures** button is overlaid on each painting: just under the painted book on desktop, and on the book on tablet and mobile. If the book moves in new artwork, update the `.storybook-plaque` positions in `app/globals.css` (one per screen size) to match. On phones the button sizes itself to its label and is centered on the book, so only its `left` (the book's horizontal center) and `bottom` values need changing. If the new images have different dimensions, also update the `width`/`height` attributes in `app/page.tsx` and the aspect ratios in `app/globals.css`.

## License

© Little Tails Press. All rights reserved. The illustrations, characters, and story text are not licensed for reuse.
