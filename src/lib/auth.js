// lib/auth.js - VERSION KHUSUS OPERATOR (TANPA ADMIN)
export const ROLES = {
  PKBM: "PKBM",
  PAUD: "PAUD",
  TK: "TK",
  SD: "SD",
  SMP: "SMP",
};

// Menu configuration berdasarkan role - HANYA OPERATOR
export const MENU_BY_ROLE = {
  [ROLES.PKBM]: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard",
    },
    {
      name: "Data PKBM",
      href: "/dashboard/pkbm",
      icon: "GraduationCap",
    },
    {
      name: "Input Data",
      href: "/dashboard/pkbm/input",
      icon: "Plus",
    },
  ],
  [ROLES.PAUD]: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard",
    },
    {
      name: "Data PAUD",
      href: "/dashboard/paud",
      icon: "Baby",
    },
    {
      name: "Input Data",
      href: "/dashboard/paud/input",
      icon: "Plus",
    },
  ],
  [ROLES.TK]: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard",
    },
    {
      name: "Data TK",
      href: "/dashboard/tk",
      icon: "Blocks",
    },
    {
      name: "Input Data",
      href: "/dashboard/tk/input",
      icon: "Plus",
    },
  ],
  [ROLES.SD]: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard",
    },
    {
      name: "Data SD",
      href: "/dashboard/sd",
      icon: "BookOpen",
    },
    {
      name: "Input Data",
      href: "/dashboard/sd/input",
      icon: "Plus",
    },
  ],
  [ROLES.SMP]: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard",
    },
    {
      name: "Data SMP",
      href: "/dashboard/smp",
      icon: "School",
    },
    {
      name: "Input Data",
      href: "/dashboard/smp/input",
      icon: "Plus",
    },
  ],
};

// Auth functions - HANYA OPERATOR
export const auth = {
  // Login function - simulate API call
  login: (username, password) => {
    // HANYA OPERATOR - TIDAK ADA ADMIN
    const users = [
      {
        username: "operator.pkbm",
        password: "123",
        role: ROLES.PKBM,
        name: "Operator PKBM",
      },
      {
        username: "operator.paud",
        password: "123",
        role: ROLES.PAUD,
        name: "Operator PAUD",
      },
      {
        username: "operator.tk",
        password: "123",
        role: ROLES.TK,
        name: "Operator TK",
      },
      {
        username: "operator.sd",
        password: "123",
        role: ROLES.SD,
        name: "Operator SD",
      },
      {
        username: "operator.smp",
        password: "123",
        role: ROLES.SMP,
        name: "Operator SMP",
      },
    ];

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const userData = {
        username: user.username,
        role: user.role,
        name: user.name,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true, user: userData };
    }

    return { success: false, message: "Username atau password salah" };
  },

  // Get current user
  getUser: () => {
    if (typeof window === "undefined") return null; // SSR safety
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return auth.getUser() !== null;
  },

  // Get user role
  getRole: () => {
    const user = auth.getUser();
    return user ? user.role : null;
  },

  // Get menu items for current user
  getMenuItems: () => {
    const role = auth.getRole();
    return role ? MENU_BY_ROLE[role] || [] : [];
  },

  // Check if user has access to specific route
  hasAccess: (route) => {
    const menuItems = auth.getMenuItems();
    return menuItems.some((item) => route.startsWith(item.href));
  },

  // Logout
  logout: () => {
    localStorage.removeItem("user");
  },
};

// Helper function to get role display name
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [ROLES.PKBM]: "Operator PKBM",
    [ROLES.PAUD]: "Operator PAUD",
    [ROLES.TK]: "Operator TK",
    [ROLES.SD]: "Operator SD",
    [ROLES.SMP]: "Operator SMP",
  };
  return displayNames[role] || role;
};
