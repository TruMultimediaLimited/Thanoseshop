"use client";

import { useState } from "react";
import { Menu, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AdminNavLinks } from "@/components/admin/AdminSidebar";
import type { AdminRole } from "@/lib/types/admin";

export function AdminMobileNav({ adminRole }: { adminRole: AdminRole | null }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open admin menu">
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShieldCheck className="text-primary size-5" /> Admin Panel
          </SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-3 pb-6">
          <AdminNavLinks adminRole={adminRole} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
