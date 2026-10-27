"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

const modules = [
  { id: 1, title: "Kosakata Dasar", desc: "Belajar kata benda & kerja sehari-hari.", icon: "📚" },
  { id: 2, title: "Grammar Sederhana", desc: "Pahami struktur kalimat dasar.", icon: "📝" },
  { id: 3, title: "Reading Practice", desc: "Latih pemahaman bacaan.", icon: "📖" },
];

export default function LearnPage() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("completed_modules")
          .select("module_id")
          .eq("user_id", user.id);
        
        if (data) {
          setCompleted(data.map((d) => d.module_id));
        }
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
          <p className="text-slate-500 mt-2">Selesaikan modul berurutan untuk membuka kunci berikutnya.</p>
        </div>

        <div className="relative flex flex-col items-center gap-6 pb-20">
          {/* Garis putus-putus di belakang */}
          <div className="absolute top-10 bottom-10 w-2 bg-slate-200 rounded-full z-0"></div>

          {modules.map((mod, index) => {
            // Modul 1 selalu terbuka. Modul selanjutnya terbuka kalau modul sebelumnya udah selesai.
            const isUnlocked = index === 0 || completed.includes(modules[index - 1].id);
            const isDone = completed.includes(mod.id);

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
                      {isDone && <p className="text-xs font-bold text-green-600 mt-1">Selesai (+50 XP)</p>}
                    </div>
                  </Link>
                ) : (
                  <div className="w-full max-w-sm rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 flex items-center gap-4 opacity-70">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-400 text-2xl">
                      🔒
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-400 text-lg">{mod.title}</h3>
                      <p className="text-sm text-slate-400">Selesaikan modul sebelumnya.</p>
                    </div>
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