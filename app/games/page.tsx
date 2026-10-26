"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Data kata (jawaban disimpan sebagai teks, bukan index, biar aman saat diacak)
const vocabData = [
  { word: "Meticulous", options: ["Ceroboh", "Sangat Teliti", "Malas", "Cepat"], answer: "Sangat Teliti" },
  { word: "Ambiguous", options: ["Jelas", "Membingungkan", "Tegas", "Sederhana"], answer: "Membingungkan" },
  { word: "Benevolent", options: ["Kejam", "Baik Hati", "Pelit", "Pemarah"], answer: "Baik Hati" },
  { word: "Pragmatic", options: ["Idealistis", "Praktis", "Teoretis", "Aneh"], answer: "Praktis" },
  { word: "Resilient", options: ["Mudah Menyerah", "Tangguh", "Lemah", "Rapuh"], answer: "Tangguh" },
  { word: "Scrutinize", options: ["Mengabaikan", "Memeriksa Teliti", "Membeli", "Menghancurkan"], answer: "Memeriksa Teliti" },
  { word: "Inevitable", options: ["Bisa Dihindari", "Pasti Terjadi", "Misterius", "Opsional"], answer: "Pasti Terjadi" },
];

// Fungsi untuk mengacak urutan array
const shuffleArray = (array: string[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function GamesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]); // State baru untuk opsi acak
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Ganti jadi string
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // State untuk Timer
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimeout, setIsTimeout] = useState(false);

  // Acak opsi saat pertama kali buka atau ganti soal
  useEffect(() => {
    if (!isFinished) {
      setShuffledOptions(shuffleArray(vocabData[currentIndex].options));
    }
  }, [currentIndex, isFinished]);

  // Logika Timer
  useEffect(() => {
    if (isAnswered || isFinished) return;

    if (timeLeft === 0) {
      setIsAnswered(true);
      setIsTimeout(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isFinished]);

  const handleAnswer = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    if (option === vocabData[currentIndex].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < vocabData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsTimeout(false);
      setTimeLeft(15); // Reset timer
    } else {
      setIsFinished(true);
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setIsTimeout(false);
    setTimeLeft(15);
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-12">
        <Link href="/" className="text-sm text-brand-600 hover:underline mb-6 inline-block">← Kembali ke Beranda</Link>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Mini Games 🎮</h1>
          <p className="text-slate-600 mt-2">Tebak arti kata level IELTS dalam 15 detik!</p>
        </div>

        {!isFinished ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-brand-500/5">
            
            {/* Header: Progress & Skor */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-slate-500">
                Soal {currentIndex + 1} / {vocabData.length}
              </span>
              <span className="text-sm font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                Skor: {score}
              </span>
            </div>

            {/* Timer Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className={timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-slate-400"}>
                  {timeLeft} Detik
                </span>
                <span className="text-slate-400">Waktu</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${timeLeft <= 5 ? 'bg-red-500' : 'bg-brand-500'}`}
                  style={{ width: `${(timeLeft / 15) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Kata yang Ditebak */}
            <div className="bg-slate-50 rounded-2xl p-8 text-center mb-6">
              <h2 className="text-4xl font-black text-slate-800 tracking-wide">
                {vocabData[currentIndex].word}
              </h2>
            </div>

            {/* Pilihan Jawaban (Yang sudah diacak) */}
            <div className="space-y-3">
              {shuffledOptions.map((option, index) => {
                const isCorrect = option === vocabData[currentIndex].answer;
                const isSelected = option === selectedOption;
                
                let buttonClass = "bg-white border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-brand-50";
                
                if (isAnswered) {
                  if (isCorrect) buttonClass = "bg-green-100 border-green-500 text-green-800 font-bold";
                  else if (isSelected && !isCorrect) buttonClass = "bg-red-100 border-red-500 text-red-800 font-bold";
                  else buttonClass = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${buttonClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Pesan Timeout */}
            {isTimeout && (
              <div className="mt-4 text-center text-red-500 font-bold text-sm bg-red-50 p-2 rounded-lg">
                ⏰ Waktu Habis!
              </div>
            )}

            {/* Tombol Next */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full mt-6 bg-brand-500 text-white font-bold py-3.5 rounded-xl hover:bg-brand-600 transition-colors animate-pulse"
              >
                {currentIndex < vocabData.length - 1 ? "Soal Selanjutnya →" : "Lihat Hasil Akhir"}
              </button>
            )}
          </div>
        ) : (
          /* Tampilan Skor Akhir */
          <div className="rounded-3xl border border-brand-200 bg-brand-50 p-10 text-center shadow-lg">
            <div className="text-6xl mb-4">
              {score === vocabData.length ? "👑" : score > 4 ? "🏆" : "📚"}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Game Selesai!</h2>
            <p className="text-slate-600 mb-6">Skor akhir kamu:</p>
            <div className="text-5xl font-black text-brand-600 mb-8">
              {score} <span className="text-2xl text-slate-400 font-medium">/ {vocabData.length}</span>
            </div>
            <button
              onClick={restartGame}
              className="w-full bg-brand-500 text-white font-bold py-3.5 rounded-xl hover:bg-brand-600 transition-colors"
            >
              Main Lagi 🔄
            </button>
          </div>
        )}
      </main>
    </>
  );
}