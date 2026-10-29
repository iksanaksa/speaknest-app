"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function UnitSpeakingPage() {
  const pathname = usePathname();
  const router = useRouter();
  const pathParts = pathname ? pathname.split("/") : [];
  const unitId = pathParts[pathParts.length - 2] || "";

  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const fetchUnit = async () => {
      const { data } = await supabase.from("curriculum_units").select("*").eq("id", unitId).single();
      if (data) setUnit(data);
      setLoading(false);
    };
    fetchUnit();
  }, [unitId]);

  if (loading) return <div className="min-h-screen grid place-items-center">Memuat tugas...</div>;
  if (!unit?.content?.speaking) return <div className="min-h-screen grid place-items-center">Tugas speaking tidak ditemukan.</div>;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-10">
        <Link href={`/learn/unit/${unitId}`} className="text-sm text-brand-600 hover:underline mb-4 inline-block">← Kembali ke Materi</Link>
        
        {!isDone ? (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">Speaking Task</span>
              <h1 className="text-xl font-bold text-slate-900 mt-3 mb-2">Tugas Berbicara</h1>
              
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-6 text-center">
                <p className="text-purple-800 font-bold text-lg mb-2">🎤 Prompt:</p>
                <p className="text-slate-700 font-medium italic">"{unit.content.speaking.prompt}"</p>
              </div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ketik jawabanmu di sini (bayangkan kamu sedang merekam suara):
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Hello, my name is..."
                className="w-full h-32 rounded-xl border border-slate-300 p-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <button
              onClick={() => setIsDone(true)}
              disabled={answer.length < 10}
              className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
            >
              Selesai Berbicara
            </button>
          </>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Hebat!</h2>
            <p className="text-slate-600 mb-8">Kamu telah menyelesaikan seluruh rangkaian Unit ini (Materi, Kuis, Writing, Speaking).</p>
            <button onClick={() => router.push("/learn")} className="w-full bg-brand-500 text-white font-bold py-3.5 rounded-xl hover:bg-brand-600 transition">
              Kembali ke Peta
            </button>
          </div>
        )}
      </main>
    </>
  );
}