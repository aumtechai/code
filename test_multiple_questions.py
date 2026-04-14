import asyncio
import os
import sys
import json
import time

from dotenv import load_dotenv
load_dotenv(".env.local")

sys.path.append(os.path.join(os.path.dirname(__file__), "api", "swarm", "aura_core"))
from agents.aura_agents import run_aura_core_query_async

async def main():
    questions = [
        "What is my current major and background?", # Should trigger STUDENT_HELP
        "How much financial aid am I getting and what is my net due?", # Should trigger FINANCIER
        "I need help organizing my degree roadmap and also want to find a job matching my skills." # Plural: ACADEMIC_ADVISOR + CAREER_PLACEMENT
    ]
    email = "erin.carlson1@txu.edu"
    
    for idx, q in enumerate(questions):
        print(f"\n============================\nQUESTION {idx+1}")
        print(f"User: {q}")
        start = time.time()
        try:
            res = await run_aura_core_query_async(q, email)
            print("--- AGENT RESPONSE ---")
            print(res.get("answer", "No answer provided."))
            print(f"> Processing took: {res.get('processing_seconds', 0)} seconds")
            print(f"> Flow Log Log: {json.dumps(res.get('flow_log', []), indent=2)}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
