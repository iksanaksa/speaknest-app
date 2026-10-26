"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


const links = [
  { label: "Practice", href: "/#practice" },
  { label: "Tools", href: "/tools" },
  { label: "Games", href: "/games" },
  { label: "Fitur", href: "/#fitur" },
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        {/* ===== MENU DESKTOP ===== */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-600 transition hover:text-brand-600">
              {link.label}
            </a>
          ))}
          {/* Menu Progress di Desktop */}
          {mounted && user && (
            <Link href="/progress" className="text-sm font-bold text-brand-600 transition hover:text-brand-700">
              Progress 📈
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!mounted ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-100"></div>
          ) : user ? (
            <>
              <span className="text-sm font-medium text-slate-600 mr-2">
                Halo, {user.email?.split('@')[0]}!
              </span>
              <button onClick={handleLogout} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-brand-600">
                Masuk
              </Link>
              <Link href="/login" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600">
                Mulai Gratis
              </Link>
            </>
          )}
        </div>

        {/* Tombol Hamburger (HP) */}
        <button type="button" onClick={() => setOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700 md:hidden">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>
            ) : (
              <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>
            )}
          </svg>
        </button>
      </div>

      {/* ===== MENU MOBILE (HP) ===== */}
      {open && (
        <div className="border-t border-slate-100 bg-white px-5 pb-5 pt-2 md:hidden">
          <nav className="flex flex-col">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50">
                {link.label}
              </a>
            ))}
            
            {/* 👇 MENU PROGRESS DI HP 👇 */}
            {mounted && user && (
              <Link href="/progress" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-bold text-brand-600 transition hover:bg-brand-50">
                Progress 📈
              </Link>
            )}
            {/* 👆 SAMPAI SINI 👆 */}

          </nav>
          
          <div className="mt-3 flex flex-col gap-2">
            {mounted && user ? (
              <button onClick={handleLogout} className="rounded-lg border border-red-200 px-4 py-2.5 text-center text-sm font-semibold text-red-600">
                Keluar ({user.email?.split('@')[0]})
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700">
                  Masuk
                </Link>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg bg-brand-500 px-4 py-2.5 text-center text-sm font-semibold text-white">
                  Mulai Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}