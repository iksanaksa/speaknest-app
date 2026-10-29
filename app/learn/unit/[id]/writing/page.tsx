"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function UnitWritingPage() {
  const pathname = usePathname();
  const pathParts = pathname ? pathname.split("/") : [];
  const unitId = pathParts[pathParts.length - 2] || "";

  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [essay, setEssay] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUnit = async () => {
      const { data } = await supabase.from("curriculum_units").select("*").eq("id", unitId).single();
      if (data) setUnit(data);
      setLoading(false);
    };
    fetchUnit();
  }, [unitId]);

  const handleSubmit = async () => {
    if (essay.length < 20) {
      setError("Tulis minimal 20 karakter ya.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    setResult(null);

    try {
      // Tembak API Gemini yang udah kita bikin
      const res = await fetch("/api/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay, level: unit.level }), // Kirim level ke API
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      setError("Gagal mendapatkan feedback. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen grid place-items-center">Memuat tugas...</div>;
  if (!unit?.content?.writing) return <div className="min-h-screen grid place-items-center">Tugas writing tidak ditemukan.</div>;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-10">
        <Link href={`/learn/unit/${unitId}`} className="text-sm text-brand-600 hover:underline mb-4 inline-block">← Kembali ke Materi</Link>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">Writing Task</span>
          <h1 className="text-xl font-bold text-slate-900 mt-3 mb-2">Tugas Menulis</h1>
          <p className="text-slate-700 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
            "{unit.content.writing.prompt}"
          </p>
        </div>

        {!result ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Tulis jawabanmu di sini dalam bahasa Inggris..."
              className="w-full h-40 rounded-xl border border-slate-300 p-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 mb-2"
            />
            <p className="text-xs text-slate-400 text-right mb-4">{essay.length} karakter</p>
            
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || essay.length < 20}
              className="w-full bg-brand-500 text-white font-bold py-3.5 rounded-xl hover:bg-brand-600 transition disabled:opacity-50"
            >
              {isSubmitting ? "AI sedang menilai..." : "Kirim ke AI"}
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-200 bg-brand-50 overflow-hidden shadow-lg">
            <div className="bg-brand-500 p-6 text-center text-white">
              <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Estimasi Band</p>
              <p className="text-5xl font-black mt-2">{result.bandScore}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <p className="font-bold text-slate-800 text-sm">Task Response</p>
                <p className="text-xs text-slate-600">{result.criteria.taskResponse}</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Grammar</p>
                <p className="text-xs text-slate-600">{result.criteria.grammar}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-brand-200 bg-white/50 p-4 rounded-xl">
                <p className="font-bold text-brand-700 mb-1 text-sm">💡 Tips:</p>
                <p className="text-xs text-slate-700">{result.tips}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}