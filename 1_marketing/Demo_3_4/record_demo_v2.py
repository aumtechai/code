"""
record_demo_v2.py  -  aumtech.ai Demo Recorder (v2, fixed)
===========================================================
Fixes over v1:
  - headless=True  -> zero browser chrome, zero gray bars, pure clean capture
  - Recording at 1920x1080 (proper 16:9 HD)
  - Playwright controls slide advancement directly (no JS timer race)
  - HTML slides use 100vw/100vh -- fill viewport exactly
  - Proper login wait loop (waits for actual dashboard element)
  - Chunked waits (5s max each) to avoid TargetClosedError
  - Output saved to  demo/v2/recorded_browser.webm  (new version folder)

Run: python demo/record_demo_v2.py
"""
import asyncio
import time
import os
import sys
import shutil
from playwright.async_api import async_playwright

# Force UTF-8 output so Windows cp1252 doesn't choke on special chars
sys.stdout.reconfigure(encoding="utf-8")

# ── Exact voiceover durations (seconds) ──────────────────────────────────────
DURATIONS = {
    "01_Intro":        72.55,
    "02_SignIn":       21.96,
    "03_Dashboard":    49.39,
    "04_AINavigator":  61.30,
    "05_Courses":      34.85,
    "06_Tutoring":     62.64,
    "07_Wellness":     30.05,
    "08_Holds":        29.42,
    "09_FinancialAid": 39.29,
    "10_SocialCampus": 29.06,
    "11_AdminPanel":   45.70,
    "12_Closing":      36.70,
}

# ── Config ────────────────────────────────────────────────────────────────────
DEMO_DIR    = os.path.dirname(os.path.abspath(__file__))
V2_DIR      = os.path.join(DEMO_DIR, "v2")
VIDEO_OUT   = os.path.join(V2_DIR, "recorded_browser.webm")
SLIDES_PATH = os.path.join(DEMO_DIR, "intro_slides_v2.html")
SLIDES_URL  = "file:///" + SLIDES_PATH.replace("\\", "/")
BASE_URL    = "http://localhost:5173"

# 1920x1080 = proper full HD, no browser chrome in headless mode
REC_W, REC_H = 1920, 1080

os.makedirs(V2_DIR, exist_ok=True)

# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────
def log(msg):
    print(msg, flush=True)

def scene(name):
    log("\n" + "=" * 60)
    log(f"[SCENE] {name}  ({DURATIONS[name]:.1f}s)")
    log("=" * 60)

async def wait(page, secs, label=""):
    """Chunked wait -- avoids single large timeout crashing Playwright."""
    if label:
        log(f"  -> {label} ({secs:.1f}s)")
    remaining = float(secs)
    while remaining > 0:
        chunk = min(4.9, remaining)
        await page.wait_for_timeout(int(chunk * 1000))
        remaining -= chunk

async def go(page, url, label=""):
    if label:
        log(f"  -> navigating: {label}")
    await page.goto(url, wait_until="domcontentloaded")
    await page.wait_for_load_state("networkidle")

async def click(page, selector, label="", timeout=5000):
    try:
        await page.wait_for_selector(selector, timeout=timeout)
        if label:
            log(f"  -> clicking: {label}")
        await page.click(selector)
        return True
    except Exception as e:
        log(f"  [skip click '{label}']")
        return False

async def fill(page, selector, text, delay=55, timeout=5000):
    try:
        await page.wait_for_selector(selector, timeout=timeout)
        await page.click(selector)
        await page.type(selector, text, delay=delay)
        return True
    except Exception as e:
        log(f"  [skip fill '{selector}']")
        return False

async def scroll(page, y):
    await page.evaluate(f"window.scrollTo({{top:{y},behavior:'smooth'}})")
    await page.wait_for_timeout(700)

async def glow(page, selector, timeout=2000):
    """Highlight an element with a brief pulse ring."""
    try:
        await page.wait_for_selector(selector, timeout=timeout)
        await page.evaluate("""(sel) => {
            const el = document.querySelector(sel);
            if (!el) return;
            el.style.transition = 'box-shadow 0.25s';
            el.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.7), 0 0 24px rgba(99,102,241,0.4)';
            setTimeout(() => { el.style.boxShadow = ''; }, 2200);
        }""", selector)
    except Exception:
        pass


# ── Scene Synchronization ──────────────────────────────────────────────────
class SceneTimer:
    def __init__(self, page, duration):
        self.page = page
        self.duration = float(duration)
        self.start_time = time.time()
        
    async def finish(self, label="wait for audio to finish"):
        elapsed = time.time() - self.start_time
        remaining = self.duration - elapsed
        if remaining > 0:
            log(f"  -> [SYNC] {label} ({remaining:.1f}s remaining of {self.duration}s)")
            await wait(self.page, remaining)
        else:
            log(f"  -> [SYNC WARN] Scene ran {-remaining:.1f}s overtime!")

async def inject_heartbeat(page):
    """Tiny 1px animated element keeps Playwright recording frames."""
    await page.evaluate("""() => {
        if (document.getElementById('__hb')) return;
        const d = document.createElement('div');
        d.id = '__hb';
        d.style.cssText = 'position:fixed;bottom:1px;right:1px;width:1px;height:1px;z-index:999999;pointer-events:none;';
        document.body.appendChild(d);
        let t = 0;
        (function tick() { d.style.opacity = (t++ % 2 === 0) ? '1' : '0.99'; requestAnimationFrame(tick); })();
    }""")

