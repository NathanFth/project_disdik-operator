import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// 1) Daftar divisi yang dijaga
const divisions = [
  "divisi-sd",
  "divisi-paud",
  "divisi-pkbm",
  "divisi-smp",
  "divisi-tendik",
];

// 2) Ambil divisi dari path, contoh: "/divisi-sd/..." -> "divisi-sd"
function getDivisionFromPath(pathname) {
  return divisions.find(
    (d) => pathname === `/${d}` || pathname.startsWith(`/${d}/`)
  );
}

// 3) Normalisasi role & mapping role -> slug divisi
function normalizeRole(role) {
  return typeof role === "string" ? role.trim().toLowerCase() : null;
}

function roleToDivision(roleRaw) {
  const role = normalizeRole(roleRaw);
  console.log("ROLE dari session:", role);

  const map = {
    sd: "divisi-sd",
    paud: "divisi-paud",
    pkbm: "divisi-pkbm",
    smp: "divisi-smp",
    tendik: "divisi-tendik",
    gtk: "divisi-tendik", // alias gtk -> tendik
    superadmin: "*", // boleh semua divisi
    admin: "*",
  };

  return map[role] ?? null;
}

// 4) Redirect sambil memastikan cookie Supabase ikut pada response redirect
async function redirectWithSupabase(req, toPath) {
  const redirectRes = NextResponse.redirect(new URL(toPath, req.url));
  const supa = createMiddlewareClient({ req, res: redirectRes });
  await supa.auth.getSession(); // supaya Set-Cookie (kalau ada) nempel di redirect
  return redirectRes;
}

export async function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;

  // Response default
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Cek apakah ini area salah satu divisi
  const activeDivision = getDivisionFromPath(pathname);

  // Kalau bukan /divisi-*, lepas aja
  if (!activeDivision) {
    return res;
  }

  // Path penting untuk divisi aktif
  const root = `/${activeDivision}`;
  const loginPath = `${root}/login`; // contoh: /divisi-sd/login
  const dashboardPath = `${root}/dashboard`; // contoh: /divisi-sd/dashboard

  const isDivisionRoot = pathname === root || pathname === `${root}/`;
  const isLoginPage =
    pathname === loginPath || pathname.startsWith(`${loginPath}/`);
  const isDashboardArea =
    pathname === dashboardPath || pathname.startsWith(`${dashboardPath}/`);

  const isDashboardRoot =
    pathname === dashboardPath || pathname === `${dashboardPath}/`;
  const currentFullPath = pathname + (req.nextUrl.search || "");

  // =====================================================
  // A) ROLE GUARD (aktif hanya jika sudah login)
  // =====================================================
  if (session) {
    const userRole =
      session.user?.user_metadata?.role ??
      session.user?.app_metadata?.role ??
      null;

    const allowedDivision = roleToDivision(userRole);

    // Kalau role punya divisi tertentu dan lagi nyasar ke divisi lain → tendang ke divisinya
    if (
      allowedDivision &&
      allowedDivision !== "*" &&
      allowedDivision !== activeDivision
    ) {
      return redirectWithSupabase(req, `/${allowedDivision}/dashboard`);
    }
  }

  // =====================================================
  // B) AUTH GUARD (login / dashboard)
  // =====================================================

  // Akses root divisi → arahkan sesuai status login (tanpa next)
  if (isDivisionRoot) {
    return redirectWithSupabase(req, session ? dashboardPath : loginPath);
  }

  // Belum login → blokir dashboard area
  if (!session && isDashboardArea) {
    // Kalau hanya root dashboard -> arahkan ke /login (tanpa next)
    if (isDashboardRoot) {
      return redirectWithSupabase(req, loginPath);
    }

    // Kalau dashboard dengan path lebih dalam -> pakai ?next
    const to = `${loginPath}?next=${encodeURIComponent(currentFullPath)}`;
    return redirectWithSupabase(req, to);
  }

  // Sudah login → blokir halaman login (kembali ke dashboard ATAU next)
  if (session && isLoginPage) {
    const nextParam = searchParams.get("next");
    // Demi keamanan, hanya izinkan redirect ke dalam divisi aktif
    const safeNext = nextParam && nextParam.startsWith(root) ? nextParam : null;

    return redirectWithSupabase(req, safeNext || dashboardPath);
  }

  // Selain itu → izinkan
  return res;
}

// MATCH ROUTES: root + subpath per divisi
export const config = {
  matcher: [
    "/divisi-sd",
    "/divisi-sd/:path*",
    "/divisi-paud",
    "/divisi-paud/:path*",
    "/divisi-pkbm",
    "/divisi-pkbm/:path*",
    "/divisi-smp",
    "/divisi-smp/:path*",
    "/divisi-tendik",
    "/divisi-tendik/:path*",
  ],
};
