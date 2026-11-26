import { Shell } from "@/components/layout/Shell";
import { HomeDashboard } from "@/features/home/HomeDashboard";

export default function Page() {
  return (
    <Shell activeTab="home">
      <HomeDashboard />
    </Shell>
  );
}
