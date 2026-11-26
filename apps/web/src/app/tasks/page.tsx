import { Shell } from "@/components/layout/Shell";
import { TasksView } from "@/features/tasks/TasksView";

export default function TasksPage() {
  return (
    <Shell activeTab="tasks">
      <TasksView />
    </Shell>
  );
}
