import { supabase } from "./supabase";

// Fungsi buat nambah XP user
export const addXP = async (amount: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // 1. Ambil XP user saat ini
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("xp")
      .eq("id", user.id)
      .single();

    if (fetchError) throw fetchError;

    // 2. Hitung XP baru
    const currentXP = profile?.xp || 0;
    const newXP = currentXP + amount;

    // 3. Update ke database
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ xp: newXP })
      .eq("id", user.id);

    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error("Gagal nambah XP:", error);
    return false;
  }
};