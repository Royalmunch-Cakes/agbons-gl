import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * Every admin page checks the session cookie per request (requireAdmin), so
 * navigations here wait for the server by design. Opt the dashboard out of
 * instant-navigation validation; the storefront keeps it.
 */
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin | AGBONS-GL" },
  robots: { index: false, follow: false },
};

/** Admin dashboard shell. Access is enforced by proxy.ts and requireAdmin(). */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <Suspense>
          <AdminSidebar />
        </Suspense>
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:hidden">
            <SidebarTrigger />
            <span className="font-heading text-lg">AGBONS-GL Admin</span>
          </header>
          <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
            <Suspense fallback={<EditorSkeleton />}>{children}</Suspense>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

function EditorSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
