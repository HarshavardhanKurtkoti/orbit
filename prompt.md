
# MASTER BUILD PROMPT — ORBIT

## AI-Powered Spatial Productivity Operating System

### YOUR ROLE

You are an elite multidisciplinary software engineering team consisting of:

- Principal Frontend Engineer
- Senior UI/UX and Motion Designer
- Creative Technologist
- Backend Systems Architect
- AI/LLM Engineer
- Database Architect
- DevOps and Infrastructure Engineer
- Quality Assurance and Accessibility Engineer

Your mission is to design and implement **ORBIT**, a visually exceptional, highly interactive, AI-powered personal productivity operating system.

This must be a real, functional, production-quality application, not a static landing page, template, or UI mockup.

Prioritize engineering quality, exceptional visual design, sophisticated interaction design, performance, accessibility, and maintainability.

Do not create a generic SaaS dashboard.

Build something that feels like a futuristic desktop operating system combined with the usability of Linear, the organization of Notion, the spatial interactions of a canvas-based application, and the polish of a premium Apple product.

Use these products as quality references, not as designs to copy.

---

# 1. PRODUCT VISION

**Product Name:** ORBIT

**Tagline:** Your mind. Your universe. One workspace.

ORBIT is an AI-powered spatial productivity platform where users organize their digital lives through an intelligent, interactive workspace.

Instead of navigating traditional lists and disconnected pages, users interact with a connected universe of projects, tasks, notes, goals, timelines, and knowledge.

The interface should feel alive through purposeful animations, physical interactions, contextual transitions, and intelligent feedback.

The application should combine:

1. Spatial workspace management
2. AI-assisted project creation
3. Task and goal management
4. Knowledge graph visualization
5. Notes and documentation
6. Interactive timeline and planning
7. Global command palette
8. Productivity analytics
9. Customizable workspace layouts
10. Intelligent search and navigation

## Core philosophy

- Every interaction must have a purpose.
- Every animation must communicate feedback, orientation, or emphasis.
- The interface must remain responsive and interruptible.
- The application must be keyboard accessible.
- The product must remain usable without animations.
- Advanced visual effects must never compromise performance.
- Users must be able to accomplish common tasks quickly.
- Visual complexity should not create functional complexity.

---

# 2. REQUIRED TECHNOLOGY STACK

Use the following stack unless a compelling technical reason justifies a change.

## Frontend

**Framework**

- Next.js 16 with App Router
- React
- TypeScript in strict mode

**Styling**

- Tailwind CSS
- CSS variables for design tokens
- shadcn/ui for accessible component foundations
- Radix UI primitives
- Lucide React icons

**Animation and interaction**

- Motion for React (Framer Motion successor)
- React Three Fiber for selective 3D visualization
- Three.js
- @react-three/drei
- @dnd-kit for accessible drag-and-drop interactions
- React Flow / @xyflow/react for knowledge graph editing

**State management**

- Zustand for client-side application state
- TanStack Query for server-state management

**Forms and validation**

- React Hook Form
- Zod

**Rich text**

- Tiptap editor

**Code editing, if required**

- Monaco Editor

**Charts**

- Recharts for standard analytics
- Custom SVG for specialized interactive visualizations

## Backend

- Python 3.13
- FastAPI
- Pydantic v2
- SQLAlchemy 2.x async
- Alembic
- asyncpg
- PostgreSQL
- Redis
- Celery or a simpler Redis-backed worker system, depending on requirements

Use asynchronous APIs for I/O-bound operations.

Do not introduce distributed systems complexity where simple background jobs are sufficient.

## AI integration

Implement a provider-independent AI abstraction.

Support:

- OpenAI-compatible LLM APIs
- Structured JSON output
- Tool/function calling
- Streaming responses
- Context-aware workspace generation
- AI-assisted task decomposition
- Semantic search as a later phase

Use Pydantic schemas to validate AI-generated structured output.

Never directly execute arbitrary model-generated commands.

## Authentication

- Secure session-based authentication or standards-compliant JWT architecture
- OAuth support through a maintained authentication solution
- PostgreSQL-backed user identity
- Role-based authorization where needed

