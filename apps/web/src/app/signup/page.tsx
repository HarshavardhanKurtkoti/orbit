import { AuthCard } from "@/components/auth/AuthCard";
import { SpatialDemoPanel } from "@/components/auth/SpatialDemoPanel";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

export const metadata = {
  title: "Initialize Account | Orbit Spatial OS",
  description: "Provision your personal autonomous spatial operating system and knowledge universe.",
};

export default function SignupPage() {
  return (
    <AmbientBackground>
      <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] relative z-10">
        {/* LEFT COLUMN: INTERACTIVE AUTHENTICATION CARD */}
        <div className="flex items-center justify-center">
          <AuthCard initialMode="signup" />
        </div>

        {/* RIGHT COLUMN: ANIMATED SPATIAL THEATER DEMO */}
        <div className="hidden lg:flex p-8 xl:p-12 items-center justify-center border-l border-[#202e2b]/60">
          <SpatialDemoPanel />
        </div>
      </div>
    </AmbientBackground>
  );
}
