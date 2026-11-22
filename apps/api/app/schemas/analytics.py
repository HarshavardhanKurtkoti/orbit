from pydantic import BaseModel


class ProductivityOverviewResponse(BaseModel):
    total_tasks: int
    completed_tasks: int
    completion_rate: float
    active_projects: int
    overdue_tasks: int
    active_goals: int
    total_notes: int
    graph_density_nodes: int
    graph_density_edges: int
