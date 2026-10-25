export default function CTA() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-5 pb-16 lg:px-8 lg:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-brand-500 px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-3xl font-extrabold text-white">Siap mulai latihan pertamamu?</h2>
          <p className="mx-auto mt-4 max-w-xl text-orange-50">Gratis untuk mulai. Upgrade nanti kalau butuh lebih.</p>
          <a href="/login" className="relative mt-8 inline-block rounded-xl bg-white px-7 py-3.5 text-base font-bold text-brand-600 shadow-lg shadow-brand-900/10 transition hover:bg-orange-50 active:scale-[0.99]">
           Mulai Gratis Sekarang
          </a>
        </div>
      </div>
    </section>
  );
}