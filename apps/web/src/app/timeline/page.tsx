import { Shell } from "@/components/layout/Shell";
import { TimelineView } from "@/features/timeline/TimelineView";

export default function TimelinePage() {
  return (
    <Shell activeTab="timeline">
      <TimelineView />
    </Shell>
  );
}