Prefer secure HTTP-only cookies for browser sessions.

## Testing

- Vitest
- React Testing Library
- Playwright
- pytest
- pytest-asyncio
- Ruff
- TypeScript compiler checks

## Infrastructure

- Docker
- Docker Compose for local development
- GitHub Actions
- Vercel for frontend deployment
- Container hosting for FastAPI
- Managed PostgreSQL and Redis for production
- Sentry for error monitoring
- OpenTelemetry-compatible observability

---

# 3. VISUAL DESIGN DIRECTION

Create a premium, dark-first futuristic interface.

The design should feel like a sophisticated digital operating system rather than a conventional business dashboard.

## Color palette

Use a carefully controlled design system.

Primary background:

- #08090D

Secondary surface:

- #11131A

Elevated surface:

- #191C26

Primary accent:

- #8B5CF6

Secondary accent:

- #38BDF8

Primary text:

- #F8FAFC

Secondary text:

- #94A3B8

Borders:

- rgba(255,255,255,0.08)

Success:

- #34D399

Warning:

- #FBBF24

Error:

- #FB7185

Use subtle gradients, refined lighting, layered shadows, and restrained glow effects.

Avoid excessive neon, oversized blur effects, and unnecessary glassmorphism.

## Typography

Use:

- Geist Sans for application UI
- Geist Mono for technical information and keyboard shortcuts

Establish a consistent typography scale.

Use clear hierarchy, readable line heights, and appropriate contrast.

## Design system

Create reusable design tokens for:

- Colors
- Typography
- Spacing
- Border radii
- Shadows
- Elevation
- Motion durations
- Easing functions
- Z-index layers
- Responsive breakpoints

## Layout

The main application should include:

**Left navigation rail**

- ORBIT logo
- Home
- Universe
- Projects
- Tasks
- Notes
- Timeline
- Analytics
- Settings

**Top command bar**

- Current workspace
- Breadcrumbs
- Global search
- Command palette trigger
- Notifications
- Profile menu

**Main workspace**

- Context-dependent application content
- Smooth navigation transitions
- Resizable panels
- Spatial canvas when appropriate

**Right contextual inspector**

- Selected object properties
- Details
- Connections
- AI suggestions
- Editing controls

The inspector should appear only when needed.

---

# 4. APPLICATION MODULES

## MODULE A — ORBIT HOME

Create a personalized home dashboard.

The home screen should show:

- Personalized greeting
- Current date and time
- Today's priorities
- Active projects
- Upcoming deadlines
- Recently edited notes
- Productivity overview
- Quick actions
- AI recommendations

The home dashboard must not feel cluttered.

Use a visually balanced grid of interactive cards.

### Interactions

Cards should respond to pointer hover with subtle elevation and perspective.

Clicking a project card should smoothly transition into the project detail view.

Tasks should be completable directly from the dashboard.

Completion should immediately update the UI.

Provide optimistic updates with rollback on failure.

---

## MODULE B — SPATIAL UNIVERSE

This is the signature feature of ORBIT.

Create an interactive spatial canvas where projects, notes, goals, and tasks are represented as connected objects.

### Core functionality

Users must be able to:

- Pan the workspace
- Zoom in and out
- Drag objects
- Create new objects
- Select multiple objects
- Connect related objects
- Open object details
- Group objects
- Rename objects
- Delete objects
- Search and locate objects
- Reset camera position
- Fit all objects into view
- Save and restore canvas positions

### Object types

**Project node**
Contains project title, description, progress, status, and deadline.

**Task node**
Contains title, priority, due date, completion state, and linked project.

**Note node**
Contains rich-text content, tags, and relationships.

**Goal node**
Contains milestones, progress, and target date.

### Interaction behavior

Objects should have realistic physical behavior.

Dragging an object should feel responsive and controlled.

On release, use a subtle spring settling effect.

Selected objects should display clear selection states.

Connections should update continuously during dragging.

Hovering over a node should reveal contextual actions without overwhelming the interface.

Double-clicking a node should open its detailed view.

### Technical approach

