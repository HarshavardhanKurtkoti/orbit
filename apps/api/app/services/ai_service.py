import json
import logging
import httpx
from app.core.config import settings
from app.schemas.ai import AiGeneratedPlan, ProjectBlueprint, TaskBlueprint, MilestoneBlueprint

logger = logging.getLogger(__name__)


def _extract_and_parse_json(raw_text: str) -> dict:
    text = raw_text.strip()

    # Strip markdown code blocks if the LLM outputted ```json ... ```
    if "```" in text:
        lines = text.splitlines()
        cleaned_lines = []
        inside = False
        for line in lines:
            if line.strip().startswith("```"):
                inside = not inside
                continue
            cleaned_lines.append(line)
        text = "\n".join(cleaned_lines).strip()

    # Extract outermost JSON object bracket if there's surrounding chatter
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        text = text[start : end + 1]

    return json.loads(text)


class AiWorkspaceService:
    @staticmethod
    async def generate_plan(prompt: str) -> dict:
        system_prompt = (
            "You are ORBIT's AI Systems Architect. Given a user goal, output ONLY a valid JSON object "
            "(no markdown, no backticks, no code fences, no conversational prose) with schema:\n"
            "{\n"
            '  "title": str,\n'
            '  "description": str,\n'
            '  "projects": [\n'
            "    {\n"
            '      "title": str,\n'
            '      "description": str,\n'
            '      "priority": "low" | "medium" | "high" | "urgent",\n'
            '      "tasks": [{"title": str, "priority": "low" | "medium" | "high" | "urgent", "estimated_hours": int}]\n'
            "    }\n"
            "  ],\n"
            '  "milestones": [{"title": str, "target_week": int}]\n'
            "}"
        )

        # 1. OpenRouter Provider
        if (settings.LLM_PROVIDER == "openrouter" or settings.OPENROUTER_API_KEY) and settings.OPENROUTER_API_KEY:
            try:
                headers = {
                    "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "ORBIT Spatial OS",
                    "Content-Type": "application/json",
                }
                async with httpx.AsyncClient(timeout=18.0) as client:
                    response = await client.post(
                        "https://openrouter.ai/api/v1/chat/completions",
                        headers=headers,
                        json={
                            "model": settings.effective_openrouter_model,
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": prompt},
                            ],
                            "temperature": 0.4,
                        },
                    )

                    if response.status_code == 200:
                        data = response.json()
                        raw_content = data["choices"][0]["message"]["content"]
                        parsed = _extract_and_parse_json(raw_content)
                        validated = AiGeneratedPlan.model_validate(parsed)
                        return validated.model_dump()
                    else:
                        logger.warning(
                            "OpenRouter error %s: %s",
                            response.status_code,
                            response.text[:300],
                        )
            except Exception as e:
                logger.error("OpenRouter request failed: %s", e)

        # 2. OpenAI Provider
        if settings.OPENAI_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=35.0) as client:
                    response = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                        json={
                            "model": "gpt-4o-mini",
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": prompt},
                            ],
                            "response_format": {"type": "json_object"},
                            "temperature": 0.7,
                        },
                    )
                    if response.status_code == 200:
                        data = response.json()
                        raw_content = data["choices"][0]["message"]["content"]
                        parsed = _extract_and_parse_json(raw_content)
                        validated = AiGeneratedPlan.model_validate(parsed)
                        return validated.model_dump()
            except Exception as e:
                logger.error("OpenAI request failed: %s", e)

        # 3. Deterministic Fallback Mode
        lower_prompt = prompt.lower()
        if "backend" in lower_prompt or "engineer" in lower_prompt or "system" in lower_prompt:
            plan = AiGeneratedPlan(
                title="Cloud Backend & Systems Mastery",
                description="Comprehensive roadmap covering distributed systems, PostgreSQL, Redis caching, and microservices architecture.",
                projects=[
                    ProjectBlueprint(
                        title="Core Database Architecture & Indexing",
                        description="Deep dive into PostgreSQL query plans, B-Tree indexes, asyncpg connection pooling, and connection isolation.",
                        priority="urgent",
                        tasks=[
                            TaskBlueprint(title="Design normalized relational schema with UUID primary keys", priority="urgent", estimated_hours=4),
                            TaskBlueprint(title="Benchmark EXPLAIN ANALYZE on multi-million row joins", priority="high", estimated_hours=6),
                            TaskBlueprint(title="Implement async transaction context managers", priority="medium", estimated_hours=3),
                        ],
                    ),
                    ProjectBlueprint(
                        title="Distributed Caching & Event Messaging",
                        description="Implementing Redis pub/sub, caching patterns, cache stampede prevention, and background tasks.",
                        priority="high",
                        tasks=[
                            TaskBlueprint(title="Set up Redis key eviction policies and TTL strategies", priority="high", estimated_hours=4),
                            TaskBlueprint(title="Build rate-limiting sliding window middleware", priority="medium", estimated_hours=5),
                        ],
                    ),
                    ProjectBlueprint(
                        title="Production Observability & Hardening",
                        description="Structured logging, health probes, Prometheus metrics, and automated Docker testing.",
                        priority="medium",
                        tasks=[
                            TaskBlueprint(title="Configure graceful shutdown with signal handling", priority="medium", estimated_hours=3),
                            TaskBlueprint(title="Write comprehensive integration tests with pytest-asyncio", priority="high", estimated_hours=6),
                        ],
                    ),
                ],
                milestones=[
                    MilestoneBlueprint(title="Database Performance Certification", target_week=2),
                    MilestoneBlueprint(title="Distributed Systems Prototype Deploy", target_week=4),
                    MilestoneBlueprint(title="Production Architecture Ready", target_week=6),
                ],
            )
            return plan.model_dump()
        else:
            plan = AiGeneratedPlan(
                title=f"Strategic Objective: {prompt[:40]}...",
                description=f"AI-structured execution plan synthesized from requirement: '{prompt}'.",
                projects=[
                    ProjectBlueprint(
                        title="Discovery & Architecture Formulation",
                        description="Initial scoping, dependency mapping, and foundational structure setup.",
                        priority="high",
                        tasks=[
                            TaskBlueprint(title="Define technical specifications and boundary conditions", priority="high", estimated_hours=4),
                            TaskBlueprint(title="Establish baseline environment and telemetry", priority="medium", estimated_hours=3),
                        ],
                    ),
                    ProjectBlueprint(
                        title="Core Feature Implementation & Integration",
                        description="Execution of primary capabilities and bidirectional connection wiring.",
                        priority="urgent",
                        tasks=[
                            TaskBlueprint(title="Build primary pipeline workflow", priority="urgent", estimated_hours=8),
                            TaskBlueprint(title="Connect cross-module signals and feedback loops", priority="high", estimated_hours=5),
                        ],
                    ),
                    ProjectBlueprint(
                        title="Review, Testing & Delivery",
                        description="Quality assurance, verification against acceptance criteria, and release.",
                        priority="medium",
                        tasks=[
                            TaskBlueprint(title="Run verification test suite and benchmark latency", priority="medium", estimated_hours=4),
                            TaskBlueprint(title="Final polish and launch sign-off", priority="high", estimated_hours=2),
                        ],
                    ),
                ],
                milestones=[
                    MilestoneBlueprint(title="Architecture Baseline Complete", target_week=1),
                    MilestoneBlueprint(title="Core Pipeline Operational", target_week=3),
                    MilestoneBlueprint(title="Target Goal Achieved", target_week=5),
                ],
            )
            return plan.model_dump()
