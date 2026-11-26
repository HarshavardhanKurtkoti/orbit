import { Shell } from "@/components/layout/Shell";
import { AnalyticsView } from "@/features/analytics/AnalyticsView";

export default function AnalyticsPage() {
  return (
    <Shell activeTab="analytics">
      <AnalyticsView />
    </Shell>
  );
}
