'use server';

import { supabaseAdmin } from '@/lib/admin';

// Helper function untuk mengambil SEMUA data tanpa terpotong limit 1000
async function fetchAllData(tableName: string, selectQuery = '*') {
  let allData: any[] = [];
  let page = 0;
  const pageSize = 600; // Kita ambil per 1000 (sesuai limit default Supabase)
  
  while (true) {
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .select(selectQuery)
      .range(page * pageSize, (page + 1) * pageSize - 1);
      
    if (error) throw error;
    
    if (data) {
      allData = [...allData, ...data];
      // Jika data yang ditarik kurang dari pageSize, berarti sudah habis (halaman terakhir)
      if (data.length < pageSize) break;
    } else {
      break;
    }
    
    page++;
  }
  
  return allData;
}

export async function getDashboardData() {
  try {
    // 1. Kandidat (Data sedikit, fetch biasa aman)
    const { data: kandidatData, error: kandidatError } = await supabaseAdmin
      .from('kandidat')
      .select('*')
      .order('nomor_urut', { ascending: true });

    if (kandidatError) throw kandidatError;

    // 2. Pemilih & Votes (Data BANYAK, gunakan fetchAllData agar tembus limit 1000)
    // Kita jalankan parallel biar cepat
    const [pemilihData, votesData] = await Promise.all([
      fetchAllData('pemilih', '*'),
      fetchAllData('hasil_vote', 'id_kandidat')
    ]);

    return {
      kandidat: kandidatData || [],
      pemilih: pemilihData || [],
      votes: votesData || [],
      error: null
    };
  } catch (error) {
    console.error("Server Action Error:", error);
    // Return error object structure
    return { 
      kandidat: [], 
      pemilih: [], 
      votes: [], 
      error: error 
    };
  }
}