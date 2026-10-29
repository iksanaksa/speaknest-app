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

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("current_level").eq("id", user.id).single();
        if (profile?.current_level) setUserLevel(profile.current_level);

        const { data: completed } = await supabase.from("completed_units").select("unit_id").eq("user_id", user.id);
        if (completed) setCompletedUnits(completed.map(c => c.unit_id));
      }

      const { data: unitsData } = await supabase.from("curriculum_units").select("*").order("created_at", { ascending: true })
      if (unitsData) setUnits(unitsData);
      
      setLoading(false);
    };
    fetchData();
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

          {units.map((unit, index) => {
            // LOGIKA GEMBOK: Unit pertama selalu terbuka. Unit selanjutnya kebuka kalau unit sebelumnya udah selesai.
            const prevUnitDone = index === 0 || completedUnits.includes(units[index - 1].id);
            const isDone = completedUnits.includes(unit.id);
            const isUnlocked = prevUnitDone || isDone; // Biar unit yg udah selesai tetep kebuka

            let levelColor = "bg-slate-100 text-slate-600";
            if (unit.level === "A0") levelColor = "bg-orange-100 text-orange-700";
            if (unit.level === "A1") levelColor = "bg-blue-100 text-blue-700";

            return (
              <div key={unit.id} className="relative z-10 w-full flex justify-center">
                {isUnlocked ? (
                  <Link 
                    href={`/learn/unit/${unit.id}`}
                    className={`w-full max-w-sm rounded-2xl border-2 p-5 flex items-center gap-4 transition transform hover:-translate-y-1 ${
                      isDone ? "border-green-500 bg-green-50" : "border-brand-500 bg-white shadow-lg shadow-brand-500/10"
                    }`}
                  >
                    <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-2xl font-bold ${
                      isDone ? "bg-green-500 text-white" : "bg-brand-100 text-brand-600"
                    }`}>
                      {isDone ? "✓" : index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{unit.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-1">{unit.goal}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-2 inline-block ${levelColor}`}>
                        {unit.level}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div className="w-full max-w-sm rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 flex items-center gap-4 opacity-70">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-400 text-2xl">
                      🔒
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-400 text-lg">{unit.title}</h3>
                      <p className="text-sm text-slate-400">Selesaikan unit sebelumnya.</p>
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