"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ToolsPage() {
  // ===== LOGIKA WORD COUNTER =====
  const [text, setText] = useState("");
  
  // Fungsi hitung kata: pisahkan teks berdasarkan spasi, lalu hitung
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  // ===== LOGIKA TIMER =====
  const [timeLeft, setTimeLeft] = useState(40 * 60); // Default 40 menit (dalam detik)
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Di HP, alert standar browser bisa dipakai untuk notifikasi
      alert("Waktu habis!");
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Format detik ke MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const resetTimer = (minutes: number) => {
    setIsRunning(false);
    setTimeLeft(minutes * 60);
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-10">
        <Link href="/" className="text-sm text-brand-600 hover:underline mb-6 inline-block">← Kembali ke Beranda</Link>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Alat Bantu Latihan 🛠️</h1>
        <p className="text-slate-600 mb-8">Gunakan alat ini untuk simulasi waktu ujian dan menghitung panjang esai kamu.</p>

        <div className="grid gap-8 md:grid-cols-2">
          
          {/* ===== KARTU WORD COUNTER ===== */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Word Counter</h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ketik atau tempel esai kamu di sini untuk menghitung kata..."
              className="w-full h-48 rounded-xl border border-slate-300 p-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <div className="flex justify-between mt-4 p-4 bg-brand-50 rounded-xl">
              <div className="text-center">
                <p className="text-2xl font-black text-brand-600">{wordCount}</p>
                <p className="text-xs text-brand-800 uppercase tracking-wider font-semibold">Kata</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-brand-600">{charCount}</p>
                <p className="text-xs text-brand-800 uppercase tracking-wider font-semibold">Karakter</p>
              </div>
            </div>
          </div>

          {/* ===== KARTU TIMER ===== */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">Timer Ujian</h2>
              <div className={`text-center py-8 rounded-2xl mb-6 transition-colors ${timeLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-800'}`}>
                <p className="text-6xl font-black font-mono">{formatTime(timeLeft)}</p>
                <p className="text-sm font-semibold mt-2 opacity-70">
                  {timeLeft < 300 ? "Waktu hampir habis!" : "Sisa Waktu"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2 justify-center mb-4">
                <button onClick={() => resetTimer(40)} className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-lg hover:bg-slate-200">40 Mnt (Task 2)</button>
                <button onClick={() => resetTimer(20)} className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-lg hover:bg-slate-200">20 Mnt (Task 1)</button>
                <button onClick={() => resetTimer(60)} className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-lg hover:bg-slate-200">60 Mnt (Reading)</button>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 py-3 rounded-xl font-bold text-white transition-colors ${isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-brand-500 hover:bg-brand-600'}`}
                >
                  {isRunning ? "Pause ⏸" : "Mulai ▶"}
                </button>
                <button
                  onClick={() => resetTimer(40)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Reset ↺
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}