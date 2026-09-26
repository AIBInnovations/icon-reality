#!/usr/bin/env python3
"""
Build the home page hero montage from the project films on Icon Realty's own
YouTube channel (https://www.youtube.com/@iconrealtyofficial).

    python3 scripts/build-hero-montage.py

Needs ffmpeg, ImageMagick (`magick`, for the AVIF posters), yt-dlp
(`pip install yt-dlp`) and Node, which yt-dlp uses to answer YouTube's player
challenge. Only the few seconds each clip needs are fetched, at the best
resolution the film exists in (1080p, 720p for Saatvik Vihar), into a cache
outside the repo (WORK, default: the system temp dir).

Writes to public/video/hero/:
    montage-av1.mp4, montage.mp4                       1920x1080, landscape screens
    montage-portrait-av1.mp4, montage-portrait.mp4     720x1280, portrait screens (a centre crop)
    poster.jpg / .avif, poster-portrait.jpg / .avif

Every clip runs CLIP seconds and crossfades into the next over FADE, so a new
clip is fully on screen every STEP = CLIP - FADE seconds. The last clip also
crossfades back into the first, and the film is trimmed so that its end meets
its start exactly: it loops with no visible jump. HeroMontage.jsx opens the
film at a random clip, at k * STEP; keep its STEP and COUNT in step with these,
and bump its ASSET_REV after a rebuild (/video is cached immutable).

Choosing clips: only project films (walkthroughs and project promos), never
the podcast, testimonials or market round-ups. Every clip sits inside a single
camera shot, clear of title cards, captions and on-screen graphics. Where a
film burns a caption or a studio watermark into the bottom-right corner, the
clip is cropped just enough to lose it (`crop` below); the portrait cut is a
centre crop and never reaches that corner.
"""
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'video', 'hero')
WORK = os.environ.get('WORK', os.path.join(tempfile.gettempdir(), 'icon-hero-montage'))
SEGMENTS = os.path.join(WORK, 'segments')

CLIP = 3.2      # seconds per clip, including the crossfade overlap
FADE = 0.7      # crossfade
STEP = CLIP - FADE
PAD = 0.5       # extra fetched either side of each clip
FPS = 30
# Chosen by comparing 100% crops against the master: the YouTube sources are
# the ceiling, and below these settings the files only grow. AV1 goes to the
# browsers that can decode it (Chrome, Edge, Firefox, Android, recent Safari),
# H.264 to everything else.
AV1_CRF = 48
H264_CRF = {'landscape': 32, 'portrait': 31}

# Where a corner mark sits, the clip is cropped to stay clear of it:
#   ('above', y)   keep only what is above y, full width ratio kept (1920x1080 space)
#   ('left', x)    keep only what is left of x
# (source video id, project, start in seconds, shot, crop)
CLIPS = [
    ('5XdvKOCYIw8', 'oscar-palace',       38.0, 'palace gate',          ('above', 928)),  # "Main Entrance"
    ('nkHZ3F6TPNw', 'oscar-fort',         55.6, 'carved doors opening', None),
    ('JEcdrOBb_n0', 'iit-greens',         74.2, 'entrance sign',        ('above', 972)),  # Icon watermark
    ('0Ik3F_zIxA8', 'saatvik-vihar',      15.2, 'gate through foliage', None),
    ('5XdvKOCYIw8', 'oscar-palace',       22.0, 'jharokha facade',      None),
    ('KAA7H5lI6BE', 'eden-garden',        83.2, 'aerial of plots',      ('above', 932)),  # studio watermark
    ('xMjK-KgUOpg', 'labham-city',        87.4, 'aerial of garden',     None),
    ('_L54jc381DQ', 'siddhayatan',        92.6, 'gate',                 ('left', 1560)),  # studio watermark
    ('VxQHlYmZFcI', 'oscar-billionaire',   7.6, 'top-down drone',       None),
    ('nkHZ3F6TPNw', 'oscar-fort',         16.5, 'aerial',               None),
    ('5XdvKOCYIw8', 'oscar-palace',      114.8, 'chhatri fountain',     ('above', 930)),  # "Park 02 Lawn"
    ('0Ik3F_zIxA8', 'saatvik-vihar',      36.8, 'flowering garden',     None),
    ('KAA7H5lI6BE', 'eden-garden',       127.1, 'gazebo',               ('above', 934)),  # studio watermark
    ('xMjK-KgUOpg', 'labham-city',        61.5, 'statue roundabout',    None),
    ('_L54jc381DQ', 'siddhayatan',       150.0, 'fountain',             ('left', 1560)),  # studio watermark
    ('JEcdrOBb_n0', 'iit-greens',         78.2, 'gate arch',            ('above', 972)),  # Icon watermark
]

# YouTube sometimes answers with a reduced format list; pin the best one where
# it matters. Saatvik Vihar's walkthrough only exists up to 720p.
FORMAT = {'5XdvKOCYIw8': '137', '0Ik3F_zIxA8': '136'}
DEFAULT_FORMAT = 'bv*[height<=1080][vcodec^=avc1]/bv*[height<=1080]'

YTDLP = [sys.executable, '-m', 'yt_dlp', '--js-runtimes', 'node', '--remote-components', 'ejs:github',
         '--no-warnings', '-q']


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)


def segment_path(vid, start):
    return os.path.join(SEGMENTS, f'{vid}_{start:.2f}.mp4')


