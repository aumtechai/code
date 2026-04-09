# Aura Project: Pre-Action Checklist & Critical Context

Follow these rules strictly before executing any code changes, testing, or architecture decisions.

## 1. Architectural Source of Truth
*   **Primary Document**: Always consult [PRODUCT_ARCHITECTURE.md](file:///c:/Projects/AA/at/2_architecture/PRODUCT_ARCHITECTURE.md). 
*   **Visual Guide**: Refer to [ARCHITECTURE_REFINEMENT.md](file:///c:/Projects/AA/at/2_architecture/ARCHITECTURE_REFINEMENT.md) for the "Blue/TECHNICAL" ArcadeDB-style aesthetic.
*   **Status**: EdNex is the **Supabase-backed Student Data Warehouse**. Neon is the **Primary PostgreSQL** for application-specific state (subscriptions, sessions, etc.).

## 2. Testing Protocols
*   **Browser Mode**: Every time you test the UI, open the browser with **password save disabled** to avoid credential contamination.
*   **Real-Student Testing**: "Get Aura" chat MUST be validated with real student accounts from Supabase (e.g., Erin Carlson: `erin.carlson1@txu.edu` / `password123`).

## 3. EdNex (Supabase) Integration Rules
*   **EdNex = Supabase**: These terms are interchangeable. "Student data" always resides in the EdNex Supabase instance.
*   **Stateless Proxy**: Students logging in via university email are stateless. Authentication and profile retrieval must go through the EdNex Supabase client (`app/ednex.py`).
*   **GPA Source**: Academic metrics (GPA, Standing) must be pulled from the `mod01_student_profiles` table in Supabase.

## 4. Aura Chat (Core USP) Implementation
*   **Agent Fallback**: If `langgraph` or other high-level agentic libraries are unavailable in the local environment, use the **Direct HTTP Bridge** in `app/api.py` to communicate with Gemini.
*   **Thinking State**: Ensure the UI shows technical "Thinking Steps" (Querying EdNex, etc.) to communicate agent value.

## 5. Local Environment Constraints
*   **Python Version**: Current environment is **Python 3.8.10**. Newer libraries (like latest `langgraph` or `google-generativeai`) may require `python >=3.9`. 
*   **Workaround**: Use `httpx` for raw API calls when package compatibility fails.
*   **Ports**: Frontend runs on `5173`, Backend (FastAPI) on `8000`.

## 6. Database Safety
*   **Neon Override Warning**: If a "SUPABASE_URL" or "SUPABASE_KEY" exists in the `SystemConfig` table in Neon, it will override the code defaults. Always check if these overrides have been accidentally set to invalid values (like emails/passwords) if EdNex sync fails.
