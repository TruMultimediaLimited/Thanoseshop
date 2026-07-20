import type { Metadata } from "next";

import { UserRoleControls } from "@/components/admin/users/UserRoleControls";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { createClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/types/admin";

export const metadata: Metadata = { title: "Customers & Admins | Admin" };

export default async function AdminUsersPage() {
  const currentAdmin = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  const users = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Customers & Admins</h1>

      {users.length === 0 ? (
        <EmptyState message="No users yet." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-64">Role / Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{user.phone ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <UserRoleControls
                    userId={user.id}
                    role={user.role}
                    adminRole={user.admin_role as AdminRole | null}
                    isActive={user.is_active}
                    isSelf={user.id === currentAdmin.userId}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
