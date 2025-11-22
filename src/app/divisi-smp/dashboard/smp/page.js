"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SchoolsTable from "../../components/SchoolsTable";
import { School, Loader2 } from "lucide-react";
import { auth } from "../../../lib/auth";

export default function SmpPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    if (!auth.hasAccess("/dashboard/smp")) {
      router.push("/dashboard");
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[40vh] bg-background flex items-center justify-center rounded-xl border">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
          <School className="h-8 w-8 text-primary" />
          Data SMP
        </h1>
        <p className="text-muted-foreground">
          Kelola data Sekolah Menengah Pertama (SMP)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 sm:p-6">
        <SchoolsTable operatorType="SMP" />
      </div>
    </>
  );
}