def fetch_segments():
    """Fetch each clip's seconds (plus PAD either side) as a near-lossless intermediate."""
    os.makedirs(SEGMENTS, exist_ok=True)
    urls = {}
    for vid, project, start, shot, _ in CLIPS:
        path = segment_path(vid, start)
        if os.path.exists(path):
            continue
        if vid not in urls:
            urls[vid] = run(YTDLP + ['-g', '-f', FORMAT.get(vid, DEFAULT_FORMAT),
                                     f'https://www.youtube.com/watch?v={vid}'],
                            capture_output=True, text=True).stdout.split()[0]
        print(f'fetch  {project:18} {shot:22} {vid} @ {start}s')
        # input seek + re-encode: starts exactly at start - PAD, fetching only that byte range
        run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{start - PAD:.3f}', '-i', urls[vid],
             '-t', f'{CLIP + 2 * PAD:.3f}', '-an', '-c:v', 'libx264', '-crf', '10', '-preset', 'veryfast', path])


def landscape_crop(crop):
    if crop is None:
        return 'null'
    side, edge = crop
    if side == 'above':           # full-ratio window, top-anchored, centred across
        h = edge
        w = round(h * 16 / 9)
        return f'crop={w}:{h}:{(1920 - w) // 2}:0'
    if side == 'left':            # full-ratio window, left-anchored, centred down
        w = edge
        h = round(w * 9 / 16)
        return f'crop={w}:{h}:0:{(1080 - h) // 2}'
    raise ValueError(crop)


def build(kind):
    # the first clip again at the end, so the loop point crossfades as well
    seq = CLIPS + CLIPS[:1]
    cmd = ['ffmpeg', '-v', 'error', '-y']
    for vid, _, start, _, _ in seq:
        cmd += ['-i', segment_path(vid, start)]

    graph = []
    for i, (_, _, _, _, crop) in enumerate(seq):
        chain = (f'[{i}:v]trim={PAD}:{PAD + CLIP},setpts=PTS-STARTPTS,fps={FPS},'
                 'scale=1920:1080:flags=lanczos,')
        if kind == 'landscape':
            chain += f'{landscape_crop(crop)},scale=1920:1080:flags=lanczos'
        else:
            chain += 'crop=608:1080:656:0,scale=720:1280:flags=lanczos'
        graph.append(chain + f',setsar=1,format=yuv420p[v{i}]')

    prev = 'v0'
    for i in range(1, len(seq)):
        graph.append(f'[{prev}][v{i}]xfade=transition=fade:duration={FADE}:offset={i * STEP:.3f}[x{i}]')
        prev = f'x{i}'
    # Drop the first FADE seconds: the film now ends on the exact frame it starts on.
    count = len(CLIPS)
    graph.append(f'[{prev}]trim={FADE}:{FADE + count * STEP:.3f},setpts=PTS-STARTPTS[out]')

    # Near-lossless master; the delivery encodes are made from it (encode()).
    master = os.path.join(WORK, f'master-{kind}.mp4')
    cmd += ['-filter_complex', ';'.join(graph), '-map', '[out]', '-an',
            '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '12', '-pix_fmt', 'yuv420p', master]
    print(f'master {kind}')
    run(cmd)

    poster = 'poster.jpg' if kind == 'landscape' else 'poster-portrait.jpg'
    run(['ffmpeg', '-v', 'error', '-y', '-ss', '0', '-i', master, '-frames:v', '1',
         '-q:v', '3', os.path.join(OUT, poster)])
    # the same encoder settings scripts/build-avif.sh uses for photographs
    run(['magick', os.path.join(OUT, poster), '-strip', '-quality', '68', '-define', 'heic:speed=4',
         os.path.join(OUT, poster.replace('.jpg', '.avif'))])
    return master


# A fixed GOP of one clip (STEP seconds) puts a keyframe exactly where every
# clip starts, so the random start in HeroMontage.jsx always lands on one.
GOP = str(round(STEP * FPS))


def encode(master, name, codec, quality):
    out = os.path.join(OUT, name)
    if codec == 'h264':
        args = ['-c:v', 'libx264', '-preset', 'slower', '-crf', str(quality), '-profile:v', 'high',
                '-g', GOP, '-keyint_min', GOP, '-sc_threshold', '0']
    else:  # av1
        args = ['-c:v', 'libsvtav1', '-preset', '5', '-crf', str(quality), '-g', GOP,
                '-svtav1-params', 'scd=0:tune=0']
    print(f'encode {name}')
    run(['ffmpeg', '-v', 'error', '-y', '-i', master, '-an', *args, '-pix_fmt', 'yuv420p',
         '-movflags', '+faststart', out])


def main():
    os.makedirs(OUT, exist_ok=True)
    fetch_segments()
    landscape = build('landscape')
    portrait = build('portrait')
    encode(landscape, 'montage-av1.mp4', 'av1', AV1_CRF)
    encode(landscape, 'montage.mp4', 'h264', H264_CRF['landscape'])
    encode(portrait, 'montage-portrait-av1.mp4', 'av1', AV1_CRF)
    encode(portrait, 'montage-portrait.mp4', 'h264', H264_CRF['portrait'])
    print(f'\n{len(CLIPS)} clips, a new one every {STEP:.1f}s, {len(CLIPS) * STEP:.1f}s loop')
    for name in sorted(os.listdir(OUT)):
        print(f'  {name:24} {os.path.getsize(os.path.join(OUT, name)) / 1e6:6.2f} MB')


if __name__ == '__main__':
    main()
