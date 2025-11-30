'use client';

import SchoolsTable from '@/app/components/SchoolsTable';
import { GraduationCap } from 'lucide-react';

export default function PkbmPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          Data PKBM
        </h1>
        <p className="text-muted-foreground">
          Kelola data Pusat Kegiatan Belajar Masyarakat (PKBM)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 sm:p-6">
        <SchoolsTable operatorType="PKBM" />
      </div>
    </>
  );
}
