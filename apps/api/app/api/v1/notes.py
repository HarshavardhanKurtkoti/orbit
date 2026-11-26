from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user, verify_workspace_access
from app.models.user import User
from app.models.note import Note
from app.models.graph import GraphNode
from app.schemas.note import NoteCreate, NoteResponse, NoteUpdate

router = APIRouter()


@router.get("", response_model=list[NoteResponse])
async def list_notes(
    workspace_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_workspace_access(workspace_id, current_user.id, db)
    query = select(Note).where(Note.workspace_id == workspace_id).order_by(Note.updated_at.desc())
    result = await db.execute(query)
    notes = result.scalars().all()
    return [NoteResponse.model_validate(n) for n in notes]


@router.post("", response_model=NoteResponse)
async def create_note(
    note_in: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_workspace_access(note_in.workspace_id, current_user.id, db)
    note = Note(
        workspace_id=note_in.workspace_id,
        title=note_in.title,
        content=note_in.content,
        tags=note_in.tags,
    )
    db.add(note)
    await db.flush()

    graph_node = GraphNode(
        workspace_id=note.workspace_id,
        entity_type="note",
        entity_id=note.id,
        position_x=400.0,
        position_y=250.0,
        metadata_json={"title": note.title, "tags": note.tags},
    )
    db.add(graph_node)

    await db.commit()
    await db.refresh(note)
    return NoteResponse.model_validate(note)


@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return NoteResponse.model_validate(note)


@router.patch("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: str,
    note_in: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    update_data = note_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(note, field, value)

    # Sync graph node title
    node_result = await db.execute(select(GraphNode).where(GraphNode.entity_id == note_id))
    node = node_result.scalar_one_or_none()
    if node:
        meta = dict(node.metadata_json or {})
        meta["title"] = note.title
        meta["tags"] = note.tags
        node.metadata_json = meta

    await db.commit()
    await db.refresh(note)
    return NoteResponse.model_validate(note)


@router.delete("/{note_id}")
async def delete_note(
    note_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    graph_node_result = await db.execute(
        select(GraphNode).where(GraphNode.entity_id == note_id)
    )
    for node in graph_node_result.scalars().all():
        await db.delete(node)

    await db.delete(note)
    await db.commit()
    return {"status": "success", "message": "Note deleted"}
