"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function UnitPlayerPage() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Ambil ID dari URL secara manual (karena useParams belum ada di Next 13.2)
  const unitId = pathname ? pathname.split("/").pop() : "";

  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"vocab" | "grammar">("vocab");

  useEffect(() => {
    const fetchUnit = async () => {
      if (!unitId) return;
      
      const { data, error } = await supabase
        .from("curriculum_units")
        .select("*")
        .eq("id", unitId)
        .single();
        
      if (data) setUnit(data);
      setLoading(false);
    };
    fetchUnit();
  }, [unitId]);

  if (loading) return <div className="min-h-screen grid place-items-center">Membuka kotak bekal... 📦</div>;
  if (!unit) return <div className="min-h-screen grid place-items-center text-red-500">Unit tidak ditemukan.</div>;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-10 pb-20">
        <Link href="/learn" className="text-sm text-brand-600 hover:underline mb-4 inline-block">← Kembali ke Peta</Link>
        
        {/* Header Unit */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md">{unit.level}</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">{unit.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{unit.goal}</p>
        </div>

        {/* Hook (Dialog) */}
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl mb-8">
          <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Percakapan Pemanasan</p>
          <div className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
            {unit.content.hook.text}
          </div>
        </div>

        {/* Tab Menu */}
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setActiveTab("vocab")}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${activeTab === "vocab" ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600"}`}
          >
            Kosakata
          </button>
          <button 
            onClick={() => setActiveTab("grammar")}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${activeTab === "grammar" ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600"}`}
          >
            Grammar
          </button>
        </div>

        {/* Konten Tab */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8 min-h-[300px]">
          {activeTab === "vocab" && (
            <div className="space-y-4">
              {unit.content.vocabulary.map((vocab: any, i: number) => (
                <div key={i} className="border-b border-slate-100 pb-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{vocab.en}</span>
                    <span className="text-brand-600 font-medium">{vocab.id}</span>
                  </div>
                  <p className="text-sm text-slate-500 italic mt-1">"{vocab.example}"</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "grammar" && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{unit.content.grammar.title}</h3>
              <p className="text-slate-600 mb-4">{unit.content.grammar.explanation}</p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Contoh:</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {unit.content.grammar.examples.map((ex: string, i: number) => (
                    <li key={i}>• {ex}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Tombol Lanjut ke Latihan */}
        <button
          onClick={() => router.push(`/learn/unit/${unitId}/practice`)}
          className="w-full bg-brand-500 text-white font-bold py-4 rounded-xl hover:bg-brand-600 transition shadow-lg shadow-brand-500/30"
        >
          Mulai Latihan Soal →
        </button>

      </main>
    </>
  );
}