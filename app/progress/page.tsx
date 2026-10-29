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
    const fetchAllHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      // 1. Ambil nilai Reading
      const { data: readingData } = await supabase
        .from("practice_scores")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // 2. Ambil nilai Writing
      const { data: writingData } = await supabase
        .from("writing_scores")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // 3. Ambil data Unit yang selesai
      const { data: completedUnits } = await supabase
        .from("completed_units")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // 4. Ambil detail judul unit dari tabel kurikulum
      const { data: masterUnits } = await supabase
        .from("curriculum_units")
        .select("id, title, level");

      // Gabungkan semuanya
      const combined = [
        ...(readingData || []).map(item => ({ ...item, type: "reading" })),
        ...(writingData || []).map(item => ({ ...item, type: "writing" })),
        ...(completedUnits || []).map(item => {
          const unitInfo = masterUnits?.find(u => u.id === item.unit_id);
          return {
            ...item,
            type: "unit",
            title: unitInfo?.title || "Materi Belajar",
            level: unitInfo?.level || "A0"
          }
        })
      ];

      // Urutkan dari yang paling baru
      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setHistory(combined);
      setLoading(false);
    };

    fetchAllHistory();
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
            {history.map((item, index) => {
              const isReading = item.type === "reading";
              const isWriting = item.type === "writing";
              const isUnit = item.type === "unit";

              // Atur ikon dan judul berdasarkan tipe
              let icon = "📖";
              let title = "Reading: History of Pizza";
              let scoreDisplay = `${item.score} / ${item.total_questions}`;
              let label = "SKOR";

              if (isWriting) {
                icon = "✍️";
                title = item.feedback_json?.type === "speaking" ? "Speaking Simulation" : "Writing: AI Feedback";
                scoreDisplay = item.band_score;
                label = "BAND";
              } else if (isUnit) {
                icon = "🗺️";
                title = `Materi Selesai: ${item.title}`;
                scoreDisplay = item.level;
                label = "LEVEL";
              }

              return (
                <div key={`${item.type}-${item.id}-${index}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl">
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{title}</h3>
                      <p className="text-sm text-slate-500">
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-brand-600 ${isUnit ? 'text-lg' : 'text-2xl'}`}>
                      {scoreDisplay}
                    </p>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {label}
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