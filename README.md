# Birthday site — quick start

## 1. Edit before deploying
- **`script.js` top section**: set `gfBirthDate` (format `'YYYY-MM-DD'`). Until you set it, the age/day counters in Section 2 just stay at 0.
- **`TARGET_MONTH` / `TARGET_DAY`** in `script.js` control the unlock date (defaults to July 30, using the visitor's current year automatically).
- **`REASONS`** array in `script.js` — 12 objects with `emoji` + `text`, used for Section 5.
- **`MESSAGES`** array in `script.js` — 12 objects with `title` + `text`, used for Section 6.
- **Letter text** — edit the placeholder paragraph inside `#envelopeLetter` in `index.html` (Section 4).
- **Images/gifs** — everything under `./assets/` is a placeholder right now (solid-color stand-ins so the layout previews cleanly). Replace the files in `assets/` with the real photos/gifs using the *same filenames*, or update the `src` paths in `index.html`.

## 2. How the lock works
- Before the target date → countdown ("Not Yet...").
- On the target date, and for 30 days after → unlocked ("Happy Birthday" + "Start the surprise").
- More than 30 days after → re-locks, countdown resets to next year's date.
- The "Replay from the top" button on the finale section bypasses all of this for the session (so you can demo/replay it any time), resetting opened cards, likes, and scroll position.

## 3. Deploy to GitHub Pages
1. Push `index.html`, `style.css`, `script.js`, and the `assets/` folder to a repo.
2. Repo → **Settings → Pages** → set source to your default branch (root).
3. GitHub gives you a `https://<username>.github.io/<repo>/` URL — that's the link to send her.

No build step, no dependencies beyond the two Google Fonts loaded via `<link>` in `index.html`.
