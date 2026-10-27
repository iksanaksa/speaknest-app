"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Komponen Landing Page
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      // 1. Cek apakah ada user yang login
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // 2. Kalau ada, ambil data profilnya dari tabel 'profiles'
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(data);
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  // Kalau lagi loading ngecek user
  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN 1: LANDING PAGE (Kalau Belum Login)
  // ==========================================
  if (!user) {
    return (
      <>
        <Navbar />
        <main>
          <Hero />
          <Skills />
          <Features />
          <CTA />
        </main>
        <Footer />
      </>
    );
  }

  // ==========================================
  // TAMPILAN 2: DASHBOARD (Kalau Sudah Login)
  // ==========================================
  const username = user.email?.split("@")[0] || "Siswa";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pb-20">
        {/* Header Dashboard */}
        <div className="bg-white px-5 pt-8 pb-8 rounded-b-[2.5rem] shadow-sm border-b border-slate-100">
          <div className="max-w-3xl mx-auto">
            <p className="text-slate-500 font-medium text-sm">Selamat datang kembali,</p>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1 capitalize">
              Halo, {username}! 👋
            </h1>
            
            {profile?.goal && (
              <div className="mt-4 inline-flex items-center gap-2 bg-orange-50 text-brand-700 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-200">
                🎯 Target: {profile.goal}
              </div>
            )}
          </div>
        </div>

        {/* Gamifikasi: Streak & XP */}
        <div className="max-w-3xl mx-auto px-5 -mt-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="text-3xl">🔥</div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Streak</p>
                <p className="text-xl font-black text-slate-800">1 Hari</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="text-3xl">⭐</div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total XP</p>
                <p className="text-xl font-black text-slate-800">{profile?.xp || 0} XP.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sparky Greeting Banner */}
        <div className="max-w-3xl mx-auto px-5 mt-6">
          <div className="bg-gradient-to-r from-brand-500 to-orange-400 rounded-3xl p-1 pb-2 shadow-lg shadow-brand-500/20">
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 rounded-full bg-gradient-to-tr from-brand-600 to-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center justify-center">
                <div className="flex gap-2">
                  <div className="w-2.5 h-5 bg-slate-900 rounded-full"></div>
                  <div className="w-2.5 h-5 bg-slate-900 rounded-full"></div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Ayo semangat hari ini!</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Latihan rutin adalah kunci. Sparky siap nemenin kamu belajar {profile?.goal ? `untuk ${profile.goal}` : ""}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Latihan Harian */}
        <div className="max-w-3xl mx-auto px-5 mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Pilih Latihanmu Hari Ini</h2>
          <div className="grid gap-4">
            <Link href="/practice/reading" className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-brand-300 transition group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-2xl flex items-center justify-center group-hover:scale-110 transition">📖</div>
                <div>
                  <h3 className="font-bold text-slate-800">Reading Practice</h3>
                  <p className="text-xs text-slate-500 mt-1">Latih pemahaman bacaanmu.</p>
                </div>
              </div>
              <div className="text-brand-500 font-bold text-xl">→</div>
            </Link>

            <Link href="/practice/writing" className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-brand-300 transition group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-2xl flex items-center justify-center group-hover:scale-110 transition">✍️</div>
                <div>
                  <h3 className="font-bold text-slate-800">Writing AI Feedback</h3>
                  <p className="text-xs text-slate-500 mt-1">Dapatkan koreksi instan dari AI.</p>
                </div>
              </div>
              <div className="text-brand-500 font-bold text-xl">→</div>
            </Link>

            <Link href="/games" className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-brand-300 transition group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-2xl flex items-center justify-center group-hover:scale-110 transition">🎮</div>
                <div>
                  <h3 className="font-bold text-slate-800">Mini Games</h3>
                  <p className="text-xs text-slate-500 mt-1">Tebak kosakata sambil santai.</p>
                </div>
              </div>
              <div className="text-brand-500 font-bold text-xl">→</div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}