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
VO_DIR = r"1_marketing\Demo_3_21\voiceovers"
V5_DIR = r"1_marketing\Demo_3_21\v5"
AUTH_FILE = r"1_marketing\Demo_3_21\auth_v4.json"

os.makedirs(V5_DIR, exist_ok=True)

# Audio durations
DURS = {
    "01_Intro": 14.5, "01B_Architecture": 15.2, "02_SignIn": 11.8,
    "03_Dashboard": 28.4, "04_AINavigator": 14.2, "05_Courses": 24.5,
    "06_Tutoring": 32.1, "07_Wellness": 21.4, "08_Holds": 18.2,
    "09_FinancialAid": 26.7, "10_SocialCampus": 22.4, "11_AdminPanel": 45.7,
    "12_Closing": 12.5
}

def log(msg): print(f"[V5_REC] {msg}")

def run_mux(raw_vid, vo_audio, out_path, dur):
    try:
        log(f"  [MUXING] {out_path} ({dur}s)")
        video = VideoFileClip(raw_vid)
        audio = AudioFileClip(vo_audio)
        
        # Ensure they match duration
        final_dur = min(video.duration, dur)
        video = video.subclip(0, final_dur)
        
        # audio might be slightly different
        audio = audio.subclip(0, min(audio.duration, final_dur))
        
        final = video.set_audio(audio)
        final.write_videofile(out_path, codec="libx264", audio_codec="aac", fps=24)
        video.close()
        audio.close()
        return True
    except Exception as e:
        log(f"[MUX ERROR] {str(e)}")
        return False

# ── Playwright Helpers ──────────────────────────────────────────────────────
async def wait(page, seconds, label=""):
    if label: log(f"  -> {label} ({seconds}s)")
    await asyncio.sleep(seconds)

async def scroll(page, distance, steps=20):
    for i in range(steps):
        await page.evaluate(f"window.scrollBy(0, {distance/steps})")
        await asyncio.sleep(0.05)

async def glow(page, selector):
    await page.evaluate(f"""(sel) => {{
        document.querySelectorAll(sel).forEach(el => {{
            el.style.transition = 'all 0.8s ease';
            el.style.boxShadow = '0 0 30px rgba(79, 70, 229, 0.8)';
            el.style.transform = 'scale(1.02)';
            setTimeout(() => {{
                el.style.boxShadow = '';
                el.style.transform = '';
            }}, 2500);
        }});
    }}""")

async def fill(page, selector, text, delay=50):
    await page.wait_for_selector(selector)
    await page.click(selector)
    for char in text:
        await page.keyboard.press(char)
        await asyncio.sleep(delay/1000)

async def try_click(page, selector, label="", timeout=4000):
    try:
        try:
            await page.wait_for_selector(selector, timeout=timeout)
            await page.click(selector, force=True)
            log(f"  -> click: {label}")
        except Exception:
            # Fallback to inclusive JS text search click
            if "has-text(" in selector:
                text_match = selector.split("has-text(")[1].rstrip(")").strip("'\"")
            elif "text=" in selector:
                text_match = selector.split("text=")[1].strip("'\"")
            else:
                text_match = ""
            
            if text_match:
                found = await page.evaluate("""(txt) => {
                    const all = Array.from(document.querySelectorAll('button, a, div, span, label, li'));
                    const target = txt.toLowerCase();
                    const el = all.find(e => {
                        const content = e.textContent?.toLowerCase() || "";
                        return (content.trim() === target) || (content.includes(target) && e.children.length > 0);
                    });
                    if (el) {
                        el.scrollIntoView();
                        el.click();
                        return true;
                    }
                    return false;
                }""", text_match)
                if not found: raise Exception("No element found by text")
            else:
                clean_sel = selector.replace('"', '\\"')
                await page.evaluate(f'const el = document.querySelector("{clean_sel}"); if(el) el.click();')
            log(f"  -> JS click: {label}")
        return True
    except Exception as e:
        log(f"  [skip click] {label} - JS fallback failed: {str(e)[:50]}")
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
    audio_dur = DURS.get(name, 10.0)
    vo_path = os.path.join(VO_DIR, f"{name}.mp3")
    final_out = os.path.join(V5_DIR, f"{name}.mp4")
    
    log("\n" + "="*60)
    log(f"[RECORDING CHAPTER V5] {name}  (Audio: {audio_dur:.1f}s)")
    log("="*60)

    # V5 strategy: Use 'stats' bypass for most, 'admin' for Ch 11.
    target_url = BASE_URL + "/dashboard?stats=true"
    if name == "11_AdminPanel":
        target_url = BASE_URL + "/dashboard?admin=true&tab=adminPanel"
    elif name == "02_SignIn" or name == "01_Intro" or name == "01B_Architecture":
        target_url = BASE_URL # Show Login screen or root

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=False,
            args=["--no-sandbox", "--disable-setuid-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1", "--disable-web-security"]
        )
        
        ctx = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1,
            record_video_dir="/tmp/v5_raw_vids"
        )
        page = await ctx.new_page()

        # Route mocks for consistent data
        async def handle_route(route):
            url = route.request.url
            if "/api/users/me" in url:
                await route.fulfill(status=200, json={
                    "id": 10452, "full_name": "Daniel Garrett", "gpa": 3.5, "on_track_score": 87, "is_admin": True
                })
            elif "/api/admin/students" in url:
                await route.fulfill(status=200, json=[
                    {"id": 1, "name": "Sarah Miller", "gpa": 3.8, "risk": "Low"},
                    {"id": 2, "name": "John Davis", "gpa": 1.9, "risk": "High"},
                    {"id": 3, "name": "Elena Rodriguez", "gpa": 2.4, "risk": "Medium"}
                ])
            else:
                try: await route.continue_()
                except: pass

        await page.route("**/*", handle_route)

        await page.goto(target_url)
        await inject_heartbeat(page)
        await wait(page, 2, "initial load")

        # Scene Sequence Logics
        if name == "01_Intro" or name == "01B_Architecture":
            await wait(page, audio_dur)
            
        elif name == "02_SignIn":
            await fill(page, "input[type='email']", "dean@university.edu")
            await wait(page, 0.5)
            await fill(page, "input[type='password']", "admin123")
            await wait(page, 1)
            await page.click("button:has-text('Sign In')")
            await wait(page, audio_dur - 3)

        elif name == "03_Dashboard":
            await wait(page, 5, "viewing stats")
            await scroll(page, 500)
            await wait(page, 5)
            await scroll(page, 0)
            await wait(page, audio_dur - 13)

        elif name == "11_AdminPanel":
            await wait(page, 5, "Dean Garrett view")
            await scroll(page, 450)
            await wait(page, 6, "Risk Assessment")
            await scroll(page, 0)
            await page.evaluate("() => window.__setAdminSection && window.__setAdminSection('analytics')")
            await wait(page, 10, "Intelligence Dashboard")
            await scroll(page, 400)
            await wait(page, 6, "Tutoring Insights")
            await scroll(page, 0)
            await page.evaluate("() => window.__setAdminSection && window.__setAdminSection('campaigns')")
            await wait(page, audio_dur - 35)

        else:
            await wait(page, audio_dur)

        # Teardown
        raw_vid_path = await page.video.path()
        await ctx.close()
        await browser.close()
        
        # Muxing
        if os.path.exists(final_out): os.remove(final_out)
        run_mux(raw_vid_path, vo_path, final_out, audio_dur)
        
if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "all"
    if target == "all":
        for scene in DURS.keys():
            asyncio.run(record_scene(scene))
    else:
        asyncio.run(record_scene(target))
