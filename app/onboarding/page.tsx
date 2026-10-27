"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";

// Komponen Maskot Sparky
const Sparky = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center mb-8">
    {/* Speech Bubble */}
    <div className="relative bg-white border-2 border-slate-200 rounded-2xl p-4 mb-4 shadow-sm max-w-xs text-center">
      <p className="text-slate-700 font-medium text-sm leading-relaxed">{message}</p>
      {/* Ekor bubble chat */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-200 rotate-45"></div>
    </div>

    {/* Badan Sparky */}
    <div className="sparky-container relative w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.4)] flex items-center justify-center">
      {/* Mata */}
      <div className="flex gap-3">
        <div className="sparky-eye w-3 h-6 bg-slate-900 rounded-full"></div>
        <div className="sparky-eye w-3 h-6 bg-slate-900 rounded-full"></div>
      </div>
      {/* Pipi merona */}
      <div className="absolute bottom-5 left-4 w-3 h-1.5 bg-pink-400/50 rounded-full blur-[1px]"></div>
      <div className="absolute bottom-5 right-4 w-3 h-1.5 bg-pink-400/50 rounded-full blur-[1px]"></div>
      {/* Kaki api kecil */}
      <div className="absolute -bottom-2 w-8 h-4 bg-orange-500 rounded-b-full blur-sm opacity-80"></div>
    </div>
  </div>
);

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [painPoint, setPainPoint] = useState("");

  // Progress bar (0% sampai 100%)
  const progress = (step / 3) * 100;

  const handleFinish = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from("profiles").upsert({
          id: user.id,
          goal,
          current_level: level,
          pain_point: painPoint,
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan profil. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header: Logo & Progress Bar */}
      <div className="p-5 flex items-center gap-4 max-w-lg mx-auto w-full">
        <Logo />
        <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button onClick={() => router.push("/")} className="text-slate-400 hover:text-slate-600 font-bold text-xl">×</button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-5 pb-10 max-w-lg mx-auto w-full">
        
        {/* STEP 1: Tujuan */}
        {step === 1 && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparky message="Hai! Aku Sparky. Apa tujuan utama kamu belajar bahasa Inggris?" />
            <div className="space-y-3">
              {[
                { id: "study", icon: "🎓", title: "Kuliah / Beasiswa" },
                { id: "work", icon: "💼", title: "Kerja / Karier" },
                { id: "travel", icon: "✈️", title: "Jalan-jalan / Liburan" },
                { id: "exam", icon: "📝", title: "Persiapan Ujian IELTS" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setGoal(item.title); setStep(2); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-brand-500 hover:bg-orange-50 transition text-left shadow-sm"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold text-slate-700">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Level */}
        {step === 2 && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
            <Sparky message="Oke, siap! Kalau level bahasa Inggris kamu sekarang gimana?" />
            <div className="space-y-3">
              {[
                { id: "beginner", title: "Pemula", desc: "Tahu beberapa kata saja." },
                { id: "intermediate", title: "Menengah", desc: "Bisa ngobrol tapi masih terbata-bata." },
                { id: "advanced", title: "Mahir", desc: "Lancar, tapi mau poles lagi." },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setLevel(item.title); setStep(3); }}
                  className="w-full flex flex-col p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-brand-500 hover:bg-orange-50 transition text-left shadow-sm"
                >
                  <span className="font-bold text-slate-800">{item.title}</span>
                  <span className="text-sm text-slate-500 mt-1">{item.desc}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-6 text-sm font-semibold text-slate-400 hover:text-slate-600 block mx-auto">← Kembali</button>
          </div>
        )}

        {/* STEP 3: Kendala */}
        {step === 3 && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
            <Sparky message="Hampir selesai! Apa yang paling sering bikin kamu kesulitan?" />
            <div className="space-y-3 mb-8">
              {[
                { id: "speaking", title: "Nggak Percaya Diri / Takut Salah" },
                { id: "vocab", title: "Kosakata Terlalu Sedikit" },
                { id: "grammar", title: "Grammar Sering Berantakan" },
                { id: "listening", title: "Orang Bicara Terlalu Cepat" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPainPoint(item.title)}
                  className={`w-full p-4 rounded-xl border-2 transition text-left font-medium shadow-sm ${
                    painPoint === item.title 
                      ? "border-brand-500 bg-orange-50 text-brand-700 ring-2 ring-brand-500/20" 
                      : "border-slate-200 bg-white text-slate-700 hover:border-brand-300"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
            <button
              onClick={handleFinish}
              disabled={!painPoint || loading}
              className="w-full rounded-xl bg-brand-500 py-4 font-bold text-white text-lg hover:bg-brand-600 disabled:opacity-50 transition shadow-lg shadow-brand-500/30"
            >
              {loading ? "Menyimpan..." : "Selesai & Mulai Belajar 🚀"}
            </button>
            <button onClick={() => setStep(2)} className="mt-4 text-sm font-semibold text-slate-400 hover:text-slate-600 block mx-auto">← Kembali</button>
          </div>
        )}

      </div>
    </main>
  );
}