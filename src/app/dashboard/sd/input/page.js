"use client";

import InputPageBody from "@/app/components/InputPageBody";
import { ClipboardList } from "lucide-react";

export default function SdInputPage() {
  return (
    <>
      <div className="min-h-screen bg-background md:pl-0">
        <InputPageBody
          title="Input Data SD"
          schoolType="SD"
          schemaKey="SD"
          Icon={ClipboardList}
        />
      </div>
    </>
  );
}
