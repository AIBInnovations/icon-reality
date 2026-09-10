#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Generate an .avif twin beside every raster asset in public/.
#
# Originals are NEVER touched: <picture> serves the .avif to browsers that
# support it and falls back to the .jpg/.png for everything else, so quality
# and compatibility both stay where they were.
#
# Re-run after adding images. Existing twins are skipped unless the source is
# newer, so a re-run is cheap.
#
#   ./scripts/build-avif.sh            # convert anything missing or stale
#   ./scripts/build-avif.sh --force    # re-encode everything
# ---------------------------------------------------------------------------
set -uo pipefail
cd "$(dirname "$0")/.."

FORCE=""
[ "${1:-}" = "--force" ] && FORCE=1

# Quality per class. Photographs tolerate more compression than the canvas
# frame sequences, which are drawn at full-bleed and scrubbed frame by frame.
Q_PHOTO=68
Q_FRAME=63
Q_FLAT=76     # PNGs that are artwork/logos rather than photographs

convert_one() {
  local src="$1" q="$2"
  local out="${src%.*}.avif"

  if [ -z "${FORCE:-}" ] && [ -f "$out" ] && [ "$out" -nt "$src" ]; then
    echo "skip $out"; return
  fi

  magick "$src" -strip -quality "$q" -define heic:speed=4 "$out" 2>/dev/null || {
    echo "FAIL $src"; rm -f "$out"; return; }

  local so no
  so=$(stat -f%z "$src"); no=$(stat -f%z "$out")
  # An .avif that is no smaller than its source earns nothing and costs a
  # request; drop it and let <picture> fall through to the original.
  if [ "$no" -ge "$so" ]; then
    rm -f "$out"; echo "drop $src (avif ${no}B >= ${so}B)"; return
  fi
  echo "ok   $out  $((so/1024))KB -> $((no/1024))KB"
}
export -f convert_one
export FORCE

echo "== frame sequences =="
find public/frames public/about-frames -type f -iname '*.jpg' -print0 \
  | xargs -0 -P 8 -I{} bash -c 'convert_one "$@" '"$Q_FRAME" _ {}

# EVERY raster under public/, not just public/images. <picture> chooses a
# <source> by its type, never by whether the file is actually there, so a
# missing twin is not a graceful fallback: the browser commits to the AVIF,
# gets a 404 and renders a broken image. /icon-logo.png sat outside
# public/images and did exactly that to the header logo on every page.
echo "== photographs =="
find public -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' \) \
  -not -path 'public/frames/*' -not -path 'public/about-frames/*' -print0 \
  | xargs -0 -P 8 -I{} bash -c 'convert_one "$@" '"$Q_PHOTO" _ {}

echo "== flat artwork (png) =="
find public -type f -iname '*.png' -print0 \
  | xargs -0 -P 8 -I{} bash -c 'convert_one "$@" '"$Q_FLAT" _ {}

# The invariant the <picture> markup depends on. Anything listed here will
# render as a broken image wherever <Picture> points at it.
echo "== check: rasters with no .avif twin =="
missing=0
while IFS= read -r f; do
  [ -f "${f%.*}.avif" ] || { echo "  MISSING TWIN: $f"; missing=$((missing+1)); }
done < <(find public -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \))
[ "$missing" -eq 0 ] && echo "  all good" || echo "  $missing file(s) would break <picture>"
