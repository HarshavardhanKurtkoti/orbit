import { Shell } from "@/components/layout/Shell";
import { UniverseCanvas } from "@/features/universe/UniverseCanvas";

export default function UniversePage() {
  return (
    <Shell activeTab="universe">
      <UniverseCanvas />
    </Shell>
  );
}
