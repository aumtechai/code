"""
generate_all.py — Unified aumtech.ai Demo Generation Pipeline
=============================================================
1. Generate Voiceovers (edge-tts)
2. Capture Video (Playwright, synced to audio length)
3. Mix Final Video (moviepy)

Run: python demo/generate_all.py
"""
import subprocess
import sys
import os

DEMO_DIR = os.path.dirname(os.path.abspath(__file__))

def run_step(name, script, args=[]):
    print(f"\n{'='*60}\n[STEP] {name}\n{'='*60}")
    cmd = [sys.executable, os.path.join(DEMO_DIR, script)] + args
    try:
        subprocess.check_call(cmd)
    except subprocess.CalledProcessError as e:
        print(f"\n[ERROR] Step '{name}' failed with code {e.returncode}")
        sys.exit(e.returncode)

if __name__ == "__main__":
    # 1. Generate Voiceovers
    run_step("TTS Generation", "generate_voiceover.py")
    
    # 2. Record Video (Synced automatically)
    # Pass --play to hear it while recording if you want
    run_step("Browser Capture", "record_demo_v2.py")
    
    # 3. Mix
    run_step("Final Mix", "mix_demo_v2.py")
    
    print("\n" + "="*60)
    print("  ALL STEPS COMPLETE!")
    print(f"  Final Video -> demo/v2/aumtech_ai_demo_v2.mp4")
    print("="*60)
