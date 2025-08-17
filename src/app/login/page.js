"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Username dan password wajib diisi!");
      return;
    }

    // Simpan session login
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);

    // Redirect ke dashboard
    router.push("/dashboard");
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
            Electronic Planning Dinas Pendidikan <br />
            Kabupaten - Garut
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

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Username"
              className="w-full outline-none bg-transparent"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
            <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Password"
              className="w-full outline-none bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-full hover:bg-blue-500 transition"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
