import Link from "next/link";

export default function Skills() {
  const skills = [
    { icon: "🎧", title: "Listening", desc: "Latihan audio dengan transcript dan pembahasan.", href: "/practice" },
    { icon: "📖", title: "Reading", desc: "Soal reading buatan sendiri, lengkap dengan alasannya.", href: "/practice/reading" },
    { icon: "✍️", title: "Writing", desc: "Tulis esai, dapat estimasi band + tips dari AI.", href: "/practice" },
    { icon: "🎤", title: "Speaking", desc: "Rekam jawabanmu, dapat catatan kelancaran.", href: "/practice" },
  ];

  return (
    <section id="practice" className="border-t border-slate-100 bg-slate-50/60">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="text-center">
          <span className="text-xs font-bold uppercase text-brand-600">Practice</span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Latih 4 skill, satu per satu</h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {skills.map((skill) => (
            <Link
              key={skill.title}
              href={skill.href}
              className="rounded-2xl border border-slate-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg block"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-2xl">{skill.icon}</div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{skill.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{skill.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}