"""
record_partial.py — Record ONLY the 5 previously failing scenes
================================================================
Uses direct URL hash navigation (no sidebar click needed) so every
scene is guaranteed to load.

Scenes recorded:
  07_Wellness, 08_Holds, 09_FinancialAid,
  10_SocialCampus, 11_AdminPanel

Output: demo/v2/partial_scenes.webm

Run: python 1_marketing/Demo_3_21/record_partial.py
"""
import asyncio, os, sys, shutil
from playwright.async_api import async_playwright
from moviepy.editor import AudioFileClip
import pygame

# ── Config ────────────────────────────────────────────────────────────────────
DEMO_DIR  = os.path.dirname(os.path.abspath(__file__))
V2_DIR    = os.path.join(DEMO_DIR, "v2")
VO_DIR    = os.path.join(DEMO_DIR, "voiceovers")
VIDEO_OUT = os.path.join(V2_DIR, "partial_scenes.webm")
BASE_URL  = "https://aumtech.ai"
REC_W, REC_H = 1920, 1080

os.makedirs(V2_DIR, exist_ok=True)

# ── PARTIAL scenes only ───────────────────────────────────────────────────────
SCENES = [
    "07_Wellness", "08_Holds", "09_FinancialAid",
    "10_SocialCampus", "11_AdminPanel"
]

# ── URL map: direct hash navigation — no sidebar click needed ─────────────────
SCENE_URLS = {
    "07_Wellness":     f"{BASE_URL}/#/wellness",
    "08_Holds":        f"{BASE_URL}/#/holds",
    "09_FinancialAid": f"{BASE_URL}/#/financial-nexus",
    "10_SocialCampus": f"{BASE_URL}/#/social-campus",
    "11_AdminPanel":   f"{BASE_URL}/#/institutional-access",
}

# ── Auto-detect durations ─────────────────────────────────────────────────────
def get_durations():
    durs = {}
    print("\n[DETECTING AUDIO DURATIONS]")
    for s in SCENES:
        f = os.path.join(VO_DIR, f"{s}.mp3")
        if os.path.exists(f):
            clip = AudioFileClip(f)
            durs[s] = clip.duration
            clip.close()
            print(f"  -> {s}: {clip.duration:.2f}s")
        else:
            print(f"  [MISSING] {s}.mp3 — using 5s fallback")
            durs[s] = 5.0
    return durs

DURATIONS = get_durations()
PLAY_AUDIO = "--play" in sys.argv
if PLAY_AUDIO:
    pygame.mixer.init()

# ── Helpers ───────────────────────────────────────────────────────────────────
def log(msg): print(msg, flush=True)

def scene(name):
    log("\n" + "=" * 60)
    log(f"[SCENE] {name}  ({DURATIONS[name]:.1f}s)")
    log("=" * 60)
    if PLAY_AUDIO:
        f = os.path.join(VO_DIR, f"{name}.mp3")
        if os.path.exists(f):
            pygame.mixer.music.load(f)
            pygame.mixer.music.play()

async def wait(page, secs, label=""):
    if label: log(f"  -> {label} ({secs:.1f}s)")
    remaining = float(secs)
    while remaining > 0:
        chunk = min(4.9, remaining)
        await page.wait_for_timeout(int(chunk * 1000))
        remaining -= chunk

async def go(page, url, label=""):
    if label: log(f"  -> navigate: {label}")
    await page.goto(url, wait_until="domcontentloaded")
    await page.wait_for_load_state("networkidle")
    await page.wait_for_timeout(1500)

async def scroll(page, y):
    await page.evaluate(f"window.scrollTo({{top:{y},behavior:'smooth'}})")
    await page.wait_for_timeout(700)

async def click_safe(page, selector, label="", timeout=5000):
    try:
        await page.wait_for_selector(selector, timeout=timeout)
        if label: log(f"  -> click: {label}")
        await page.click(selector)
        return True
    except Exception:
        log(f"  [skip] {label}")
        return False

async def inject_heartbeat(page):
    await page.evaluate("""() => {
        if (document.getElementById('__hb')) return;
        const d = document.createElement('div');
        d.id = '__hb';
        d.style.cssText = 'position:fixed;bottom:1px;right:1px;width:1px;height:1px;z-index:999999;pointer-events:none;';
        document.body.appendChild(d);
        let t = 0;
        (function tick() { d.style.opacity = (t++ % 2 === 0) ? '1' : '0.99'; requestAnimationFrame(tick); })();
    }""")

async def glow(page, selector, timeout=2000):
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

async def login(page):
    """Login with real student credentials."""
    log("  -> logging in as daniel.garrett12@txu.edu")
    await go(page, f"{BASE_URL}/login", "login page")
    email_sel = "input[type='email'], input[name='email'], input[name='username']"
    pass_sel  = "input[type='password']"
    try:
        await page.wait_for_selector(email_sel, timeout=8000)
        await page.click(email_sel)
        await page.type(email_sel, "daniel.garrett12@txu.edu", delay=60)
        await page.click(pass_sel)
        await page.type(pass_sel, "password123", delay=70)
        await page.click("button[type='submit']")
        # Wait for dashboard
        await page.wait_for_selector(
            ".sidebar, [class*='dashboard'], .hero-card, h1",
            timeout=15000
        )
        await page.wait_for_load_state("networkidle")
        log("  -> logged in successfully")
    except Exception as e:
        log(f"  [WARN] login issue: {e}")

