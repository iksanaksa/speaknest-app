"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { addXP } from "@/lib/xp";
import Navbar from "@/components/Navbar";

// Data soal (Dialog)
const questions = [
  {
    id: 1,
    context: "Di Restoran",
    npc: "Waiter: Hello, are you ready to order?",
    options: [
      "Yes, I would like a cup of coffee, please.",
      "No, I am a student.",
      "I am going to school.",
    ],
    answer: 0,
  },
  {
    id: 2,
    context: "Di Jalan",
    npc: "Stranger: Excuse me, how do I get to the train station?",
    options: [
      "I like playing football.",
      "Go straight and turn left at the traffic light.",
      "My name is Ikhsan.",
    ],
    answer: 1,
  },
  {
    id: 3,
    context: "Di Toko",
    npc: "Cashier: That will be 50,000 rupiahs. How would you like to pay?",
    options: [
      "I will pay with cash.",
      "I want to buy a house.",
      "See you tomorrow!",
    ],
    answer: 0,
  },
];

export default function ModuleThreePage() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [isSaving, setIsSaving] = useState(false);

  const currentQ = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (status !== "idle") return;
    setSelected(idx);
  };

  const handleCheck = () => {
    if (selected === currentQ.answer) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }
  };

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSelected(null);
      setStatus("idle");
    } else {
      // Modul Selesai
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Simpan progress modul 3 (abaikan error jika sudah ada)
        await supabase.from("completed_modules").insert({ user_id: user.id, module_id: 3 });
        await addXP(50); // Kasih 50 XP
      }
      setIsSaving(false);
      router.push("/learn"); // Balik ke peta
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-10 flex flex-col min-h-[80vh]">
        
        {/* Header Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-brand-600">Modul 3: Percakapan</span>
            <span className="text-sm text-slate-500">Soal {currentIdx + 1} / {questions.length}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full">
            <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>

        {/* Konteks & Dialog */}
        <div className="mb-8">
          <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            {currentQ.context}
          </span>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl shrink-0">🧑</div>
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none text-slate-800">
              {currentQ.npc}
            </div>
          </div>
        </div>

        {/* Pilihan Jawaban */}
        <div className="space-y-3 mb-auto">
          <p className="text-sm font-bold text-slate-500 mb-2">Pilih balasan yang paling tepat:</p>
          {currentQ.options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = status === "correct" && isSelected;
            const isWrong = status === "wrong" && isSelected;
            const isActualAnswer = status !== "idle" && idx === currentQ.answer;

            let btnClass = "bg-white border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-orange-50";
            if (isSelected && status === "idle") btnClass = "bg-orange-50 border-brand-500 text-brand-700 ring-1 ring-brand-500";
            if (isActualAnswer) btnClass = "bg-green-50 border-green-500 text-green-800 font-bold";
            if (isWrong) btnClass = "bg-red-50 border-red-500 text-red-800 font-bold";

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={status !== "idle"}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all shadow-sm ${btnClass}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Pesan Status & Tombol */}
        <div className="mt-8">
          {status === "wrong" && (
            <div className="mb-4 text-red-600 font-bold bg-red-50 p-3 rounded-lg">
              ❌ Balasan kurang tepat. Perhatikan konteksnya ya!
            </div>
          )}
          {status === "correct" && (
            <div className="mb-4 text-green-600 font-bold bg-green-50 p-3 rounded-lg">
              ✅ Tepat! Itu balasan yang paling wajar.
            </div>
          )}

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