Use React Flow as the primary interactive canvas.

Use React Three Fiber selectively for optional visual effects, background depth, or special presentation modes.

Do not build the entire application in WebGL.

Prioritize readable text, accessibility, and interaction reliability.

Implement viewport virtualization or equivalent performance optimizations for large graphs.

### Persistence

Store node positions, connections, viewport settings, and object metadata in PostgreSQL.

Debounce noncritical position updates while ensuring final positions are persisted reliably.

---

## MODULE C — AI WORKSPACE GENERATOR

Create an intelligent workspace generation interface.

The user should be able to enter a natural-language goal.

Example:

"I want to become an expert backend engineer in six months. Create a learning roadmap covering distributed systems, Kubernetes, Redis, PostgreSQL, system design, and interview preparation."

The AI should generate:

- Workspace title
- Description
- Projects
- Milestones
- Tasks
- Dependencies
- Estimated durations
- Suggested priorities
- Timeline
- Knowledge graph relationships

### Generation workflow

1. User enters a prompt.
2. Frontend immediately acknowledges the action.
3. Backend creates a generation job.
4. LLM generates a structured workspace plan.
5. Backend validates the result using Pydantic.
6. Frontend displays a preview.
7. User can edit the generated structure.
8. User confirms creation.
9. Backend saves the workspace transactionally.
10. Frontend opens the newly created spatial universe.

Do not automatically persist AI-generated plans without user confirmation.

### AI interface

Create a premium AI command interface with:

- Streaming feedback where supported
- Clear generation stages
- Editable preview
- Retry functionality
- Error recovery
- Cancellation
- Usage limits
- Token usage tracking where available

Do not fake AI generation.

If no AI API key is configured, provide a clearly labeled demo mode with deterministic sample results.

---

## MODULE D — TASK MANAGEMENT

Build a complete task management system.

### Features

- Create tasks
- Edit tasks
- Delete tasks
- Assign priorities
- Set due dates
- Add subtasks
- Create recurring tasks
- Organize tasks into projects
- Add tags
- Filter and sort
- Search tasks
- Mark tasks complete
- Track task history

### Views

- List
- Kanban
- Calendar
- Timeline

### Motion behavior

Dragging Kanban cards should use realistic drag feedback.

Cards should animate smoothly when moved between columns.

Task completion should produce subtle visual confirmation.

Avoid excessive celebrations for frequently completed tasks.

---

## MODULE E — NOTES AND KNOWLEDGE

Build a modern rich-text note editor.

Use Tiptap.

### Features

- Rich-text formatting
- Headings
- Bullet lists
- Checklists
- Code blocks
- Links
- Tables
- Tags
- Backlinks
- Autosave
- Search
- Version history where practical

Notes can be linked to projects, tasks, and goals.

These relationships should appear in the knowledge graph.

Autosave should be debounced and include clear saving, saved, and error states.

Prevent accidental data loss.

---

## MODULE F — TIMELINE

Create an interactive timeline that visualizes:

- Projects
- Milestones
- Deadlines
- Task dependencies
- Goal progress

Support:

- Day view
- Week view
- Month view
- Zooming
- Dragging milestones
- Rescheduling tasks
- Dependency visualization

Changes should persist through the backend.

The timeline should use smooth transitions without sacrificing precision.

---

## MODULE G — COMMAND PALETTE

Implement a global command palette.

Keyboard shortcut:

Ctrl + K on Windows/Linux

Cmd + K on macOS

### Capabilities

- Navigate between pages
- Search projects
- Search notes
- Search tasks
- Create new objects
- Open settings
- Switch workspaces
- Trigger AI generation
- Execute supported quick actions

### UX requirements

- Open quickly
- Search immediately
- Support keyboard navigation
- Display keyboard shortcuts
- Group results by category
- Remember recent commands
- Close with Escape
- Restore focus to the original trigger

Opening should be fast and restrained.

Closing should be even faster.

---

## MODULE H — PRODUCTIVITY ANALYTICS

Create an analytics dashboard with:

- Completed tasks
- Task completion trends
- Active projects
- Project progress
- Overdue tasks
- Upcoming milestones
- Productivity patterns
- Goal completion rates

