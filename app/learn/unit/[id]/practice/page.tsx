"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { addXP } from "@/lib/xp";
import Navbar from "@/components/Navbar";

export default function PracticePage() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Ambil ID Unit dari URL (contoh: /learn/unit/l0-u3/practice)
  const pathParts = pathname ? pathname.split("/") : [];
  const unitId = pathParts[pathParts.length - 2] || "";

  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State Kuis
  const [qIndex, setQIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State Jawaban
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [bankWords, setBankWords] = useState<string[]>([]);

  useEffect(() => {
    const fetchUnit = async () => {
      const { data } = await supabase
        .from("curriculum_units")
        .select("*")
        .eq("id", unitId)
        .single();
        
      if (data) {
        setUnit(data);
      }
      setLoading(false);
    };
    fetchUnit();
  }, [unitId]);

  // Reset jawaban saat pindah soal
  const resetState = (idx: number, exercises: any[]) => {
    setSelectedOpt(null);
    setInputAnswer("");
    setStatus("idle");
    if (exercises[idx]?.type === "arrange_words") {
      setBankWords(exercises[idx].words);
      setSelectedWords([]);
    }
  };

  // Cek Jawaban
  const handleCheck = () => {
    const exercise = unit?.content?.exercises?.[qIndex];
    if (!exercise) return;

    let isCorrect = false;

    if (exercise.type === "multiple_choice") {
      isCorrect = exercise.options[selectedOpt!] === exercise.answer;
    } else if (exercise.type === "fill_blank") {
      isCorrect = inputAnswer.toLowerCase().trim() === exercise.answer.toLowerCase().trim();
    } else if (exercise.type === "arrange_words") {
      isCorrect = selectedWords.join(" ").toLowerCase() === exercise.answer.toLowerCase();
    }

    if (isCorrect) {
      setStatus("correct");
      setScore((s) => s + 1);
    } else {
      setStatus("wrong");
    }
  };

  // Lanjut Soal Berikutnya / Selesai
  const handleNext = async () => {
    const exercises = unit?.content?.exercises || [];
    if (qIndex < exercises.length - 1) {
      const nextIdx = qIndex + 1;
      setQIndex(nextIdx);
      resetState(nextIdx, exercises);
    } else {
      // SELESAI
      setIsSaving(true);
      setIsFinished(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await addXP(50);
      }
      setIsSaving(false);
    }
  };

  // Fungsi untuk Susun Kata
  const handleSelectWord = (word: string, index: number) => {
    if (status !== "idle") return;
    setSelectedWords([...selectedWords, word]);
    const newBank = [...bankWords];
    newBank.splice(index, 1);
    setBankWords(newBank);
  };
  const handleRemoveWord = (word: string, index: number) => {
    if (status !== "idle") return;
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setBankWords([...bankWords, word]);
  };

  if (loading) return <div className="min-h-screen grid place-items-center">Menyiapkan latihan... ⚡</div>;
  if (!unit) return <div className="min-h-screen grid place-items-center text-red-500">Unit tidak ditemukan.</div>;

  const exercises = unit?.content?.exercises || [];
  const currentExercise = exercises[qIndex];

  // Pengaman kalau data soal kosong
  if (!currentExercise && !isFinished) {
    return (
      <>
        <Navbar />
        <main className="min-h-[80vh] flex flex-col items-center justify-center px-5 text-center">
          <p className="text-slate-500 mb-4">Belum ada soal latihan di unit ini.</p>
          <Link href={`/learn/unit/${unitId}`} className="text-brand-600 font-bold underline">← Kembali ke Materi</Link>
        </main>
      </>
    );
  }

  // Tampilan Selesai
  if (isFinished) {
    return (
      <>
        <Navbar />
        <main className="min-h-[80vh] flex flex-col items-center justify-center px-5">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Latihan Selesai!</h1>
          <p className="text-slate-500 mb-8">Kamu berhasil menjawab {score} dari {exercises.length} soal.</p>
          <div className="bg-brand-50 text-brand-700 px-6 py-3 rounded-full font-bold text-lg mb-8 shadow-sm">
            +50 XP Didapatkan! ⭐
          </div>
          <Link href="/learn" className="w-full max-w-xs text-center bg-brand-500 text-white font-bold py-3.5 rounded-xl hover:bg-brand-600 transition">
            Kembali ke Peta
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-10 flex flex-col min-h-[80vh]">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-brand-600">Latihan Soal</span>
            <span className="text-sm text-slate-500">{qIndex + 1} / {exercises.length}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full">
            <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${((qIndex + 1) / exercises.length) * 100}%` }}></div>
          </div>
        </div>

        {/* Render Soal Berdasarkan Tipe */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">{currentExercise.question}</h2>

          {/* TIPE 1: Pilihan Ganda */}
          {currentExercise.type === "multiple_choice" && (
            <div className="space-y-3">
              {currentExercise.options.map((opt: string, idx: number) => {
                const isSelected = selectedOpt === idx;
                const isActualAnswer = status !== "idle" && opt === currentExercise.answer;
                const isWrong = status === "wrong" && isSelected;

                let btnClass = "bg-white border-slate-200 text-slate-700 hover:border-brand-300";
                if (isSelected && status === "idle") btnClass = "bg-orange-50 border-brand-500 text-brand-700 ring-1 ring-brand-500";
                if (isActualAnswer) btnClass = "bg-green-50 border-green-500 text-green-800 font-bold";
                if (isWrong) btnClass = "bg-red-50 border-red-500 text-red-800 font-bold";

                return (
                  <button key={idx} onClick={() => status === "idle" && setSelectedOpt(idx)} disabled={status !== "idle"} className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${btnClass}`}>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* TIPE 2: Isi Titik-titik */}
          {currentExercise.type === "fill_blank" && (
            <div>
              <input
                type="text"
                value={inputAnswer}
                onChange={(e) => setInputAnswer(e.target.value)}
                disabled={status !== "idle"}
                placeholder="Ketik jawabanmu di sini..."
                className={`w-full px-4 py-3 rounded-xl border-2 text-lg focus:outline-none transition ${
                  status === "correct" ? "border-green-500 bg-green-50 text-green-800 font-bold" :
                  status === "wrong" ? "border-red-500 bg-red-50 text-red-800" :
                  "border-slate-200 focus:border-brand-500"
                }`}
              />
            </div>
          )}

          {/* TIPE 3: Susun Kata */}
          {currentExercise.type === "arrange_words" && (
            <div>
              <div className={`min-h-[80px] border-b-2 border-slate-200 mb-6 pb-2 flex flex-wrap gap-2 content-start ${status === 'wrong' ? 'border-red-500' : status === 'correct' ? 'border-green-500' : ''}`}>
                {selectedWords.length === 0 && <span className="text-slate-300 italic text-sm">Klik kata di bawah...</span>}
                {selectedWords.map((word, i) => (
                  <button key={`sel-${i}`} onClick={() => handleRemoveWord(word, i)} disabled={status !== "idle"} className="px-3 py-1.5 bg-white border-2 border-slate-200 rounded-lg text-slate-700 font-medium shadow-sm">
                    {word}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {bankWords.map((word, i) => (
                  <button key={`bank-${i}`} onClick={() => handleSelectWord(word, i)} disabled={status !== "idle"} className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-slate-700 font-bold shadow-sm hover:border-brand-300 disabled:opacity-50">
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feedback & Tombol Action */}
        <div className="mt-auto">
          {status === "wrong" && (
            <div className="mb-4 text-red-600 font-bold bg-red-50 p-3 rounded-lg">
              ❌ Belum tepat. Coba teliti lagi ya!
            </div>
          )}
          {status === "correct" && (
            <div className="mb-4 text-green-600 font-bold bg-green-50 p-3 rounded-lg">
              ✅ Tepat sekali! Lanjut!
            </div>
          )}

          {status === "idle" ? (
            <button onClick={handleCheck} className="w-full bg-brand-500 text-white font-bold py-4 rounded-xl hover:bg-brand-600 transition shadow-lg shadow-brand-500/30">
              Periksa Jawaban
            </button>
          ) : (
            <button onClick={handleNext} disabled={isSaving} className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-500/30">
              {qIndex < exercises.length - 1 ? "Soal Selanjutnya →" : "Selesai & Ambil XP"}
            </button>
          )}
          
          <div className="mt-6 text-center">
            <Link href={`/learn/unit/${unitId}`} className="text-sm text-slate-400 hover:text-slate-600">← Kembali ke Materi</Link>
          </div>
        </div>

      </main>
    </>
  );
}