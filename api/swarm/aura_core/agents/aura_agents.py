import os
import sys
import json
import time
import asyncio
import traceback
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

def load_agent_config():
    with open(CONFIG_PATH, "r") as f:
        return json.load(f)

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
            model="gemini-flash-latest",
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
        
    # Initialize OpenAI-compatible Client for Gemini
    client = AsyncOpenAI(
        api_key=api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )
    
    config = load_agent_config()
    flow_log = []
    specialist_answers = []

    try:
        # 1. Planning Phase: Orchestrator
        orchestrator = LightweightAgent(
            name="Aura_Orchestrator",
            system_message="""You are the Aura Master Orchestrator. 
Identify ALL specialists needed from: ACADEMIC_ADVISOR, FINANCIER, STUDENT_HELP, CAREER_PLACEMENT.
Respond ONLY with JSON: {"selected_agents": ["AGENT_KEY"], "reasoning": "..."}""",
            client=client
        )

        print(f"[Aura_Core] Orchestrating: {query}")
        plan_raw = await orchestrator.chat(f"User Query: {query}\nWhich specialists are needed?")
        
        # Clean JSON
        plan_clean = plan_raw.strip().replace("```json", "").replace("```", "")
        master_decision = json.loads(plan_clean)
        
        agent_key_map = {
            "STUDENT_HELP": "student_help",
            "ACADEMIC_ADVISOR": "academic_advisor",
            "FINANCIER": "financier",
            "CAREER_PLACEMENT": "placement"
        }

        selected_keys = [agent_key_map.get(k) for k in master_decision.get("selected_agents", []) if agent_key_map.get(k)]
        if not selected_keys: selected_keys = ["student_help"]

        flow_log.append({
            "sender": "Aura_Orchestrator",
            "content": f"Plan: {master_decision.get('reasoning', 'Standard consult.')}"
        })

        # 2. Execution Phase: Specialists
        for agent_key in selected_keys:
            selected_agent_config = config.get(agent_key, config["student_help"])
            agent_name = selected_agent_config["name"]
            
            specialist = LightweightAgent(
                name=agent_name,
                system_message=selected_agent_config["prompt"],
                client=client
            )
            
            print(f"[Aura_Core] Consulting {agent_name}...")
            
            # Sub-Phase A: Tool/Module Decision
            spec_msg = f"User Query: {query}. From student: {student_email}. Based on your role, suggest target_module in JSON: {{\"target_module\": \"...\"}}"
            spec_init_raw = await specialist.chat(spec_msg)
            spec_init_clean = spec_init_raw.strip().replace("```json", "").replace("```", "")
            spec_decision = json.loads(spec_init_clean)
            target_module = spec_decision.get("target_module", "general")
            
            # Sub-Phase B: Data Retrieval
            db_data = query_ednex_module(target_module, student_email)
            
            # Sub-Phase C: Final Domain Answer (Maintain Context)
            final_msg = f"EdNex DB Data for {target_module}: {db_data}. Provide your final analysis in JSON: {{\"message_content\": \"...\", \"sources\": [...]}}"
            final_raw = await specialist.chat(final_msg, clear_history=False)
            final_clean = final_raw.strip().replace("```json", "").replace("```", "")
            final_result = json.loads(final_clean)
            
            specialist_answers.append({
                "agent": agent_name,
                "content": final_result.get("message_content", "Information retrieved."),
                "source": final_result.get("sources", [])
            })
            
            flow_log.append({
                "sender": agent_name,
                "content": f"Analysis complete via {target_module}."
            })

        # 3. Synthesis Phase
        synthesizer = LightweightAgent(
            name="Synthesizer",
            system_message="Combine specialists reports into a cohesive final answer. Respond in JSON: {\"final_answer\": \"...\", \"action_items\": [...]}",
            client=client
        )
        
        synth_prompt = f"User query: {query}\n\nReports:\n{json.dumps(specialist_answers)}\nProvide final synthesis."
        synth_raw = await synthesizer.chat(synth_prompt)
        synth_clean = synth_raw.strip().replace("```json", "").replace("```", "")
        synthesis_result = json.loads(synth_clean)

        duration = time.time() - start_time
        log_agent_call(query, "Aura_Lightweight_Swarm", synthesis_result.get("final_answer", ""), duration=duration)
        
        return {
            "status": "success",
            "answer": synthesis_result.get("final_answer"),
            "flow_log": flow_log,
            "processing_seconds": round(duration, 2),
            "routing_reason": master_decision.get("reasoning", "Multi-Agent Intelligence Path"),
            "action_items": synthesis_result.get("action_items", [])
        }
        
    except Exception as e:
        print(f"[Aura_Core] Swarm Crash: {e}")
        print(traceback.format_exc())
        return {"status": "error", "message": f"Core Swarm Failure: {str(e)}"}

if __name__ == "__main__":
    res = run_aura_core_query("What is my current cumulative GPA according to EdNex?", "erin.carlson1@txu.edu")
    print(json.dumps(res, indent=2))