Use real persisted application data.

Do not invent analytics values.

For empty accounts, display meaningful empty states.

Use subtle chart transitions rather than distracting animations.

---

# 5. UX MOTION ENGINE — 20 REQUIRED PRINCIPLES

Implement a centralized motion design system.

Do not scatter arbitrary animation values across components.

Create reusable motion presets and utilities.

## Principle 1 — Squash and stretch

Use for playful physical feedback.

Recommended:

- Duration: 80–150ms
- ScaleX: approximately 1.1
- ScaleY: approximately 0.9

Preserve approximately constant visual area.

Never squash text or data.

## Principle 2 — Anticipation

Use a small movement opposite the primary direction before major actions.

- Duration: 60–200ms
- Distance: 5–25% of primary movement

Apply only to meaningful launches or large movements.

## Principle 3 — Stagger

Use staggered entrances for short collections.

- Interval: 30–60ms
- Total cascade: approximately 300ms maximum

Avoid staggered loading for long lists.

## Principle 4 — Follow-through

Use subtle overshoot and settling behavior.

- Child delay: 20–60ms
- Damping ratio: approximately 0.7–0.85 where appropriate

Apply to draggable cards and expanding panels.

## Principle 5 — Slow in, slow out

Use consistent easing presets.

Entrance:
cubic-bezier(0.16, 1, 0.3, 1)

Exit:
cubic-bezier(0.7, 0, 0.84, 0)

Movement:
cubic-bezier(0.65, 0, 0.35, 1)

Use linear motion only when appropriate for continuous indicators.

## Principle 6 — Moving in arcs

Use curved motion for meaningful diagonal travel.

Avoid unnecessary curved paths for small movements.

## Principle 7 — Secondary action

Support primary actions with smaller secondary animations.

Example:

Completing a task updates the checkbox and progress indicator.

The secondary effect must not overpower the primary interaction.

## Principle 8 — Snappy timing

Timing guidelines:

- Hover: 100–150ms
- Press: 80–150ms
- Standard transitions: 150–300ms
- Large panels: 250–400ms

Avoid routine animations exceeding 500ms.

## Principle 9 — Exaggerated feedback

Reserve stronger effects for significant events.

Examples:

- Important milestone completion
- Invalid destructive action
- First workspace creation

Use restraint.

## Principle 10 — Solid drawing in 3D

Use perspective and layered shadows.

- Perspective: 800–1200px
- Maximum tilt: approximately 10–15 degrees

Avoid aggressive 3D transformations on text-heavy interfaces.

## Principle 11 — Origin awareness

Menus, popovers, and panels must visually originate from their triggers.

Use correct transform origins.

Maintain spatial continuity.

## Principle 12 — Fitts's law

Ensure touch-friendly targets.

- Minimum Apple-style target: 44 × 44pt
- Material-style target: 48 × 48dp

Make important controls easy to reach.

## Principle 13 — Rubber banding

Implement resistance when dragging beyond bounds.

Use a diminishing movement response.

Spring back naturally when released.

## Principle 14 — Hick's law

Reduce unnecessary choices.

Group advanced options.

Use progressive disclosure.

## Principle 15 — Von Restorff effect

Maintain one clearly dominant primary action per view.

Avoid competing visual highlights.

## Principle 16 — Doherty threshold

Provide visible response within approximately 100ms.

For long operations:

- Show immediate feedback
- Display loading or progress states
- Use optimistic updates when safe
- Communicate failures clearly

## Principle 17 — Interruptible motion

Animations must be interruptible.

Users should be able to reverse:

- Drawers
- Menus
- Panels
- Toggles
- Navigation transitions

Prefer retargetable springs and transitions.

## Principle 18 — Fast closing

Closing should be faster than opening.

Example:

- Open: 250ms
- Close: 120ms

## Principle 19 — Peak-end rule

Make important completion moments satisfying.

Examples:

- Workspace created
- Goal achieved
- Project completed

Use meaningful confirmation and clear next steps.

## Principle 20 — Frequency of use

Frequently used interactions should animate minimally.

