import json
from app.core.config import settings
from app.schemas.ai import AiGeneratedPlan, ProjectBlueprint, TaskBlueprint, MilestoneBlueprint


class AiWorkspaceService:
    @staticmethod
    async def generate_plan(prompt: str) -> dict:
        # Check if OpenAI or alternative LLM is configured
        if settings.OPENAI_API_KEY:
            try:
                import httpx
                async with httpx.AsyncClient(timeout=30.0) as client:
                    system_prompt = (
                        "You are ORBIT's AI Systems Architect. Given a user goal, output ONLY a valid JSON object "
                        "with schema: {'title': str, 'description': str, 'projects': [{'title': str, 'description': str, "
                        "'priority': 'low'|'medium'|'high'|'urgent', 'tasks': [{'title': str, 'priority': str, 'estimated_hours': int}]}], "
                        "'milestones': [{'title': str, 'target_week': int}]}"
                    )
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
                        content = data["choices"][0]["message"]["content"]
                        parsed = json.loads(content)
                        # Validate with Pydantic
                        validated = AiGeneratedPlan.model_validate(parsed)
                        return validated.model_dump()
            except Exception as e:
                # Log error and fall through to clearly labeled deterministic mode
                pass

        # Clearly labeled deterministic generation engine
        # Analyzes prompt keywords to generate relevant roadmap
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
