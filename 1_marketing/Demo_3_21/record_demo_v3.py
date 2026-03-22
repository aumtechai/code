"""
record_demo_v3.py — aumtech.ai Demo Recorder (v3, single-session)
=================================================================
Fixes over v2:
  - SINGLE browser session — no re-login, no stitching artifacts
  - ALL navigation by DIRECT URL hash (no sidebar clicks that fail)
  - Intro slide pre-warms before recording context opens, eliminating white frames
  - Audio/video sync fixed: wait times are derived precisely from voiceover durations
    with a buffer at START of each wait (gives page time to render) not at the end
  - Date input cleared before filling (fixes "02/02/60330" bug)
  - Headless recording with heartbeat keeps frames active throughout

Output: v2/recorded_browser_v3.webm  (rename/replace recorded_browser.webm after verify)

Run: python 1_marketing/Demo_3_21/record_demo_v3.py
"""
import asyncio, os, sys, shutil
from playwright.async_api import async_playwright
from moviepy.editor import AudioFileClip

sys.stdout.reconfigure(encoding="utf-8")

# ── Config ──────────────────────────────────────────────────────────────────
DEMO_DIR    = os.path.dirname(os.path.abspath(__file__))
V2_DIR      = os.path.join(DEMO_DIR, "v2")
VIDEO_OUT   = os.path.join(V2_DIR, "recorded_browser.webm")
VO_DIR      = os.path.join(DEMO_DIR, "voiceovers")
SLIDES_PATH = os.path.join(DEMO_DIR, "intro_slides_v2.html")
SLIDES_URL  = "file:///" + SLIDES_PATH.replace("\\", "/")
BASE_URL    = "https://aumtech.ai"
REC_W, REC_H = 1920, 1080

os.makedirs(V2_DIR, exist_ok=True)

# ── Scene list (order matters) ───────────────────────────────────────────────
SCENES = [
    "01_Intro", "01B_Architecture", "02_SignIn", "03_Dashboard",
    "04_AINavigator", "05_Courses", "06_Tutoring", "07_Wellness",
    "08_Holds", "09_FinancialAid", "10_SocialCampus", "11_AdminPanel",
    "12_Closing"
]

# ── URL map — direct hash navigation, no sidebar clicks ─────────────────────
SCENE_URL = {
    "04_AINavigator": f"{BASE_URL}/#/aura",
    "05_Courses":     f"{BASE_URL}/#/courses",
    "05_Roadmap":     f"{BASE_URL}/#/degree-roadmap",
    "06_Tutoring":    f"{BASE_URL}/#/tutoring",
    "07_Wellness":    f"{BASE_URL}/#/wellness",
    "08_Holds":       f"{BASE_URL}/#/holds",
    "09_FinancialAid":f"{BASE_URL}/#/financial-nexus",
    "10_SocialCampus":f"{BASE_URL}/#/social-campus",
    "11_AdminPanel":  f"{BASE_URL}/#/institutional-access",
}

# ── Detect audio durations ───────────────────────────────────────────────────
def get_dur(scene):
    f = os.path.join(VO_DIR, f"{scene}.mp3")
    if os.path.exists(f):
        c = AudioFileClip(f); d = c.duration; c.close(); return d
    return 10.0

print("\n[DETECTING] Audio durations...")
D = {}
for s in SCENES:
    D[s] = get_dur(s)
    print(f"  -> {s}: {D[s]:.2f}s")

# ── Helpers ──────────────────────────────────────────────────────────────────
def log(msg): print(msg, flush=True)

def scene_header(name):
    log("\n" + "=" * 60)
    log(f"[SCENE] {name}  ({D[name]:.1f}s)")
    log("=" * 60)

async def wait(page, secs, label=""):
    if label: log(f"  -> {label} ({secs:.1f}s)")
    remaining = float(secs)
    while remaining > 0:
        chunk = min(4.9, remaining)
        await page.wait_for_timeout(int(chunk * 1000))
        remaining -= chunk

async def go(page, url, label="", settle=1.5):
    if label: log(f"  -> nav: {label}")
    await page.goto(url, wait_until="domcontentloaded")
    try:
        await page.wait_for_load_state("networkidle", timeout=8000)
    except Exception:
        pass
    await page.wait_for_timeout(int(settle * 1000))

async def url_nav(page, url, label="", settle=2.0):
    """Navigate to a section by direct URL — most reliable method."""
    if label: log(f"  -> url_nav: {label}")
    await page.evaluate(f"window.location.href = '{url}'")
    await page.wait_for_timeout(int(settle * 1000))
    try:
        await page.wait_for_load_state("networkidle", timeout=6000)
    except Exception:
        pass
    await page.wait_for_timeout(800)

