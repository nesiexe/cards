# cards

Nesi's social card, built with Vite and Tailwind CSS. The mobile-first layout keeps a centered, bounded column on larger screens.

## Development

```sh
npm ci
npm run dev
```

Development runs on port 4001. Vite proxies `/api/now-playing` to the existing music API because that API allows the production origin through CORS, but not localhost. Production builds still request the API directly.

## Production

```sh
npm run build
npm run preview
```

Deploy the `dist` directory. Vite uses relative asset paths so builds also work under a subdirectory. Public images belong in `public/` and are referenced without the `public/` prefix.

## Styling and behavior

- `index.html`: semantic page structure, Tailwind utilities, and stable music UI markup.
- `src/index.css`: Tailwind theme, shared social-link component, and avatar animation.
- `src/script.js`: age, keyboard-accessible avatar interaction, Discord clipboard feedback, and music feed updates. JavaScript updates content and state; it does not write inline styles.
- `vite.config.js`: Tailwind's Vite plugin and deployment base path.

Now Playing reads `https://api.nesiexe.xyz/api/now-playing`. The API should return `isPlaying` and, when playing, `track`, `artist`, `url`, and `albumArt`. Requests time out after eight seconds and retry ten seconds after completion. Loading, idle, unavailable, missing artwork, and long titles are supported. The API must allow browser requests from the deployed origin through CORS.

## Manual checks

Run `npm test` for music state, URL handling, clipboard feedback, and reduced-motion behavior checks.

Check narrow (320px), tablet, and wide screens, browser zoom, keyboard focus, and reduced motion. Verify avatar activation, all social links, clipboard success/failure, and music loading/playing/idle/error states. Repeated music updates should preserve link focus and avoid announcing unchanged tracks.
