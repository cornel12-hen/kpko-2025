import { Database } from './lib/database.types'; // Pastikan path-nya benar

// Helper untuk mengambil tipe Row dari tabel tertentu
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

// --- TIPE UTAMA (Sesuai Skema Database) ---

export type Kandidat = Tables<'kandidat'>;

export type Pemilih = Tables<'pemilih'>;
// Karena kamu sudah generate ulang database.types.ts,
// tipe 'Pemilih' di atas otomatis sudah punya properti 'kelas'.

export type HasilVote = Tables<'hasil_vote'>;

// --- TIPE GABUNGAN (Custom) ---

export type HasilVoteDenganKandidat = HasilVote & {
  kandidat: Kandidat;
};

export type UserSession = {
  user: {
    id: string;
    email?: string;
  };
  pemilih: Pemilih | null; // Data detail siswa (nis, nama, kelas, status vote)
};

// import { Database } from '@/lib/database.types'; // Asumsikan Anda telah generate tipe database dari Supabase CLI

// // --- 1. Tipe Dasar untuk Skema Publik ---
// // Tipe ini akan sangat membantu jika Anda menggunakan Supabase CLI untuk mengenerate
// // tipe dari skema Anda. Ganti './database.types' dengan path yang benar jika berbeda.

// // Export the types for public tables
// // export type T_Kandidat = Database['public']['Tables']['kandidat']['Row'];
// // export type T_Pemilih = Database['public']['Tables']['pemilih']['Row'];
// // export type T_HasilVote = Database['public']['Tables']['hasil_vote']['Row'];

// // Karena Anda tidak menyertakan file 'database.types', mari kita definisikan tipe
// // secara manual berdasarkan skema ERD Anda untuk saat ini:

// /**
//  * Tipe untuk data satu baris dari tabel 'kandidat'.
//  */
// export type T_Kandidat = {
//   id: string; // uuid - Primary Key
//   nomor_urut: number; // int2 - Unique
//   nama_ketua: string; // varchar - Non-Nullable
//   nama_wakil: string; // varchar - Non-Nullable
//   visi: string; // text
//   misi: string; // text
//   foto_url: string; // text
// };

// /**
//  * Tipe untuk data satu baris dari tabel 'pemilih'.
//  * Terhubung ke 'auth.users.id' (foreign key).
//  */
// export type T_Pemilih = {
//   id: string; // uuid - Primary Key, Foreign Key (auth.users.id)
//   nis: string; // varchar - Unique
//   sudah_vote: boolean; // bool - Non-Nullable
//   tanggal_vote: string | null; // timestamptz | null
//   nama: string; // text
// };

// /**
//  * Tipe untuk data satu baris dari tabel 'hasil_vote'.
//  */
// export type T_HasilVote = {
//   id: string; // uuid - Primary Key
//   id_pemilih: string; // uuid - Non-Nullable, Unique, Foreign Key (pemilih.id)
//   id_kandidat: string; // uuid - Non-Nullable, Foreign Key (kandidat.id)
//   created_at: string; // timestamptz - Non-Nullable
// };

// // --- 2. Tipe Gabungan (Joined Types) ---
// // Tipe ini berguna saat Anda perlu mengambil data dari beberapa tabel
// // dalam satu kueri (misalnya, untuk menampilkan hasil di dashboard).

// /**
//  * Tipe untuk Hasil Vote yang sudah digabungkan dengan data Kandidat terkait.
//  * Berguna untuk menampilkan siapa yang dipilih.
//  */
// export type T_HasilVoteDenganKandidat = T_HasilVote & {
//   kandidat: T_Kandidat;
// };


// // --- 3. Tipe untuk Komponen Frontend & State Management ---

// /**
//  * Tipe yang merepresentasikan data sesi user yang sudah diverifikasi,
//  * digabungkan dengan data spesifik Pemilih dari tabel 'pemilih'.
//  * Berguna saat membuat context user atau state sesi.
//  */
// export type T_UserSessionDenganPemilih = {
//   // Data dari Supabase Auth Session
//   user_id: string; 
//   email: string;
//   // ... Tambahkan properti user session lainnya jika diperlukan

//   // Data yang digabungkan dari tabel 'pemilih'
//   pemilih: Pick<T_Pemilih, 'nis' | 'nama' | 'sudah_vote' | 'tanggal_vote'> | null;
// };