# ── Main recorder ─────────────────────────────────────────────────────────────
async def record():
    log("=" * 60)
    log("  Partial Scene Recorder — 5 Missing Scenes")
    log(f"  Output -> {VIDEO_OUT}")
    log("=" * 60)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless="--headful" not in sys.argv,
            args=["--no-sandbox", "--disable-setuid-sandbox",
                  "--hide-scrollbars", "--disable-web-security",
                  "--allow-file-access-from-files"]
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

        # Login once, then navigate directly to each scene URL
        await login(page)
        await inject_heartbeat(page)

        # ── SCENE 07 : Wellness ───────────────────────────────────────────────
        scene("07_Wellness")
        await go(page, SCENE_URLS["07_Wellness"], "Wellness Check page")
        await inject_heartbeat(page)
        await wait(page, 2, "wellness page loads")
        await scroll(page, 250)
        await wait(page, 3, "showing wellness cards")
        await scroll(page, 0)
        await wait(page, DURATIONS["07_Wellness"] - 7, "wellness overview")

        # ── SCENE 08 : Holds & Alerts ─────────────────────────────────────────
        scene("08_Holds")
        await go(page, SCENE_URLS["08_Holds"], "Holds & Financial Alerts page")
        await inject_heartbeat(page)
        await wait(page, 2, "holds load - Library Fine visible")
        await glow(page, "[class*='hold'], .card-white, [class*='card']")
        await wait(page, 4, "reading Library Fine - $45 Outstanding Balance")
        await glow(page, "button:has-text('Resolve'), button:has-text('How to fix')")
        await wait(page, DURATIONS["08_Holds"] - 9, "hold resolution info shown")

        # ── SCENE 09 : Financial Nexus ────────────────────────────────────────
        scene("09_FinancialAid")
        await go(page, SCENE_URLS["09_FinancialAid"], "Financial Nexus page")
        await inject_heartbeat(page)
        await wait(page, 2, "financial nexus loads")
        # Click Scholarship Matcher tab
        try:
            await page.get_by_text("Scholarship Matcher", exact=True).first.click()
            log("  -> clicked: Scholarship Matcher tab")
            await wait(page, 2, "scholarship tab loaded")
        except Exception:
            log("  [skip] Scholarship Matcher tab")
        # Trigger AI re-scan
        try:
            btn = page.get_by_text("Force AI Re-scan").first
            await btn.wait_for(state="visible", timeout=5000)
            await btn.click()
            log("  -> clicked: Force AI Re-scan")
        except Exception:
            log("  [skip] Force AI Re-scan button")
        await wait(page, 5, "AI matching scholarships")
        await scroll(page, 350)
        await wait(page, DURATIONS["09_FinancialAid"] - 12, "scholarship results visible")

        # ── SCENE 10 : Social Campus ──────────────────────────────────────────
        scene("10_SocialCampus")
        await go(page, SCENE_URLS["10_SocialCampus"], "Social Campus page")
        await inject_heartbeat(page)
        await wait(page, 3, "social campus loads")
        await scroll(page, 300)
        await wait(page, 4, "study groups visible")
        # Try sub-tabs if they exist
        try:
            await page.get_by_text("Peer Mentoring", exact=True).first.click()
            log("  -> clicked: Peer Mentoring tab")
            await wait(page, 3, "peer mentors shown")
        except Exception:
            await wait(page, 3)
        try:
            await page.get_by_text("Textbook Marketplace", exact=True).first.click()
            log("  -> clicked: Textbook Marketplace tab")
        except Exception:
            pass
        await wait(page, DURATIONS["10_SocialCampus"] - 12, "textbook listings shown")

        # ── SCENE 11 : Institutional Access ──────────────────────────────────
        scene("11_AdminPanel")
        await go(page, SCENE_URLS["11_AdminPanel"], "Institutional Access (Admin) page")
        await inject_heartbeat(page)
        await wait(page, 2, "admin panel loads")
        await scroll(page, 300)
        await wait(page, 4, "admin content visible")
        await scroll(page, 0)
        await wait(page, DURATIONS["11_AdminPanel"] - 8, "admin panel overview")

        # ── Save ──────────────────────────────────────────────────────────────
        log("\n[SAVING] Closing browser and saving partial video...")
        raw = await page.video.path()
        await ctx.close()
        await browser.close()

        if os.path.exists(VIDEO_OUT):
            os.remove(VIDEO_OUT)
        shutil.copy(raw, VIDEO_OUT)
        log(f"[SAVED]  {VIDEO_OUT}")
        return VIDEO_OUT

if __name__ == "__main__":
    asyncio.run(record())
