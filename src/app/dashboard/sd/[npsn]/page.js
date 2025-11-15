"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import { Button } from "../../../components/ui/button";
import SchoolDetailsTabs from "../../../components/SchoolDetailsTabs";
import { BookOpen, ArrowLeft, Loader2, PencilLine } from "lucide-react";

export default function SdDetailPage() {
  const params = useParams();
  const npsn = Array.isArray(params?.npsn) ? params.npsn[0] : params?.npsn;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        // TODO: sesuaikan endpoint API kamu
        const res = await fetch(`/api/sd/${npsn}`);
        if (!res.ok) throw new Error("Gagal memuat data");
        const json = await res.json();
        if (!ignore) setDetail({ ...json, schoolType: "SD" });
      } catch (e) {
        if (!ignore) setError(e.message || "Terjadi kesalahan");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (npsn) load();
    return () => {
      ignore = true;
    };
  }, [npsn]);

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-background md:pl-0">
        <main className="py-6 px-2 sm:px-3 md:px-4 space-y-4">
          {/* Header konsisten */}
          <div className="mb-2">
            <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              Detail SD
            </h1>
            <p className="text-muted-foreground">
              NPSN: <span className="font-medium">{npsn}</span>
            </p>
          </div>

          {/* Aksi */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <Link href="/dashboard/sd">
              <Button variant="outline">Ke Data SD</Button>
            </Link>
            <Link href={`/dashboard/sd/edit/${npsn}`}>
              <Button>
                <PencilLine className="h-4 w-4 mr-2" /> Edit
              </Button>
            </Link>
          </div>

          {/* State */}
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Memuat detail...
            </div>
          )}
          {!loading && error && (
            <div className="p-4 border border-destructive/30 rounded-lg text-destructive">
              {error}
            </div>
          )}
          {!loading && !error && <SchoolDetailsTabs school={detail} />}
        </main>
      </div>
    </>
  );
}
