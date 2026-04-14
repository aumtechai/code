import json
import datetime
import os

# Audit Log Dir in project local dir
AUDIT_LOG_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "audit"))

def log_agent_call(query: str, agent_name: str, response: str, status: str = "success", duration: float = 0.0, context: dict = None):
    """
    Store the audit log in the filesystem as a structured JSON.
    This also enables the visualizer to fetch the process flow.
    """
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = {
        "timestamp": timestamp,
        "query": query,
        "agent": agent_name,
        "response_summary": response[:200] + "..." if len(response) > 200 else response,
        "status": status,
        "processing_time": f"{duration:.3f}s",
        "context_used": context
    }
    
    # Write to audit/audit_log.json
    log_file = os.path.join(AUDIT_LOG_DIR, "audit_log.json")
    
    try:
        logs = []
        if os.path.exists(log_file):
            with open(log_file, "r") as f:
                logs = json.load(f)
        
        logs.append(log_entry)
        
        with open(log_file, "w") as f:
            json.dump(logs[-100:], f, indent=2) # Keep last 100 logs
            
        print(f"[Aura_Core] Audit: {agent_name} logged at {timestamp}")
    except Exception as e:
        print(f"Audit log error: {e}")

def generate_visual_state():
    """
    Helper for the browser visualization to see the latest call.
    """
    # Simple logic to convert logs into a flowchart or trace
    pass
