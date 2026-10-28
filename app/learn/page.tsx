"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

// Kita tambahin data level di sini
const modules = [
  { id: 1, title: "Kosakata Dasar", desc: "Belajar kata benda & kerja sehari-hari.", icon: "📚", level: "Pemula" },
  { id: 2, title: "Grammar Sederhana", desc: "Pahami struktur kalimat dasar.", icon: "📝", level: "Pemula" },
  { id: 3, title: "Percakapan Sehari-hari", desc: "Belajar ngobrol di restoran / toko.", icon: "🗣️", level: "Menengah" },
  { id: 4, title: "Reading Practice", desc: "Latih pemahaman bacaan.", icon: "📖", level: "Menengah" },
  { id: 5, title: "Diskusi Topik Abstrak", desc: "Latihan opini & debat.", icon: "🧠", level: "Mahir" },
];

export default function LearnPage() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [userLevel, setUserLevel] = useState("Pemula"); // Default
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Ambil data modul yang selesai
        const { data: modData } = await supabase
          .from("completed_modules")
          .select("module_id")
          .eq("user_id", user.id);
        if (modData) setCompleted(modData.map((d) => d.module_id));

        // Ambil level user dari profil
        const { data: profileData } = await supabase
          .from("profiles")
          .select("current_level")
          .eq("id", user.id)
          .single();
        if (profileData?.current_level) setUserLevel(profileData.current_level);
      }
      setLoading(false);
    };
    fetchProgress();
  }, []);

  if (loading) return <div className="min-h-screen grid place-items-center">Memuat peta...</div>;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900">Peta Belajar 🗺️</h1>
          <p className="text-slate-500 mt-2">Level kamu saat ini: <span className="font-bold text-brand-600">{userLevel}</span></p>
        </div>

        <div className="relative flex flex-col items-center gap-6 pb-20">
          <div className="absolute top-10 bottom-10 w-2 bg-slate-200 rounded-full z-0"></div>

          {modules.map((mod, index) => {
            // LOGIKA PINTAR: 
            // 1. Kalau level user "Pemula", modul level "Menengah" & "Mahir" digembok.
            // 2. Modul terbuka kalau modul sebelumnya udah selesai (kecuali modul pertama di levelnya).
            
            const isLevelLocked = 
              (userLevel === "Pemula" && mod.level !== "Pemula") ||
              (userLevel === "Menengah" && mod.level === "Mahir");

            const prevModDone = index === 0 || completed.includes(modules[index - 1].id);
            
            // Modul pertama dari level user otomatis kebuka
            const isFirstOfLevel = mod.level === userLevel && (index === 0 || modules[index - 1].level !== userLevel);
            
            const isUnlocked = !isLevelLocked && (prevModDone || isFirstOfLevel)
            const isDone = completed.includes(mod.id);
             // Cek apakah semua modul di level saat ini udah selesai
            const modulesInCurrentLevel = modules.filter(m => m.level === userLevel);
            const isLevelComplete = modulesInCurrentLevel.every(m => completed.includes(m.id));

            return (
              <div key={mod.id} className="relative z-10 w-full flex justify-center">
                {isUnlocked ? (
                  <Link 
                    href={`/learn/module-${mod.id}`}
                    className={`w-full max-w-sm rounded-2xl border-2 p-5 flex items-center gap-4 transition transform hover:-translate-y-1 ${
                      isDone 
                        ? "border-green-500 bg-green-50" 
                        : "border-brand-500 bg-white shadow-lg shadow-brand-500/20"
                    }`}
                  >
                    <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-3xl ${
                      isDone ? "bg-green-500 text-white" : "bg-brand-100 text-brand-600"
                    }`}>
                      {isDone ? "✓" : mod.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{mod.title}</h3>
                      <p className="text-sm text-slate-500">{mod.desc}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full mt-2 inline-block">{mod.level}</span>
                    </div>
                  </Link>
                ) : (
                  <div className="w-full max-w-sm rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 flex items-center gap-4 opacity-70">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-400 text-2xl">
                      🔒
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-400 text-lg">{mod.title}</h3>
                      <p className="text-sm text-slate-400">
                        {isLevelLocked ? "Naikkan level kamu dulu." : "Selesaikan modul sebelumnya."}
                      </p>
                    </div>
                  {/* TOMBOL UJIAN KENAIKAN LEVEL */}
{userLevel !== "Mahir" && (
  <div className="relative z-10 w-full flex justify-center mt-4">
    {isLevelComplete ? (
      <Link 
        href="/learn/level-up"
        className="w-full max-w-sm rounded-2xl border-2 border-purple-500 bg-purple-50 p-5 flex items-center gap-4 transition transform hover:-translate-y-1 shadow-lg shadow-purple-500/20"
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-purple-500 text-white text-2xl animate-pulse">
          🏆
        </div>
        <div>
          <h3 className="font-bold text-purple-900 text-lg">Ujian Kenaikan Level!</h3>
          <p className="text-sm text-purple-700">Kamu udah selesai semua modul. Lulus ujian ini untuk naik level!</p>
        </div>
      </Link>
    ) : (
      <div className="w-full max-w-sm rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 flex items-center gap-4 opacity-70">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-400 text-2xl">🏆</div>
        <div>
          <h3 className="font-bold text-slate-400 text-lg">Ujian Kenaikan Level</h3>
          <p className="text-sm text-slate-400">Selesaikan semua modul di level ini dulu.</p>
        </div>
      </div>
    )}
  </div>
)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}