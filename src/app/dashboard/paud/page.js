'use client';

const { default: SchoolsTable } = require('@/app/components/SchoolsTable');
const { Baby } = require('lucide-react');

export default function SmpPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
          <Baby className="h-8 w-8 text-primary" />
          Data PAUD
        </h1>
        <p className="text-muted-foreground">Kelola data Pendidikan Anak Usia Dini (PAUD)</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 sm:p-6">
        <SchoolsTable operatorType="PAUD" />
      </div>
    </>
  );
}
