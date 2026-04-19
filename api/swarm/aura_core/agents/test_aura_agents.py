import json
import asyncio
from aura_agents import run_aura_core_query

if __name__ == "__main__":
    test_queries = [
        "What is my current cumulative GPA according to EdNex?",
        "How can I graduate early? Can you help me plan the next two years?",
        "Do I have any outstanding tuition balance or financial aid updates?",
        "Are there any internship opportunities matching my profile at partner companies?"
    ]
    student = "erin.carlson1@txu.edu"
    
    for q in test_queries:
        print(f"\n--- Testing Query: {q} ---")
        res = run_aura_core_query(q, student)
        print(json.dumps(res, indent=2))
