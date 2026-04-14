import asyncio
import os
import sys
import json
import time

# Load env
from dotenv import load_dotenv
load_dotenv(".env.local")

sys.path.append(os.path.join(os.path.dirname(__file__), "api", "swarm", "aura_core"))

from agents.aura_agents import run_aura_core_query_async

async def main():
    print("API KEY:", os.environ.get("GOOGLE_API_KEY"), flush=True)
    query = "I am an accounting student. I want to know my class schedule and what internship opportunities are available for me right now."
    email = "erin.carlson1@txu.edu"
    print(f"Testing Complex Query: {query}", flush=True)
    start = time.time()
    try:
        res = await run_aura_core_query_async(query, email)
        print("\n\n--- MULTI-AGENT SWARM RESULT ---", flush=True)
        print(json.dumps(res, indent=2), flush=True)
    except Exception as e:
        print("ERROR:", str(e), flush=True)
    print("FINISHED IN:", time.time() - start, "seconds", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
