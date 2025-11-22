"use client";

import { useState, useCallback } from "react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

import CommandPalette from "./CommandPalette";
import { supabase } from "@/lib/supabase/lib/client";

export default function TopNavbar() {
  const [openCmd, setOpenCmd] = useState(false);
  const router = useRouter();

  // ======= LOGOUT Supabase (FIXED) =======
  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut(); // hapus session Supabase
      localStorage.removeItem("user"); // hapus penyimpanan UI kalau ada
      router.push("/divisi-sd/login"); // arahkan ke login
    } catch (err) {
      console.log("Logout error:", err.message);
    }
  }, [router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-primary">e-PlanDISDIK</h1>
          <div className="hidden md:block w-px h-6 bg-border" />
          <span className="hidden md:inline-block text-sm text-muted-foreground">
            Kab. Garut
          </span>

          {/* Tombol Command Palette */}
          <Button
            variant="outline"
            className="hidden md:inline-flex rounded-xl"
            onClick={() => setOpenCmd(true)}
            title="Buka Command (⌘K • Ctrl+/)"
          >
            Cari / Perintah
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 rounded-xl"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">Divisi SD</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem className="cursor-pointer rounded-lg">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer rounded-lg">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive rounded-lg"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Command Button */}
          <Button
            variant="outline"
            className="md:hidden rounded-xl"
            onClick={() => setOpenCmd(true)}
            title="Buka Command (⌘K • Ctrl+/)"
          >
            Cari
          </Button>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette open={openCmd} onOpenChange={setOpenCmd} />
    </header>
  );
}
