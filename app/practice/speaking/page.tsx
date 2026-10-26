"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

// Topik untuk Part 2 (Cue Card)
const topics = [
  "Describe a memorable trip you have taken.",
  "Describe a person who has influenced you the most.",
  "Describe a skill you would like to learn.",
  "Describe your favorite childhood memory.",
  "Describe a piece of technology you use every day."
];

export default function SpeakingPage() {
  const [step, setStep] = useState(1); // 1: Intro, 2: Prep, 3: Speak, 4: Done
  const [topic, setTopic] = useState("");
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(60); // Default 60 detik (1 menit) untuk prep
  const [isActive, setIsActive] = useState(false);

  // Input text state
  const [userResponse, setUserResponse] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Logika Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (step === 2) {
        // Kalau persiapan habis, lanjut ke sesi bicara
        setStep(3);
        setTimeLeft(120); // 2 menit untuk bicara
        setIsActive(true);
      } else if (step === 3) {
        // Kalau waktu bicara habis
        setStep(4);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, step]);

  const startSpeaking = () => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    setTopic(randomTopic);
    setStep(2);
    setTimeLeft(60); // 1 menit persiapan
    setIsActive(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Simpan sebagai skor dummy (misal nilai band 6) karena belum ada AI audio
        // Nanti di masa depan, kita bisa sambungin ke AI
        const dummyBand = 6.0; 
        
        const { error } = await supabase
          .from("writing_scores") // Kita pinjam tabel writing dulu buat progress
          .insert([
            { 
              user_id: user.id, 
              essay_text: `Speaking Topic: ${topic}\n\nResponse: ${userResponse}`, 
              band_score: dummyBand,
              feedback_json: { type: "speaking", note: "Simulasi selesai" }
            }
          ]);
          
        if (error) throw error;
        alert("Simulasi Speaking selesai! Skor estimasi 6.0 telah disimpan ke Progress.");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan progress.");
    } finally {
      setIsSaving(false);
      setStep(5); // Finish
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <Link href="/practice" className="text-sm text-brand-600 hover:underline mb-6 inline-block">← Kembali ke Practice</Link>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Speaking Simulation</h1>
        <p className="text-slate-600 mb-8">Latih kemampuan berbicara kamu dengan simulasi waktu ujian asli.</p>

        {/* Tampilan Awal */}
        {step === 1 && (
          <div className="text-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
            <div className="text-6xl mb-4">🎤</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Siap untuk Mulai?</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Kamu akan diberikan sebuah topik. Kamu punya <strong>1 menit</strong> untuk persiapan, dan <strong>2 menit</strong> untuk berbicara (atau mengetik jawabanmu).
            </p>
            <button onClick={startSpeaking} className="rounded-xl bg-brand-500 px-8 py-3 font-bold text-white hover:bg-brand-600 transition">
              Mulai Simulasi
            </button>
          </div>
        )}

        {/* Persiapan (Step 2) & Berbicara (Step 3) */}
        {(step === 2 || step === 3) && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center">
              <p className="text-sm font-semibold text-brand-700 uppercase tracking-widest mb-2">
                {step === 2 ? "Waktu Persiapan (1 Menit)" : "Waktu Berbicara (2 Menit)"}
              </p>
              <div className={`text-5xl font-black font-mono ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Cue Card</h3>
              <p className="text-xl font-bold text-slate-800 mb-4">{topic}</p>
              
              {step === 2 && (
                <p className="text-sm text-slate-500 italic">Siapkan poin-poin pentingmu dalam pikiran. Timer berjalan...</p>
              )}

              {step === 3 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ketik jawabanmu di sini (atau bicara di depan HP, lalu ketik ringkasannya):
                  </label>
                  <textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="I would like to describe..."
                    className="w-full h-40 rounded-xl border border-slate-300 p-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              )}
            </div>

            {step === 3 && (
               <button 
                 onClick={() => setStep(4)} 
                 className="w-full rounded-xl bg-slate-800 py-3 font-bold text-white hover:bg-slate-900 transition"
               >
                 Selesai Lebih Awal
               </button>
            )}
          </div>
        )}

        {/* Selesai (Step 4) */}
        {step === 4 && (
          <div className="text-center rounded-2xl border border-green-200 bg-green-50 p-10 shadow-sm">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Waktu Habis!</h2>
            <p className="text-slate-600 mb-6">Kerja bagus. Simpan hasil latihanmu ke Progress.</p>
            <button 
              onClick={handleFinish} 
              disabled={isSaving}
              className="rounded-xl bg-brand-500 px-8 py-3 font-bold text-white hover:bg-brand-600 transition disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : "Simpan ke Progress"}
            </button>
          </div>
        )}

        {/* Hasil Akhir (Step 5) */}
        {step === 5 && (
          <div className="text-center rounded-2xl border border-brand-200 bg-white p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-brand-600 mb-2">Simulasi Selesai!</h2>
            <p className="text-slate-600 mb-8">Skor estimasi kamu sudah masuk ke halaman Progress.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/progress" className="rounded-xl bg-brand-500 px-6 py-3 font-bold text-white hover:bg-brand-600 transition">
                Lihat Progress
              </Link>
              <button onClick={() => { setStep(1); setUserResponse(""); }} className="rounded-xl border-2 border-slate-200 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50 transition">
                Ulangi
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}