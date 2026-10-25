export default function Features() {
  const features = [
    { icon: "🤖", title: "Feedback AI", desc: "Writing & Speaking dinilai per kriteria plus saran praktis." },
    { icon: "🎮", title: "Mini Games Kosakata", desc: "Latihan kosakata bentuk kuis singkat." },
    { icon: "🛠️", title: "Tools Praktis", desc: "Word counter dan timer simulasi ujian." },
    { icon: "📈", title: "Progress Tracking", desc: "Lihat riwayat latihan dan skor rata-rata." },
  ];
  return (
    <section id="fitur" className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="text-center">
          <span className="text-xs font-bold uppercase text-brand-600">Fitur</span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Bukan cuma soal-soal</h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-6 hover:shadow-lg">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl">{f.icon}</div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}