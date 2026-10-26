import Link from "next/link";
import Navbar from "@/components/Navbar";

const guides = [
  {
    id: "writing-tips",
    icon: "✍️",
    title: "5 Tips Jitu Writing Task 2",
    desc: "Cara menyusun paragraf yang logis dan kosakata yang bikin penguji terkesan.",
    readTime: "4 menit baca",
  },
  {
    id: "reading-skimming",
    icon: "📖",
    title: "Teknik Skimming & Scanning",
    desc: "Jangan baca semua teks! Pelajari cara menemukan jawaban dalam hitungan detik.",
    readTime: "3 menit baca",
  },
  {
    id: "speaking-fluency",
    icon: "🎤",
    title: "Meningkatkan Fluency Speaking",
    desc: "Cara menghilangkan kebiasaan 'eee...' dan 'hmmm...' saat sesi wawancara.",
    readTime: "5 menit baca",
  },
  {
    id: "vocab-building",
    icon: "📚",
    title: "Membangun Kosakata Level C1",
    desc: "Teknik menghafal kosakata baru tanpa harus membuka kamus terus-menerus.",
    readTime: "6 menit baca",
  },
];

export default function GuidesPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-12">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            Panduan
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Belajar Lebih Cerdas
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Tips dan strategi original dari tim kami untuk menaklukkan ujian English.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {guides.map((guide) => (
            <div 
              key={guide.id} 
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5 cursor-pointer"
            >
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl group-hover:scale-110 transition-transform">
                {guide.icon}
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                {guide.title}
              </h2>
              <p className="mt-2 flex-grow text-sm leading-relaxed text-slate-600">
                {guide.desc}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-medium text-slate-400">
                  {guide.readTime}
                </span>
                <span className="text-sm font-bold text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Baca →
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}