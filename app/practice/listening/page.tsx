"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Teks yang bakal dibacain sama browser
const audioScript = "Hello and welcome to today's lecture. Today, we are going to discuss the impact of plastic pollution on marine life. Every year, millions of tons of plastic waste end up in our oceans. This poses a severe threat to turtles, fish, and seabirds. To solve this problem, scientists are developing new biodegradable materials. However, the most effective solution is still reducing our daily use of single-use plastics.";

const questions = [
  {
    id: 1,
    text: "What is the main topic of the lecture?",
    options: ["A. How to cook seafood", "B. Plastic pollution in oceans", "C. The life cycle of turtles", "D. New plastic factories"],
    answer: 1
  },
  {
    id: 2,
    text: "According to the audio, what are scientists developing?",
    options: ["A. Biodegradable materials", "B. Fishing boats", "C. Plastic bottles", "D. Water filters"],
    answer: 0
  }
];

export default function ListeningPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Fungsi buat muter audio pakai suara bawaan HP
  const playAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Berhentiin suara sebelumnya kalau ada
      
      const utterance = new SpeechSynthesisUtterance(audioScript);
      utterance.lang = 'en-US'; // Pakai logat Inggris Amerika
      utterance.rate = 0.9; // Kecepatan bicara (0.9 = sedikit lebih lambat dari normal)
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Browser kamu tidak mendukung fitur pemutar suara otomatis.");
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleSelect = (qId: number, optIndex: number) => {
    if (!submitted) {
      setSelectedAnswers({ ...selectedAnswers, [qId]: optIndex });
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const resetTest = () => {
    setSubmitted(false);
    setSelectedAnswers({});
    setScore(0);
    stopAudio();
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <Link href="/practice" className="text-sm text-brand-600 hover:underline mb-6 inline-block">← Kembali ke Practice</Link>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Listening Practice: Ocean Pollution</h1>
        <p className="text-slate-600 mb-8">Dengarkan audio di bawah ini, lalu jawab pertanyaannya.</p>

        {/* Area Pemutar Audio */}
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`grid h-12 w-12 place-items-center rounded-full bg-brand-500 text-white ${isPlaying ? 'animate-pulse' : ''}`}>
              🎧
            </div>
            <div>
              <p className="font-bold text-slate-800">Audio Lecture</p>
              <p className="text-sm text-slate-500">{isPlaying ? "Sedang diputar..." : "Siap diputar"}</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {!isPlaying ? (
              <button onClick={playAudio} className="flex-1 sm:flex-none rounded-lg bg-brand-500 px-6 py-2.5 font-bold text-white hover:bg-brand-600 transition">
                Putar ▶
              </button>
            ) : (
              <button onClick={stopAudio} className="flex-1 sm:flex-none rounded-lg bg-orange-500 px-6 py-2.5 font-bold text-white hover:bg-orange-600 transition">
                Stop ⏹
              </button>
            )}
          </div>
        </div>

        {/* Transcript Rahasia */}
        <div className="mb-8">
          <button 
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-sm font-semibold text-slate-500 underline hover:text-brand-600 transition"
          >
            {showTranscript ? "Sembunyikan Transcript" : "Lihat Transcript (Curang?) 👀"}
          </button>
          {showTranscript && (
            <div className="mt-3 rounded-xl bg-slate-100 p-4 text-sm text-slate-700 leading-relaxed border border-slate-200">
              {audioScript}
            </div>
          )}
        </div>

        {/* Soal-soal */}
        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="rounded-xl border border-slate-200 p-5">
              <p className="font-semibold text-slate-800 mb-3">{q.id}. {q.text}</p>
              <div className="space-y-2">
                {q.options.map((opt, index) => {
                  const isSelected = selectedAnswers[q.id] === index;
                  const isCorrect = submitted && index === q.answer;
                  const isWrong = submitted && isSelected && index !== q.answer;

                  let bgClass = "bg-white border-slate-200 hover:bg-slate-50";
                  if (isSelected && !submitted) bgClass = "bg-brand-50 border-brand-500";
                  if (isCorrect) bgClass = "bg-green-50 border-green-500";
                  if (isWrong) bgClass = "bg-red-50 border-red-500";

                  return (
                    <div
                      key={index}
                      onClick={() => handleSelect(q.id, index)}
                      className={`cursor-pointer rounded-lg border p-3 text-sm transition ${bgClass}`}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Cek Jawaban */}
        <div className="mt-8">
          {!submitted ? (
            <button 
              onClick={handleSubmit} 
              disabled={Object.keys(selectedAnswers).length < questions.length}
              className="w-full rounded-xl bg-brand-500 py-3 font-bold text-white hover:bg-brand-600 disabled:opacity-50"
            >
              Cek Jawaban
            </button>
          ) : (
            <div className="rounded-xl bg-brand-50 border border-brand-200 p-6 text-center">
              <h2 className="text-2xl font-bold text-brand-800">Skor Kamu: {score} / {questions.length}</h2>
              <p className="text-brand-600 mt-2">Kerja bagus! Latihan mendengarkan sangat penting.</p>
              <button onClick={resetTest} className="mt-4 text-sm font-semibold text-brand-700 underline">
                Ulangi Tes
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}