Rare and important moments may use richer motion.

Respect:

prefers-reduced-motion

When reduced motion is enabled, remove unnecessary spatial movement and use short fades or instant state changes.

---

# 6. MOTION ARCHITECTURE

Create a reusable motion library.

Suggested structure:

src/
  motion/
    tokens.ts
    easings.ts
    springs.ts
    variants.ts
    accessibility.ts
    presets/
      fade.ts
      scale.ts
      slide.ts
      stagger.ts
      spring.ts
      modal.ts
      drawer.ts
      popover.ts
      drag.ts

Define standardized motion presets.

Examples:

- motion.button.press
- motion.card.hover
- motion.modal.enter
- motion.modal.exit
- motion.drawer.open
- motion.drawer.close
- motion.list.stagger
- motion.task.complete
- motion.node.drag
- motion.node.release

Support reduced-motion alternatives.

Do not animate layout properties when transform-based alternatives are available.

Prefer GPU-friendly transforms and opacity.

Avoid unnecessary use of will-change.

---

# 7. DATABASE ARCHITECTURE

Design a normalized PostgreSQL schema.

Required entities:

## users

- id
- email
- password_hash, where applicable
- display_name
- avatar_url
- created_at
- updated_at

## workspaces

- id
- owner_id
- name
- description
- settings
- created_at
- updated_at

## workspace_members

- id
- workspace_id
- user_id
- role

## projects

- id
- workspace_id
- title
- description
- status
- priority
- progress
- start_date
- due_date
- created_at
- updated_at

## tasks

- id
- project_id
- parent_task_id
- title
- description
- status
- priority
- due_date
- completed_at
- created_at
- updated_at

## notes

- id
- workspace_id
- title
- content
- created_at
- updated_at

## goals

- id
- workspace_id
- title
- description
- target_date
- progress
- created_at
- updated_at

## graph_nodes

- id
- workspace_id
- entity_type
- entity_id
- position_x
- position_y
- metadata

## graph_edges

- id
- workspace_id
- source_node_id
- target_node_id
- relationship_type

## ai_generation_jobs

- id
- workspace_id
- user_id
- prompt
- status
- result
- error_message
- created_at
- completed_at

## activity_events

- id
- workspace_id
- user_id
- event_type
- entity_type
- entity_id
- metadata
- created_at

Use UUID primary keys where appropriate.

Define foreign keys, constraints, and indexes.

Implement cascading behavior deliberately.

Enforce workspace ownership and membership authorization.

Do not rely only on frontend filtering for data isolation.

Use Alembic migrations.

---

# 8. BACKEND API DESIGN

Build REST APIs with FastAPI.

Suggested endpoints:

Authentication:

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- GET /api/v1/auth/me

Workspaces:

- GET /api/v1/workspaces
- POST /api/v1/workspaces
- GET /api/v1/workspaces/{id}
- PATCH /api/v1/workspaces/{id}
- DELETE /api/v1/workspaces/{id}

Projects:

- GET /api/v1/projects
- POST /api/v1/projects
- GET /api/v1/projects/{id}
- PATCH /api/v1/projects/{id}
- DELETE /api/v1/projects/{id}

Tasks:

- GET /api/v1/tasks
- POST /api/v1/tasks
- PATCH /api/v1/tasks/{id}
- DELETE /api/v1/tasks/{id}

Notes:

- GET /api/v1/notes
- POST /api/v1/notes
- PATCH /api/v1/notes/{id}
- DELETE /api/v1/notes/{id}

Graph:

- GET /api/v1/workspaces/{id}/graph
- PUT /api/v1/workspaces/{id}/graph/layout
- POST /api/v1/workspaces/{id}/graph/edges
- DELETE /api/v1/workspaces/{id}/graph/edges/{edge_id}

AI:

- POST /api/v1/ai/generate-workspace
- GET /api/v1/ai/jobs/{id}
- POST /api/v1/ai/jobs/{id}/cancel
- POST /api/v1/ai/jobs/{id}/confirm

Analytics:

- GET /api/v1/analytics/overview
- GET /api/v1/analytics/productivity

