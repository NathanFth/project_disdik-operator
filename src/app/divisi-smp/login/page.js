"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/20/solid";
import { supabase } from "@/lib/supabase/lib/client";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Ubah username jadi email (contoh: operator.sd → operator.sd@example.com)
      let email = formData.username;
      if (!email.includes("@")) {
        email = `${email}@example.com`;
      }

      // Login ke Supabase
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email,
          password: formData.password,
        });

      if (loginError || !data.user) {
        setError("Username atau password salah");
        setLoading(false);
        return;
      }

      // Ambil metadata user
      const role = data.user.user_metadata?.role || null;

      // Simpan ke localStorage untuk UI (opsional)
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.user.email,
          role,
          name: data.user.user_metadata?.name || data.user.email,
        })
      );

      setLoading(false);

      // Redirect sesuai kebutuhan
      // contoh: /divisi-sd/test (sesuai kode kamu)
      router.push("/divisi-sd/dashboard");
    } catch (err) {
      setError("Terjadi kesalahan. Periksa koneksi atau hubungi admin.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Kiri: Banner */}
      <div className="md:w-1/2 w-full bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col justify-center items-center p-10 relative">
        <img
          src="/garut-logo.png"
          alt="Logo Garut"
          className="absolute w-[300px] opacity-10"
        />
        <div className="relative z-10 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">e-PlanDISDIK</h1>
          <p className="text-lg leading-snug">
            Electronic Planning Dinas Pendidikan <br /> Kabupaten Garut
          </p>
          <button className="mt-6 bg-blue-500 hover:bg-blue-400 px-6 py-2 rounded-full font-medium">
            Selengkapnya
          </button>
        </div>
      </div>

      {/* Kanan: Form Login */}
      <div className="md:w-1/2 w-full bg-white flex flex-col justify-center items-center px-6 py-12">
        <img src="/disdik-logo.png" alt="DISDIK" className="w-40 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Selamat Datang di
        </h2>
        <h1 className="text-3xl font-bold text-blue-800 mb-4">e-PlanDISDIK</h1>
        <p className="text-gray-500 mb-6">
          Silahkan Login untuk mengelola data
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4 bg-white"
        >
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <ExclamationCircleIcon className="h-5 w-5" />
              {error}
            </div>
          )}

          {/* Username */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full outline-none bg-transparent"
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 relative">
            <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="w-full outline-none bg-transparent pr-10"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
            <button
              type="button"
              className="absolute right-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-full hover:bg-blue-500 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
