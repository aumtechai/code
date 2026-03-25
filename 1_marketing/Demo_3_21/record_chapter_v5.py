import os
import sys
import asyncio
import json
import subprocess
import shutil
from playwright.async_api import async_playwright
from moviepy.editor import VideoFileClip, AudioFileClip

# ── CONFIGURATION ───────────────────────────────────────────────────────────
BASE_URL = "http://localhost:5173"  # Standard local dev port
# Absolute paths to avoid any nesting issues
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VO_DIR = os.path.join(BASE_DIR, "voiceovers")
V5_DIR = os.path.join(BASE_DIR, "v5")
AUTH_FILE = os.path.join(BASE_DIR, "auth_v4.json")

os.makedirs(V5_DIR, exist_ok=True)

def log(msg): print(f"[V5_REC] {msg}")

def get_audio_duration(name):
    path = os.path.join(VO_DIR, f"{name}.mp3")
    if not os.path.exists(path):
        log(f"  [WARN] Voiceover not found: {path}. Using default 10s.")
        return 10.0
    try:
        audio = AudioFileClip(path)
        dur = audio.duration
        audio.close()
        return dur
    except Exception as e:
        log(f"  [ERROR] Failed to read audio duration: {e}")
        return 10.0

def run_mux(raw_vid, vo_audio, out_path, target_dur):
    try:
        log(f"  [MUXING] {out_path}")
        video = VideoFileClip(raw_vid)
        audio = AudioFileClip(vo_audio)
        
        # Absolute Sync strategy:
        # Use the actual audio duration as the final clip length
        final_dur = audio.duration
        
        # If the video is slightly shorter than the audio, we freeze the last frame
        # If the video is longer, we trim it.
        if video.duration < final_dur:
            log(f"  [SYNC] Video is shorter than audio ({video.duration} < {final_dur}). Freezing last frame.")
            video = video.set_duration(final_dur)
        else:
            video = video.subclip(0, final_dur)
        
        # Audio should also match
        audio = audio.subclip(0, final_dur)
        
        final = video.set_audio(audio)
        # Use high quality and specific FPS for perfect sync
        final.write_videofile(out_path, codec="libx264", audio_codec="aac", fps=24, preset="medium", bitrate="5000k")
        video.close()
        audio.close()
        return True
    except Exception as e:
        log(f"[MUX ERROR] {str(e)}")
        return False

# ── Playwright Helpers ──────────────────────────────────────────────────────
async def wait(page, seconds, label=""):
    if label: log(f"  -> {label} ({seconds:.1f}s)")
    await asyncio.sleep(seconds)

async def scroll(page, distance, steps=30):
    for i in range(steps):
        await page.evaluate(f"window.scrollBy(0, {distance/steps})")
        await asyncio.sleep(0.05)

async def glow(page, selector):
    await page.evaluate(f"""(sel) => {{
        document.querySelectorAll(sel).forEach(el => {{
            el.style.transition = 'all 0.8s ease';
            el.style.boxShadow = '0 0 30px rgba(79, 70, 229, 0.8)';
            el.style.transform = 'scale(1.05)';
            setTimeout(() => {{
                el.style.boxShadow = '';
                el.style.transform = '';
            }}, 3000);
        }});
    }}""")

async def fill(page, selector, text, delay=50):
    await page.wait_for_selector(selector)
    await page.click(selector)
    await page.keyboard.type(text, delay=delay)

async def try_click(page, selector, label="", timeout=5000):
    try:
        await page.wait_for_selector(selector, timeout=timeout)
        await page.click(selector, force=True)
        log(f"  -> click: {label}")
        return True
    except Exception as e:
        log(f"  [skip click] {label} - {str(e)[:40]}")
        return False

async def inject_heartbeat(page):
    await page.evaluate("""() => {
        if (document.getElementById('__hb')) return;
        const d = document.createElement('div');
        d.id = '__hb';
        d.style.cssText = 'position:fixed;bottom:1px;right:1px;width:1px;height:1px;z-index:999999;pointer-events:none;background:transparent;';
        document.body.appendChild(d);
        let t = 0;
        (function tick() { d.style.opacity = (++t % 2 === 0) ? '1' : '0.99'; requestAnimationFrame(tick); })();
    }""")

