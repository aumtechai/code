import os
import sys
import json

# Add directory and start a mock query
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), "5_Aura_Core")))
from agents.aura_agents import run_aura_core_query

def debug_core():
    # Attempt to ask about GPA specifically to summon the Advisor
    q = "What is my current cumulative GPA according to EdNex academic records?"
    e = "erin.carlson1@txu.edu"
    
    print(f"Testing Aura Core Specialists... Q: {q}")
    result = run_aura_core_query(q, e)
    
    if result.get("status") == "success":
        print("Aura Core SUCCESS!")
        print(f"Final Answer: {result['answer'][:100]}...")
        # Check flow for switching agents
        print(f"Agent Conversation Steps: {len(result['flow_log'])}")
    else:
        print(f"Aura Core FAIL: {result.get('message')}")

if __name__ == "__main__":
    debug_core()
