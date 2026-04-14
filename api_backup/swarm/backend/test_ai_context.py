import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "3_code", "backend"))

from app.agent.graph import tutor_agent, AgentState
from langchain_core.messages import HumanMessage

async def test_agent_context():
    print("Testing Tutor Agent Context Integration...")
    
    # Mock context
    student_context = {
        "name": "Jane Doe",
        "major": "Mechanical Engineering",
        "gpa": 2.1,
        "background": "Jane is a first-generation student.",
        "detailed_sis": {"academic_standing": "Probation"},
        "previous_insight": "Jane expressed interest in thermodynamics study groups last week."
    }
    
    state: AgentState = {
        "messages": [HumanMessage(content="I failed my calculus exam and I'm really worried about my probation status.")],
        "student_id": "test_jane",
        "student_context": student_context,
        "next_step": "",
        "final_response": {},
    }
    
    # Run the agent node
    result = await tutor_agent(state)
    
    print("\n--- AI Response ---")
    print(result['final_response']['message_content'])
    print("\n--- Action Items ---")
    print(result['final_response']['action_items'])
    print("\n--- Cited Sources ---")
    print(result['final_response']['cited_sources'])
    
    # Verify context usage
    msg = result['final_response']['message_content'].lower()
    if "jane" in msg:
        print("\n✅ Verification SUCCESS: Student name found in response.")
    else:
        print("\n❌ Verification FAILED: Student name missing from response.")
        
    if "calculus" in msg:
        print("✅ Verification SUCCESS: Course context found in response.")
    else:
        print("❌ Verification FAILED: Course context missing from response.")

if __name__ == "__main__":
    if not os.environ.get("GOOGLE_API_KEY"):
        print("Set GOOGLE_API_KEY environment variable first.")
    else:
        asyncio.run(test_agent_context())
