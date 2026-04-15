# AI Model Swarm Architecture Comparison

This document outlines the comparative advantages of various AI models specifically for the Aura Multi-Agent Swarm setup using the `AsyncOpenAI` compatibility layer.

## 1. Gemini 1.5 Flash (Current Setup)
- **Best For:** High speed and processing massive context.
- **Pros:** `gemini-1.5-flash` is one of the fastest models on the market. It supports a massive 1-million-token context window which is amazing if we ever want the agents to read huge syllabus PDFs or entire campus catalogs.
- **Cons:** Its JSON enforcement can occasionally be slightly erratic, which requires a robust regex fallback for extraction (like the `extract_json()` utility).
- **Cost:** Extremely low cost (roughly $0.075 per 1 million tokens).

## 2. OpenAI (`gpt-4o-mini`)
- **Best For:** Absolute reliability in JSON output and easy integration.
- **Pros:** `gpt-4o-mini` is roughly the same price and speed as Gemini Flash. OpenAI is generally regarded as the industry gold standard for strictly adhering to JSON schemas, which is very useful for our Orchestrator routing and DB queries. 
- **Migration:** Effortless. Because the backend already utilizes the `AsyncOpenAI` python wrapper, you would only need to drop in an `sk-proj-...` key, remove the Google `base_url` argument in `aura_agents.py`, and change the model name string to `gpt-4o-mini`. 

## 3. Anthropic Claude (`claude-3-5-haiku` or `claude-3-5-sonnet`)
- **Best For:** Nuance, empathy, and writing quality.
- **Pros:** Claude is vastly superior at adopting "personas". If you want the *Mental Health Counselor* or *Peer Mentor* agents to sound deeply empathetic, human, and conversational, Claude 3.5 Sonnet is unmatched. 
- **Cons:** It is generally more expensive than Flash/mini.
- **Migration:** Slightly more involved. We would need to rewrite `aura_agents.py` to use the `anthropic` SDK instead of the `openai` SDK or route through an intermediary proxy gateway since Anthropic does not natively support the OpenAI HTTP format.

## Recommendation
If you want to keep costs extremely low while maintaining rapid response times, **Pay-as-you-go Gemini 1.5 Flash** or **OpenAI's gpt-4o-mini** are both perfect for your Swarm. If you choose OpenAI, no code changes are required other than updating the API URL and Key.
