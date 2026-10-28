"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { addXP } from "@/lib/xp";
import Navbar from "@/components/Navbar";

// Data soal (Word Bank)
const questions = [
  {
    id: 1,
    prompt: "Saya pergi ke sekolah setiap hari.",
    correctAnswer: "I go to school every day",
    bank: ["to", "I", "every", "eat", "go", "school", "day", "sleep"],
  },
  {
    id: 2,
    prompt: "Dia suka makan apel.",
    correctAnswer: "She likes to eat apples",
    bank: ["eat", "likes", "She", "apples", "to", "drink"],
  },
  {
    id: 3,
    prompt: "Mereka sedang belajar bahasa Inggris.",
    correctAnswer: "They are studying English",
    bank: ["studying", "are", "They", "English", "is", "play"],
  },
];

export default function ModuleTwoPage() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [isSaving, setIsSaving] = useState(false);

  // Load bank kata saat ganti soal
  useEffect(() => {
    setAvailableWords(questions[currentIdx].bank);
    setSelectedWords([]);
    setStatus("idle");
  }, [currentIdx]);

  // Fungsi saat user klik kata di bank
  const handleSelectWord = (word: string, index: number) => {
    if (status !== "idle") return;
    setSelectedWords([...selectedWords, word]);
    const newBank = [...availableWords];
    newBank.splice(index, 1);
    setAvailableWords(newBank);
  };

  // Fungsi saat user klik kata yang udah dipilih (buat batalin)
  const handleRemoveWord = (word: string, index: number) => {
    if (status !== "idle") return;
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, word]);
  };

  // Cek Jawaban
  const handleCheck = () => {
    const userAnswer = selectedWords.join(" ");
    if (userAnswer === questions[currentIdx].correctAnswer) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }
  };

  // Lanjut ke soal berikutnya / Selesai
  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((c) => c + 1);
    } else {
      // Modul Selesai
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Simpan progress modul 2
        const { error } = await supabase.from("completed_modules").insert({ user_id: user.id, module_id: 2 });
        // Abaikan error kalau modul udah pernah diselesaiin (unique constraint)
        await addXP(50);
      }
      setIsSaving(false);
      router.push("/learn"); // Balik ke peta
    }
  };

  const currentQ = questions[currentIdx];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-10 flex flex-col min-h-[80vh]">
        
        {/* Header Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-brand-600">Modul 2: Grammar</span>
            <span className="text-sm text-slate-500">Soal {currentIdx + 1} / {questions.length}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full">
            <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>

        {/* Pertanyaan */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Terjemahkan kalimat ini:</h2>
          <p className="text-lg text-slate-600 italic">"{currentQ.prompt}"</p>
        </div>

        {/* Area Jawaban User */}
        <div className={`min-h-[120px] border-b-2 border-slate-200 mb-8 pb-4 flex flex-wrap gap-2 content-start ${status === 'wrong' ? 'border-red-500' : status === 'correct' ? 'border-green-500' : ''}`}>
          {selectedWords.length === 0 && <span className="text-slate-300 italic text-sm">Klik kata di bawah untuk menyusun kalimat...</span>}
          {selectedWords.map((word, i) => (
            <button
              key={`sel-${i}`}
              onClick={() => handleRemoveWord(word, i)}
              disabled={status !== "idle"}
              className="px-3 py-1.5 bg-white border-2 border-slate-200 rounded-lg text-slate-700 font-medium shadow-sm hover:bg-slate-50 transition"
            >
              {word}
            </button>
          ))}
        </div>

        {/* Status Benar/Salah */}
        {status === "wrong" && (
          <div className="mb-4 text-red-600 font-bold bg-red-50 p-3 rounded-lg">
            ❌ Belum tepat. Coba susun ulang ya!
            <button onClick={() => { setStatus("idle"); setSelectedWords([]); setAvailableWords(currentQ.bank); }} className="block mt-2 text-sm underline text-red-700">Reset Jawaban</button>
          </div>
        )}
        {status === "correct" && (
          <div className="mb-4 text-green-600 font-bold bg-green-50 p-3 rounded-lg flex items-center gap-2">
            ✅ Tepat sekali! Kalimatnya sudah benar.
          </div>
        )}

        {/* Word Bank (Pilihan Kata) */}
        <div className="flex flex-wrap gap-2 mb-auto">
          {availableWords.map((word, i) => (
            <button
              key={`bank-${i}`}
              onClick={() => handleSelectWord(word, i)}
              disabled={status !== "idle"}
              className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-slate-700 font-bold shadow-sm hover:border-brand-300 transition active:scale-95 disabled:opacity-50 disabled:bg-slate-100"
            >
              {word}
            </button>
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className="mt-8">
          {status === "idle" ? (
            <button
              onClick={handleCheck}
              disabled={selectedWords.length === 0}
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