Health:

- GET /health/live
- GET /health/ready

Implement pagination, validation, filtering, authorization, and consistent error responses.

Use OpenAPI-generated documentation.

---

# 9. FRONTEND PROJECT STRUCTURE

Use a scalable feature-oriented architecture.

Suggested structure:

apps/
  web/
    src/
      app/
      components/
        ui/
        layout/
        shared/
      features/
        auth/
        dashboard/
        universe/
        projects/
        tasks/
        notes/
        timeline/
        analytics/
        ai/
        command-palette/
      hooks/
      lib/
      motion/
      stores/
      styles/
      types/
      tests/

  api/
    app/
      api/
      core/
      models/
      schemas/
      services/
      repositories/
      workers/
      db/
      tests/
    alembic/

packages/
  shared-types/
  design-tokens/

infra/
  docker/
  monitoring/

docs/

Use clear boundaries between presentation, business logic, and infrastructure.

Avoid oversized components and tightly coupled modules.

---

# 10. SECURITY REQUIREMENTS

Implement:

- Secure authentication
- Workspace-level authorization
- Input validation
- SQL injection prevention through parameterized queries
- XSS protections
- CSRF protections when using cookie-based authentication
- Secure cookies
- Rate limiting
- Environment-based secret management
- AI usage quotas
- Audit logging for sensitive operations
- Safe error handling
- CORS restrictions
- Security headers
- Dependency vulnerability checks

Never expose API keys to the frontend.

Never trust AI-generated content as executable instructions.

Treat user-provided rich text as untrusted content.

---

# 11. PERFORMANCE REQUIREMENTS

Target a highly responsive application.

Goals:

- Smooth interactions on modern desktop hardware
- 60 FPS target for ordinary UI animations
- Immediate visual feedback on interaction
- Minimal layout shifts
- Efficient rendering of large canvases
- Fast navigation
- Lazy-loaded heavy visualization modules

Use:

- React memoization where justified
- Dynamic imports
- Code splitting
- Virtualization
- Debounced writes
- Optimized database queries
- TanStack Query caching
- Appropriate indexes

Avoid excessive component rerenders during dragging.

Measure performance rather than assuming optimizations are effective.

---

# 12. ACCESSIBILITY REQUIREMENTS

Target WCAG 2.2 AA where applicable.

Implement:

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Screen reader labels
- Accessible dialogs
- Proper focus management
- Reduced-motion support
- Sufficient contrast
- Accessible drag-and-drop alternatives
- Clear error messages

The spatial universe must also provide a non-spatial list or tree view so users can access the same information without dragging or navigating a canvas.

---

# 13. TESTING STRATEGY

Create meaningful automated tests.

## Unit tests

Test:

- Motion configuration utilities
- State management
- Validation schemas
- Task calculations
- Permission helpers

## Integration tests

Test:

- Authentication
- Workspace CRUD
- Task management
- Graph persistence
- AI generation validation
- Authorization boundaries

## End-to-end tests

Test:

1. Register or sign in.
2. Create a workspace.
3. Create a project.
4. Add tasks.
5. Move a node.
6. Reload and verify position persistence.
7. Open command palette.
8. Generate an AI workspace.
9. Review and confirm it.
10. Verify generated content.
11. Complete a task.
12. Verify analytics update.

Test reduced-motion behavior.

Test keyboard-only navigation.

Test responsive layouts.

---

# 14. IMPLEMENTATION ROADMAP

Build incrementally.

Do not attempt every module simultaneously.

## PHASE 1 — FOUNDATION

Implement:

- Monorepo structure
- Next.js frontend
- FastAPI backend
- PostgreSQL
- Redis
- Docker Compose
- Design system
- Motion system
- Application shell
- Authentication
- Database migrations

Deliver a working local environment.

## PHASE 2 — CORE PRODUCT

Implement:

- Workspaces
- Projects
- Tasks
- Dashboard
- Notes
- Navigation
- Command palette

All CRUD operations must persist.

## PHASE 3 — SPATIAL UNIVERSE

Implement:

