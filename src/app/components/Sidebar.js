'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, BookOpen, Plus, Baby, Menu, X, User, LogOut } from 'lucide-react';

const IconMap = { LayoutDashboard, BookOpen, Plus, Baby };

export default function Sidebar() {
  const { user, roleConfig, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">DISDIK Operator</h2>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <User size={16} />
            <div>
              <div className="font-medium truncate w-40">{user?.email}</div>
              <div className="text-xs text-blue-600 font-bold">{roleConfig?.title}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {roleConfig?.menu.map((item) => {
              const IconComponent = IconMap[item.icon] || LayoutDashboard;
              const fullPath =
                item.path === '' ? roleConfig.basePath : `${roleConfig.basePath}${item.path}`;
              const isActive = pathname === fullPath;

              return (
                <li key={item.name}>
                  <Link
                    href={fullPath}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
