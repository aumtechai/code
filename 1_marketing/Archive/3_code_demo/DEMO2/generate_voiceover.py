import asyncio
import edge_tts
import os

VOICE = "en-US-ChristopherNeural"  # Professional male voice
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "voiceovers")

SCRIPT = {
    "01_Hook_EdNex": (
        "Higher education technology is mostly unreliable to make data informed decision support due to the lack of "
        "data quality, governance and it is perceived by stakeholders as broken. "
        "Universities have decades of legacy infrastructure—student records in a mainframe, "
        "grades in Canvas, billing in WorkDay Finance. "
        "So, to introduce AI into this ecosystem without a unified data layer is impossible. "
        "That is why before we ever show you the student app, we need to show you EdNex. "
        "EdNex is our hybrid staging platform—a tool-agnostic data hub. "
        "It ingests your unstructured and structured data daily, normalizes it, vectorizes it, "
        "and safely provisions it for our Intelligence layers. "
        "Through nightly Airbyte syncs or daily secure SFTP drops, EdNex seamlessly merges your "
        "core IT systems without you having to rebuild your infrastructure. "
        "This is what enables real-time, proactive AI—we call it 'Roster Truth.'"
    ),
    "02_Aura_Tiers": (
        "Once the data is inside EdNex, how do we process it securely? Meet the Aura Intelligence Tiers. "
        "For most institutions, we deploy Aura Prism. This acts as a Privacy Gateway—a stateless API proxy "
        "that scrubs all PII and any classified and compliance sensitive data before reasoning "
        "through high-performance cloud models like Google Gemini, then restores the data before "
        "the student ever sees the answer. Full intelligence, zero leakage. "
        "But for state institutions requiring absolute sovereignty, we offer Aura Vault. "
        "This deploys an air-gapped, sovereign LLM entirely within your university's VPC. "
        "No data ever leaves your walled garden or used to train the vendor’s LLM."
    ),
    "03_SignIn": (
        "So what does this architecture actually look like for the student? Let's log in. "
        "Instantly, the system queries the EdNex data warehouse. It pulls the student's current LMS grades, "
        "financial holds, and advising history—loading a fully personalized academic profile "
        "before the page even finishes rendering."
    ),
    "04_Dashboard": (
        "Welcome to the Aura dashboard. At the center is the On-Track Score, a dynamic metric "
        "that continuously evaluates a student’s progress by factoring in grades, outstanding holds, "
        "and wellness check-ins. You’ll also notice the ‘EdNex Verified’ badge. "
        "This tells students that the information they’re seeing is not an AI guess or hallucination, "
        "it is verified directly against the university’s official source of truth. "
        "Instead of logging into three different systems to understand why they can’t register, "
        "Aura provides proactive guidance. For example, it might say: ‘You currently have a Bursar hold for $140. "
        "Click here to resolve it.’ That’s the power of unified, trusted data, turning complexity into clarity for students."
    ),
    "05_GetAuraChat": (
        "At the heart of the platform is Get Aura — the conversational academic agent. "
        "Watch this. I'll ask it: 'I failed my Calculus midterm and I think I'm losing my scholarship.' "
        "Look at how the AI responds. It didn't just point to a generic counseling center link. "
        "It checked EdNex. It knows this student's exact GPA, the scholarship parameters, "
        "and sees that taking a drop will save the scholarship. "
        "It then instantly offers to book an appointment with their assigned advisor. "
        "It is truly next-generation advising—available twenty-four seven."
    ),
    "06_Courses": (
        "Under Academics, students get a crystal-clear view of every course they are taking — grades, "
        "credit hours, and AI-generated improvement suggestions appear automatically. "
        "Click on the Degree Roadmap, and the student sees their entire academic journey laid out visually. "
        "Which credits are complete. Which are in progress. What is missing before they can graduate. "
        "No more mysterious holds about missing prerequisites. "
        "Get Aura proactively surfaces gaps before they derail a semester."
    ),
    "07_Tutoring": (
        "One of our most powerful features is the intelligent Tutoring System, built directly on top of EdNex Roster Truth. "
        "Their full course schedule is verified live. Now they select Intro to Computer Science, "
        "enter a triage note: 'I am struggling with Python lists', and attach a screenshot of their code. "
        "In under two seconds, the AI analyzes the note, generates a concise briefing for the Teaching Assistant, "
        "and our Round Robin load balancer assigns the TA with the lowest current workload. "
        "This is intelligent academic triage at scale."
    ),
    "08_Wellness": (
        "Aura doesn't just track grades — it cares about the whole student. "
        "The Wellness Check-In prompts short, thoughtful surveys. Responses are processed to identify "
        "and personalize recommendations — like a study break, a campus resource, or a gentle nudge toward counseling services. "
        "For students needing to focus, the Study Timer provides a built-in Pomodoro-style productivity tool."
    ),
    "09_Holds": (
        "One of the largest hidden barriers to graduation is the mystery hold—a blockage that offers zero explanation. "
        "Aura's Holds Center identifies every active hold in plain language: why it exists, "
        "how much is owed, and exactly what the student needs to do to resolve it. "
        "One click initiates resolution—no more emailing three different offices."
    ),
    "10_FinancialAid": (
        "Financial stress is the leading cause of dropouts. The Financial Aid Nexus changes the game. "
        "Click 'AI Match', and Gemini analyzes the student's entire profile from EdNex against available scholarships, ranking them by fit. "
        "But we take it further. Click 'Draft Statement', and the AI scaffolds a personalized, "
        "professional scholarship essay using the student's history. "
        "What used to take days of writing and anxiety now takes seconds to start."
    ),
    "11_SocialCampus": (
        "College is also about community. The Social Campus module seamlessly connects verified peers. "
        "The Study Buddy Finder automatically matches students taking the same courses. "
        "The Textbook Marketplace lets students buy and sell materials directly within the safety "
        "of the verified platform—no third-party sites, no awkward public meetups."
    ),
    "12_AdminPanel": (
        "Now, flip over to the administrative perspective. "
        "Leadership and Advising staff see a live dashboard tracking every student's academic risk. "
        "Students in trouble are flagged red continuously with full context. "
        "Admins can launch targeted outreach campaigns instantly—select at-risk first-generation students in STEM, "
        "write a personalized message, and dispatch. "
        "Through Tutoring Analytics, Deans know exactly which courses have the highest load demands "
        "to redeploy TA resources dynamically."
    ),
    "13_TCO": (
        "Finally, the business case. To prove our Return on Investment against fractured legacy systems like EAB Navigate, "
        "we use our Quote and TCO Generator. "
        "When you plug in a university of 10,000 students running entirely sovereign on the Aura Vault tier, "
        "the tool shows exactly what your costs look like. "
        "Compare this to legacy platforms, which often cost over $260k just in the first year with long implementations. "
        "Through EdNex integrations and predictable per-student intelligence, Aura dramatically slashes Total Cost of Ownership. "
        "The 3-Year Institutional savings show that migrating to Aura essentially pays for itself."
    ),
    "14_Closing": (
        "Aura is more than just software. It is a mission to ensure every student—regardless of background "
        "or enrollment size—gets the focused, intelligent advising they deserve to graduate. "
        "We are replacing fragmented portals with a unified, context-aware intelligence ecosystem. "
        "Thank you. Let's rebuild the student experience."
    )
}

async def generate_audio():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"[GENERATING] {len(SCRIPT)} audio files using voice: {VOICE}")
    print(f"[OUTPUT DIR] {OUTPUT_DIR}\n")

    for filename, text in SCRIPT.items():
        output_file = os.path.join(OUTPUT_DIR, f"{filename}.mp3")
        communicate = edge_tts.Communicate(text, VOICE)
        await communicate.save(output_file)
        size_kb = os.path.getsize(output_file) // 1024
        print(f"  [OK] {filename}.mp3  ({size_kb} KB)")

    print(f"\n[DONE] All {len(SCRIPT)} audio files saved to: {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(generate_audio())
