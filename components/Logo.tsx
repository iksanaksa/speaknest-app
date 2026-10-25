import { brand } from "@/lib/brand";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-base font-black text-white shadow-sm">
        {brand.name.charAt(0).toUpperCase()}
      </span>
      <span className="text-lg font-extrabold tracking-tight text-slate-900">
        {brand.name}
      </span>
    </span>
  );
}