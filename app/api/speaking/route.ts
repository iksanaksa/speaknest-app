import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { transcript, level, prompt } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "Transkrip tidak boleh kosong" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

    const aiPrompt = `
      Kamu adalah penguji IELTS Speaking profesional.
      User ini berada di level ${level || "Pemula"}. 
      Tugas mereka adalah: "${prompt}".
      
      Berikut adalah transkrip apa yang baru saja mereka ucapkan:
      "${transcript}"

      Berikan evaluasi HANYA dalam format JSON seperti ini:
      {
        "bandScore": (angka 1-9, misal 6.5),
        "fluency": "Penjelasan singkat 1-2 kalimat tentang kelancaran.",
        "vocabulary": "Penjelasan singkat 1-2 kalimat tentang kosakata.",
        "grammar": "Penjelasan singkat 1-2 kalimat tentang grammar.",
        "tips": "Satu saran praktis yang memotivasi."
      }
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: aiPrompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("Google API gagal merespons.");
    }

    let textResponse = data.candidates[0].content.parts[0].text;
    textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(textResponse);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Speaking AI Error:", error.message);
    return NextResponse.json({ error: "Gagal memproses AI" }, { status: 500 });
  }
}