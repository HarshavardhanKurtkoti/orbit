const API_BASE = "/api/v1";

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("orbit_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("orbit_token", token);
      else localStorage.removeItem("orbit_token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(errorData.detail || `HTTP Error ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async demoLogin() {
    const data = await this.request<{ access_token: string; user: any }>("/auth/demo", {
      method: "POST",
    });
    this.setToken(data.access_token);
    return data;
  }

  async getMe() {
    return this.request<any>("/auth/me");
  }

  // Workspaces
  async listWorkspaces() {
    return this.request<any[]>("/workspaces");
  }

  // Projects
  async listProjects(workspaceId: string) {
    return this.request<any[]>(`/projects?workspace_id=${workspaceId}`);
  }

  async createProject(data: any) {
    return this.request<any>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProject(projectId: string, data: any) {
    return this.request<any>(`/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Tasks
  async listTasks(workspaceId: string) {
    return this.request<any[]>(`/tasks?workspace_id=${workspaceId}`);
  }

  async createTask(data: any) {
    return this.request<any>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTask(taskId: string, data: any) {
    return this.request<any>(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Notes
  async listNotes(workspaceId: string) {
    return this.request<any[]>(`/notes?workspace_id=${workspaceId}`);
  }

  async createNote(data: any) {
    return this.request<any>("/notes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateNote(noteId: string, data: any) {
    return this.request<any>(`/notes/${noteId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }


  // Graph
  async getGraph(workspaceId: string) {
    return this.request<{ nodes: any[]; edges: any[] }>(`/workspaces/${workspaceId}/graph`);
  }

  async updateGraphLayout(workspaceId: string, positions: Array<{ id: string; position_x: number; position_y: number }>) {
    return this.request<{ status: string; message: string }>(`/workspaces/${workspaceId}/graph/layout`, {
      method: "PUT",
      body: JSON.stringify({ positions }),
    });
  }

  async createGraphEdge(workspaceId: string, data: { source_node_id: string; target_node_id: string; relationship_type?: string }) {
    return this.request<any>(`/workspaces/${workspaceId}/graph/edges`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // AI
  async generateWorkspacePlan(workspaceId: string, prompt: string) {
    return this.request<any>("/ai/generate-workspace", {
      method: "POST",
      body: JSON.stringify({ workspace_id: workspaceId, prompt }),
    });
  }

  async confirmAiJob(jobId: string, plan: any) {
    return this.request<any>(`/ai/jobs/${jobId}/confirm`, {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
  }

  // Analytics
  async getAnalytics(workspaceId: string) {
    return this.request<any>(`/analytics/overview?workspace_id=${workspaceId}`);
  }
}

export const api = new ApiClient();
