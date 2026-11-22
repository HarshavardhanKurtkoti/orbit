from pydantic import BaseModel, ConfigDict
from typing import Any


class GraphNodeBase(BaseModel):
    entity_type: str  # project, task, note, goal
    entity_id: str
    position_x: float = 0.0
    position_y: float = 0.0
    metadata: dict[str, Any] = {}


class GraphNodeCreate(GraphNodeBase):
    workspace_id: str


class GraphNodeResponse(GraphNodeBase):
    id: str
    workspace_id: str

    model_config = ConfigDict(from_attributes=True)


class GraphEdgeBase(BaseModel):
    source_node_id: str
    target_node_id: str
    relationship_type: str = "relates_to"


class GraphEdgeCreate(GraphEdgeBase):
    workspace_id: str


class GraphEdgeResponse(GraphEdgeBase):
    id: str
    workspace_id: str

    model_config = ConfigDict(from_attributes=True)



class NodePositionUpdate(BaseModel):
    id: str
    position_x: float
    position_y: float


class GraphLayoutBatchUpdate(BaseModel):
    positions: list[NodePositionUpdate]


class GraphBundleResponse(BaseModel):
    nodes: list[GraphNodeResponse]
    edges: list[GraphEdgeResponse]
