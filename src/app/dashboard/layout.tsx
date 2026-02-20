"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ShiftProvider } from "@/contexts/ShiftContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const activePage = pathname.replace(/^\/dashboard\/?/, "") || "overview";

  const handlePageChange = (page: string) => {
    router.push(`/dashboard/${page}`);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <ShiftProvider>
      <div className="flex h-screen w-full bg-gray-50">
        <Sidebar
          activePage={activePage}
          setPage={handlePageChange}
          onLogout={handleLogout}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
          {children}
        </main>
      </div>
    </ShiftProvider>
  );
}
