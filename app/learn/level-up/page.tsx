"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

const testQuestions = [
  { id: 1, text: "What is the correct translation of 'Dia (lk) makan apel'?", options: ["He eats an apple", "He eat an apple", "She eats an apple", "He ate an apple"], answer: 0 },
  { id: 2, text: "Complete the dialogue: Waiter: 'Are you ready to order?' You: '...'", options: ["I am a teacher", "Yes, I would like some water please", "I go to school", "My name is Ikhsan"], answer: 1 },
  { id: 3, text: "Choose the correct sentence:", options: ["They is studying English", "They are study English", "They are studying English", "They studying English"], answer: 2 },
];

export default function LevelUpTest() {
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
    if (idx === testQuestions[currentIdx].answer) setScore(s => s + 1);
  };

  const handleNext = async () => {
    if (currentIdx < testQuestions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      // Ujian Selesai. Cek Skor.
      setIsSaving(true);
      const finalScore = score + (selected === testQuestions[currentIdx].answer ? 1 : 0);
      
      // Syarat lulus: Benar minimal 2 dari 3
      if (finalScore >= 2) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // 1. Cek level user saat ini
          const { data: profile } = await supabase
            .from("profiles")
            .select("current_level")
            .eq("id", user.id)
            .single();

          // 2. Tentukan level selanjutnya
          let nextLevel = "Menengah";
          if (profile?.current_level === "Menengah") {
            nextLevel = "Mahir";
          }

          // 3. Update level ke database
          await supabase.from("profiles").update({ current_level: nextLevel }).eq("id", user.id);
          alert(`Selamat! Skor kamu ${finalScore}/3. Kamu LULUS dan naik ke Level ${nextLevel}! 🎉`);
        }
      } else {
        alert(`Skor kamu ${finalScore}/3. Belum lulus. Coba pelajari lagi modul sebelumnya ya.`);
      }
      
      setIsSaving(false);
      router.push("/learn"); // Balik ke peta
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-10 flex flex-col min-h-[80vh]">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-purple-600 mb-2">Ujian Kenaikan Level 🏆</h1>
          <p className="text-slate-500 text-sm">Jawab dengan benar minimal 2 dari 3 soal untuk naik level.</p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-purple-600">Soal {currentIdx + 1} / {testQuestions.length}</span>
            <span className="text-sm font-bold text-slate-400">Skor: {score}</span>
          </div>
          
          <h2 className="text-xl font-bold text-slate-800 mb-6">{testQuestions[currentIdx].text}</h2>
          
          <div className="space-y-3">
            {testQuestions[currentIdx].options.map((opt, idx) => {
              const isCorrect = idx === testQuestions[currentIdx].answer;
              const isWrong = isAnswered && idx === selected && !isCorrect;
              
              let bg = "bg-white border-slate-200 text-slate-700 hover:border-purple-300";
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
            className="w-full mt-6 bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-600/30"
          >
            {isSaving ? "Memproses..." : currentIdx < testQuestions.length - 1 ? "Soal Selanjutnya →" : "Selesai & Lihat Hasil"}
          </button>
        )}
      </main>
    </>
  );
}