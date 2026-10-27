"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { addXP } from "@/lib/xp";
import Navbar from "@/components/Navbar";

const questions = [
  { id: 1, text: "Apa arti kata 'Apple'?", options: ["Apel", "Jeruk", "Mangga", "Pisang"], answer: 0 },
  { id: 2, text: "Apa arti kata 'Run'?", options: ["Duduk", "Berlari", "Makan", "Tidur"], answer: 1 },
];

export default function ModuleOnePage() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelected(idx);
    setIsAnswered(true);
    if (idx === questions[currentIdx].answer) setScore(s => s + 1);
  };

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      // Kuis Selesai, simpan progress!
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 1. Tandai modul 1 selesai
        await supabase.from("completed_modules").insert({ user_id: user.id, module_id: 1 });
        // 2. Kasih XP
        await addXP(50); 
      }
      setIsSaving(false);
      router.push("/learn"); // Balik ke peta
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-10">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-brand-600">Modul 1: Kosakata</span>
            <span className="text-sm text-slate-500">Soal {currentIdx + 1} / {questions.length}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full">
            <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">{questions[currentIdx].text}</h2>
          <div className="space-y-3">
            {questions[currentIdx].options.map((opt, idx) => {
              const isCorrect = idx === questions[currentIdx].answer;
              const isWrong = isAnswered && idx === selected && !isCorrect;
              
              let bg = "bg-white border-slate-200 text-slate-700";
              if (isAnswered) {
                if (isCorrect) bg = "bg-green-100 border-green-500 text-green-800 font-bold";
                else if (isWrong) bg = "bg-red-100 border-red-500 text-red-800";
                else bg = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${bg}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {isAnswered && (
          <button
            onClick={handleNext}
            disabled={isSaving}
            className="w-full mt-6 bg-brand-500 text-white font-bold py-3.5 rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/30"
          >
            {isSaving ? "Menyimpan..." : currentIdx < questions.length - 1 ? "Soal Selanjutnya →" : "Selesai & Ambil XP"}
          </button>
        )}
        
        <div className="mt-6 text-center">
            <Link href="/learn" className="text-sm text-slate-400 hover:text-slate-600">← Kembali ke Peta</Link>
        </div>
      </main>
    </>
  );
}