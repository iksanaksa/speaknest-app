export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-200/50 blur-3xl pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-12 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Gratis untuk mulai · Tanpa kartu kredit
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Latihan <span className="text-brand-600">IELTS</span> yang jelas, terukur, dan bisa diulang.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
              Empat skill dalam satu tempat: Listening, Reading, Writing, dan Speaking. Dapatkan feedback AI plus estimasi band per kriteria.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <a href="/login" className="rounded-xl bg-brand-500 px-6 py-3.5 text-center text-base font-bold text-white shadow-lg transition hover:bg-brand-600 active:scale-[0.99]">
                 Mulai Sekarang
              </a>
              <a href="#fitur" className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-center text-base font-bold text-slate-700 hover:border-brand-300 hover:text-brand-700">Lihat Fitur</a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:mx-0">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl lg:rotate-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Writing Task 2</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">Contoh hasil feedback</p>
                </div>
                <div className="rounded-2xl bg-brand-50 px-3 py-2 text-center">
                  <p className="text-[10px] font-bold uppercase text-brand-600">Estimasi</p>
                  <p className="text-xl font-black text-brand-700">6.5</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {['Task Response', 'Coherence & Cohesion', 'Lexical Resource', 'Grammatical Range'].map((label, i) => (
                  <div key={label}>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="font-medium text-slate-600">{label}</span>
                      <span className="font-semibold text-slate-400">{70 - i * 5}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${70 - i * 5}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}