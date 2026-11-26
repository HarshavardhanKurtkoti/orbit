import asyncio
from datetime import datetime, timezone
from sqlalchemy import select
from app.core.database import AsyncSessionLocal, engine
from app.core.security import get_password_hash
from app.models.base import Base
from app.models.user import User
from app.models.workspace import Workspace, WorkspaceMember
from app.models.project import Project
from app.models.task import Task
from app.models.note import Note
from app.models.goal import Goal
from app.models.graph import GraphNode, GraphEdge
from app.models.ai import AiGenerationJob
from app.models.activity import ActivityEvent


async def seed_data():
    max_retries = 15
    retry_delay = 1.5
    for attempt in range(1, max_retries + 1):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            break
        except (ConnectionRefusedError, OSError, Exception) as e:
            if attempt == max_retries:
                print(f"[seed] Failed to initialize database tables after {max_retries} attempts: {e}")
                raise e
            print(f"[seed] Database not ready yet ({type(e).__name__}: {e}). Retrying in {retry_delay}s ({attempt}/{max_retries})...")
            await asyncio.sleep(retry_delay)

    async with AsyncSessionLocal() as session:
        # Check if already seeded
        result = await session.execute(select(User).where(User.email == "commander@orbit.internal"))
        existing = result.scalar_one_or_none()
        if existing:
            print("Database already seeded with demo user.")
            return

        print("Seeding ORBIT Universe demo data...")

        # 1. User
        user = User(
            email="commander@orbit.internal",
            display_name="Orbit Commander",
            password_hash=get_password_hash("orbit2026!"),
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80",
        )
        session.add(user)
        await session.flush()

        # 2. Workspace
        workspace = Workspace(
            owner_id=user.id,
            name="Cosmos Prime",
            description="Deep space spatial operations and research hub",
            settings={"theme": "space-dark", "layout": "spatial"},
        )
        session.add(workspace)
        await session.flush()

        member = WorkspaceMember(
            workspace_id=workspace.id,
            user_id=user.id,
            role="owner",
        )
        session.add(member)
        await session.flush()

        # 3. Goal
        goal = Goal(
            workspace_id=workspace.id,
            title="Achieve Interstellar Hyperdrive Operational Capability",
            description="Complete orbital trials, plasma shielding calibration, and quantum navigation telemetry.",
            target_date=datetime(2027, 3, 1, tzinfo=timezone.utc),
            progress=45,
            milestones=[
                {"title": "Orbital Station Thrusters Online", "completed": True},
                {"title": "Subspace Sensor Calibration", "completed": True},
                {"title": "Quantum Plasma Core Trial", "completed": False},
                {"title": "Interstellar Flight Sign-off", "completed": False},
            ],
        )
        session.add(goal)
        await session.flush()

        goal_node = GraphNode(
            workspace_id=workspace.id,
            entity_type="goal",
            entity_id=goal.id,
            position_x=400.0,
            position_y=40.0,
            metadata_json={"title": goal.title, "progress": 45},
        )
        session.add(goal_node)
        await session.flush()

        # 4. Projects
        proj1 = Project(
            workspace_id=workspace.id,
            title="Orbital Platform Infrastructure",
            description="Core structural reinforcement, docking ports, and atmospheric life support telemetry.",
            status="in_progress",
            priority="urgent",
            progress=70,
        )
        proj2 = Project(
            workspace_id=workspace.id,
            title="Quantum Hyperdrive Engine",
            description="Superconducting plasma coils, tachyon wave dampeners, and warp core harmonics.",
            status="in_progress",
            priority="high",
            progress=35,
        )
        session.add_all([proj1, proj2])
        await session.flush()

        proj1_node = GraphNode(
            workspace_id=workspace.id,
            entity_type="project",
            entity_id=proj1.id,
            position_x=160.0,
            position_y=200.0,
            metadata_json={"title": proj1.title, "priority": proj1.priority},
        )
        proj2_node = GraphNode(
            workspace_id=workspace.id,
            entity_type="project",
            entity_id=proj2.id,
            position_x=640.0,
            position_y=200.0,
            metadata_json={"title": proj2.title, "priority": proj2.priority},
        )
        session.add_all([proj1_node, proj2_node])
        await session.flush()

        # Edges from Goal to Projects
        session.add(GraphEdge(
            workspace_id=workspace.id,
            source_node_id=goal_node.id,
            target_node_id=proj1_node.id,
            relationship_type="parent_of",
        ))
        session.add(GraphEdge(
            workspace_id=workspace.id,
            source_node_id=goal_node.id,
            target_node_id=proj2_node.id,
            relationship_type="parent_of",
        ))

        # 5. Tasks
        t1 = Task(project_id=proj1.id, title="Calibrate life support thermal coupling", status="done", priority="urgent")
        t2 = Task(project_id=proj1.id, title="Inspect primary airlock pressure seals", status="done", priority="high")
        t3 = Task(project_id=proj1.id, title="Deploy solar radiator array extensions", status="in_progress", priority="medium")
        t4 = Task(project_id=proj2.id, title="Synthesize magnetic confinement coils", status="in_progress", priority="urgent")
        t5 = Task(project_id=proj2.id, title="Benchmark tachyon harmonic frequencies", status="todo", priority="high")
        t6 = Task(project_id=proj2.id, title="Test emergency magnetic quench protocol", status="todo", priority="medium")
        session.add_all([t1, t2, t3, t4, t5, t6])
        await session.flush()

        t_nodes = []
        for idx, (t, p_node) in enumerate([(t1, proj1_node), (t2, proj1_node), (t3, proj1_node)]):
            n = GraphNode(
                workspace_id=workspace.id,
                entity_type="task",
                entity_id=t.id,
                position_x=100.0 + (idx * 90.0),
                position_y=360.0 + (idx * 50.0),
                metadata_json={"title": t.title, "status": t.status, "priority": t.priority},
            )
            session.add(n)
            t_nodes.append((n, p_node))

        for idx, (t, p_node) in enumerate([(t4, proj2_node), (t5, proj2_node), (t6, proj2_node)]):
            n = GraphNode(
                workspace_id=workspace.id,
                entity_type="task",
                entity_id=t.id,
                position_x=580.0 + (idx * 90.0),
                position_y=360.0 + (idx * 50.0),
                metadata_json={"title": t.title, "status": t.status, "priority": t.priority},
            )
            session.add(n)
            t_nodes.append((n, p_node))

        await session.flush()

        for t_node, p_node in t_nodes:
            session.add(GraphEdge(
                workspace_id=workspace.id,
                source_node_id=p_node.id,
                target_node_id=t_node.id,
                relationship_type="parent_of",
            ))

        # 6. Notes
        note1 = Note(
            workspace_id=workspace.id,
            title="Subspace Navigation Protocols",
            content="<h3>Subspace Coordinate Transmission</h3><p>Ensure all high-frequency subspace telemetry packets are signed with quantum key encryption prior to transmission across relay beacons.</p>",
            tags=["telemetry", "protocols", "subspace"],
        )
        session.add(note1)
        await session.flush()

        note_node = GraphNode(
            workspace_id=workspace.id,
            entity_type="note",
            entity_id=note1.id,
            position_x=400.0,
            position_y=540.0,
            metadata_json={"title": note1.title, "tags": note1.tags},
        )
        session.add(note_node)
        await session.flush()

        session.add(GraphEdge(
            workspace_id=workspace.id,
            source_node_id=proj2_node.id,
            target_node_id=note_node.id,
            relationship_type="references",
        ))

        await session.commit()
        print("ORBIT Universe successfully seeded with projects, tasks, nodes, and goals.")


if __name__ == "__main__":
    asyncio.run(seed_data())
