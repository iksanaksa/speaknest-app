"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { addXP } from "@/lib/xp";
import Navbar from "@/components/Navbar";

const readingText = "Artificial Intelligence (AI) is changing the way we live. From smartphones that understand our voices to cars that can drive themselves, AI is everywhere. While some people worry that AI will take away jobs, others believe it will create new opportunities. The key is to learn how to work alongside technology, not against it.";

const questions = [
  {
    id: 1,
    text: "What is the main idea of the text?",
    options: ["A. AI is dangerous", "B. AI is changing our lives and we must adapt", "C. Cars cannot drive themselves", "D. Smartphones are bad"],
    answer: 1,
  },
  {
    id: 2,
    text: "According to the text, what do some people worry about?",
    options: ["A. AI taking away jobs", "B. AI making cars", "C. Smartphones exploding", "D. Learning new things"],
    answer: 0,
  },
];

export default function ModuleFourPage() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [isSaving, setIsSaving] = useState(false);

  const currentQ = questions[currentIdx];

  const handleCheck = () => {
    if (selected === currentQ.answer) setStatus("correct");
    else setStatus("wrong");
  };

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSelected(null);
      setStatus("idle");
    } else {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("completed_modules").insert({ user_id: user.id, module_id: 4 });
        await addXP(50);
      }
      setIsSaving(false);
      router.push("/learn");
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-10 flex flex-col min-h-[80vh]">
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-brand-600">Modul 4: Reading</span>
            <span className="text-sm text-slate-500">Soal {currentIdx + 1} / {questions.length}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full">
            <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>

        {/* Teks Bacaan */}
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl mb-6 text-slate-700 leading-relaxed text-sm">
          <p className="font-bold text-blue-800 mb-2">Read the text below:</p>
          {readingText}
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{currentQ.text}</h2>
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isCorrect = status === "correct" && isSelected;
              const isWrong = status === "wrong" && isSelected;
              const isActualAnswer = status !== "idle" && idx === currentQ.answer;

              let btnClass = "bg-white border-slate-200 text-slate-700 hover:border-brand-300";
              if (isSelected && status === "idle") btnClass = "bg-orange-50 border-brand-500 text-brand-700 ring-1 ring-brand-500";
              if (isActualAnswer) btnClass = "bg-green-50 border-green-500 text-green-800 font-bold";
              if (isWrong) btnClass = "bg-red-50 border-red-500 text-red-800 font-bold";

              return (
                <button
                  key={idx}
                  onClick={() => status === "idle" && setSelected(idx)}
                  disabled={status !== "idle"}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all shadow-sm ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto">
          {status === "idle" ? (
            <button
              onClick={handleCheck}
              disabled={selected === null}
              className="w-full bg-brand-500 text-white font-bold py-4 rounded-xl hover:bg-brand-600 disabled:opacity-50 transition shadow-lg shadow-brand-500/30"
            >
              Periksa Jawaban
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={isSaving}
              className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-500/30"
            >
              {isSaving ? "Menyimpan..." : currentIdx < questions.length - 1 ? "Soal Selanjutnya →" : "Selesai & Ambil XP"}
            </button>
          )}
          <div className="mt-6 text-center">
            <Link href="/learn" className="text-sm text-slate-400 hover:text-slate-600">← Kembali ke Peta</Link>
          </div>
        </div>

      </main>
    </>
  );
}