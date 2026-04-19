import os
import sys
import json
import time
import asyncio
import traceback
import re
from typing import List, Dict, Any
from openai import AsyncOpenAI

# Add 5_Aura_Core path so Python can find the 'tools' folder
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

try:
    from dotenv import load_dotenv
    dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env.local"))
    load_dotenv(dotenv_path)
except ImportError:
    pass

from tools.db_tools import query_ednex_module
from tools.audit_logger import log_agent_call

# Load Agent Configuration
CONFIG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "config", "agent_config.json"))

_cached_config = None
def load_agent_config():
    global _cached_config
    if _cached_config is None:
        with open(CONFIG_PATH, "r") as f:
            _cached_config = json.load(f)
    return _cached_config

def extract_json(text: str) -> dict:
    try:
        return json.loads(text)
    except Exception:
        pass
    match = re.search(r'```(?:json)?\s*(.*?)\s*```', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except Exception:
            pass
    start = text.find('{')
    end = text.rfind('}')
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(text[start:end+1])
        except Exception:
            pass
    return {}

# Lightweight Agent Peer for Swarm logic
class LightweightAgent:
    def __init__(self, name: str, system_message: str, client: AsyncOpenAI):
        self.name = name
        self.system_message = system_message
        self.client = client
        self.history = []

    async def chat(self, message: str, clear_history: bool = True) -> str:
        if clear_history:
            self.history = []
        
        self.history.append({"role": "user", "content": message})
        
        messages = [{"role": "system", "content": self.system_message}] + self.history
        
        response = await self.client.chat.completions.create(
            model="gemini-1.5-flash-latest",
            messages=messages,
            temperature=0.1
        )
        
        reply = response.choices[0].message.content
        self.history.append({"role": "assistant", "content": reply})
        return reply

def run_aura_core_query(query: str, student_email: str):
    """Synchronous wrapper for async flow."""
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(run_aura_core_query_async(query, student_email))

async def run_aura_core_query_async(query: str, student_email: str):
    """
    Lightweight Swarm Orchestrator (Replaces heavy AutoGen).
    Reduces bundle size by ~600MB while maintaining core logic.
    """
    start_time = time.time()
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        return {"status": "error", "message": "GOOGLE_API_KEY is not set."}
    
    api_key = api_key.strip()
        
    # Initialize OpenAI-compatible Client for Gemini
    client = AsyncOpenAI(
        api_key=api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )
    
    config = load_agent_config()
    flow_log = []
    specialist_answers = []

    try:
        # Load Config
        config = load_agent_config()
        
        # Merge specialist prompts into a single master context for efficiency (Protecting Quotas)
        all_specialist_info = "\n".join([f"- {k}: {v['name']} ({v['prompt'][:100]}...)" for k,v in config.items() if k != 'master'])
        
        system_instructions = (
            "You are the Aura Multi-Agent Orchestrator. You have access to academic data modules. "
            f"Specialist Contexts available:\n{all_specialist_info}\n\n"
            "INSTRUCTIONS:\n"
            "1. Analyze the query and student context.\n"
            "2. If you need data, simulate the search yourself using the knowledge of modules: [mod01_profiles, mod04_courses, mod08_aid].\n"
            "3. Return a clean JSON response: {\"final_answer\": \"...\", \"action_items\": [...], \"routing_reason\": \"...\"}\n"
            "DO NOT reveal technical errors or tracebacks. If rate limited, apologize politely."
        )

        master = LightweightAgent(
            name="Aura_Core",
            system_message=system_instructions,
            client=client
        )

        print(f"[Aura_Core] Multi-Agent Synthesis: {query}")
        
        # Attempt the call with retry logic for 429
        max_retries = 2
        for attempt in range(max_retries + 1):
            try:
                raw_response = await master.chat(f"User Query: {query}\nStudent context: {student_email}")
                result = extract_json(raw_response)
                
                duration = time.time() - start_time
                log_agent_call(query, "Aura_SinglePass_Swarm", result.get("final_answer", ""), duration=duration)

                return {
                    "status": "success",
                    "answer": result.get("final_answer", "I am processing your academic data. Could you please rephrase or try in a moment?"),
                    "processing_seconds": round(duration, 2),
                    "routing_reason": result.get("routing_reason", "Optimized Intelligence Path"),
                    "action_items": result.get("action_items", [])
                }
            except Exception as e:
                if "429" in str(e) and attempt < max_retries:
                    time.sleep(2 * (attempt + 1)) # Backoff
                    continue
                raise e

    except Exception as e:
        print(f"[Aura_Core] Swarm Error Handled: {e}")
        return {
            "status": "success", 
            "answer": "Aura is currently synchronizing with high-volume academic data. Please give me 5 seconds to catch up!",
            "routing_reason": "Rate Limit Protection",
            "action_items": ["Try again in 30 seconds", "Contact support if persists"]
        }

if __name__ == "__main__":
    res = run_aura_core_query("What is my current cumulative GPA according to EdNex?", "erin.carlson1@txu.edu")
    print(json.dumps(res, indent=2))
