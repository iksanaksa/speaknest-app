"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function LearnPage() {
  const [units, setUnits] = useState<any[]>([]);
  const [completedUnits, setCompletedUnits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLevel, setUserLevel] = useState("Pemula");
  
  // State buat milih tab level (default A0)
  const [selectedLevel, setSelectedLevel] = useState("A0");

  // Daftar level buat Tab
  const levels = ["A0", "A1", "A2", "B1", "B2", "C1", "C2"];

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("current_level").eq("id", user.id).single();
        if (profile?.current_level) setUserLevel(profile.current_level);

        const { data: completed } = await supabase.from("completed_units").select("unit_id").eq("user_id", user.id);
        if (completed) setCompletedUnits(completed.map(c => c.unit_id));
      }

      // Ambil SEMUA unit dari database
      const { data: unitsData } = await supabase
        .from("curriculum_units")
        .select("*")
        .order("created_at", { ascending: true });
        
      if (unitsData) setUnits(unitsData);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen grid place-items-center">Memuat peta...</div>;

  // Filter unit berdasarkan tab level yang dipilih
  const filteredUnits = units.filter(u => u.level === selectedLevel);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-10 overflow-hidden relative">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">Peta Belajar 🗺️</h1>
          <p className="text-slate-500 mt-2">Level profil kamu: <span className="font-bold text-brand-600">{userLevel}</span></p>
        </div>

        {/* Tab Level (Horizontal Scroll) */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-6 scrollbar-hide">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors border-2 ${
                selectedLevel === lvl 
                  ? "bg-brand-500 border-brand-500 text-white" 
                  : "bg-white border-slate-200 text-slate-500 hover:border-brand-300"
              }`}
            >
              Level {lvl}
            </button>
          ))}
        </div>

        {/* Area Peta */}
        <div className="relative flex flex-col items-center pb-20 min-h-[50vh]">
          
          {filteredUnits.length === 0 ? (
            <div className="text-center text-slate-400 mt-20">
              <p className="text-4xl mb-4">📭</p>
              <p>Belum ada materi di Level {selectedLevel}.</p>
              <p className="text-sm">Silakan tambahkan lewat Admin.</p>
            </div>
          ) : (
            <>
              {/* Garis Putus-putus di belakang */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 border-l-4 border-dashed border-slate-200 z-0"></div>

              {filteredUnits.map((unit, index) => {
                // Logika Gembok disesuaikan per level
                // Cek index sebelumnya di filteredUnits, bukan di all units
                const prevUnitDone = index === 0 || completedUnits.includes(filteredUnits[index - 1].id);
                const isDone = completedUnits.includes(unit.id);
                
                // Buka gembok jika: (1) Ini unit pertama di level tsb, (2) unit sebelumnya selesai, (3) unit udah selesai
                // Khusus A0, unit pertama langsung buka. Level lain, butuh A0 selesai (opsional, tergantung lo mau strict atau nggak).
                // Saat ini kita bikin: unit pertama selalu buka.
                const isUnlocked = prevUnitDone || isDone;
                
                const isEven = index % 2 === 0;
                const offsetClass = isEven ? "-translate-x-12" : "translate-x-12";
                const icon = isDone ? "👑" : (isUnlocked ? "⭐" : "🔒");

                return (
                  <div key={unit.id} className={`relative z-10 flex flex-col items-center mb-10 ${offsetClass} transition-transform hover:scale-105`}>
                    
                    {/* Tombol Bulat 3D */}
                    <Link 
                      href={isUnlocked ? `/learn/unit/${unit.id}` : "#"}
                      className={`group relative flex h-24 w-24 items-center justify-center rounded-full border-b-8 transition-all active:border-b-0 active:translate-y-2 ${
                        isDone 
                          ? "bg-green-500 border-green-700 shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                          : isUnlocked
                            ? "bg-brand-500 border-brand-700 shadow-[0_0_20px_rgba(249,115,22,0.4)] animate-pulse-slow"
                            : "bg-slate-300 border-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <span className="text-4xl filter drop-shadow-md">{icon}</span>
                    </Link>

                    {/* Label Teks */}
                    <div className="mt-3 text-center w-40">
                      <h3 className={`font-extrabold text-sm ${isUnlocked ? "text-slate-800" : "text-slate-400"}`}>
                        {unit.title}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block ${
                        isDone ? "bg-green-100 text-green-700" : isUnlocked ? "bg-orange-100 text-brand-700" : "bg-slate-100 text-slate-400"
                      }`}>
                        {unit.level}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </main>
    </>
  );
}