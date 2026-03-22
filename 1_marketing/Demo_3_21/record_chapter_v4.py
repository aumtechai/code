"""
record_chapter_v4.py — Chapter-by-Chapter Demo Recorder
=======================================================
Records a SINGLE chapter of the demo perfectly synced with its audio.
Uses saved session state (v4_auth.json) to jump straight to the correct
pages without re-recording the login sequence for every video.

Usage:
  python record_chapter_v4.py 02_SignIn      (Do this first to auth!)
  python record_chapter_v4.py 03_Dashboard
  python record_chapter_v4.py all            (Records everything sequentially)

Output:
  v4/[scene_name].mp4  (Ready for individual review)
"""
import asyncio
import os
import sys
import shutil
import tempfile
import subprocess
from playwright.async_api import async_playwright
from moviepy.editor import AudioFileClip
from moviepy.config import get_setting

sys.stdout.reconfigure(encoding="utf-8")

# ── Config ──────────────────────────────────────────────────────────────────
DEMO_DIR    = os.path.dirname(os.path.abspath(__file__))
V4_DIR      = os.path.join(DEMO_DIR, "v4")
VO_DIR      = os.path.join(DEMO_DIR, "voiceovers")
SLIDES_PATH = os.path.join(DEMO_DIR, "intro_slides_v2.html")
SLIDES_URL  = "file:///" + SLIDES_PATH.replace("\\", "/")
BASE_URL    = "https://aumtech.ai"
AUTH_FILE   = os.path.join(V4_DIR, "v4_auth.json")
FFMPEG      = get_setting("FFMPEG_BINARY")

os.makedirs(V4_DIR, exist_ok=True)
REC_W, REC_H = 1920, 1080

SCENES = [
    "01_Intro", "01B_Architecture", "02_SignIn", "03_Dashboard",
    "04_AINavigator", "05_Courses", "06_Tutoring", "07_Wellness",
    "08_Holds", "09_FinancialAid", "10_SocialCampus", "11_AdminPanel",
    "12_Closing"
]

SCENE_SIDEBAR = {
    "04_AINavigator":  "Get Aura",
    "05_Courses":      "Courses",
    "06_Tutoring":     "Tutoring Center",
    "07_Wellness":     "Wellness",
    "08_Holds":        "Holds & Alerts",
    "09_FinancialAid": "Financial Nexus",
    "10_SocialCampus": "Social Campus",
    "11_AdminPanel":   "Admin Panel",
}

def get_dur(scene):
    f = os.path.join(VO_DIR, f"{scene}.mp3")
    if os.path.exists(f):
        c = AudioFileClip(f); d = c.duration; c.close(); return d
    return 10.0

def run_ffmpeg(cmd, label=""):
    print(f"  [ffmpeg] {label}")
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  [STDERR] {r.stderr[-800:]}")
    return r.returncode

def log(msg): print(msg, flush=True)

# ── Playwright Actions ──────────────────────────────────────────────────────
async def wait(page, secs, label=""):
    if label: log(f"  -> {label} ({secs:.1f}s)")
    remaining = float(secs)
    while remaining > 0:
        chunk = min(4.9, remaining)
        await page.wait_for_timeout(int(chunk * 1000))
        remaining -= chunk

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

async def fill(page, selector, text, delay=55, timeout=5000):
    try:
        await page.wait_for_selector(selector, timeout=timeout)
        await page.click(selector)
        await page.fill(selector, "")
        await page.type(selector, text, delay=delay)
        return True
    except Exception:
        log(f"  [skip fill] {selector}")
        return False