# ── Scene Logic ─────────────────────────────────────────────────────────────
async def record_scene(name):
    audio_dur = get_audio_duration(name)
    vo_path = os.path.join(VO_DIR, f"{name}.mp3")
    final_out = os.path.join(V5_DIR, f"{name}.mp4")
    
    log("\n" + "="*80)
    log(f"[RECORDING] {name} | Real Audio Duration: {audio_dur:.2f}s")
    log("="*80)

    # Route selection
    target_url = BASE_URL + "/dashboard?stats=true"
    if name == "11_AdminPanel":
        target_url = BASE_URL + "/dashboard?admin=true&tab=adminPanel"
    elif name == "02_SignIn":
        target_url = BASE_URL + "/#/login"
    elif name in ["01_Intro", "01B_Architecture"]:
        target_url = "file://" + os.path.join(BASE_DIR, "intro_slides_v2.html")

    async with async_playwright() as pw:
        # Use headless=True for consistent background recording
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--disable-save-password-bubble",
                "--hide-scrollbars",
                "--disable-infobars",
                "--disable-notifications"
            ]
        )
        
        ctx = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1,
            record_video_dir=os.path.join(os.environ.get("TEMP", "/tmp"), "aura_recording")
        )
        page = await ctx.new_page()

        # Mocks (Context-wide)
        async def handle_route(route):
            url = route.request.url
            if "/api/users/me" in url:
                await route.fulfill(status=200, json={
                    "id": 10452, "full_name": "Daniel Garrett", "gpa": 3.5, "on_track_score": 87, 
                    "is_admin": True, "is_ednex_verified": True, "major": "Computer Science & Ethics",
                    "ai_insight": "Welcome back, Daniel. Your academic growth in the last semester puts you in the top 5% of your cohort."
                })
            elif "/api/auth/login" in url:
                await route.fulfill(status=200, json={"access_token": "demo_token_v5", "token_type": "bearer"})
            elif "/api/holds" in url:
                await route.fulfill(status=200, json=[{"id": 1, "title": "Academic Check-in", "severity": "Medium", "description": "Please confirm your graduation pathway choice."}])
            elif "/api/ednex/context" in url:
                await route.fulfill(status=200, json={
                    "status": "success",
                    "context": {
                        "student_profile": {"name": "Daniel Garrett"},
                        "sis_stream": {"cumulative_gpa": 3.5}
                    }
                })
            else:
                try: await route.continue_()
                except: pass

        await ctx.route("**/*", handle_route)

        # Start Recording
        await page.goto(target_url)
        await inject_heartbeat(page)
        
        # Buffer for video start
        await wait(page, 2, "Buffer")

        if name == "01_Intro":
            await page.evaluate("() => window.jumpToSlide(0)")
            await wait(page, audio_dur * 0.3, "Slide 1")
            await page.evaluate("() => window.jumpToSlide(1)")
            await wait(page, audio_dur * 0.3, "Slide 2")
            await page.evaluate("() => window.jumpToSlide(2)")
            await wait(page, audio_dur * 0.4 + 2, "Slide 3 & Buffer")
            
        elif name == "01B_Architecture":
            await page.evaluate("() => window.jumpToSlide(4)")
            await wait(page, audio_dur + 2, "Architecture Detail")

        elif name == "02_SignIn":
            await fill(page, "#email", "daniel.garrett12@txu.edu")
            await wait(page, 0.8)
            await fill(page, "#password", "password123")
            await wait(page, 1.2)
            await page.click("button[type='submit']")
            # Wait for scores to confirm success
            await page.wait_for_selector(".stat-card-glass")
            log("  -> Dashboard loaded successfully")
            await wait(page, max(2, audio_dur - 8), "Post-Login view")

        elif name == "03_Dashboard":
            await page.wait_for_selector(".stat-card-glass")
            await glow(page, ".stat-card-glass")
            await wait(page, 4, "Highlighting scores")
            await scroll(page, 450)
            await wait(page, audio_dur - 3, "Scrolling features")
            await scroll(page, 0)

        elif name == "11_AdminPanel":
            await page.wait_for_selector("button:has-text('Form Requests')")
            await wait(page, 4, "Dean's view")
            await try_click(page, "button:has-text('Form Requests')", "Forms Manager")
            await wait(page, 6, "Reviewing requests")
            await page.evaluate("() => window.__setAdminSection && window.__setAdminSection('analytics')")
            await wait(page, 10, "Institutional Intelligence")
            await wait(page, audio_dur - 18, "Finalize Admin")

        else:
            # General fallback for other chapters
            await wait(page, audio_dur + 2, "Generic Scene Capture")

        # Cleanup & Mux
        raw_vid_path = await page.video.path()
        await ctx.close()
        await browser.close()
        
        if os.path.exists(final_out): os.remove(final_out)
        run_mux(raw_vid_path, vo_path, final_out, audio_dur)

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "all"
    
    # List of all standard scenes
    all_scenes = [
        "01_Intro", "01B_Architecture", "02_SignIn", "03_Dashboard", 
        "04_AINavigator", "05_Courses", "06_Tutoring", "07_Wellness", 
        "08_Holds", "09_FinancialAid", "10_SocialCampus", "11_AdminPanel", "12_Closing"
    ]
    
    if target == "all":
        for s in all_scenes:
            asyncio.run(record_scene(s))
    else:
        asyncio.run(record_scene(target))