async def scroll(page, y, smooth=True):
    behavior = "'smooth'" if smooth else "'instant'"
    await page.evaluate(f"window.scrollTo({{top:{y}, behavior:{behavior}}})")
    await page.wait_for_timeout(700)

async def glow(page, selector, timeout=3000):
    try:
        await page.wait_for_selector(selector, timeout=timeout)
        await page.evaluate("""(sel) => {
            const el = document.querySelector(sel);
            if (!el) return;
            el.style.transition = 'box-shadow 0.3s';
            el.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.75), 0 0 30px rgba(99,102,241,0.4)';
            setTimeout(() => { el.style.boxShadow = ''; }, 2500);
        }""", selector)
    except Exception:
        pass

async def try_click(page, selector, label="", timeout=4000):
    try:
        await page.wait_for_selector(selector, timeout=timeout)
        log(f"  -> click: {label}")
        await page.click(selector)
        return True
    except Exception:
        log(f"  [skip] {label}")
        return False

async def fill(page, selector, text, delay=55, timeout=5000):
    try:
        await page.wait_for_selector(selector, timeout=timeout)
        await page.click(selector)
        await page.fill(selector, "")        # clear first!
        await page.type(selector, text, delay=delay)
        return True
    except Exception:
        log(f"  [skip fill] {selector}")
        return False

async def inject_heartbeat(page):
    """Tiny animated pixel keeps Playwright's video encoder producing frames."""
    await page.evaluate("""() => {
        if (document.getElementById('__hb')) return;
        const d = document.createElement('div');
        d.id = '__hb';
        d.style.cssText = 'position:fixed;bottom:1px;right:1px;width:1px;height:1px;z-index:999999;pointer-events:none;background:transparent;';
        document.body.appendChild(d);
        let t = 0;
        (function tick() {
            d.style.opacity = (++t % 2 === 0) ? '1' : '0.99';
            requestAnimationFrame(tick);
        })();
    }""")

