import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            Paket Harga
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Investasi Terbaik untuk Skor IELTS-mu
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
            Mulai secara gratis, atau upgrade ke Premium untuk membuka feedback AI tanpa batas dan fitur eksklusif lainnya.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          
          {/* Paket Gratis */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Gratis</h2>
              <p className="text-slate-500 text-sm mt-1">Untuk mencoba-coba dulu.</p>
              <div className="mt-4 flex items-baseline text-slate-900">
                <span className="text-5xl font-black">Rp 0</span>
                <span className="ml-1 text-lg font-medium text-slate-500">/bulan</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {[
                "Akses soal Reading & Listening",
                "Mini Games Kosakata",
                "Timer & Word Counter",
                "Progress Tracking dasar",
                "3x Feedback AI Writing / bulan",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-slate-500 text-xs">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            
            <Link href="/login" className="mt-auto block w-full rounded-xl border-2 border-slate-200 bg-white py-3 text-center font-bold text-slate-700 hover:bg-slate-50 transition">
              Mulai Gratis
            </Link>
          </div>

          {/* Paket Premium */}
          <div className="rounded-3xl border-2 border-brand-500 bg-brand-50/30 p-8 shadow-xl shadow-brand-500/10 relative flex flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              Paling Populer
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Premium</h2>
              <p className="text-slate-500 text-sm mt-1">Untuk hasil maksimal.</p>
              <div className="mt-4 flex items-baseline text-slate-900">
                <span className="text-5xl font-black">Rp 49.000</span>
                <span className="ml-1 text-lg font-medium text-slate-500">/bulan</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {[
                "Semua fitur paket Gratis",
                "Feedback AI Writing TANPA BATAS",
                "Akses ke Speaking Practice",
                "Analisis Grammar mendalam",
                "Bank soal eksklusif",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-800 font-medium">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-white text-xs">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button className="mt-auto block w-full rounded-xl bg-brand-500 py-3 text-center font-bold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition">
              Upgrade ke Premium
            </button>
          </div>

        </div>
      </main>
    </>
  );
}