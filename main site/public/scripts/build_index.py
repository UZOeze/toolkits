#!/usr/bin/env python3
"""
build_index.py

Scans /posts/<category>/*.html for metadata <meta> tags and writes
a single /posts.json file that the homepage (index.html) reads to
render the article list automatically.

This runs automatically via GitHub Actions on every push (see
.github/workflows/build.yml), so you never have to touch this file
or posts.json by hand. You can also run it locally:

    python3 scripts/build_index.py

Each article HTML file should include meta tags like this in its <head>:

    <meta name="post:title" content="Why NFA Matters More Than Your Signal">
    <meta name="post:date" content="2026-07-06">
    <meta name="post:excerpt" content="A short one or two sentence summary shown on the homepage card.">
    <meta name="post:image" content="">   <!-- optional, leave blank to use a generated tile -->
    <meta name="post:author" content="CryptoRocket">

See posts/_template.html for a ready-to-copy starting point.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "posts"
OUTPUT_FILE = ROOT / "posts.json"

# Folder name -> display label + accent used on the homepage
CATEGORIES = {
    "sports": "Sports",
    "forex": "Forex",
    "crypto": "Crypto",
    "polymarket": "Polymarket",
}

META_PATTERN = re.compile(
    r'<meta\s+name=["\']post:(?P<key>[a-zA-Z]+)["\']\s+content=["\'](?P<value>.*?)["\']\s*/?>',
    re.IGNORECASE | re.DOTALL,
)

TITLE_FALLBACK_PATTERN = re.compile(r"<title>(.*?)</title>", re.IGNORECASE | re.DOTALL)


def read_meta(html_text: str) -> dict:
    meta = {}
    for match in META_PATTERN.finditer(html_text):
        key = match.group("key").lower()
        value = match.group("value").strip()
        meta[key] = value
    return meta


def build() -> list:
    articles = []

    if not POSTS_DIR.exists():
        print(f"No posts directory found at {POSTS_DIR}")
        return articles

    for category_dir in sorted(POSTS_DIR.iterdir()):
        if not category_dir.is_dir():
            continue

        category_key = category_dir.name.lower()
        category_label = CATEGORIES.get(category_key, category_dir.name.title())

        for html_file in sorted(category_dir.glob("*.html")):
            if html_file.name.startswith("_"):
                # Files prefixed with "_" (like _template.html) are skipped,
                # so you can keep a template inside a category folder if you want.
                continue

            text = html_file.read_text(encoding="utf-8", errors="ignore")
            meta = read_meta(text)

            title = meta.get("title")
            if not title:
                title_match = TITLE_FALLBACK_PATTERN.search(text)
                title = title_match.group(1).strip() if title_match else html_file.stem.replace("-", " ").title()

            date = meta.get("date", "")
            excerpt = meta.get("excerpt", "")
            image = meta.get("image", "")
            author = meta.get("author", "CryptoRocket")

            rel_path = html_file.relative_to(ROOT).as_posix()

            articles.append(
                {
                    "title": title,
                    "date": date,
                    "excerpt": excerpt,
                    "image": image,
                    "author": author,
                    "category": category_key,
                    "categoryLabel": category_label,
                    "url": rel_path,
                    "filename": html_file.name,
                }
            )

    def sort_key(article: dict):
        # Sort newest first; articles with no/invalid date sink to the bottom.
        return article["date"] or "0000-00-00"

    articles.sort(key=sort_key, reverse=True)
    return articles


def main() -> int:
    articles = build()
    OUTPUT_FILE.write_text(json.dumps(articles, indent=2), encoding="utf-8")
    print(f"Wrote {len(articles)} article(s) to {OUTPUT_FILE}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
