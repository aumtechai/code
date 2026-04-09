# Aura Core: Multi-Agent Specialist Hub

This directory contains the central agentic software for the Aura platform. It utilizes a Master-Specialist architecture to provide data-driven insights from the EdNex student data warehouse.

## Architecture
1. **Master Agent (`Aura_Master`)**: Routes student queries to the most relevant specialist.
2. **Specialized Agents**:
   - `Student_Help_Agent`: General profile and hurdles.
   - `Academic_Advisor_Agent`: GPA, degree progress, and planning.
   - `Financial_Agent`: Tuition, aid, and transactions.
   - `Career_Placement_Agent`: Jobs and student contributions.
3. **EdNex Tools**: Directly queries Supabase modules based on the specialist's requirements.
4. **Audit Hub**: Logs query metrics and agent handshake flow for performance monitoring.

## Directory Structure
- `agents/`: Contains AutoGen agent definitions and orchestration logic.
- `config/`: JSON configuration for system prompts and data access mapping.
- `tools/`: Handlers for database connectivity (Supabase) and auditing.
- `audit/`: Local JSON-based trace store.
- `tests/`: Standalone validation server and HTML interface.

## Quick Start
1. Ensure `GOOGLE_API_KEY`, `SUPABASE_URL`, and `SUPABASE_KEY` are set in the environment.
2. Run `start_core.bat` (Windows) or `python tests/aura_test_server.py`.
3. Open `tests/aura_test.html` in your browser to interact with the specialists directly.

## Requirements
- Python 3.10+ (Recommended for latest AutoGen)
- `pyautogen==0.2.35`
- `supabase`
- `google-generativeai`
- `fastapi`, `uvicorn`
