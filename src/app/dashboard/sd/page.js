'use client';

import SchoolsTable from '@/app/components/SchoolsTable';
import { BookOpen } from 'lucide-react';

export default function SdPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Data SD
        </h1>
        <p className="text-muted-foreground">Kelola data Sekolah Dasar (SD)</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 sm:p-6">
        <SchoolsTable operatorType="SD" />
      </div>
    </>
  );
}
