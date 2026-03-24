import os
import sys
import time
import asyncio
import json
import subprocess
from playwright.async_api import async_playwright

# ── CONFIGURATION ───────────────────────────────────────────────────────────
BASE_URL = "https://www.aumtech.ai"
# Use absolute paths for stability on Windows background tasks
VO_DIR = r"C:\Projects\AA\at\1_marketing\Demo_3_21\voiceovers"
V4_DIR = r"C:\Projects\AA\at\1_marketing\Demo_3_21\v4"
AUTH_FILE = r"C:\Projects\AA\at\1_marketing\Demo_3_21\v4\v4_auth.json"
MOCK_FILE = r"C:\Projects\AA\at\1_marketing\Demo_3_21\auth_v4.json" # Fallback if local exists
SLIDES_URL = "file:///" + os.path.abspath(r"1_marketing\Demo_3_21\intro_slides_v2.html").replace("\\", "/")

os.makedirs(V4_DIR, exist_ok=True)
from moviepy.editor import VideoFileClip, AudioFileClip

# Audio durations (extracted manually or via script) - for sync
DURS = {
    "01_Intro": 72.5, "01B_Architecture": 56.4, "02_SignIn": 22.0,
    "03_Dashboard": 49.4, "04_AINavigator": 61.3, "05_Courses": 34.9,
    "06_Tutoring": 62.6, "07_Wellness": 30.1, "08_Holds": 29.4,
    "09_FinancialAid": 39.3, "10_SocialCampus": 29.1, "11_AdminPanel": 45.7,
    "12_Closing": 36.7
}

def log(msg):
    print(f"[V4_REC] {msg}", flush=True)

def get_dur(name): return DURS.get(name, 10.0)

def run_mux(raw_vid, vo_audio, out_path, dur):
    try:
        log(f"  [MUXING] {out_path} ({dur}s)")
        video = VideoFileClip(raw_vid)
        audio = AudioFileClip(vo_audio)
        
        final_dur = min(video.duration, dur)
        video = video.subclip(0, final_dur)
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
            # Fallback to JS text search click
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

