// app/dashboard/smp/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import TopNavbar from "../../../components/TopNavbar";
import SchoolsTable from "../../components/SchoolsTable";
import { School, Loader2 } from "lucide-react";
import { auth } from "../../../lib/auth";

export default function SmpPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = auth.getUser();

    if (!userData) {
      router.push("/login");
      return;
    }

    // Check access permission
    if (!auth.hasAccess("/dashboard/smp")) {
      router.push("/dashboard");
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <TopNavbar />

          <main className="p-6 space-y-8">
            {/* Header */}
            <div className="mb-8">
              {/* Schools Data Table - Khusus untuk Role User */}
              <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
                <School className="h-8 w-8 text-primary" />
                Data SMP
              </h1>
              <p className="text-muted-foreground">
                Kelola data Sekolah Menengah Pertama (SMP)
              </p>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Daftar Sekolah SMP</h2>

              {/* Table or content here */}
              <div className="text-center py-12 text-gray-500">
                <SchoolsTable operatorType={user.role} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
