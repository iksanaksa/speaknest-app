"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function ProgressPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllScores = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      // Ambil nilai Reading
      const { data: readingData } = await supabase
        .from("practice_scores")
        .select("*")
        .order("created_at", { ascending: false });

      // Ambil nilai Writing
      const { data: writingData } = await supabase
        .from("writing_scores")
        .select("*")
        .order("created_at", { ascending: false });

      // Gabungkan dan beri label tipe
      const combined = [
        ...(readingData || []).map(item => ({ ...item, type: "reading" })),
        ...(writingData || []).map(item => ({ ...item, type: "writing" }))
      ];

      // Urutkan dari yang paling baru
      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setHistory(combined);
      setLoading(false);
    };

    fetchAllScores();
  }, [router]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Progress Kamu 📈</h1>
            <p className="text-slate-600 mt-2">Riwayat latihan yang sudah kamu selesaikan.</p>
          </div>
          <Link href="/practice" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
            Latihan Lagi
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Memuat data...</div>
        ) : history.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
            <div className="text-4xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Belum ada riwayat</h2>
            <p className="text-slate-600 mb-6">Kamu belum menyelesaikan latihan apa pun.</p>
            <Link href="/practice" className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-600">
              Mulai Latihan Pertama
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((item) => {
              const isReading = item.type === "reading";
              return (
                <div key={`${item.type}-${item.id}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl">
                      {isReading ? "📖" : item.feedback_json?.type === "speaking" ? "🎤" : "✍️"}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {isReading 
                         ? "Reading: History of Pizza" 
                           : item.feedback_json?.type === "speaking" 
                             ? "Speaking Simulation" 
                           : "Writing: AI Feedback"}
                       </h3>
                      <p className="text-sm text-slate-500">
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-brand-600">
                      {isReading ? `${item.score} / ${item.total_questions}` : item.band_score}
                    </p>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {isReading ? "Skor" : "Band"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}