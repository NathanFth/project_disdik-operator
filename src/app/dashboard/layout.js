'use client';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { Loader2 } from 'lucide-react';

function DashboardContent({ children }) {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:pl-64">
          <TopNavbar />
          <main className="p-6 space-y-8 fade-in">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
