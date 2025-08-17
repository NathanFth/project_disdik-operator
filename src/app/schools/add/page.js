"use client";

import TopNavbar from "../../components/TopNavbar";
import Sidebar from "../../components/Sidebar";
import AddSchoolForm from "../../components/AddSchoolForm";
// import { Button } from "../../components/ui/button";
import { School } from "lucide-react";

export default function App() {
  // const handleGoBack = () => {
  //   console.log("Navigate back to schools list");
  //   // Nanti bisa diganti pakai useRouter() untuk navigasi
  // };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 md:ml-64">
          <TopNavbar />

          <main className="p-6 space-y-8">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                {/* <Button
                  variant="outline"
                  onClick={handleGoBack}
                  className="rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Schools
                </Button> */}

                <div>
                  <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
                    <School className="h-8 w-8 text-primary" />
                    Tambah Sekolah
                  </h1>
                  <p className="text-muted-foreground">
                    Isi detail sekolah untuk mendaftarkan sekolah baru ke dalam
                    sistem{" "}
                  </p>
                </div>
              </div>
            </div>

            {/* Add School Form */}
            <AddSchoolForm />
          </main>
        </div>
      </div>
    </div>
  );
}
