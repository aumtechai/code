# Aumtech AI - Core Product Architecture

This document serves as the authoritative reference for the Aumtech AI product architecture.

## 1. Institutions Layer (Data Sources)
- **SIS (Student Information Systems)**: Banner, Colleague, Workday.
- **Finance**: Banner Finance, PeopleSoft.
- **Unstructured Content**: Canvas (LMS), Syllabus PDFs, Course Materials.

## 2. EdNex Platform (Data Processing & Storage)
- **Structured Path**:
    - Relational data flows into **PostgreSQL**.
- **Unstructured Path**:
    - Files and documents flow into **Object Storage (S3)**.
    - Processed via **Parser / Embedder**.
    - Stored in **Vector Database** (pgvector / Pinecone).

## 3. Intelligence Layer (Orchestration & Reasoning)
- **API Gateway**: Powered by **FastAPI**.
- **LLM Context Engine**: The central brain that consumes data from both PostgreSQL (structured) and Vector DB (unstructured) to provide intelligent responses.

---
*Note: This architecture ensures that institutional data is securely ingested, processed based on its type (structured vs. unstructured), and made available to the LLM Context Engine via a unified API Gateway.*
