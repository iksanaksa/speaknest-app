"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { addXP } from "@/lib/xp";
import Navbar from "@/components/Navbar";

const questions = [
  {
    id: 1,
    text: "Someone says: 'I think technology makes us lazy.' What is the best response to start a discussion?",
    options: [
      "A. No, you are wrong.",
      "B. That is an interesting point. However, it also helps us work faster.",
      "C. I don't care about technology.",
      "D. Technology is bad.",
    ],
    answer: 1,
  },
  {
    id: 2,
    text: "In a formal debate, how do you politely disagree?",
    options: [
      "A. You are crazy if you think that.",
      "B. I'm afraid I have to disagree with you on this matter.",
      "C. Shut up, I'm talking.",
      "D. That's stupid.",
    ],
    answer: 1,
  },
];

export default function ModuleFivePage() {
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
        await supabase.from("completed_modules").insert({ user_id: user.id, module_id: 5 });
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
            <span className="text-sm font-bold text-purple-600">Modul 5: Diskusi Abstrak</span>
            <span className="text-sm text-slate-500">Soal {currentIdx + 1} / {questions.length}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full">
            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>

        <div className="mb-8">
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Diskusi Formal
          </span>
          <h2 className="text-xl font-bold text-slate-800 mb-6">{currentQ.text}</h2>
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isCorrect = status === "correct" && isSelected;
              const isWrong = status === "wrong" && isSelected;
              const isActualAnswer = status !== "idle" && idx === currentQ.answer;

              let btnClass = "bg-white border-slate-200 text-slate-700 hover:border-purple-300";
              if (isSelected && status === "idle") btnClass = "bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500";
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
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 disabled:opacity-50 transition shadow-lg shadow-purple-600/30"
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