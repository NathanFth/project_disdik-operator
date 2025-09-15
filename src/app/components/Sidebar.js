"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Baby,
  Blocks,
  BookOpen,
  School,
  LogOut,
  Menu,
  X,
  User,
  Plus,
} from "lucide-react";
import { auth, getRoleDisplayName } from "../../lib/auth";

const IconMap = {
  LayoutDashboard,
  GraduationCap,
  Baby,
  Blocks,
  BookOpen,
  School,
  Plus,
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userData = auth.getUser();
    if (!userData) {
      router.push("/login");
      return;
    }

    const userMenuItems = auth.getMenuItems();
    setUser(userData);
    setMenuItems(userMenuItems);
  }, [router]);

  const handleLogout = () => {
    auth.logout();
    router.push("/login");
  };

  if (!user) {
    return null; // Atau tampilkan skeleton/loading state
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">DISDIK Operator</h2>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <User size={16} />
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500">
                {getRoleDisplayName(user.role)}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = IconMap[item.icon] || LayoutDashboard;
              const isActive = pathname === item.href;

              return (
                // FIX: Menggunakan item.href sebagai key yang unik dan stabil
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                    onClick={() => setIsOpen(false)} // Close mobile menu
                  >
                    <IconComponent size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
