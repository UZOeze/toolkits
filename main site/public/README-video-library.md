# CryptoRocket Video Library

A static video library for sports, forex, crypto, and Polymarket videos.
Publishing a new video is: **write the video link in a .txt file → drop it
in a folder → push to GitHub.** No CMS, no re-uploading the video file
itself — you just point at wherever it's already hosted (YouTube or Vimeo).

## How it works

```
video-library/
├── videos.html                  ← homepage (ticker + filters + video grid + player modal)
├── videos.json                 ← auto-generated list of every video (don't edit by hand)
├── assets/
│   ├── css/video-style.css
│   └── js/video-main.js              ← fetches videos.json and renders the homepage + modal
├── videos/
│   ├── _example.txt             ← copy this to add a new video
│   ├── sports/
│   ├── forex/
│   ├── crypto/
│   └── polymarket/
├── scripts/
│   └── build_video_index.py          ← scans /videos, fetches titles/thumbnails, writes videos.json
└── .github/workflows/build-videos.yml ← runs build_video_index.py automatically on every push
```

Every time you push a change to the `videos/` folder, a GitHub Action runs
automatically: it rescans all four category folders, reads each `.txt`
file's link, calls YouTube's or Vimeo's oEmbed API to fetch the real
title/thumbnail/channel name, and rewrites `videos.json`. The homepage
reads that file to build the ticker tape, filter counts, and the video
grid. **You never touch `videos.json`, `videos.html`, or the JS yourself.**

## Publishing a new video (the only steps you need)

1. Upload your video to YouTube (or Vimeo) as normal, and copy its link.

2. Create a plain `.txt` file in the right category folder:
   - `videos/sports/your-video-name.txt`
   - `videos/forex/your-video-name.txt`
   - `videos/crypto/your-video-name.txt`
   - `videos/polymarket/your-video-name.txt`

3. The simplest possible file is just the link, nothing else:

   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

   The title, thumbnail, and channel name are fetched automatically.
   If you want to override any of that, add optional lines below the link:

   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   title: Custom title instead of the auto-fetched one
   date: 2026-07-06
   description: One or two sentence summary shown on the card.
   ```

   Use `YYYY-MM-DD` for the date — that's what the homepage sorts by
   (newest first). Videos with no date sink to the bottom of the list.

4. Commit and push to GitHub:

   ```
   git add videos/forex/your-video-name.txt
   git commit -m "Add: your video title"
   git push
   ```

5. Wait about a minute. The GitHub Action fetches the metadata, rebuilds
   `videos.json`, and commits it automatically. Refresh your live site —
   the video is there, filed under the right category, newest first,
   with its real thumbnail and a click-to-play modal.

## Supported video sources

- **YouTube** — any `youtube.com/watch?v=...`, `youtu.be/...`, or
  `youtube.com/shorts/...` link.
- **Vimeo** — any `vimeo.com/...` link.
- **Anything else** — the link is still saved and listed, but since it
  can't be embedded in the player, the card links straight out to the
  original site instead of opening the in-page player.

## Adding a fifth category later

If you ever want a fifth vertical (say, "stocks"):

1. Make the folder: `videos/stocks/`
2. In `scripts/build_video_index.py`, add a line to the `CATEGORIES` dict:
   ```python
   "stocks": "Stocks",
   ```
3. In `assets/js/video-main.js`, add `"stocks"` to `CATEGORY_ORDER` and
   `CATEGORY_LABELS`.
4. In `assets/css/video-style.css`, add a new accent color variable
   (e.g. `--cat-stocks: #...;`) and reference it in `CATEGORY_VARS` in `video-main.js`.

## Merging this into the same repo as your CryptoRocket blog

All filenames in this folder were renamed (`videos.html`, `video-style.css`,
`video-main.js`, `build_video_index.py`, `build-videos.yml`,
`README-video-library.md`) so nothing overwrites the blog's `index.html`,
`style.css`, `main.js`, `build_index.py`, `build.yml`, or `README.md` when
you copy both into one repository.

After merging, add a link to `videos.html` somewhere in the blog's
`index.html` nav (and vice versa) so visitors can get from one to the
other — e.g. in the blog's `<nav class="site-nav">`:

```html
<a href="videos.html" class="back-link">Video Library</a>
```

## Hosting on GitHub Pages

1. Push this folder's contents to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch",
   branch `main`, folder `/ (root)`.
4. Save. Your site will be live at
   `https://<your-username>.github.io/<repo-name>/` within a minute or two.

The included `.nojekyll` file tells GitHub Pages to serve the files exactly
as they are, without running them through Jekyll first.

### First-time setup note on the GitHub Action

The workflow needs permission to commit `videos.json` back to your repo.
This is already enabled in `.github/workflows/build-videos.yml` via
`permissions: contents: write`. If your organization restricts Actions
permissions, make sure **Settings → Actions → General → Workflow
permissions** is set to "Read and write permissions".

## Running the index build locally (optional)

You don't need to do this to publish — the GitHub Action does it for you —
but if you want to preview `videos.json` locally (requires internet access
for the oEmbed lookups):

```
python3 scripts/build_video_index.py
```

Then open `videos.html` in a browser, ideally via a tiny local server since
`fetch()` can be picky about local files opened directly from disk in some
browsers, e.g.:

```
python3 -m http.server
```
