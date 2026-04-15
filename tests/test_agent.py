import asyncio
import os
import sys

# Load env
from dotenv import load_dotenv
load_dotenv(".env.local")

sys.path.append(os.path.join(os.path.dirname(__file__), "api", "swarm", "aura_core"))

from agents.aura_agents import run_aura_core_query_async

async def main():
    print("API KEY:", os.environ.get("GOOGLE_API_KEY"))
    query = "I am worried about my grades impacting my financial aid, and I am also looking for an internship. Help me understand."
    email = "erin.carlson1@txu.edu"
    print(f"Testing Complex Query: {query}")
    res = await run_aura_core_query_async(query, email)
    
    import json
    print("\n\n--- MULTI-AGENT SWARM RESULT ---")
    print(json.dumps(res, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
