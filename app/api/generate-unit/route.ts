import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic, level } = await req.json();

    if (!topic || !level) {
      return NextResponse.json({ error: "Topik dan level harus diisi" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    // Pake model Flash-Lite yang lebih enteng dan jarang ngantri
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

    const prompt = `
      Kamu adalah ahli kurikulum bahasa Inggris. Buatkan 1 unit materi belajar bahasa Inggris untuk level ${level} dengan topik "${topic}".
      
      Berikan jawaban HANYA dalam format JSON murni (tanpa format markdown, tanpa teks pembuka/penutup) dengan struktur PERSIS seperti ini:
      {
        "title": "Judul Unit Menarik",
        "goal": "Tujuan pembelajaran singkat",
        "content": {
          "hook": { "type": "dialog", "text": "Percakapan pendek 2-4 baris berkaitan topik." },
          "vocabulary": [
            { "en": "Kata Inggris 1", "id": "Arti Indo", "example": "Contoh kalimat." },
            { "en": "Kata Inggris 2", "id": "Arti Indo", "example": "Contoh kalimat." }
          ],
          "grammar": {
            "title": "Judul Grammar",
            "explanation": "Penjelasan singkat.",
            "examples": ["Contoh 1", "Contoh 2"]
          },
          "exercises": [
            {
              "type": "multiple_choice",
              "question": "Pertanyaan?",
              "options": ["Opsi A", "Opsi B", "Opsi C"],
              "answer": "Opsi A"
            },
            {
              "type": "fill_blank",
              "question": "Kalimat rumpang ___ .",
              "answer": "kata_yang_hilang"
            }
          ],
          "writing": { "prompt": "Tugas menulis singkat." },
          "speaking": { "prompt": "Tugas berbicara singkat." }
        }
      }
    `;

    // --- SISTEM RETRY OTOMATIS (Kalau server Google penuh, dia nunggu dan coba lagi) ---
    let response;
    let retries = 3;
    
    while (retries > 0) {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 2048
          }
        })
      });

      // Kalau sukses, langsung lanjut
      if (response.ok) break;
      
      const errorData = await response.json();
      console.log("API Error Response:", errorData);

      // Kalau error 503 (High Demand) atau 429 (Too Many Requests), coba lagi
      if (errorData.error && (errorData.error.code === 503 || errorData.error.code === 429)) {
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 3000)); // Nunggu 3 detik
          continue; // Ulangi fetch
        }
      }
      break; // Kalau error selain itu, keluar loop
    }

    const data = await response!.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      const googleErrorMsg = data.error ? data.error.message : "Google API gagal merespons tanpa alasan yang jelas.";
      throw new Error(googleErrorMsg);
    }

    let textResponse = data.candidates[0].content.parts[0].text;
    
    // PENGAMAN EKSTRA: Bersihin format markdown kalau AI bandel
    textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Ekstrak teksnya pakai Regex, kalau-kalau AI nambahin teks lain di luar kurung kurawal {}
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI tidak mengembalikan format JSON yang valid.");
    
    const cleanJson = jsonMatch[0];
    const result = JSON.parse(cleanJson);

    // Bikin ID unik
    const generatedId = `${level.toLowerCase()}-${topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(Math.random() * 1000)}`;
    
    result.id = generatedId;
    result.level = level;

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Generate Error:", error.message);
    return NextResponse.json({ error: error.message || "Gagal memproses AI" }, { status: 500 });
  }
}