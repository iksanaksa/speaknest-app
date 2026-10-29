import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { essay, level } = await req.json();

    if (!essay) {
      return NextResponse.json({ error: "Esai tidak boleh kosong" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    // Update ke model terbaru 2026: gemini-3.8-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
  Kamu adalah penguji bahasa Inggris profesional. 
  User ini sedang di level ${level || "Pemula"}. Berikan evaluasi yang sesuai dengan level tersebut (jangan terlalu keras jika masih pemula).
  
  Berikan evaluasi untuk teks berikut:
  "${essay}"

  Berikan jawaban HANYA dalam format JSON seperti ini (tanpa teks lain di luar JSON):
  {
    "bandScore": (angka 1-9, misal 6.5),
    "criteria": {
      "taskResponse": "Penjelasan singkat 1-2 kalimat sesuai level user.",
      "coherence": "Penjelasan singkat 1-2 kalimat.",
      "lexical": "Penjelasan singkat 1-2 kalimat.",
      "grammar": "Penjelasan singkat 1-2 kalimat."
    },
    "tips": "Satu saran praktis yang memotivasi."
  }
`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
           // <--- TAMBAHKAN INI (Biar AI nggak bertele-tele)
       }
      })
    });

    const data = await response.json();

    // Pengaman kalau API error
    if (!data.candidates || data.candidates.length === 0) {
      console.error("Google API Error:", JSON.stringify(data));
      throw new Error("Google API gagal merespons.");
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    const result = JSON.parse(textResponse);

    return NextResponse.json(result);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal memproses AI" }, { status: 500 });
  }
}