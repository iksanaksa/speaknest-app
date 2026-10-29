"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function AdminGeneratePage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("A0");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
  if (!topic) return setError("Isi topik dulu!");
  setIsGenerating(true);
  setError("");
  setGeneratedData(null);

  try {
    const res = await fetch("/api/generate-unit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, level }),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || "Gagal mengambil data dari AI");
    }
    
    setGeneratedData(data);
  } catch (err: any) {
    setError(err.message); // Nampilin pesan error asli
  } finally {
    setIsGenerating(false);
  }
};

  const handleSaveToDatabase = async () => {
    if (!generatedData) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from("curriculum_units").insert({
        id: generatedData.id,
        level: generatedData.level,
        title: generatedData.title,
        goal: generatedData.goal,
        content: generatedData.content,
      });
      if (error) throw error;
      alert("Berhasil disimpan ke Database!");
      router.push("/learn");
    } catch (err: any) {
      alert("Gagal simpan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <div className="bg-slate-900 text-white p-6 rounded-2xl mb-8 shadow-xl">
          <h1 className="text-2xl font-bold mb-2">🏭 Pabrik Konten AI</h1>
          <p className="text-slate-400 text-sm">Ketik topik, biarkan AI yang membuat materi, kuis, dan tugasnya untukmu.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Level (CEFR)</label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="A0">A0 (Starter)</option>
                <option value="A1">A1 (Beginner)</option>
                <option value="A2">A2 (Elementary)</option>
                <option value="B1">B1 (Intermediate)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Topik Pembelajaran</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Makanan & Minuman, Hewan Peliharaan, Cuaca..."
                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
          >
            {isGenerating ? "⏳ AI Sedang Menulis Materi..." : "🤖 Generate Materi AI"}
          </button>
        </div>

        {/* Preview Data JSON */}
        {generatedData && (
          <div className="bg-white rounded-2xl p-6 border-2 border-green-500 shadow-lg animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-lg font-bold text-green-700 mb-4">✅ Berhasil Di-generate!</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Judul</p>
                <p className="font-bold text-lg">{generatedData.title}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Tujuan</p>
                <p className="text-slate-700">{generatedData.goal}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Preview Kosakata</p>
                <div className="bg-slate-50 p-3 rounded-lg text-sm font-mono overflow-x-auto">
                  {generatedData.content.vocabulary.map((v: any, i: number) => (
                    <div key={i}>{v.en} = {v.id}</div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveToDatabase}
              disabled={isSaving}
              className="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-500/30"
            >
              {isSaving ? "Menyimpan..." : "💾 Simpan ke Database Peta Belajar"}
            </button>
          </div>
        )}
      </main>
    </>
  );
}