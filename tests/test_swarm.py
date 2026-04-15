import os
import sys
import json
import asyncio

sys.path.append(os.path.abspath('api/swarm'))
from aura_core.agents.aura_agents import run_aura_core_query_async

async def main():
    result = await run_aura_core_query_async('What is my current cumulative GPA?', 'eric.moore0@txu.edu')
    with open('test_swarm_out.json', 'w') as f:
        json.dump(result, f, indent=2)

if __name__ == '__main__':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
