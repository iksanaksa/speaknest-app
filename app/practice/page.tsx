import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PracticePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-16">
        <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-8">
          Pilih Skill Latihanmu
        </h1>
        <div className="grid gap-4 sm:grid-cols-2">
          
          {/* Kartu Reading */}
          <Link href="/practice/reading" className="rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition block">
            <div className="text-4xl mb-3">📖</div>
            <h2 className="text-xl font-bold text-slate-900">Reading</h2>
            <p className="text-slate-600 mt-2 text-sm">Latihan membaca teks bahasa Inggris dan jawab pertanyaan.</p>
          </Link>

          {/* Kartu Listening (Placeholder) */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 opacity-50 cursor-not-allowed">
            <div className="text-4xl mb-3">🎧</div>
            <h2 className="text-xl font-bold text-slate-500">Listening</h2>
            <p className="text-slate-400 mt-2 text-sm">Segera hadir.</p>
          </div>

        </div>
      </main>
    </>
  );
}