- React Flow canvas
- Node types
- Dragging
- Zooming
- Connections
- Inspector
- Position persistence
- Keyboard accessibility
- Motion physics

This is the main visual differentiator.

## PHASE 4 — AI INTEGRATION

Implement:

- AI prompt interface
- Generation jobs
- Structured output
- Editable previews
- Confirmation workflow
- Workspace creation
- Error handling

## PHASE 5 — ADVANCED FEATURES

Implement:

- Timeline
- Analytics
- Goal tracking
- Knowledge relationships
- Advanced search
- Optional 3D presentation mode

## PHASE 6 — PRODUCTION HARDENING

Implement:

- Tests
- Security review
- Accessibility audit
- Performance profiling
- CI/CD
- Observability
- Production deployment configuration

---

# 15. DESIGN QUALITY STANDARDS

Every screen must have:

- Clear hierarchy
- Thoughtful spacing
- Consistent typography
- Purposeful interactions
- Polished loading states
- Useful empty states
- Error states
- Responsive behavior
- Keyboard support
- Appropriate animation

Avoid:

- Generic dashboard templates
- Excessive gradients
- Random animations
- Overcrowded cards
- Fake data presented as real
- Nonfunctional buttons
- Placeholder-only features
- Unnecessary modals
- Heavy 3D effects everywhere
- Inconsistent spacing
- Arbitrary animation durations

Use realistic seed data only for clearly identified development/demo environments.

---

# 16. ANTIGRAVITY EXECUTION INSTRUCTIONS

Before writing code:

1. Inspect the existing repository and environment.
2. Identify existing files, dependencies, and conventions.
3. Create an implementation plan.
4. Define the architecture.
5. Identify dependencies between modules.
6. Establish the design tokens and motion presets.
7. Determine the smallest complete working milestone.

Then begin implementation.

Do not stop after generating a plan.

Implement the application in working vertical slices.

For each phase:

1. Build the required components.
2. Connect frontend and backend.
3. Implement persistence.
4. Add loading and error states.
5. Apply the relevant UX motion principles.
6. Write tests.
7. Run validation.
8. Fix errors.
9. Verify the functionality.
10. Document completed work.

Do not claim a feature is complete unless it works.

Do not silently substitute mock functionality for real functionality.

Do not fabricate test results.

When credentials or external services are unavailable, document the blocker and provide a clearly labeled local development alternative.

Maintain a progress document:

docs/IMPLEMENTATION_STATUS.md

Track:

- Completed features
- Current work
- Pending features
- Known issues
- Technical decisions
- Test results
- Next steps

---

# 17. ACCEPTANCE CRITERIA

The project is successful when:

1. Users can authenticate securely.
2. Users can create and manage workspaces.
3. Projects, tasks, notes, and goals persist.
4. The spatial universe is interactive.
5. Nodes and connections persist across reloads.
6. Users can navigate using the command palette.
7. AI can generate structured workspace plans.
8. Users can review AI plans before saving.
9. Motion is consistent and purposeful.
10. Animations remain interruptible.
11. Reduced-motion preferences are respected.
12. Core workflows support keyboard navigation.
13. The application is responsive.
14. Backend authorization is enforced.
15. Automated tests cover critical workflows.
16. The application can run locally using documented commands.
17. CI validates code quality and tests.
18. No critical user action is represented by a nonfunctional placeholder.

---

# 18. FINAL PRODUCT EXPERIENCE

The final application should feel like opening a sophisticated digital environment.

The user enters ORBIT and immediately understands their priorities.

Projects are visually connected.

Tasks are easy to manage.

Notes form a meaningful knowledge network.

AI transforms ideas into actionable plans.

Every interaction feels responsive, physical, and intentional.

The interface is visually memorable without becoming difficult to use.

The final result must demonstrate exceptional frontend engineering, sophisticated motion design, reliable backend architecture, thoughtful AI integration, and production-quality software engineering.

**Build ORBIT as a real product, not a visual experiment.**

Begin by establishing the architecture and implementing Phase 1. Continue through the roadmap in dependency order, validating each phase before proceeding. Prioritize a fully working core experience over partially implemented advanced features.
