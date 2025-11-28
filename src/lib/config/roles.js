export const ROLE_CONFIG = {
  DIVISI_PAUD: {
    title: 'PAUD',
    description: 'Pendidikan Anak Usia Dini',
    basePath: '/dashboard',
    menu: [
      { name: 'Dashboard', icon: 'LayoutDashboard', path: '' },
      { name: 'Data Siswa', icon: 'Baby', path: '/paud' },
      { name: 'Input Data', icon: 'Plus', path: '/paud/input' },
    ],
  },
  DIVISI_SD: {
    title: 'SD',
    description: 'Sekolah Dasar',
    basePath: '/dashboard',
    menu: [
      { name: 'Dashboard', icon: 'LayoutDashboard', path: '' },
      { name: 'Data SD', icon: 'BookOpen', path: '/sd' },
      { name: 'Input Data', icon: 'Plus', path: '/sd/input' },
    ],
  },
  DIVISI_SMP: {
    title: 'SMP',
    description: 'Sekolah Menengah Pertama',
    basePath: '/dashboard',
    menu: [
      { name: 'Dashboard', icon: 'LayoutDashboard', path: '' },
      { name: 'Data SMP', icon: 'BookOpen', path: '/smp' },
      { name: 'Input Data', icon: 'Plus', path: '/smp/input' },
    ],
  },

  DEFAULT: {
    title: 'Operator',
    description: 'Dashboard Operator',
    basePath: '/dashboard',
    menu: [],
  },
};

export const getRoleConfig = (role) => {
  return ROLE_CONFIG[role] || ROLE_CONFIG.DEFAULT;
};
