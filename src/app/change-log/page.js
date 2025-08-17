"useclient";

import TopNavbar from "../components/TopNavbar";
import Sidebar from "../components/Sidebar";
import ChangeLogPage from "../components/ChangeLogPage";
// import { Button } from "../components/ui/button";
import { History } from "lucide-react";

export default function App() {
  // const handleGoBack = () => {
  //   console.log("Navigate back to dashboard or previous page");
  //   // Biasanya pakai router seperti useRouter() dari Next.js
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
                  Back to Dashboard
                </Button> */}

                <div>
                  <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
                    <History className="h-8 w-8 text-primary" />
                    Change Log
                  </h1>
                  <p className="text-muted-foreground">
                    Track all system changes and data modifications with details
                    and timestamps
                  </p>
                </div>
              </div>
            </div>

            {/* Change Log Content */}
            <ChangeLogPage />
          </main>
        </div>
      </div>
    </div>
  );
}
