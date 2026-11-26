import { Shell } from "@/components/layout/Shell";
import { NotesView } from "@/features/notes/NotesView";

export default function NotesPage() {
  return (
    <Shell activeTab="notes">
      <NotesView />
    </Shell>
  );
}
