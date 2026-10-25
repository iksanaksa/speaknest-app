"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase"; // Import Supabase

const questions = [
  {
    id: 1,
    text: "What is the main topic of the text?",
    options: ["A. The history of pizza", "B. How to cook pasta", "C. Healthy eating habits", "D. Italian restaurants"],
    answer: 0
  },
  {
    id: 2,
    text: "According to the text, where was pizza invented?",
    options: ["A. America", "B. Naples, Italy", "C. France", "D. Greece"],
    answer: 1
  }
];

export default function ReadingTestPage() {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSelect = (qId: number, optIndex: number) => {
    if (!submitted) {
      setSelectedAnswers({ ...selectedAnswers, [qId]: optIndex });
    }
  };

  const handleSubmit = async () => {
    // 1. Hitung skor
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) correct++;
    });
    
    setScore(correct);
    setSubmitted(true);
    setIsSaving(true);

    // 2. Simpan ke Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Kalau user login, simpan ke database
        const { error } = await supabase
          .from('practice_scores')
          .insert([
            { user_id: user.id, score: correct, total_questions: questions.length }
          ]);
        
        if (error) throw error;
        setSaveMessage("Skor berhasil disimpan ke database!");
      } else {
        // Kalau belum login, kasih tau untuk login
        setSaveMessage("Kamu belum login. Skor hanya disimpan sementara.");
      }
    } catch (error) {
      console.error(error);
      setSaveMessage("Gagal menyimpan skor.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetTest = () => {
    setSubmitted(false);
    setSelectedAnswers({});
    setSaveMessage("");
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <Link href="/practice" className="text-sm text-brand-600 hover:underline mb-6 inline-block">← Kembali ke Practice</Link>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Reading Practice: The History of Pizza</h1>
        <p className="text-slate-600 mb-8">Read the text below and answer the questions.</p>

        <div className="rounded-2xl bg-slate-50 p-6 text-slate-800 leading-relaxed mb-8">
          <p>Pizza is one of the world's most popular foods. Although it is often associated with American fast food, its origins can be traced back to Naples, Italy. In the 18th century, flatbreads with toppings were sold on the streets of Naples to poor workers. Later, in 1889, a famous pizza maker created a special pizza for the Queen of Italy, Margherita, using tomatoes, mozzarella, and basil to represent the colors of the Italian flag. Today, pizza has evolved into many different styles around the globe.</p>
        </div>

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

        <div className="mt-8">
          {!submitted ? (
            <button 
              onClick={handleSubmit} 
              disabled={Object.keys(selectedAnswers).length < questions.length}
              className="w-full rounded-xl bg-brand-500 py-3 font-bold text-white hover:bg-brand-600 disabled:opacity-50"
            >
              Cek Jawaban & Simpan Skor
            </button>
          ) : (
            <div className="rounded-xl bg-brand-50 border border-brand-200 p-6 text-center">
              <h2 className="text-2xl font-bold text-brand-800">Skor Kamu: {score} / {questions.length}</h2>
              
              {/* Pesan Status Simpan */}
              <p className={`mt-2 text-sm font-medium ${isSaving ? 'text-slate-500' : 'text-brand-600'}`}>
                {isSaving ? "Menyimpan..." : saveMessage}
              </p>

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