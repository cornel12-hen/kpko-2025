import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import dotenv from 'dotenv';

// 1. Load Environment Variables dari .env.local
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Error: Pastikan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY ada di .env.local');
  process.exit(1);
}

// 2. Inisialisasi Admin Client (Bypass RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Tipe data untuk baris CSV
type CsvRow = {
  nis: string;
  nama: string;
  kelas: string;
  token: string;
};

async function seedUsers() {
  // 3. Baca File CSV
  const csvFilePath = path.resolve(process.cwd(), 'DataKPKO2025_Tes.csv'); // Pastikan nama file sesuai
  
  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ File tidak ditemukan: ${csvFilePath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvFilePath, 'utf8');
  
  // 4. Parse CSV
  const { data, errors } = Papa.parse<CsvRow>(fileContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().trim(), // Normalisasi header jadi huruf kecil
  });

  if (errors.length > 0) {
    console.error('❌ Error parsing CSV:', errors);
    process.exit(1);
  }

  console.log(`🚀 Memulai proses registrasi untuk ${data.length} siswa...`);

  let successCount = 0;
  let failCount = 0;

  // 5. Loop setiap siswa
  for (const row of data) {
    const { nis, nama, kelas, token } = row;

    if (!nis || !token) {
      console.warn(`⚠️  Skip baris: Data tidak lengkap (NIS: ${nis})`);
      failCount++;
      continue;
    }

    const emailPalsu = `${nis}@osistel.sch.id`;

    console.log(`\nProcessing: ${nama} (${nis})...`);

    try {
      // A. Buat User di Auth Supabase
      // Kita gunakan admin.createUser agar tidak perlu konfirmasi email
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: emailPalsu,
        password: token,
        email_confirm: true, // Langsung verifikasi email
        user_metadata: { nis, nama, kelas }, // Simpan metadata opsional
      });

      if (authError) {
        console.error(`   ❌ Gagal Auth: ${authError.message}`);
        failCount++;
        continue;
      }

      const userId = authData.user.id;

      // B. Masukkan Data ke Tabel 'pemilih'
      const { error: dbError } = await supabase
        .from('pemilih')
        .insert({
          id: userId, // PENTING: ID ini harus sama dengan Auth ID
          nis: nis,
          nama: nama,
          kelas: kelas,
          sudah_vote: false,
        });

      if (dbError) {
        // Jika gagal insert ke DB, hapus user auth yang baru dibuat agar tidak jadi data sampah
        await supabase.auth.admin.deleteUser(userId);
        console.error(`   ❌ Gagal DB Insert (Rollback Auth): ${dbError.message}`);
        failCount++;
      } else {
        console.log(`   ✅ Sukses!`);
        successCount++;
      }

    } catch (err) {
      console.error(`   ❌ Unexpected Error:`, err);
      failCount++;
    }
  }

  console.log('\n-----------------------------------');
  console.log(`🏁 Selesai!`);
  console.log(`✅ Berhasil: ${successCount}`);
  console.log(`❌ Gagal: ${failCount}`);
  console.log('-----------------------------------');
}

seedUsers();