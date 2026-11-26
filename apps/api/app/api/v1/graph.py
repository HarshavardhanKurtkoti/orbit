from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user, verify_workspace_access
from app.models.user import User
from app.models.graph import GraphNode, GraphEdge
from app.schemas.graph import (
    GraphBundleResponse,
    GraphEdgeCreate,
    GraphEdgeResponse,
    GraphLayoutBatchUpdate,
    GraphNodeResponse,
)

router = APIRouter()


@router.get("/workspaces/{workspace_id}/graph", response_model=GraphBundleResponse)
async def get_workspace_graph(
    workspace_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_workspace_access(workspace_id, current_user.id, db)
    nodes_res = await db.execute(select(GraphNode).where(GraphNode.workspace_id == workspace_id))
    edges_res = await db.execute(select(GraphEdge).where(GraphEdge.workspace_id == workspace_id))
    
    nodes = nodes_res.scalars().all()
    edges = edges_res.scalars().all()

    node_models = [
        GraphNodeResponse(
            id=n.id,
            workspace_id=n.workspace_id,
            entity_type=n.entity_type,
            entity_id=n.entity_id,
            position_x=n.position_x,
            position_y=n.position_y,
            metadata=n.metadata_json or {},
        )
        for n in nodes
    ]

    edge_models = [
        GraphEdgeResponse(
            id=e.id,
            workspace_id=e.workspace_id,
            source_node_id=e.source_node_id,
            target_node_id=e.target_node_id,
            relationship_type=e.relationship_type,
        )
        for e in edges
    ]

    return GraphBundleResponse(nodes=node_models, edges=edge_models)


@router.put("/workspaces/{workspace_id}/graph/layout")
async def update_graph_layout(
    workspace_id: str,
    layout_in: GraphLayoutBatchUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    for pos in layout_in.positions:
        res = await db.execute(
            select(GraphNode).where(
                GraphNode.id == pos.id,
                GraphNode.workspace_id == workspace_id,
            )
        )
        node = res.scalar_one_or_none()
        if node:
            node.position_x = pos.position_x
            node.position_y = pos.position_y

    await db.commit()
    return {"status": "success", "message": f"Updated {len(layout_in.positions)} node positions"}


@router.post("/workspaces/{workspace_id}/graph/edges", response_model=GraphEdgeResponse)
async def create_graph_edge(
    workspace_id: str,
    edge_in: GraphEdgeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    edge = GraphEdge(
        workspace_id=workspace_id,
        source_node_id=edge_in.source_node_id,
        target_node_id=edge_in.target_node_id,
        relationship_type=edge_in.relationship_type,
    )
    db.add(edge)
    await db.commit()
    await db.refresh(edge)
    return GraphEdgeResponse(
        id=edge.id,
        workspace_id=edge.workspace_id,
        source_node_id=edge.source_node_id,
        target_node_id=edge.target_node_id,
        relationship_type=edge.relationship_type,
    )


@router.delete("/workspaces/{workspace_id}/graph/edges/{edge_id}")
async def delete_graph_edge(
    workspace_id: str,
    edge_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(
        select(GraphEdge).where(
            GraphEdge.id == edge_id,
            GraphEdge.workspace_id == workspace_id,
        )
    )
    edge = res.scalar_one_or_none()
    if not edge:
        raise HTTPException(status_code=404, detail="Edge not found")
        
    await db.delete(edge)
    await db.commit()
    return {"status": "success", "message": "Edge deleted"}