# ── Scene Logics ─────────────────────────────────────────────────────────────
async def record_scene(name):
    audio_dur = get_dur(name)
    vo_path = os.path.join(VO_DIR, f"{name}.mp3")
    final_out = os.path.join(V4_DIR, f"{name}.mp4")
    
    log("\n" + "="*60)
    log(f"[RECORDING CHAPTER] {name}  (Audio: {audio_dur:.1f}s)")
    log("="*60)

    needs_auth = (name not in [
        "01_Intro", "01B_Architecture", "12_Closing", "02_SignIn", "11_AdminPanel", 
        "03_Dashboard", "06_Tutoring", "04_AINavigator", "05_Courses", 
        "07_Wellness", "08_Holds", "09_FinancialAid", "10_SocialCampus"
    ])
    if needs_auth and not os.path.exists(AUTH_FILE):
        log(f"[ERROR] {AUTH_FILE} not found. Please run 'python record_chapter_v4.py 02_SignIn' first!")
        sys.exit(1)

    async with async_playwright() as pw:
        target_url = BASE_URL
        if name in ["01_Intro", "01B_Architecture", "12_Closing"]:
            target_url = SLIDES_URL
        elif name == "11_AdminPanel":
            target_url += "/?admin=true&tab=adminPanel#/dashboard"
        elif name == "03_Dashboard":
            target_url += "/?stats=true#/dashboard"
        elif name == "04_AINavigator":
            target_url += "/?stats=true&tab=chat#/dashboard"
        elif name == "05_Courses":
            # Using degree-roadmap as the primary view for this chapter
            target_url += "/?stats=true&tab=degree-roadmap#/dashboard"
        elif name == "06_Tutoring":
            target_url += "/?stats=true&tab=tutoring#/dashboard"
        elif name == "07_Wellness":
            target_url += "/?stats=true&tab=wellness#/dashboard"
        elif name == "08_Holds":
            target_url += "/?stats=true&tab=holds#/dashboard"
        elif name == "09_FinancialAid":
            target_url += "/?stats=true&tab=financial#/dashboard"
        elif name == "10_SocialCampus":
            target_url += "/?stats=true&tab=social#/dashboard"

        browser = await pw.chromium.launch(
            headless=False,
            args=[
                "--no-sandbox", "--disable-setuid-sandbox", "--hide-scrollbars",
                "--force-device-scale-factor=1",
                "--disable-web-security",
                "--disable-save-password-bubble", "--password-store=basic"
            ]
        )
        
        ctx_args = {
            "viewport": {"width": 1920, "height": 1080},
            "device_scale_factor": 1,
            "record_video_dir": "/tmp/playwright_vids"
        }
        if needs_auth:
            ctx_args["storage_state"] = AUTH_FILE
            
        ctx = await browser.new_context(**ctx_args)
        page = await ctx.new_page()

        # ── BRUTE FORCE MOCKS REMOVED - USING LIVE SITE DATA ─────────────

        # API MOCKS REMOVED - USING LIVE SITE API
        pass

        # ── NAVIGATION ──────────────────────────────────────────────────────
        await inject_heartbeat(page)
        
        # Determine if we need to load storage state
        use_auth = name not in ["01_Intro", "01B_Architecture", "12_Closing", "02_SignIn"]
        
        # Load page - use domcontentloaded for production to avoid tracker hangs
        await page.goto(target_url, wait_until="domcontentloaded", timeout=60000)
        await wait(page, 10, "initial load")
        
        # Verification & Auto-Login Fallback
        if use_auth:
            try:
                # Check for dashboard markers
                await page.wait_for_selector("text=3.5", timeout=12000)
                log("  -> [OK] Session active (found GPA 3.5)")
            except:
                log("  -> [RE-LOGIN] Session invalid or expired. Performing emergency login.")
                await page.goto(f"{BASE_URL}/#/login")
                await fill(page, "input[type='email']", "daniel.garrett12@txu.edu")
                await fill(page, "input[type='password']", "password123")
                await page.click("button:has-text('Sign In')")
                await page.wait_for_url("**/dashboard**", timeout=40000)
                await page.goto(target_url) # Return to desired tab
                await wait(page, 5, "tab re-loaded")

        # ── SCENE LOGIC ─────────────────────────────────────────────────────
        if name == "01_Intro":
            await wait(page, 20, "slide 0: fragmented maze")
            await page.evaluate("window.jumpToSlide(1)")
            await wait(page, 16, "slide 1: high cost")
            await page.evaluate("window.jumpToSlide(2)")
            await wait(page, 20, "slide 2: meet aura")
            await page.evaluate("window.jumpToSlide(3)")
            await wait(page, max(0, audio_dur - 56))

        elif name == "01B_Architecture":
            await page.evaluate("window.jumpToSlide(4)")
            await wait(page, audio_dur)
        elif name == "02_SignIn":
            await fill(page, "input[type='email']", "daniel.garrett12@txu.edu")
            await wait(page, 0.5)
            await fill(page, "input[type='password']", "password123")
            await wait(page, 1, "credentials entered")
            await page.click("button:has-text('Sign In')")
            await page.wait_for_url("**/dashboard**", timeout=40000)
            await wait(page, 5, "dashboard loaded")
            # Log verification but don't fail as it breaks the sequence
            try:
                await page.wait_for_selector(".hero-card", timeout=15000)
                await page.wait_for_selector("text=3.5", timeout=10000)
                log("  -> [OK] Verified dashboard and GPA")
            except:
                log("  -> [WARN] Could not verify dashboard elements in time")
            
            await ctx.storage_state(path=AUTH_FILE)
            log(f"  -> Saved Auth State to {AUTH_FILE}")
            await wait(page, max(0, audio_dur - 15))

        elif name == "03_Dashboard":
            await wait(page, 5, "viewing dashboard")
            await scroll(page, 500)
            await wait(page, 5)
            await scroll(page, 0)
            await wait(page, audio_dur - 13)

        elif name == "05_Courses":
            await wait(page, 5, "viewing roadmap")
            await scroll(page, 500)
            await wait(page, 5, "viewing semesters")
            await scroll(page, 0)
            await wait(page, max(0, audio_dur - 13))

        elif name == "04_AINavigator":
            await wait(page, 3, "viewing dashboard")
            # Explicitly click the tab in case URL param fails
            try:
                await page.click(".nav-item:has-text('Get Aura')", timeout=8000)
            except:
                log("  -> [WARN] Could not click sidebar, trying direct tab selection")
            
            chat_input = "[placeholder*='message']"
            await wait(page, 3, "verifying chat load")
            await page.wait_for_selector(chat_input, timeout=15000)
            await fill(page, chat_input, "I failed my Calculus midterm - what should I do?", delay=30)
            await page.keyboard.press("Enter")
            await wait(page, max(0, audio_dur - 8))

        elif name == "06_Tutoring":
            await wait(page, 3, "viewing tutoring")
            # Open booking for first course card
            await try_click(
                page,
                ".card-white:first-of-type, button:has-text('Book'), button:has-text('Get Help')",
                "open booking",
                timeout=4000
            )
            await wait(page, 2, "booking form open")
            await fill(page, "textarea", "I need help with Python - specifically Lists and loops.", delay=42)
            await wait(page, 0.8)
            # Fix date to avoid tooltip error
            try:
                await page.evaluate("""() => {
                    const d = document.querySelector("input[type='date']");
                    const t = document.querySelector("input[type='time']");
                    if (d) { d.value = '2026-04-15'; d.dispatchEvent(new Event('input')); d.dispatchEvent(new Event('change')); }
                    if (t) { t.value = '14:00'; t.dispatchEvent(new Event('input')); t.dispatchEvent(new Event('change')); }
                }""")
            except: pass
            
            await wait(page, 1, "date and time fixed")
            await try_click(page, "button:has-text('Confirm')", "submit booking")
            await wait(page, max(0, audio_dur - 18))

        elif name == "07_Wellness":
            await wait(page, 5, "viewing wellness")
            await scroll(page, 500)
            await wait(page, 5, "viewing check-ins")
            await scroll(page, 0)
            await wait(page, max(0, audio_dur - 13))

        elif name == "08_Holds":
            await wait(page, 5, "viewing holds")
            await wait(page, audio_dur - 5)

        elif name == "09_FinancialAid":
            await wait(page, 5, "viewing financial nexus")
            await scroll(page, 400)
            await wait(page, 5, "viewing scholarships")
            await scroll(page, 0)
            await wait(page, audio_dur - 13)

        elif name == "10_SocialCampus":
            await wait(page, 5, "viewing social campus")
            await scroll(page, 400)
            await wait(page, 5, "viewing groups")
            await scroll(page, 0)
            await wait(page, audio_dur - 13)

        elif name == "11_AdminPanel":
            # Direct deep-link navigation
            await wait(page, 5, "viewing smart outreach")
            await page.evaluate("() => window.__setAdminSection && window.__setAdminSection('analytics')")
            await wait(page, 10, "Deans analytics")
            await scroll(page, 400)
            await wait(page, 6, "Tutoring Intelligence")
            await scroll(page, 0)
            log("  -> (bridge) switching back to campaigns")
            await page.evaluate("() => window.__setAdminSection && window.__setAdminSection('campaigns')")
            await wait(page, 5)
            await scroll(page, 450)
            await wait(page, audio_dur - 41)

        elif name == "12_Closing":
            await page.evaluate("window.jumpToSlide(5)") 
            await wait(page, audio_dur)

        else:
            log(f"  -> [WARN] No logic for {name}, just sitting for {audio_dur}s")
            await wait(page, audio_dur)

        # ── TEARDOWN & MUX ──────────────────────────────────────────────────
        log("\n[SAVING] Closing browser...")
        raw_vid_path = await page.video.path()
        await ctx.close()
        await browser.close()
        
        log(f"\n[MUX] Mixing {name}.mp4 with voiceover...")
        if os.path.exists(final_out): os.remove(final_out)
        
        run_mux(raw_vid_path, vo_path, final_out, audio_dur)

        os.remove(raw_vid_path)
        log(f"  -> [OK] Processed {name}.mp4 ({os.path.getsize(final_out)/1e6:.1f}MB)")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "all"
    if target == "all":
        for scene in DURS.keys():
            asyncio.run(record_scene(scene))
    else:
        asyncio.run(record_scene(target))
