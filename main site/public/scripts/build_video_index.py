#!/usr/bin/env python3
"""
build_video_index.py

Scans /videos/<category>/*.txt for a video link (YouTube or Vimeo) plus
optional overrides, fetches the title/thumbnail automatically from the
provider's oEmbed API, and writes a single /videos.json file that the
homepage (index.html) reads to render the video library.

This runs automatically via GitHub Actions on every push (see
.github/workflows/build-videos.yml), so you never touch this file or
videos.json by hand.

--------------------------------------------------------------------
TXT FILE FORMAT
--------------------------------------------------------------------
The simplest possible file is just a link, nothing else required:

    https://www.youtube.com/watch?v=dQw4w9WgXcQ

The title, thumbnail, and channel name are fetched automatically.

You can optionally add override lines below the link, key: value:

    https://www.youtube.com/watch?v=dQw4w9WgXcQ
    title: Custom title instead of the auto-fetched one
    date: 2026-07-06
    description: One or two sentence summary shown on the card.

If you skip "date", the file's git history / commit date isn't used —
videos with no date sort to the bottom, so add one if you want it
placed accurately in the newest-first order.

See videos/_example.txt for a ready-to-copy starting point.
"""

import json
import re
import sys
import urllib.request
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEOS_DIR = ROOT / "videos"
OUTPUT_FILE = ROOT / "videos.json"

CATEGORIES = {
    "sports": "Sports",
    "forex": "Forex",
    "crypto": "Crypto",
    "polymarket": "Polymarket",
}

URL_PATTERN = re.compile(r"https?://\S+")

YOUTUBE_ID_PATTERNS = [
    re.compile(r"(?:youtube\.com/watch\?v=|youtube\.com/shorts/|youtu\.be/|youtube\.com/embed/)([A-Za-z0-9_-]{6,})"),
]

VIMEO_ID_PATTERN = re.compile(r"vimeo\.com/(?:video/)?(\d+)")


def parse_txt(text: str) -> dict:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines:
        return {}

    url_match = None
    overrides = {}

    for line in lines:
        if url_match is None:
            found = URL_PATTERN.search(line)
            if found:
                url_match = found.group(0)
                continue
        if ":" in line:
            key, _, value = line.partition(":")
            overrides[key.strip().lower()] = value.strip()

    return {"url": url_match, **overrides}


def detect_provider(url: str):
    for pattern in YOUTUBE_ID_PATTERNS:
        m = pattern.search(url)
        if m:
            return "youtube", m.group(1)
    m = VIMEO_ID_PATTERN.search(url)
    if m:
        return "vimeo", m.group(1)
    return "external", None


def fetch_oembed(provider: str, url: str) -> dict:
    """Best-effort metadata fetch. Any failure just falls back gracefully."""
    if provider == "youtube":
        endpoint = "https://www.youtube.com/oembed?" + urllib.parse.urlencode({"url": url, "format": "json"})
    elif provider == "vimeo":
        endpoint = "https://vimeo.com/api/oembed.json?" + urllib.parse.urlencode({"url": url})
    else:
        return {}

    try:
        req = urllib.request.Request(endpoint, headers={"User-Agent": "cryptorocket-video-library/1.0"})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        return {
            "title": data.get("title", ""),
            "author": data.get("author_name", ""),
            "thumbnail": data.get("thumbnail_url", ""),
        }
    except Exception as exc:  # noqa: BLE001 — deliberately broad, this must never break the build
        print(f"  (oEmbed lookup failed for {url}: {exc})")
        return {}


def build_video_entry(txt_file: Path, category_key: str, category_label: str) -> dict | None:
    text = txt_file.read_text(encoding="utf-8", errors="ignore")
    parsed = parse_txt(text)
    url = parsed.get("url")

    if not url:
        print(f"  Skipping {txt_file} — no video URL found in file.")
        return None

    provider, video_id = detect_provider(url)
    meta = fetch_oembed(provider, url) if provider != "external" else {}

    title = parsed.get("title") or meta.get("title") or txt_file.stem.replace("-", " ").title()

    # YouTube thumbnails also live at a predictable static URL, so fall back
    # to that if the oEmbed call ever fails (rate limiting, network hiccup,
    # a restricted CI environment, etc.) rather than showing no image at all.
    fallback_thumbnail = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg" if provider == "youtube" else ""
    thumbnail = parsed.get("thumbnail") or meta.get("thumbnail") or fallback_thumbnail
    author = parsed.get("author") or meta.get("author") or "CryptoRocket"
    date = parsed.get("date", "")
    description = parsed.get("description", "")

    if provider == "youtube":
        embed_url = f"https://www.youtube.com/embed/{video_id}"
    elif provider == "vimeo":
        embed_url = f"https://player.vimeo.com/video/{video_id}"
    else:
        embed_url = ""

    return {
        "title": title,
        "date": date,
        "description": description,
        "author": author,
        "thumbnail": thumbnail,
        "provider": provider,
        "embedUrl": embed_url,
        "sourceUrl": url,
        "category": category_key,
        "categoryLabel": category_label,
        "slug": txt_file.stem,
    }


def build() -> list:
    videos = []

    if not VIDEOS_DIR.exists():
        print(f"No videos directory found at {VIDEOS_DIR}")
        return videos

    for category_dir in sorted(VIDEOS_DIR.iterdir()):
        if not category_dir.is_dir():
            continue

        category_key = category_dir.name.lower()
        category_label = CATEGORIES.get(category_key, category_dir.name.title())

        for txt_file in sorted(category_dir.glob("*.txt")):
            if txt_file.name.startswith("_"):
                continue
            print(f"Processing {txt_file} ...")
            entry = build_video_entry(txt_file, category_key, category_label)
            if entry:
                videos.append(entry)

    def sort_key(video: dict):
        return video["date"] or "0000-00-00"

    videos.sort(key=sort_key, reverse=True)
    return videos


def main() -> int:
    videos = build()
    OUTPUT_FILE.write_text(json.dumps(videos, indent=2), encoding="utf-8")
    print(f"Wrote {len(videos)} video(s) to {OUTPUT_FILE}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
