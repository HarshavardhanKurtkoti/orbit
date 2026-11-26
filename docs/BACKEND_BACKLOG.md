# Backend Issues & Future Infrastructure Backlog

This document captures backend improvements, architectural recommendations, and feature backlogs identified during the frontend UI/UX refactoring phase. As per scope restrictions, **zero backend code, database schemas, or API contracts were modified** during this frontend redesign.

---

## 1. Graph Synchronization & Real-Time Layout

- **WebSocket / SSE Stream for Live Coordinates:**
  Currently, node positions and edges poll via REST (`/api/workspaces/:id/graph`). Upgrading to Server-Sent Events or WebSockets would allow multi-device and real-time collaboration on the spatial canvas.
- **Batch Layout Persistence:**
  When multiple nodes are repositioned or force-directed layout algorithms run, batching the coordinate updates into a single transaction endpoint (`PUT /api/workspaces/:id/graph/layout`) will reduce roundtrip overhead.

---

## 2. AI Architect & Planning Job Workers

- **Asynchronous Job Polling with Celery/Redis:**
  The `generateWorkspacePlan` call currently simulates synchronous blueprint generation. For frontier LLM reasoning, moving job generation to a background task queue with status checks (`GET /api/ai/jobs/:id`) will prevent timeouts on complex project plans.
- **Hierarchical Milestone Decomp Schema:**
  Enhance the LLM output schema to natively support sub-tasks, dependency directed acyclic graphs (DAGs), and estimated story points.

---

## 3. Notes & Full-Text Knowledge Indexing

- **BM25 / Vector Search for Knowledge Base:**
  Notes are currently filtered client-side by title and content substring. Adding PostgreSQL pgvector or pg_trgm full-text indexing (`tsvector`) will enable hybrid semantic retrieval across both tasks and knowledge specs.
- **Bidirectional Links & Backlinks:**
  Support `[[wiki-links]]` parsing in the backend API to automatically create relational graph edges between notes, tasks, and project nodes.

---

## 4. Authentication & Multi-Tenancy

- **Token Refresh & RBAC Hardening:**
  The demo authentication currently bootstraps via `api.demoLogin()`. For multi-tenant production, ensure JWT refresh rotation and workspace-level permission roles (Viewer, Editor, Owner) are strictly validated in middleware.
