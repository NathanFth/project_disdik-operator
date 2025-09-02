// src/app/dashboard/page.js

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import StatCards from "../components/StatCards";
import TopNavbar from "../components/TopNavbar";
import { LayoutDashboard, Loader2, Plus, Edit, BarChart3 } from "lucide-react";
import { auth, getRoleDisplayName } from "../../lib/auth";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = auth.getUser();

    if (!userData) {
      router.push("/login");
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Get role-specific information
  const getRoleInfo = (role) => {
    const info = {
      PAUD: {
        title: "PAUD",
        description: "Pendidikan Anak Usia Dini",
        color: "bg-pink-500",
        inputLink: "/dashboard/paud/input",
        dataLink: "/dashboard/paud",
      },
      TK: {
        title: "TK",
        description: "Taman Kanak-Kanak",
        color: "bg-purple-500",
        inputLink: "/dashboard/tk/input",
        dataLink: "/dashboard/tk",
      },
      SD: {
        title: "SD",
        description: "Sekolah Dasar",
        color: "bg-blue-500",
        inputLink: "/dashboard/sd/input",
        dataLink: "/dashboard/sd",
      },
      SMP: {
        title: "SMP",
        description: "Sekolah Menengah Pertama",
        color: "bg-green-500",
        inputLink: "/dashboard/smp/input",
        dataLink: "/dashboard/smp",
      },
      PKBM: {
        title: "PKBM",
        description: "Pusat Kegiatan Belajar Masyarakat",
        color: "bg-orange-500",
        inputLink: "/dashboard/pkbm/input",
        dataLink: "/dashboard/pkbm",
      },
    };
    return info[role] || info.SD;
  };

  const roleInfo = getRoleInfo(user.role);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <TopNavbar />

          <main className="p-6 space-y-8">
            {/* Welcome Section - Lebih Personal untuk Operator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
                    <LayoutDashboard className="h-8 w-8 text-primary" />
                    Dashboard {roleInfo.title}
                  </h1>
                  <p className="text-muted-foreground">
                    Selamat datang,{" "}
                    <span className="font-medium">{user.name}</span>
                    <br />
                    Kelola data {roleInfo.description} dengan mudah dan efisien.
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="hidden md:flex gap-3">
                  <button
                    onClick={() => router.push(roleInfo.inputLink)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4 " />
                    Input Data Baru
                  </button>
                  <button
                    onClick={() => router.push(roleInfo.dataLink)}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Lihat Semua Data
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Cards - Khusus Role User */}
            <StatCards operatorType={user.role} />

            {/* Quick Actions Card - Mobile Friendly */}
            <div className="md:hidden bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Aksi Cepat
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => router.push(roleInfo.inputLink)}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Input Data Baru
                </button>
                <button
                  onClick={() => router.push(roleInfo.dataLink)}
                  className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Lihat Semua Data
                </button>
              </div>
            </div>

            

            {/* Info Panel untuk Operator */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                📋 Informasi untuk Operator {roleInfo.title}
              </h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  • Pastikan data yang diinput sesuai dengan format yang telah
                  ditentukan
                </p>
                <p>
                  • Update data secara berkala untuk menjaga akurasi informasi
                </p>
                <p>• Gunakan menu "Input Data" untuk menambah data baru</p>
                <p>• Hubungi support jika mengalami kendala teknis</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
