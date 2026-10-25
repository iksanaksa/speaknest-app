"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle Login / Register
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isLogin) {
      // Proses Login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage("Gagal masuk: " + error.message);
      } else {
        router.push("/"); // Kalau sukses, lempar ke beranda
      }
    } else {
      // Proses Daftar (Register)
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage("Gagal daftar: " + error.message);
      } else {
        setMessage("Berhasil daftar! Silakan cek email kamu untuk verifikasi (atau langsung login jika verifikasi dimatikan).");
      }
    }
    setLoading(false);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-brand-50 px-5">
      <div className="w-full max-w-sm rounded-2xl border border-brand-100 bg-white p-8 shadow-sm">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        
        <h1 className="text-xl font-bold text-slate-900 text-center mb-6">
          {isLogin ? "Masuk ke Akunmu" : "Buat Akun Baru"}
        </h1>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password (Min. 6 Karakter)</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? "Memproses..." : (isLogin ? "Masuk" : "Daftar")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setMessage(""); }}
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            {isLogin ? "Daftar di sini" : "Masuk di sini"}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}