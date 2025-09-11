"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import TopNavbar from "../../components/TopNavbar";
import SchoolsTable from "../../components/SchoolsTable";
import { BookOpen, Loader2 } from "lucide-react";
import { auth } from "../../../lib/auth";

export default function SdPage() {
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = auth.getUser();
    if (!userData) {
      router.push("/login");
      return;
    }
    if (!auth.hasAccess("/dashboard/sd")) {
      router.push("/dashboard");
      return;
    }
    setUser(userData);
    setPageLoading(false);
  }, [router]);

  if (pageLoading) {
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
            <div className="mb-8">
              <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                Data SD
              </h1>
              <p className="text-muted-foreground">
                Kelola data Sekolah Dasar (SD)
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 sm:p-6">
              {/* Cukup panggil SchoolsTable dengan operatorType */}
              <SchoolsTable operatorType={"SD"} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
