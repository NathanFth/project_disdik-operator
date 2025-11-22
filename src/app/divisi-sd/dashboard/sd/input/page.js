"use client";

import Sidebar from "../../../../components/Sidebar";
// import TopNavbar from "../../../components/TopNavbar";
import InputPageBody from "../../../../components/InputPageBody";
import { ClipboardList } from "lucide-react";

export default function SdInputPage() {
  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-background md:pl-0">
        {/* <TopNavbar /> */}
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
