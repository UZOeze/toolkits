# CryptoRocket Blog

A static blog for sports, forex, crypto, and Polymarket articles, built so
that **publishing a new post is just: write HTML → drop it in a folder →
push to GitHub.** No CMS, no database, no build step to run yourself.

## How it works

```
blog-site/
├── index.html                 ← the homepage (ticker + filters + article grid)
├── posts.json                 ← auto-generated list of every article (don't edit by hand)
├── assets/
│   ├── css/style.css
│   └── js/main.js             ← fetches posts.json and renders the homepage
├── posts/
│   ├── _template.html          ← copy this to start a new article
│   ├── sports/
│   ├── forex/
│   ├── crypto/
│   └── polymarket/
├── scripts/
│   └── build_index.py          ← scans /posts and writes posts.json
└── .github/workflows/build.yml ← runs build_index.py automatically on every push
```

Every time you push a change to the `posts/` folder, a GitHub Action runs
automatically, rescans all four category folders, and rewrites
`posts.json`. The homepage reads that file with JavaScript and builds the
ticker tape, the category filter buttons, and the article cards from it.
**You never touch `posts.json`, `index.html`, or the JS yourself to publish
a post.**

## Publishing a new article (the only steps you need)

1. Copy `posts/_template.html` into the right folder:
   - `posts/sports/your-article-name.html`
   - `posts/forex/your-article-name.html`
   - `posts/crypto/your-article-name.html`
   - `posts/polymarket/your-article-name.html`

2. Open it and fill in the meta tags near the top:

   ```html
   <meta name="post:title" content="Why NFA Beats Signals">
   <meta name="post:date" content="2026-07-06">
   <meta name="post:excerpt" content="A one or two sentence summary for the homepage card.">
   <meta name="post:image" content="">
   <meta name="post:author" content="CryptoRocket">
   ```

   Use `YYYY-MM-DD` for the date — that's what the homepage sorts by
   (newest first).

3. Write your article inside `<article class="post-body"> ... </article>`
   using normal HTML: `<h2>`, `<p>`, `<ul>`, `<blockquote>`, `<img>`, etc.

4. Commit and push to GitHub:

   ```
   git add posts/crypto/your-article-name.html
   git commit -m "Add: Why NFA Beats Signals"
   git push
   ```

5. Wait about a minute. The GitHub Action rebuilds `posts.json` and commits
   it automatically. Refresh your live site — the article is there, filed
   under the right category, newest first.

That's it. No local build tools required — you can even do all of this
from GitHub's web editor if you don't have git set up locally.

## Adding a fifth category later

If you ever want a fifth vertical (say, "stocks"):

1. Make the folder: `posts/stocks/`
2. In `scripts/build_index.py`, add a line to the `CATEGORIES` dict:
   ```python
   "stocks": "Stocks",
   ```
3. In `assets/js/main.js`, add `"stocks"` to `CATEGORY_ORDER` and to
   `CATEGORY_LABELS`.
4. In `assets/css/style.css`, add a new accent color variable
   (e.g. `--cat-stocks: #...;`) and reference it in `CATEGORY_VARS` in `main.js`.

## Hosting on GitHub Pages

1. Push this folder's contents to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch",
   branch `main`, folder `/ (root)`.
4. Save. Your site will be live at
   `https://<your-username>.github.io/<repo-name>/` within a minute or two.

The included `.nojekyll` file tells GitHub Pages to serve the files exactly
as they are, without running them through Jekyll first (Jekyll would
otherwise ignore or mangle some files by default).

### First-time setup note on the GitHub Action

The workflow needs permission to commit `posts.json` back to your repo.
This is already enabled in `.github/workflows/build.yml` via
`permissions: contents: write`. If your organization has repository-level
restrictions on Actions permissions, make sure
**Settings → Actions → General → Workflow permissions** is set to
"Read and write permissions".

## Running the index build locally (optional)

You don't need to do this to publish — the GitHub Action does it for you —
but if you want to preview `posts.json` locally:

```
python3 scripts/build_index.py
```

Then open `index.html` in a browser (or run a tiny local server, e.g.
`python3 -m http.server`, since `fetch()` can be picky about local files
opened directly from disk in some browsers).
