"""
stitch_video.py — Cut good scenes + stitch with 5 new partial scenes
====================================================================
Uses ffmpeg subprocess directly (NOT moviepy concat) to avoid white-screen bugs.

Segments:
  A: recorded_browser.webm  0s → start_of_scene_07  (Scenes 01-06)
  P: partial_scenes.webm    0s → end_of_scene_11     (Scenes 07-11)
  B: recorded_browser.webm  start_of_scene_12 → end  (Scene 12 Closing)

Full voiceover audio is rebuilt from the 13 individual MP3 files and muxed in.

Run: python 1_marketing/Demo_3_21/stitch_video.py
"""
import os, subprocess, tempfile
from moviepy.editor import AudioFileClip, concatenate_audioclips
from moviepy.config import get_setting

FFMPEG = get_setting("FFMPEG_BINARY")
print(f"[ffmpeg] Using: {FFMPEG}")


DEMO_DIR      = os.path.dirname(os.path.abspath(__file__))
V2_DIR        = os.path.join(DEMO_DIR, "v2")
VO_DIR        = os.path.join(DEMO_DIR, "voiceovers")
FULL_VIDEO    = os.path.join(V2_DIR, "recorded_browser.webm")
PARTIAL_VIDEO = os.path.join(V2_DIR, "partial_scenes.webm")
FINAL_OUT     = os.path.join(V2_DIR, "aumtech_ai_demo_final.mp4")

ALL_SCENES = [
    "01_Intro", "01B_Architecture", "02_SignIn", "03_Dashboard",
    "04_AINavigator", "05_Courses", "06_Tutoring",
    "07_Wellness", "08_Holds", "09_FinancialAid",
    "10_SocialCampus", "11_AdminPanel", "12_Closing"
]
PARTIAL_SCENES = [
    "07_Wellness", "08_Holds", "09_FinancialAid",
    "10_SocialCampus", "11_AdminPanel"
]

def get_audio_duration(scene):
    f = os.path.join(VO_DIR, f"{scene}.mp3")
    if os.path.exists(f):
        c = AudioFileClip(f); d = c.duration; c.close(); return d
    return 30.0

def run(cmd, label=""):
    if label: print(f"  [ffmpeg] {label}")
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  [STDERR] {r.stderr[-800:]}")
    return r.returncode

def stitch():
    print("\n[DURATIONS] Reading voiceover durations...")
    dur = {s: get_audio_duration(s) for s in ALL_SCENES}
    for s, d in dur.items():
        print(f"  {s}: {d:.2f}s")

    # Compute cut points
    t = 0.0
    starts = {}
    for s in ALL_SCENES:
        starts[s] = t
        t += dur[s]

    seg_a_start = 0.0
    seg_a_end   = starts["07_Wellness"]
    seg_b_start = starts["12_Closing"]
    seg_b_end   = seg_b_start + dur["12_Closing"] + 3
    partial_dur = sum(dur[s] for s in PARTIAL_SCENES)

    print(f"\n[PLAN]")
    print(f"  Seg A:       0.0s → {seg_a_end:.1f}s  from full  (Scenes 01-06, {seg_a_end:.0f}s)")
    print(f"  Seg Partial: 0.0s → {partial_dur:.1f}s  from partial (Scenes 07-11)")
    print(f"  Seg B:       {seg_b_start:.1f}s → {seg_b_end:.1f}s  from full  (Scene 12)")

    # Build full audio from MP3s
    print("\n[AUDIO] Building full audio track...")
    clips = [AudioFileClip(os.path.join(VO_DIR, f"{s}.mp3"))
             for s in ALL_SCENES if os.path.exists(os.path.join(VO_DIR, f"{s}.mp3"))]
    audio = concatenate_audioclips(clips)
    audio_path = os.path.join(V2_DIR, "_full_audio.aac")
    audio.write_audiofile(audio_path, codec="aac", logger=None)
    audio.close()
    print(f"  Audio: {audio_path}  ({audio.duration:.1f}s)")

    # Trim segments with ffmpeg → h264 mp4 (no audio)
    tmp = tempfile.mkdtemp()
    seg_a = os.path.join(tmp, "seg_a.mp4")
    seg_p = os.path.join(tmp, "seg_p.mp4")
    seg_b = os.path.join(tmp, "seg_b.mp4")

    print("\n[TRIM] Encoding segments with ffmpeg...")
    run([FFMPEG, "-y",
         "-ss", f"{seg_a_start:.3f}", "-to", f"{seg_a_end:.3f}",
         "-i", FULL_VIDEO,
         "-c:v", "libx264", "-preset", "fast", "-crf", "20",
         "-vf", "scale=1920:1080", "-an", seg_a],
        f"Seg A  0→{seg_a_end:.0f}s")

    run([FFMPEG, "-y",
         "-ss", "0", "-to", f"{partial_dur + 4:.3f}",
         "-i", PARTIAL_VIDEO,
         "-c:v", "libx264", "-preset", "fast", "-crf", "20",
         "-vf", "scale=1920:1080", "-an", seg_p],
        f"Seg Partial  0→{partial_dur:.0f}s")

    run([FFMPEG, "-y",
         "-ss", f"{seg_b_start:.3f}", "-to", f"{seg_b_end:.3f}",
         "-i", FULL_VIDEO,
         "-c:v", "libx264", "-preset", "fast", "-crf", "20",
         "-vf", "scale=1920:1080", "-an", seg_b],
        f"Seg B  {seg_b_start:.0f}→{seg_b_end:.0f}s")

    # Verify segments exist and have content
    for name, path in [("A", seg_a), ("Partial", seg_p), ("B", seg_b)]:
        size = os.path.getsize(path) if os.path.exists(path) else 0
        print(f"  Seg {name}: {size/1024/1024:.1f} MB")

    # Concat list
    concat_txt = os.path.join(tmp, "concat.txt")
    with open(concat_txt, "w") as f:
        f.write(f"file '{seg_a}'\nfile '{seg_p}'\nfile '{seg_b}'\n")

    # Concat video (stream copy — all are h264 mp4)
    silent = os.path.join(tmp, "silent.mp4")
    print("\n[CONCAT] Joining 3 segments...")
    run([FFMPEG, "-y", "-f", "concat", "-safe", "0",
         "-i", concat_txt, "-c", "copy", silent], "concat")

    size = os.path.getsize(silent) / 1024 / 1024
    print(f"  Concatenated video: {size:.1f} MB")

    # Mux with audio
    print(f"\n[MUX] -> {FINAL_OUT}")
    if os.path.exists(FINAL_OUT):
        os.remove(FINAL_OUT)
    run([FFMPEG, "-y",
         "-i", silent,
         "-i", audio_path,
         "-c:v", "copy", "-c:a", "aac",
         "-shortest", FINAL_OUT], "mux video+audio")

    size_mb = os.path.getsize(FINAL_OUT) / 1024 / 1024
    print(f"\n[DONE] {FINAL_OUT}  ({size_mb:.1f} MB)")

if __name__ == "__main__":
    stitch()