# ─────────────────────────────────────────────────────────────────────────────
# Main recording coroutine
# ─────────────────────────────────────────────────────────────────────────────
async def record():
    log("=" * 60)
    log("  aumtech.ai Demo Recorder  v2  (clean headless 1920x1080)")
    log(f"  Output  -> {VIDEO_OUT}")
    log(f"  Resolution -> {REC_W}x{REC_H}")
    log("=" * 60)

    async with async_playwright() as pw:
        # headless=True -> no OS window chrome, pristine 1920x1080 recording
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--hide-scrollbars",
                "--disable-web-security",
                "--allow-file-access-from-files",
            ]
        )
        ctx = await browser.new_context(
            record_video_dir=V2_DIR,
            record_video_size={"width": REC_W, "height": REC_H},
            viewport={"width": REC_W, "height": REC_H},
            device_scale_factor=1,
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/121.0.0.0 Safari/537.36"
            ),
        )
        page = await ctx.new_page()

        # ── SCENE 01 : Intro slides (72.55s = 20 + 16 + 20 + 16.55) ─────────
        scene("01_Intro")
        timer = SceneTimer(page, DURATIONS["01_Intro"])
        await go(page, SLIDES_URL, "intro_slides.html")
        await inject_heartbeat(page)
        await wait(page, 1, "slide load settle")

        log("  -> slide 1: Students Are Left Behind  (20s)")
        await wait(page, 20)

        # Playwright advances slides -- no JS timer race conditions
        await page.evaluate("window.goToSlide(1)")
        log("  -> slide 2: Cost of Doing Nothing  (16s)")
        await wait(page, 16)

        await page.evaluate("window.goToSlide(2)")
        log("  -> slide 3: Introducing aumtech.ai  (20s)")
        await wait(page, 20)

        await page.evaluate("window.goToSlide(3)")
        log("  -> slide 4: Brand title  (remaining)")
        await timer.finish("brand title")

        # ── SCENE 02 : Sign In (21.96s) ──────────────────────────────────────
        scene("02_SignIn")
        timer = SceneTimer(page, DURATIONS["02_SignIn"])
        # Use a faster go version
        await page.goto(f"{BASE_URL}/login", wait_until="commit") # fast commit
        await inject_heartbeat(page)
        
        email_sel = "input[type='email'], input[name='email'], input[name='username']"
        pass_sel  = "input[type='password']"
        
        # Wait for either input to appear before typing
        await page.wait_for_selector(email_sel, timeout=7000)
        
        await fill(page, email_sel, "daniel.garrett12@txu.edu", delay=35) # Speed up typing (60 -> 35)
        await wait(page, 0.3)
        await fill(page, pass_sel,  "password123", delay=35)
        await wait(page, 0.3)
        await glow(page, "button[type='submit']")
        await click(page, "button[type='submit']", "submit login")

        # Wait for dashboard items
        try:
            await page.wait_for_selector(
                ".sidebar, .nav-item, .hero-card",
                timeout=8000,
            )
        except Exception:
            pass
        await timer.finish("settle on dashboard")

        # ── SCENE 03 : Dashboard (49.39s) ─────────────────────────────────────
        scene("03_Dashboard")
        timer = SceneTimer(page, DURATIONS["03_Dashboard"])
        await inject_heartbeat(page)
        await wait(page, 2, "read greeting")

        await glow(page, ".hero-card, .stat-card-glass")
        await wait(page, 4, "GPA and on-track score cards")

        await scroll(page, 420)
        await wait(page, 3, "Quick Actions visible")
        await glow(page, ".card-white, .action-card")
        await wait(page, 3)

        await scroll(page, 850)
        await wait(page, 6, "AI Support Team visible")

        await scroll(page, 0)
        await timer.finish("full dashboard overview")

        # ── SCENE 04 : Get Aura (Shortened for 3-minute cap) ──────────────────
        scene("04_AINavigator")
        # Calc: 180s - (72.55 + 21.96 + 49.39) = 36.1s
        timer = SceneTimer(page, 36.1) 
        await click(page, "text=Get Aura", "navigate to AI chat")
        await wait(page, 2, "chat interface loads")
        await inject_heartbeat(page)

        chat_input = (
            "textarea[placeholder], "
            "input[placeholder*='Ask'], input[placeholder*='message'], "
            "input[placeholder*='type']"
        )
        await fill(
            page, chat_input,
            "I failed my Calculus midterm -- what should I do to recover my grade?",
            delay=48, timeout=6000
        )
        await wait(page, 0.8)
        await page.keyboard.press("Enter")
        await wait(page, 9, "Gemini AI generating response")

        await page.evaluate("window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})")
        await timer.finish("end of 3 minute recording cap")

        # ── Save video ────────────────────────────────────────────────────────
        log("\n[SAVING] Closing browser and saving raw video...")
        raw = await page.video.path()
        await ctx.close()
        await browser.close()

        if os.path.exists(VIDEO_OUT):
            os.remove(VIDEO_OUT)
        shutil.copy(raw, VIDEO_OUT)
        log(f"[SAVED]  {VIDEO_OUT}")
        return VIDEO_OUT


if __name__ == "__main__":
    path = asyncio.run(record())
    log("\n[NEXT] Run:  python demo/mix_demo_v2.py  to produce aumtech_ai_demo_v2.mp4")
