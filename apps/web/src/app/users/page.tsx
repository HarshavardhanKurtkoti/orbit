import { Shell } from "@/components/layout/Shell";
import { UsersView } from "@/features/users/UsersView";

export const metadata = {
  title: "Users & Access Control | Orbit Spatial OS",
  description: "Enterprise user management, workspace RBAC, and cryptographically verified JWT access tokens.",
};

export default function UsersPage() {
  return (
    <Shell activeTab="users">
      <UsersView />
    </Shell>
  );
}
