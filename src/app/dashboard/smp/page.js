'use client';

import SchoolsTable from '@/app/components/SchoolsTable';
import { School } from 'lucide-react';

export default function SmpPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
          <School className="h-8 w-8 text-primary" />
          Data SMP
        </h1>
        <p className="text-muted-foreground">Kelola data Sekolah Menengah Pertama (SMP)</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 sm:p-6">
        <SchoolsTable operatorType="SMP" />
      </div>
    </>
  );
}