# ── Main ─────────────────────────────────────────────────────────────────────
async def record():
    log("=" * 60)
    log("  aumtech.ai Demo Recorder  v3  (single-session, URL-nav)")
    log(f"  Output  -> {VIDEO_OUT}")
    log("=" * 60)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox", "--disable-setuid-sandbox",
                "--hide-scrollbars", "--disable-web-security",
                "--allow-file-access-from-files",
                "--disable-background-timer-throttling",
                "--disable-backgrounding-occluded-windows",
                "--disable-renderer-backgrounding",
                "--disable-save-password-bubble",
                "--password-store=basic"
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

        # ── PRE-WARM: navigate and settle before recording starts ─────────────
        # The first ~0.5s of a new Playwright recording context is often white.
        # We navigate to the slides first and let the page render, then inject
        # heartbeat. This ensures frame 1 already has content.
        log("\n[PRE-WARM] Loading intro slides...")
        await page.goto(SLIDES_URL, wait_until="domcontentloaded")
        await page.wait_for_timeout(2500)   # give all animations time to start
        await inject_heartbeat(page)
        await page.wait_for_timeout(500)    # one more settle
        log("[PRE-WARM] Done — recording has live content from frame 1")

        # ── SCENE 01 : Intro Slides (72.55s) ───────────────────────────────
        scene_header("01_Intro")
        # Slide 0: Students are navigating a fragmented maze (~20s)
        await wait(page, 20, "slide 0: fragmented maze")

        # Slide 1: High Cost of Inefficiency (~16s)
        await page.evaluate("window.jumpToSlide(1)")
        await wait(page, 16, "slide 1: high cost 40%/73%")

        # Slide 2: Meet Aura (~20s)
        await page.evaluate("window.jumpToSlide(2)")
        await wait(page, 20, "slide 2: meet aura")

        # Slide 3: Unified Intelligence (remainder of 01_Intro audio)
        await page.evaluate("window.jumpToSlide(3)")
        await wait(page, D["01_Intro"] - 57, "slide 3: unified intelligence")

        # ── SCENE 01B : Architecture (56.35s) ──────────────────────────────
        scene_header("01B_Architecture")
        await page.evaluate("window.jumpToSlide(4)")
        await wait(page, D["01B_Architecture"], "slide 4: architecture diagram")

        # ── SCENE 02 : Sign In (21.96s) ────────────────────────────────────
        scene_header("02_SignIn")
        await go(page, f"{BASE_URL}/login", "login page", settle=2.0)
        await inject_heartbeat(page)
        await wait(page, 1.5, "login page fully rendered")

        email_sel = "input[type='email'], input[name='email'], input[name='username']"
        pass_sel  = "input[type='password']"
        await fill(page, email_sel, "daniel.garrett12@txu.edu", delay=55)
        await wait(page, 0.5)
        await fill(page, pass_sel, "password123", delay=65)
        await wait(page, 0.5)
        await glow(page, "button[type='submit']")
        await wait(page, 0.4)
        await try_click(page, "button[type='submit']", "submit login")

        # Wait for dashboard to fully load
        try:
            await page.wait_for_selector(
                ".hero-card, [class*='dashboard'], h1", timeout=15000
            )
        except Exception:
            pass
        await page.wait_for_load_state("networkidle")
        await wait(page, D["02_SignIn"] - 10, "settle on dashboard")

        # ── SCENE 03 : Dashboard (49.39s) ──────────────────────────────────
        scene_header("03_Dashboard")
        await inject_heartbeat(page)
        await wait(page, 2, "reading greeting: Good afternoon Daniel!")

        await glow(page, ".hero-card, .stat-card-glass")
        await wait(page, 4, "GPA 3.5 and 87% on-track score")

        await scroll(page, 380)
        await wait(page, 3, "Quick Actions tiles visible")
        await glow(page, ".card-white, [class*='quick-action']")
        await wait(page, 3)

        await scroll(page, 760)
        await wait(page, 4, "AI Support Team: Tutor / Admin / Coach")

        await scroll(page, 0)
        await wait(page, D["03_Dashboard"] - 18, "dashboard overview complete")

        # ── SCENE 04 : Get Aura — AI Chat (61.30s) ─────────────────────────
        scene_header("04_AINavigator")
        await url_nav(page, SCENE_URL["04_AINavigator"], "Get Aura / AI Chat", settle=2.5)
        await inject_heartbeat(page)
        await wait(page, 2, "chat interface loaded")

        chat_input = (
            "input[placeholder*='Type your message'], "
            "textarea[placeholder*='Type your message'], "
            "input[placeholder*='message'], textarea, "
            "input[class*='chat'], input[class*='message']"
        )
        await fill(
            page, chat_input,
            "I failed my Calculus midterm — what should I do to recover my grade?",
            delay=46, timeout=6000
        )
        await wait(page, 0.8)
        await page.keyboard.press("Enter")
        await wait(page, 9, "Aura AI generating response...")

        await page.evaluate("window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})")
        await wait(page, 6, "reading full AI response")
        await page.evaluate("window.scrollTo({top:0,behavior:'smooth'})")
        await wait(page, D["04_AINavigator"] - 21, "AI scene complete")

        # ── SCENE 05 : Courses + Degree Roadmap (34.85s) ───────────────────
        scene_header("05_Courses")
        await url_nav(page, SCENE_URL["05_Courses"], "Courses page", settle=2.0)
        await inject_heartbeat(page)
        await wait(page, 2, "courses loaded")
        await scroll(page, 300)
        await wait(page, 3, "showing course list")
        await scroll(page, 0)

        await url_nav(page, SCENE_URL["05_Roadmap"], "Degree Roadmap", settle=2.0)
        await wait(page, 2, "roadmap loaded")
        await scroll(page, 300)
        await wait(page, 4, "semester blocks visible")
        await scroll(page, 0)
        await wait(page, D["05_Courses"] - 15, "roadmap overview complete")

        # ── SCENE 06 : Tutoring Center (62.64s) ────────────────────────────
        scene_header("06_Tutoring")
        await url_nav(page, SCENE_URL["06_Tutoring"], "Tutoring Center", settle=2.5)
        await inject_heartbeat(page)
        await wait(page, 2, "tutoring center loaded - courses shown")

        # Sync Roster button
        glow_ok = await try_click(
            page,
            "button:has-text('Sync Roster'), button:has-text('Sync')",
            "Sync Roster"
        )
        if glow_ok:
            await wait(page, 2, "roster synced")

        # Open booking for first course card
        card_clicked = await try_click(
            page,
            ".card-white:first-of-type, [class*='course-card']:first-of-type, "
            "button:has-text('Book'), button:has-text('Get Help')",
            "open course booking",
            timeout=4000
        )
        await wait(page, 2, "booking form open")

        # Fill booking form
        await fill(
            page, "textarea",
            "I need help with Python — specifically Lists and loops.",
            delay=42, timeout=3000
        )
        await wait(page, 0.8)

        # Fix the date: clear via evaluate then set value directly
        try:
            await page.evaluate("""() => {
                const d = document.querySelector("input[type='date']");
                if (d) { d.value = '2026-04-15'; d.dispatchEvent(new Event('input')); d.dispatchEvent(new Event('change')); }
            }""")
            log("  -> date set: 2026-04-15")
        except Exception:
            pass

        await wait(page, 0.5)
        await try_click(
            page,
            "button[type='submit']:has-text('Confirm'), "
            "button:has-text('Confirm Appointment'), button:has-text('Book'), "
            "button:has-text('Confirm')",
            "Confirm Appointment", timeout=4000
        )
        await wait(page, D["06_Tutoring"] - 16, "booking confirmed")

        # ── SCENE 07 : Wellness (30.05s) ───────────────────────────────────
        scene_header("07_Wellness")
        await url_nav(page, SCENE_URL["07_Wellness"], "Wellness Check page", settle=2.5)
        await inject_heartbeat(page)
        await wait(page, 2, "wellness page loaded")
        await scroll(page, 300)
        await wait(page, 3, "wellness cards visible")
        await scroll(page, 0)
        await wait(page, D["07_Wellness"] - 9, "wellness overview complete")

        # ── SCENE 08 : Holds & Financial Alerts (29.42s) ───────────────────
        scene_header("08_Holds")
        await url_nav(page, SCENE_URL["08_Holds"], "Holds & Financial Alerts", settle=2.5)
        await inject_heartbeat(page)
        await wait(page, 2, "holds loaded — Library Fine $45 visible")
        await glow(page, "[class*='hold'], .card-white, [class*='card']")
        await wait(page, 4, "reading: Library Fine — Outstanding Balance")
        await glow(page, "button:has-text('Resolve'), button:has-text('How to fix')")
        await wait(page, D["08_Holds"] - 10, "hold resolution info shown")

        # ── SCENE 09 : Financial Nexus (39.29s) ────────────────────────────
        scene_header("09_FinancialAid")
        await url_nav(page, SCENE_URL["09_FinancialAid"], "Financial Nexus", settle=2.5)
        await inject_heartbeat(page)
        await wait(page, 2, "financial nexus loaded")

        # Try Scholarship Matcher tab
        try:
            tab = page.get_by_text("Scholarship Matcher").first
            await tab.wait_for(state="visible", timeout=4000)
            await tab.click()
            log("  -> clicked: Scholarship Matcher tab")
            await wait(page, 2, "scholarship matcher loaded")
        except Exception:
            log("  [skip] Scholarship Matcher tab")
            await wait(page, 2)

        # Force AI Re-scan
        try:
            btn = page.get_by_text("Force AI Re-scan").first
            await btn.wait_for(state="visible", timeout=4000)
            await btn.click()
            log("  -> clicked: Force AI Re-scan")
        except Exception:
            log("  [skip] Force AI Re-scan")

        await wait(page, 5, "AI matching scholarships...")
        await scroll(page, 350)
        await wait(page, D["09_FinancialAid"] - 13, "scholarship results visible")

        # ── SCENE 10 : Social Campus (29.06s) ──────────────────────────────
        scene_header("10_SocialCampus")
        await url_nav(page, SCENE_URL["10_SocialCampus"], "Social Campus", settle=2.5)
        await inject_heartbeat(page)
        await wait(page, 3, "social campus loaded")
        await scroll(page, 300)
        await wait(page, 4, "study groups visible")

        # Try sub-tabs (they may be tabs within the page not sidebar)
        try:
            await page.get_by_text("Peer Mentoring").first.click()
            log("  -> clicked: Peer Mentoring tab")
            await wait(page, 3, "peer mentors shown")
        except Exception:
            await wait(page, 3)

        try:
            await page.get_by_text("Textbook Marketplace").first.click()
            log("  -> clicked: Textbook Marketplace tab")
        except Exception:
            pass

        await wait(page, D["10_SocialCampus"] - 12, "textbook listings")

        # ── SCENE 11 : Institutional Access / Admin (45.70s) ───────────────
        scene_header("11_AdminPanel")
        await url_nav(page, SCENE_URL["11_AdminPanel"], "Institutional Access", settle=3.0)
        await inject_heartbeat(page)
        await wait(page, 2, "admin panel loaded")
        await scroll(page, 300)
        await wait(page, 4, "admin content visible")
        await scroll(page, 0)
        await wait(page, D["11_AdminPanel"] - 9, "admin panel overview complete")

        # ── SCENE 12 : Closing Logo Slide (36.70s) ─────────────────────────
        scene_header("12_Closing")
        await go(page, SLIDES_URL, "closing logo slide", settle=1.5)
        await inject_heartbeat(page)
        try:
            await page.evaluate("window.jumpToSlide(5)")
        except Exception:
            pass
        await wait(page, D["12_Closing"], "closing slide complete")

        # ── Save ────────────────────────────────────────────────────────────
        log("\n[SAVING] Closing browser and saving raw video...")
        raw = await page.video.path()
        await ctx.close()
        await browser.close()

        if os.path.exists(VIDEO_OUT):
            os.remove(VIDEO_OUT)
        shutil.copy(raw, VIDEO_OUT)
        size_mb = os.path.getsize(VIDEO_OUT) / 1024 / 1024
        log(f"[SAVED]  {VIDEO_OUT}  ({size_mb:.1f} MB)")
        return VIDEO_OUT

if __name__ == "__main__":
    asyncio.run(record())
