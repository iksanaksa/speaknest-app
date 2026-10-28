"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";

// Maskot Sparky
const Sparky = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center mb-6">
    <div className="relative bg-white border-2 border-slate-200 rounded-2xl p-4 mb-4 shadow-sm max-w-xs text-center">
      <p className="text-slate-700 font-medium text-sm leading-relaxed">{message}</p>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-200 rotate-45"></div>
    </div>
    <div className="sparky-container relative w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.4)] flex items-center justify-center">
      <div className="flex gap-3">
        <div className="sparky-eye w-2.5 h-5 bg-slate-900 rounded-full"></div>
        <div className="sparky-eye w-2.5 h-5 bg-slate-900 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // State Jawaban
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [dailyGoal, setDailyGoal] = useState(15);
  const [interests, setInterests] = useState<string[]>([]);
  const [painPoint, setPainPoint] = useState("");

  const progress = (step / 5) * 100;

  const toggleInterest = (topic: string) => {
    if (interests.includes(topic)) {
      setInterests(interests.filter(t => t !== topic));
    } else {
      setInterests([...interests, topic]);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from("profiles").upsert({
          id: user.id,
          goal,
          current_level: level,
          daily_goal: dailyGoal,
          interests: interests.join(", "),
          pain_point: painPoint,
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
        router.push("/learn"); // Langsung lempar ke Peta Belajar!
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Progress */}
      <div className="p-5 flex items-center gap-4 max-w-lg mx-auto w-full">
        <Logo />
        <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <button onClick={() => router.push("/")} className="text-slate-400 hover:text-slate-600 font-bold text-xl">×</button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-5 pb-10 max-w-lg mx-auto w-full">
        
        {/* STEP 1: Tujuan */}
        {step === 1 && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparky message="Halo! Aku Sparky. Apa tujuan utama kamu belajar bahasa Inggris?" />
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
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-brand-500 transition text-left shadow-sm"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold text-slate-700">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Level (INI YANG NENTUIN LONCAT MODUL) */}
        {step === 2 && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
            <Sparky message="Oke, siap! Kalau level bahasa Inggris kamu sekarang gimana? Jujur aja." />
            <div className="space-y-3">
              {[
                { id: "beginner", title: "Pemula", desc: "Tahu beberapa kata saja." },
                { id: "intermediate", title: "Menengah", desc: "Bisa ngobrol tapi masih terbata-bata." },
                { id: "advanced", title: "Mahir", desc: "Lancar, tapi mau poles lagi." },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setLevel(item.title); setStep(3); }}
                  className="w-full flex flex-col p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-brand-500 transition text-left shadow-sm"
                >
                  <span className="font-bold text-slate-800">{item.title}</span>
                  <span className="text-sm text-slate-500 mt-1">{item.desc}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-6 text-sm font-semibold text-slate-400 block mx-auto">← Kembali</button>
          </div>
        )}

        {/* STEP 3: Target Harian */}
        {step === 3 && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
            <Sparky message="Berapa menit waktu yang bisa kamu luangkan untuk belajar setiap hari?" />
            <div className="grid grid-cols-2 gap-3">
              {[
                { time: 5, label: "Santai" },
                { time: 10, label: "Biasa" },
                { time: 15, label: "Serius" },
                { time: 30, label: "Hebat" },
              ].map((item) => (
                <button
                  key={item.time}
                  onClick={() => { setDailyGoal(item.time); setStep(4); }}
                  className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-200 bg-white hover:border-brand-500 transition shadow-sm"
                >
                  <span className="text-2xl font-black text-slate-800">{item.time} mnt</span>
                  <span className="text-xs font-semibold text-brand-600 mt-1">{item.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="mt-6 text-sm font-semibold text-slate-400 block mx-auto">← Kembali</button>
          </div>
        )}

        {/* STEP 4: Topik Favorit */}
        {step === 4 && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
            <Sparky message="Topik apa yang paling bikin kamu tertarik? (Bisa pilih banyak)" />
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {["Film & Serial", "Musik", "Traveling", "Teknologi", "Bisnis", "Olahraga", "Kuliner", "Sains"].map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleInterest(topic)}
                  className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition ${
                    interests.includes(topic)
                      ? "border-brand-500 bg-orange-50 text-brand-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(5)}
              disabled={interests.length === 0}
              className="w-full rounded-xl bg-brand-500 py-3.5 font-bold text-white hover:bg-brand-600 disabled:opacity-50 transition"
            >
              Lanjutkan
            </button>
          </div>
        )}

        {/* STEP 5: Kendala */}
        {step === 5 && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
            <Sparky message="Terakhir! Apa yang paling sering bikin kamu kesulitan?" />
            <div className="space-y-3 mb-8">
              {[
                "Nggak Percaya Diri / Takut Salah",
                "Kosakata Terlalu Sedikit",
                "Grammar Sering Berantakan",
                "Orang Bicara Terlalu Cepat",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setPainPoint(item)}
                  className={`w-full p-4 rounded-xl border-2 transition text-left font-medium shadow-sm ${
                    painPoint === item 
                      ? "border-brand-500 bg-orange-50 text-brand-700 ring-2 ring-brand-500/20" 
                      : "border-slate-200 bg-white text-slate-700 hover:border-brand-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={handleFinish}
              disabled={!painPoint || loading}
              className="w-full rounded-xl bg-brand-500 py-4 font-bold text-white text-lg hover:bg-brand-600 disabled:opacity-50 transition shadow-lg shadow-brand-500/30"
            >
              {loading ? "Menyiapkan Kelas..." : "Selesai & Mulai Belajar 🚀"}
            </button>
          </div>
        )}

      </div>
    </main>
  );
}