// src/context/AuthContext.js
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { getRoleConfig } from '@/lib/config/roles';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roleConfig, setRoleConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await authService.getUser();

      if (!currentUser) {
        setLoading(false);
        router.replace('/login');
        return;
      }

      const userRole = currentUser?.profile?.role?.toUpperCase();

      setUser({ ...currentUser, role: userRole });
      setRoleConfig(getRoleConfig(userRole));
      setLoading(false);
    };

    initAuth();
  }, [router]);

  const logout = async () => {
    await authService.logout();
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, roleConfig, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
