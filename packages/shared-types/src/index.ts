export type EntityType = 'project' | 'task' | 'note' | 'goal';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type WorkspaceRole = 'owner' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
}

export interface Project {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  priority: Priority;
  progress: number; // 0 to 100
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  parentTaskId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  workspaceId: string;
  title: string;
  content: string; // HTML or JSON
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  targetDate?: string;
  progress: number;
  milestones?: Array<{ title: string; completed: boolean }>;
  createdAt: string;
  updatedAt: string;
}

export interface GraphNode {
  id: string;
  workspaceId: string;
  entityType: EntityType;
  entityId: string;
  positionX: number;
  positionY: number;
  metadata?: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  workspaceId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: 'depends_on' | 'references' | 'parent_of' | 'relates_to';
}

export interface AiGenerationJob {
  id: string;
  workspaceId: string;
  userId: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: {
    title: string;
    description: string;
    projects: Array<{
      title: string;
      description: string;
      priority: Priority;
      tasks: Array<{ title: string; priority: Priority; estimatedHours?: number }>;
    }>;
    milestones: Array<{ title: string; targetWeek: number }>;
  };
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}
