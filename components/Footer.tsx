import Logo from "./Logo";
import { brand } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <Logo />
        <p className="mt-3 max-w-xs text-sm text-slate-600">{brand.tagline}</p>
        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-500">{brand.disclaimer}</p>
          <p className="mt-3 text-xs text-slate-400">© {new Date().getFullYear()} {brand.name}. Dibuat dengan sabar.</p>
        </div>
      </div>
    </footer>
  );
}