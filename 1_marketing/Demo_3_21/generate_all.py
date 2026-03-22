"""
generate_all.py — Unified aumtech.ai Demo Generation Pipeline (v3)
==================================================================
1. Generate / refresh Voiceovers (edge-tts)
2. Capture Video — single-session v3 recorder, URL-nav based
3. Mix final video — audio layered over recorded video

Run: python 1_marketing/Demo_3_21/generate_all.py
"""
import subprocess, sys, os
from moviepy.editor import AudioFileClip, concatenate_audioclips, VideoFileClip
from moviepy.config import get_setting

DEMO_DIR = os.path.dirname(os.path.abspath(__file__))
V2_DIR   = os.path.join(DEMO_DIR, "v2")
FFMPEG   = get_setting("FFMPEG_BINARY")

ALL_SCENES = [
    "01_Intro", "01B_Architecture", "02_SignIn", "03_Dashboard",
    "04_AINavigator", "05_Courses", "06_Tutoring", "07_Wellness",
    "08_Holds", "09_FinancialAid", "10_SocialCampus", "11_AdminPanel",
    "12_Closing"
]

def run_step(name, script, args=[]):
    print(f"\n{'='*60}\n[STEP] {name}\n{'='*60}")
    cmd = [sys.executable, os.path.join(DEMO_DIR, script)] + args
    result = subprocess.run(cmd)
    if result.returncode != 0:
        print(f"\n[ERROR] Step '{name}' failed with code {result.returncode}")
        sys.exit(result.returncode)

def mix_final():
    """Layer full voiceover audio over the recorded video using ffmpeg."""
    print(f"\n{'='*60}\n[STEP] Final Mix\n{'='*60}")
    vo_dir   = os.path.join(DEMO_DIR, "voiceovers")
    video_in = os.path.join(V2_DIR, "recorded_browser.webm")
    audio_out = os.path.join(V2_DIR, "_full_audio.aac")
    final_out = os.path.join(V2_DIR, "aumtech_ai_demo_v3.mp4")

    # Build full audio track
    print("[AUDIO] Concatenating voiceover MP3s...")
    clips = []
    for s in ALL_SCENES:
        f = os.path.join(vo_dir, f"{s}.mp3")
        if os.path.exists(f):
            c = AudioFileClip(f)
            print(f"  -> {s}: {c.duration:.2f}s")
            clips.append(c)
    audio = concatenate_audioclips(clips)
    audio.write_audiofile(audio_out, codec="aac", logger=None)
    audio.close()
    print(f"  Audio total: {audio.duration:.1f}s -> {audio_out}")

    # Check video
    v = VideoFileClip(video_in)
    print(f"[VIDEO] {video_in}: {v.duration:.1f}s  {v.w}x{v.h}")
    v.close()

    # Mux with ffmpeg (stream-copy video, replace audio)
    print(f"[MUX] -> {final_out}")
    if os.path.exists(final_out):
        os.remove(final_out)
    result = subprocess.run([
        FFMPEG, "-y",
        "-i", video_in,
        "-i", audio_out,
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-c:a", "aac",
        "-vf", "scale=1920:1080",
        "-shortest",
        final_out
    ], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"[WARN] ffmpeg stderr: {result.stderr[-800:]}")
    size = os.path.getsize(final_out) / 1024 / 1024
    print(f"\n[DONE] {final_out}  ({size:.1f} MB)")

if __name__ == "__main__":
    # Step 1: Generate voiceovers (skip if all present with --skip-tts)
    if "--skip-tts" not in sys.argv:
        run_step("TTS Generation", "generate_voiceover.py")
    else:
        print("\n[SKIP] TTS — using existing voiceover files")

    # Step 2: Record (single-session v3)
    run_step("Browser Capture (v3)", "record_demo_v3.py")

    # Step 3: Mix
    mix_final()

    print("\n" + "=" * 60)
    print("  ALL STEPS COMPLETE!")
    print(f"  Final Video -> {os.path.join(V2_DIR, 'aumtech_ai_demo_v3.mp4')}")
    print("=" * 60)
