import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="bg-background flex min-h-screen">
      <AdminSidebar adminRole={admin.adminRole} />
      <div className="flex-1">
        <header className="flex h-14 items-center justify-between border-b px-6">
          <span className="text-muted-foreground text-sm">
            Signed in as <span className="text-foreground font-medium">{admin.email}</span>
          </span>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
