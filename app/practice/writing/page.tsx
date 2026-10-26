"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase"; // Import Supabase

export default function WritingPage() {
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const handleSubmit = async () => {
    if (essay.length < 50) {
      setError("Esai terlalu pendek. Minimal 50 karakter.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setSaveStatus("");

    try {
      // 1. Minta Feedback ke AI
      const res = await fetch("/api/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setResult(data);

      // 2. Simpan ke Database Supabase
      setSaveStatus("Menyimpan ke database...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error: dbError } = await supabase
          .from("writing_scores")
          .insert([
            {
              user_id: user.id,
              essay_text: essay,
              band_score: data.bandScore,
              feedback_json: data,
            }
          ]);
          
        if (dbError) throw dbError;
        setSaveStatus("✅ Skor berhasil disimpan ke progress!");
      } else {
        setSaveStatus("Kamu belum login, skor tidak disimpan permanen.");
      }

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <Link href="/practice" className="text-sm text-brand-600 hover:underline mb-6 inline-block">← Kembali ke Practice</Link>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Writing Practice (AI Feedback)</h1>
        <p className="text-slate-600 mb-8">Tulis esai bahasa Inggris kamu di bawah ini. AI akan memberikan estimasi band dan tips.</p>

        <div className="mb-6">
          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Tulis esai kamu di sini..."
            className="w-full h-64 rounded-xl border border-slate-300 p-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>{essay.length} karakter</span>
          </div>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">{error}</div>}
        {saveStatus && <div className="text-sm text-brand-700 bg-brand-50 p-3 rounded-lg mb-4 font-semibold">{saveStatus}</div>}

        <button
          onClick={handleSubmit}
          disabled={loading || essay.length === 0}
          className="w-full rounded-xl bg-brand-500 py-3 font-bold text-white hover:bg-brand-600 disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {loading ? (
            <><span className="animate-spin text-xl">⏳</span> Menilai Esai...</>
          ) : (
            "Dapatkan Feedback AI"
          )}
        </button>

        {result && (
          <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 overflow-hidden">
            <div className="bg-brand-500 p-6 text-center text-white">
              <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Estimasi Band</p>
              <p className="text-5xl font-black mt-2">{result.bandScore}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <p className="font-bold text-slate-800">Task Response</p>
                <p className="text-sm text-slate-600">{result.criteria.taskResponse}</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">Coherence & Cohesion</p>
                <p className="text-sm text-slate-600">{result.criteria.coherence}</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">Lexical Resource</p>
                <p className="text-sm text-slate-600">{result.criteria.lexical}</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">Grammatical Range</p>
                <p className="text-sm text-slate-600">{result.criteria.grammar}</p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-brand-200 bg-white/50 p-4 rounded-xl">
                <p className="font-bold text-brand-700 mb-1">💡 Tips:</p>
                <p className="text-sm text-slate-700">{result.tips}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}