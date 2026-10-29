"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function AdminGeneratePage() {
  const router = useRouter();
  const [topicsInput, setTopicsInput] = useState("");
  const [level, setLevel] = useState("A0");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: "" });
  const [error, setError] = useState("");
  const [generatedUnits, setGeneratedUnits] = useState<any[]>([]);

  const handleGenerateBulk = async () => {
    if (!topicsInput) return setError("Isi topik dulu!");
    
    // Pisahkan topik berdasarkan koma
    const topics = topicsInput.split(",").map(t => t.trim()).filter(t => t !== "");
    if (topics.length === 0) return setError("Format topik tidak valid.");

    setIsGenerating(true);
    setError("");
    setGeneratedUnits([]);
    setProgress({ current: 0, total: topics.length, status: "Memulai pabrik..." });

    const results = [];

    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      setProgress({ current: i + 1, total: topics.length, status: `Membuat materi: ${topic}...` });

      try {
        // 1. Tembak API Generate
        const res = await fetch("/api/generate-unit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, level }),
        });
        
        const data = await res.json();
        
        if (res.ok) {
          // 2. Simpan ke Database
          const { error: dbError } = await supabase.from("curriculum_units").insert({
            id: data.id,
            level: data.level,
            title: data.title,
            goal: data.goal,
            content: data.content,
          });

          if (!dbError) {
            results.push(data);
          } else {
            console.error(`Gagal simpan ${topic}:`, dbError);
          }
        } else {
          console.error(`Gagal generate ${topic}:`, data.error);
        }
      } catch (err) {
        console.error(`Error koneksi ${topic}:`, err);
      }
      
      // Jeda 2 detik antar request biar nggak kena limit API
      await new Promise(r => setTimeout(r, 2000));
    }

    setGeneratedUnits(results);
    setIsGenerating(false);
    setProgress({ current: 0, total: 0, status: "Selesai!" });
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <div className="bg-slate-900 text-white p-6 rounded-2xl mb-8 shadow-xl">
          <h1 className="text-2xl font-bold mb-2">🏭 Pabrik Konten AI (Mode Borongan)</h1>
          <p className="text-slate-400 text-sm">Ketik banyak topik sekaligus, dipisahkan dengan koma. AI akan membuat semuanya secara otomatis!</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Level</label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="A0">A0 (Starter)</option>
                <option value="A1">A1 (Beginner)</option>
                <option value="A2">A2 (Elementary)</option>
                <option value="B1">B1 (Intermediate)</option>
                <option value="B2">B2 (Upper-Intermediate)</option>
                <option value="C1">C1 (Advanced)</option>
                <option value="C2">C2 (Mastery)</option>

              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-slate-700 mb-1">Topik (Pisahkan dengan koma)</label>
              <textarea
                value={topicsInput}
                onChange={(e) => setTopicsInput(e.target.value)}
                placeholder="Contoh: Makanan & Minuman, Hewan Peliharaan, Warna & Bentuk, Angka 1-100, Anggota Keluarga"
                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-500 h-24"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            onClick={handleGenerateBulk}
            disabled={isGenerating || !topicsInput}
            className="w-full bg-brand-500 text-white font-bold py-3 rounded-xl hover:bg-brand-600 transition disabled:opacity-50"
          >
            {isGenerating 
              ? `⏳ Memproses (${progress.current}/${progress.total}): ${progress.status}` 
              : "🤖 Generate Semua Materi AI"}
          </button>
        </div>

        {/* Hasil Generate */}
        {generatedUnits.length > 0 && (
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <h2 className="text-lg font-bold text-green-700 mb-4">✅ {generatedUnits.length} Unit Berhasil Dibuat & Disimpan!</h2>
            <ul className="space-y-2 mb-6">
              {generatedUnits.map((unit, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                  <span className="text-green-500">✓</span> {unit.title} ({unit.id})
                </li>
              ))}
            </ul>
            <button
              onClick={() => router.push("/learn")}
              className="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-500/30"
            >
              Lihat Peta Belajar Sekarang
            </button>
          </div>
        )}
      </main>
    </>
  );
}