async def try_click(page, selector, label="", timeout=4000):
    try:
        try:
            await page.wait_for_selector(selector, timeout=timeout)
            await page.click(selector, force=True)
            log(f"  -> click: {label}")
        except Exception:
            # Fallback to JS text search click
            # Since CSS :has-text isn't real JS, we find by text content
            text_match = ""
            if "has-text('" in selector:
                text_match = selector.split("has-text('")[1].split("')")[0]
            elif "text='" in selector:
                text_match = selector.split("text='")[1].split("'")[0]
            
            if text_match:
                await page.evaluate("""(txt) => {
                    const el = Array.from(document.querySelectorAll('*')).find(e => 
                        e.textContent.trim() === txt || e.innerText?.includes(txt)
                    );
                    if (el) el.click();
                }""", text_match)
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

    needs_auth = name not in ["01_Intro", "01B_Architecture", "12_Closing", "02_SignIn"]
    if needs_auth and not os.path.exists(AUTH_FILE):
        log(f"[ERROR] {AUTH_FILE} not found. Please run 'python record_chapter_v4.py 02_SignIn' first!")
        sys.exit(1)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=False,
            args=[
                "--no-sandbox", "--disable-setuid-sandbox", "--hide-scrollbars",
                "--force-device-scale-factor=1",
                "--disable-web-security",
                "--disable-save-password-bubble", "--password-store=basic",
                "--window-size=1920,1080"
            ]
        )
        
        ctx_args = {
            "record_video_dir": V4_DIR,
            "record_video_size": {"width": REC_W, "height": REC_H},
            "viewport": {"width": REC_W, "height": REC_H},
            "device_scale_factor": 1,
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36"
        }
        if needs_auth:
            ctx_args["storage_state"] = AUTH_FILE
            
        ctx = await browser.new_context(**ctx_args)
        page = await ctx.new_page()

        # ── BRUTE FORCE DANIEL GARRETT DATA VIA INIT SCRIPT ─────────────
        await page.add_init_script("""
            const mockData = {
                "id": 10452, "email": "daniel.garrett12@txu.edu", "full_name": "Daniel Garrett",
                "gpa": 3.5, "on_track_score": 87, "is_ednex_verified": true, "major": "Computer Science",
                "is_admin": true, "is_faculty": true
            };
            const mockContext = {
                "status": "success",
                "context": {
                    "student_profile": {"name": "Daniel Garrett"},
                    "sis_stream": {"cumulative_gpa": 3.5},
                    "finance_stream": {"tuition_balance": 0.0, "has_financial_hold": false}
                }
            };
            
            // Hook Fetch
            const originalFetch = window.fetch;
            window.fetch = async (...args) => {
                const url = args[0].toString();
                if (url.includes('users/me')) return new Response(JSON.stringify(mockData), { status: 200, headers: { 'Content-Type': 'application/json' } });
                if (url.includes('ednex/context')) return new Response(JSON.stringify(mockContext), { status: 200, headers: { 'Content-Type': 'application/json' } });
                return originalFetch(...args);
            };

            // Hook XHR
            const XHR = XMLHttpRequest.prototype;
            const open = XHR.open;
            const send = XHR.send;
            XHR.open = function(method, url) { this._url = url; return open.apply(this, arguments); };
            XHR.send = function() {
                if (this._url && this._url.includes('users/me')) {
                    Object.defineProperty(this, 'readyState', { value: 4 });
                    Object.defineProperty(this, 'status', { value: 200 });
                    Object.defineProperty(this, 'responseText', { value: JSON.stringify(mockData) });
                    this.dispatchEvent(new Event('load'));
                    this.dispatchEvent(new Event('readystatechange'));
                    return;
                }
                return send.apply(this, arguments);
            };
            
            // DOM Patch Safety: If React fails, we force the text
            setInterval(() => {
                document.querySelectorAll('h1').forEach(h1 => {
                    if (h1.innerText.includes('Good afternoon, Student')) {
                        h1.innerText = h1.innerText.replace('Student', 'Daniel');
                    }
                });
            }, 1000);
        """)

        async def handle_route(route):
            url = route.request.url
            if "/api/users/me" in url:
                await route.fulfill(status=200, content_type="application/json", json={
                    "id": 10452, "email": "daniel.garrett12@txu.edu", "full_name": "Daniel Garrett",
                    "gpa": 3.5, "on_track_score": 87, "is_ednex_verified": True, "major": "Computer Science",
                    "is_admin": True, "is_faculty": True
                })
            elif "/api/ednex/context" in url:
                await route.fulfill(status=200, content_type="application/json", json={
                    "status": "success",
                    "context": {
                        "student_profile": {"name": "Daniel Garrett"},
                        "sis_stream": {"cumulative_gpa": 3.5},
                        "finance_stream": {"tuition_balance": 0.0, "has_financial_hold": False}
                    }
                })
            else:
                try: await route.continue_()
                except: pass

        await page.route(lambda url: "/api/" in url, handle_route)
        await page.route("**/api/analytics**", lambda r: r.fulfill(status=200, json={"status":"success"}))

        # PRE-WARM AND NAVIGATE
        if name in ["01_Intro", "01B_Architecture"]:
            await page.goto(SLIDES_URL, wait_until="domcontentloaded")
            await page.wait_for_timeout(2000)
            await inject_heartbeat(page)
            if name == "01B_Architecture":
                await page.evaluate("window.jumpToSlide(4)")
                await page.wait_for_timeout(1000)

        elif name == "12_Closing":
            await page.goto(SLIDES_URL, wait_until="domcontentloaded")
            await page.evaluate("window.jumpToSlide(5)")
            await page.wait_for_timeout(2000)
            await inject_heartbeat(page)

        elif name == "02_SignIn":
            await page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded")
            await page.wait_for_timeout(2000)
            await inject_heartbeat(page)

        else:
            # Authorized chapters
            await page.goto(f"{BASE_URL}/#/dashboard", wait_until="networkidle")
            await inject_heartbeat(page)
            
            # Click the correct sidebar nav item if not Dashboard
            if name in SCENE_SIDEBAR:
                sidebar_label = SCENE_SIDEBAR[name]
                # Wait for person name to appear to ensure mock is live
                try:
                    await page.wait_for_selector("text='Daniel Garrett'", timeout=5000)
                except: pass
                
                await try_click(page, f".sidebar .nav-item:has-text('{sidebar_label}')", f"Navigating to {sidebar_label}", 8000)
                await page.wait_for_timeout(2000)

        # ── SCENE ANIMATIONS ────────────────────────────────────────────────
        if name == "01_Intro":
            # Slide 0: The modern university experience...
            await wait(page, 15, "slide 0: fragmented maze")
            
            # Slide 1: High cost of inefficiency
            await page.evaluate("window.jumpToSlide(1)")
            await wait(page, 14, "slide 1: high cost 40%/73%")
            
            # Slide 2: Meet Aura...
            await page.evaluate("window.jumpToSlide(2)")
            await wait(page, 22, "slide 2: meet aura")
            
            # Slide 3: Unified Intelligence
            await page.evaluate("window.jumpToSlide(3)")
            await wait(page, audio_dur - 51, "slide 3: unified intelligence")
            
        elif name == "01B_Architecture":
            await wait(page, audio_dur, "architecture diagram")
            
        elif name == "02_SignIn":
            sel_email = "input[type='email'], input[name='email'], input[name='username']"
            sel_pass = "input[type='password']"
            await fill(page, sel_email, "daniel.garrett12@txu.edu", delay=55)
            await wait(page, 0.5)
            await fill(page, sel_pass, "password123", delay=65)
            await wait(page, 0.5)
            await glow(page, "button[type='submit']")
            await wait(page, 0.4)
            await try_click(page, "button[type='submit']", "submit login")
            try:
                await page.wait_for_selector(".hero-card, [class*='dashboard'], h1", timeout=15000)
            except Exception: pass
            await wait(page, audio_dur - 10, "settle on dashboard")
            await ctx.storage_state(path=AUTH_FILE)
            log(f"  -> Saved Auth State to {AUTH_FILE}")

        elif name == "03_Dashboard":
            await wait(page, 2, "reading greeting")
            await glow(page, ".hero-card, .stat-card-glass")
            await wait(page, 4, "GPA and score")
            await scroll(page, 380)
            await wait(page, 3, "Quick Actions")
            await glow(page, ".card-white, [class*='quick-action']")
            await wait(page, 3)
            await scroll(page, 760)
            await wait(page, 4, "AI Support Team")
            await scroll(page, 0)
            await wait(page, audio_dur - 18, "overview complete")

        elif name == "04_AINavigator":
            chat_input = "[contenteditable='true'], textarea, input[placeholder*='message'], input[class*='chat']"
            await fill(page, chat_input, "I failed my Calculus midterm — what should I do to recover my grade?", delay=46)
            await wait(page, 0.8)
            await page.keyboard.press("Enter")
            await wait(page, 9, "AI regenerating response...")
            await page.evaluate("window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})")
            await wait(page, 6, "reading full AI response")
            await page.evaluate("window.scrollTo({top:0,behavior:'smooth'})")
            await wait(page, audio_dur - 21, "AI scene complete")

        elif name == "05_Courses":
            await scroll(page, 300)
            await wait(page, 3, "courses list")
            await scroll(page, 0)
            
            await try_click(page, ".sidebar .nav-item:has-text('Degree Roadmap')", "Navigating to Degree Roadmap", 8000)
            await wait(page, 2, "roadmap loaded")
            await scroll(page, 300)
            await wait(page, 4, "semester blocks")
            await scroll(page, 0)
            await wait(page, audio_dur - 13, "roadmap overview")

        elif name == "06_Tutoring":
            await try_click(page, "button:has-text('Sync Roster'), button:has-text('Sync')", "Sync Roster")
            await wait(page, 2)
            await try_click(page, ".card-white:first-of-type, button:has-text('Book')", "open booking")
            await wait(page, 2)
            await fill(page, "textarea", "I need help with Python — specifically Lists and loops.", delay=42)
            await page.evaluate("const d = document.querySelector(\"input[type='date']\"); if(d){ d.value='2026-04-15'; d.dispatchEvent(new Event('input')); }")
            await wait(page, 1)
            await try_click(page, "button[type='submit']:has-text('Confirm'), button:has-text('Confirm Appointment')", "Confirm Appointment")
            await wait(page, audio_dur - 12, "booking confirmed")

        elif name == "07_Wellness":
            await scroll(page, 300)
            await wait(page, 3)
            await scroll(page, 0)
            await wait(page, audio_dur - 6)

        elif name == "08_Holds":
            await glow(page, "[class*='hold'], .card-white")
            await wait(page, 4, "reading hold")
            await glow(page, "button:has-text('Resolve'), button:has-text('How to fix')")
            await wait(page, audio_dur - 7)

        elif name == "09_FinancialAid":
            await try_click(page, "text=Scholarship Matcher", "Scholarship Matcher tab")
            await wait(page, 2)
            await try_click(page, "button:has-text('Force AI Re-scan')", "Force AI Re-scan")
            await wait(page, 5, "matching...")
            await scroll(page, 350)
            await wait(page, audio_dur - 10)

        elif name == "10_SocialCampus":
            await scroll(page, 300)
            await wait(page, 4)
            await try_click(page, "text=Peer Mentoring", "Peer Mentoring tab")
            await wait(page, 3)
            await try_click(page, "text=Textbook Marketplace", "Textbook Marketplace tab")
            await wait(page, audio_dur - 12)

        elif name == "11_AdminPanel":
            await scroll(page, 300)
            await wait(page, 4)
            await scroll(page, 0)
            await wait(page, audio_dur - 6)

        elif name == "12_Closing":
            await wait(page, audio_dur, "closing slide")

        # ── TEARDOWN & MUX ──────────────────────────────────────────────────
        log("\n[SAVING] Closing browser...")
        raw_vid_path = await page.video.path()
        await ctx.close()
        await browser.close()
        
        log(f"\n[MUX] Mixing {name}.mp4 with voiceover...")
        if os.path.exists(final_out):
            os.remove(final_out)
        
        # Mux and strictly trim video to the exact audio duration to maintain perfect sync
        run_ffmpeg([
            FFMPEG, "-y",
            "-i", raw_vid_path,
            "-i", vo_path,
            "-t", str(audio_dur),
            "-c:v", "libx264", "-preset", "fast", "-crf", "20",
            "-c:a", "aac",
            "-vf", "scale=1920:1080",
            final_out
        ], "mux video+audio")

        os.remove(raw_vid_path)  # clean up raw webm
        size_mb = os.path.getsize(final_out) / 1024 / 1024
        log(f"\n[DONE] Produced {final_out} ({size_mb:.1f} MB)\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python record_chapter_v4.py <scene_name|all>")
        sys.exit(1)
        
    target = sys.argv[1]
    if target == "all":
        # Always do SignIn first for auth, then the rest
        asyncio.run(record_scene("02_SignIn"))
        for s in SCENES:
            if s != "02_SignIn":
                asyncio.run(record_scene(s))
    else:
        if target not in SCENES:
            print(f"Unknown scene: {target}\nValid scenes: {SCENES}")
            sys.exit(1)
        asyncio.run(record_scene(target))
