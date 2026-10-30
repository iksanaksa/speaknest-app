"use client";

import { useState, useEffect, useRef } from "react";
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
  
  // State Speaking
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  
  // Mode Ketik Manual (Kalau Mic Error)
  const [isManualMode, setIsManualMode] = useState(false);

  const recognitionRef = useRef<any>(null);
  // Nyimpen teks final biar nggak ilang pas mic restart
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    const fetchUnit = async () => {
      const { data } = await supabase.from("curriculum_units").select("*").eq("id", unitId).single();
      if (data) setUnit(data);
      setLoading(false);
    };
    fetchUnit();

    // Inisialisasi Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US"; 

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscriptRef.current += event.results[i][0].transcript + " ";
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          // Gabungin teks final dan teks sementara
          setTranscript(finalTranscriptRef.current + interimTranscript);
        };

        // AUTO RESTART: Kalau mic mati sendiri, nyalain lagi
        recognitionRef.current.onend = () => {
          if (isListening) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.log("Gagal restart mic:", e);
            }
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Mic Error:", event.error);
          if (event.error === 'not-allowed') {
            setError("Izin mikrofon ditolak. Aktifkan di pengaturan browser.");
            setIsListening(false);
          }
        };
      } else {
        setError("Browser tidak mendukung mikrofon. Silakan ketik manual.");
        setIsManualMode(true);
      }
    }
  }, [unitId, isListening]); // Tambahin isListening biar logikanya update

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setError("");
      setTranscript("");
      finalTranscriptRef.current = "";
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSubmit = async () => {
    if (transcript.length < 5) {
      setError("Jawaban terlalu pendek. Coba bicara/ketik lebih banyak.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    
    try {
      const res = await fetch("/api/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          transcript, 
          level: unit.level, 
          prompt: unit.content.speaking.prompt 
        }),
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
  if (!unit?.content?.speaking) return <div className="min-h-screen grid place-items-center">Tugas speaking tidak ditemukan.</div>;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-10">
        <Link href={`/learn/unit/${unitId}`} className="text-sm text-brand-600 hover:underline mb-4 inline-block">← Kembali ke Materi</Link>
        
        {!result ? (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">Speaking Task</span>
                <button onClick={() => setIsManualMode(!isManualMode)} className="text-xs font-bold text-slate-400 underline hover:text-slate-600">
                  {isManualMode ? "Gunakan Mikrofon" : "Ketik Manual"}
                </button>
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-2">Tugas Berbicara</h1>
              
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-6 text-center">
                <p className="text-purple-800 font-bold text-lg mb-2">🎤 Prompt:</p>
                <p className="text-slate-700 font-medium italic">"{unit.content.speaking.prompt}"</p>
              </div>

              {/* JIKA MODE MIKROFON */}
              {!isManualMode ? (
                <div className="text-center mb-4 animate-in fade-in">
                  <p className="text-sm text-slate-500 mb-4">Tekan tombol mikrofon dan bicara dalam bahasa Inggris.</p>
                  
                  <button
                    onClick={toggleListening}
                    className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 transition-all shadow-xl ${
                      isListening 
                        ? "bg-red-500 border-red-700 animate-pulse text-white" 
                        : "bg-purple-500 border-purple-700 text-white hover:scale-105"
                    }`}
                  >
                    {isListening ? <span className="text-4xl">⏹</span> : <span className="text-4xl">🎤</span>}
                  </button>
                  <p className="mt-4 text-sm font-bold text-slate-600">
                    {isListening ? "Mendengarkan suaramu..." : "Klik untuk merekam"}
                  </p>
                </div>
              ) : (
                /* JIKA MODE KETIK MANUAL */
                <div className="animate-in fade-in">
                  <p className="text-sm text-slate-500 mb-2">Ketik jawabanmu dalam bahasa Inggris:</p>
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Hello, my name is..."
                    className="w-full h-32 rounded-xl border border-slate-300 p-4 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              )}

              {/* Hasil Transkrip */}
              {!isManualMode && (
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Transkrip Suara:</p>
                  <div className="bg-slate-50 p-4 rounded-xl min-h-[80px] text-slate-700 italic border border-slate-200">
                    {transcript || "Belum ada suara yang terekam..."}
                  </div>
                  {transcript.length > 0 && (
                    <p className="text-xs text-slate-400 mt-2 text-right">*Kalau transkrip banyak salah, coba bicara lebih dekat ke mikrofon atau gunakan "Ketik Manual".</p>
                  )}
                </div>
              )}

              {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || transcript.length < 5 || isListening}
              className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "AI sedang menilai..." : "Kirim ke AI"}
            </button>
          </>
        ) : (
          /* Tampilan Hasil AI */
          <div className="rounded-2xl border border-purple-200 bg-purple-50 overflow-hidden shadow-lg">
            <div className="bg-purple-600 p-6 text-center text-white">
              <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Estimasi Band Speaking</p>
              <p className="text-5xl font-black mt-2">{result.bandScore}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <p className="font-bold text-slate-800 text-sm">Fluency</p>
                <p className="text-xs text-slate-600">{result.fluency}</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Vocabulary</p>
                <p className="text-xs text-slate-600">{result.vocabulary}</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Grammar</p>
                <p className="text-xs text-slate-600">{result.grammar}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-purple-200 bg-white/50 p-4 rounded-xl">
                <p className="font-bold text-purple-700 mb-1 text-sm">💡 Tips:</p>
                <p className="text-xs text-slate-700">{result.tips}</p>
              </div>
            </div>
            
            <div className="p-6 bg-white border-t border-purple-100">
              <button onClick={() => router.push("/learn")} className="w-full bg-brand-500 text-white font-bold py-3.5 rounded-xl hover:bg-brand-600 transition">
                Kembali ke Peta
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}