'use server';

import { createAuthServerClient } from '@/lib/server';
import { supabaseAdmin } from '@/lib/admin';
import { revalidatePath } from 'next/cache';

export async function submitVote(kandidatId: string) {
  // 1. Cek User Session (Keamanan Lapis 1)
  const supabase = await createAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Sesi tidak valid. Silakan login kembali.' };
  }

  // 2. Cek apakah user sudah vote di database (Keamanan Lapis 2)
  // Kita cek tabel 'pemilih'
  const { data: pemilih } = await supabaseAdmin
    .from('pemilih')
    .select('sudah_vote')
    .eq('id', user.id)
    .single();

  if (pemilih?.sudah_vote) {
    return { success: false, message: 'Anda sudah menggunakan hak suara Anda.' };
  }

  try {
    // 3. Lakukan Transaksi (Insert Vote & Update Status)
    // Karena Supabase REST API tidak support transaction block native seperti SQL,
    // kita lakukan secara berurutan tapi dengan pengecekan ketat.

    // A. Insert ke tabel hasil_vote
    const { error: voteError } = await supabaseAdmin
      .from('hasil_vote')
      .insert({
        id_pemilih: user.id,
        id_kandidat: kandidatId,
        created_at: new Date().toISOString(),
      });

    if (voteError) {
      // Kemungkinan error: Duplicate key (user memaksa vote 2x)
      console.error('Vote Error:', voteError);
      return { success: false, message: 'Gagal mencatat suara. Anda mungkin sudah memilih.' };
    }

    // B. Update status di tabel pemilih
    const { error: updateError } = await supabaseAdmin
      .from('pemilih')
      .update({
        sudah_vote: true,
        tanggal_vote: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      // Ini kondisi kritis (Vote masuk, tapi status gagal update).
      // Idealnya pakai RPC/Stored Procedure, tapi untuk skala OSIS ini cukup.
      console.error('Update Status Error:', updateError);
      // Kita biarkan return success true, karena suara SUDAH masuk.
    }

    // 4. Revalidate data dashboard
    revalidatePath('/dashboard');

    return { success: true, message: 'Terima kasih, suara Anda telah direkam.' };

  } catch (error) {
    console.error('System Error:', error);
    return { success: false, message: 'Terjadi kesalahan sistem.' };
  }
}