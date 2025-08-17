// src/components/Sidebar.js
"use client";

import {
  LayoutDashboard,
  School,
  Plus,
  Upload,
  History,
  Menu,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    active: false,
  },
  { icon: School, label: "Sekolah", href: "/schools", active: false },
  { icon: Plus, label: "Tambah Sekolah", href: "/schools/add", active: false },
  {
    icon: Upload,
    label: "Import Data",
    href: "/schools/import",
    active: false,
  },
  { icon: History, label: "Log Perubahan", href: "/change-log", active: false },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border shadow-lg
          transform transition-transform duration-200 ease-in-out
          md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-5 border-b border-sidebar-border">
            <h2 className="font-semibold text-sidebar-foreground">
              e-PlanDISDIK
            </h2>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link key={index} href={item.href} passHref>
                  <Button
                    asChild
                    variant={item.active ? "default" : "ghost"}
                    className={`
                w-full justify-start rounded-xl h-12
                ${
                  item.active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }
              `}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center">
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </div>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
