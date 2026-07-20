import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="bg-background flex min-h-screen">
      <AdminSidebar adminRole={admin.adminRole} />
      <div className="min-w-0 flex-1">
        <header className="flex h-14 items-center gap-3 border-b px-4 sm:px-6">
          <AdminMobileNav adminRole={admin.adminRole} />
          <span className="text-muted-foreground truncate text-sm">
            Signed in as <span className="text-foreground font-medium">{admin.email}</span>
          </span>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
