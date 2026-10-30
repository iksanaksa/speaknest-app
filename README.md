# SpeakNest 🦅

Platform latihan IELTS & English mandiri dengan pendekatan gamifikasi. Dibangun untuk membantu pengguna meningkatkan kemampuan bahasa Inggris melalui modul terstruktur, kuis interaktif, dan feedback AI.

## ✨ Fitur Utama
- **Adaptive Learning Path:** Peta belajar berjenjang (A0 - C2) dengan sistem gembok.
- **AI Content Generator:** Admin dapat membuat modul baru (materi, kuis, tugas) secara otomatis via Gemini AI.
- **Interactive Quizzes:** 5 tipe soal (Pilihan Ganda, Isi Titik, Susun Kata, Matching, Listening).
- **AI Feedback:** Penilaian otomatis untuk Writing dan Speaking disesuaikan dengan level pengguna.
- **Gamifikasi:** Sistem XP (Experience Points) dan Daily Streak.

## 🛠️ Tech Stack
- **Frontend:** Next.js 13, React, Tailwind CSS.
- **Backend & Auth:** Supabase (PostgreSQL, RLS).
- **AI Engine:** Google Gemini API (via Next.js API Routes).

## 🚀 Cara Menjalankan (Local Development)
1. Clone repo ini.
2. Jalankan `npm install`.
3. Buat file `.env.local` dan isi dengan kredensial Supabase & Gemini API.
4. Jalankan server: `npm run dev` (atau `npm run dev:mobile` jika menggunakan Acode di Android).

---
*Dibuat dengan ☕ dan 📱 oleh Iksanaksa.*