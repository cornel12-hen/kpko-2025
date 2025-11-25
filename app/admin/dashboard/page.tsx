'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/client';
import { Kandidat, Pemilih } from '@/types';
import { getDashboardData } from '@/app/actions/admin';

// Tipe data gabungan untuk chart
type VoteStats = Kandidat & {
  vote_count: number;
};

export default function AdminDashboard() {
  const supabase = createBrowserClient();
  
  // State Data
  const [kandidatStats, setKandidatStats] = useState<VoteStats[]>([]);
  const [pemilih, setPemilih] = useState<Pemilih[]>([]);
  const [loading, setLoading] = useState(true);

  // State Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'sudah' | 'belum'>('all');

  // --- 1. FETCH DATA (Menggunakan Server Action) ---
  const fetchData = async () => {
    try {
      // Panggil Server Action (Bypass RLS)
      const { kandidat, pemilih, votes } = await getDashboardData();

      if (kandidat && pemilih && votes) {
        setPemilih(pemilih as Pemilih[]);

        // Gabungkan Data Kandidat + Hitungan Vote
        const stats = kandidat.map((k: any) => ({
          ...k,
          vote_count: votes.filter((v: any) => v.id_kandidat === k.id).length
        }));
        setKandidatStats(stats as VoteStats[]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // --- 2. REALTIME SUBSCRIPTION ---
  useEffect(() => {
    // Load data awal
    const initData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    initData();

    // Subscribe ke perubahan tabel
    const channel = supabase
      .channel('admin-dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hasil_vote' }, () => {
        fetchData(); // Refresh data saat ada vote masuk
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pemilih' }, () => {
        fetchData(); // Refresh data saat status pemilih berubah
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  // --- 3. PERHITUNGAN STATISTIK ---
  const totalPemilih = pemilih.length;
  const totalSudahVote = pemilih.filter(p => p.sudah_vote).length;
  const totalBelumVote = totalPemilih - totalSudahVote;
  const persentasePartisipasi = totalPemilih > 0 ? Math.round((totalSudahVote / totalPemilih) * 100) : 0;

  // --- 4. FILTER LIST PEMILIH ---
  const filteredPemilih = pemilih.filter(p => {
    // Handling nilai null pada nama dengan fallback string kosong
    const nama = p.nama || ""; 
    const kelas = p.kelas || "";
    const matchName = nama.toLowerCase().includes(searchTerm.toLowerCase()) || p.nis.includes(searchTerm) || kelas.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'sudah') return matchName && p.sudah_vote;
    if (filterStatus === 'belum') return matchName && !p.sudah_vote;
    return matchName;
  });


  if (loading) return <div className="p-10 text-center text-2xl animate-pulse text-[#003566]">Loading Data Base...</div>;

  return (
    <div className="space-y-8 pb-10">
      
      {/* --- BAGIAN 1: KARTU STATISTIK --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Peserta" value={totalPemilih} color="bg-[#003566] text-white" />
        <StatCard title="Suara Masuk" value={totalSudahVote} color="bg-green-700 text-white" />
        <StatCard title="Belum Memilih" value={totalBelumVote} color="bg-red-700 text-white" />
        <StatCard title="Partisipasi" value={`${persentasePartisipasi}%`} color="bg-[#FFD60A] text-[#000814]" />
      </div>

      {/* --- BAGIAN 2: GRAFIK PEROLEHAN SUARA (Retro Bar Chart) --- */}
      <div className="bg-white border-2 border-[#003566] p-6 shadow-sm">
        <h2 className="text-2xl text-[#003566] mb-6 border-b-2 border-[#003566] pb-2">
          📊 Perolehan Suara
        </h2>
        
        <div className="space-y-6">
          {kandidatStats.map((k) => {
            // Hitung persentase vote per kandidat
            const percent = totalSudahVote > 0 ? Math.round((k.vote_count / totalSudahVote) * 100) : 0;
            
            return (
              <div key={k.id} className="relative">
                <div className="flex justify-between mb-1 text-lg">
                  <span className=" text-[#000814]">
                    #{k.nomor_urut} {k.nama_ketua} & {k.nama_wakil}
                  </span>
                  <span className="font-mono text-[#003566]">
                    {k.vote_count} Suara ({percent}%)
                  </span>
                </div>
                
                {/* Bar Container */}
                <div className="w-full h-8 bg-gray-200 border-2 border-[#003566] rounded-sm relative overflow-hidden">
                  {/* Bar Fill (Animasi CSS Width) */}
                  <div 
                    className="h-full bg-[#FFD60A] border-r-2 border-[#003566] transition-all duration-1000 ease-out relative"
                    style={{ width: `${percent}%` }}
                  >
                     {/* Pattern Overlay (Biar kelihatan retro) */}
                     <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#000814,#000814_1px,transparent_1px,transparent_4px)]"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- BAGIAN 3: DATA PEMILIH (Tabel) --- */}
      <div className="bg-white border-2 border-[#003566] p-6 shadow-sm">
        <h2 className="text-2xl text-[#003566] mb-6 border-b-2 border-[#003566] pb-2 flex justify-between items-center flex-wrap gap-2">
          <span>📂 Data Pemilih</span>
          <span className="text-sm text-gray-500">Menampilkan {Math.min(filteredPemilih.length, 100)} dari {filteredPemilih.length} Data</span>
        </h2>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Cari Nama / NIS / Kelas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-[#003566] bg-gray-50 focus:bg-white focus:outline-none focus:shadow-solid-sm transition placeholder-gray-400 text-[#000814]"
          />
          
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border-2 border-[#003566] bg-gray-50 focus:outline-none cursor-pointer text-[#000814]"
          >
            <option value="all">Semua Status</option>
            <option value="sudah">✅ Sudah Vote</option>
            <option value="belum">❌ Belum Vote</option>
          </select>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto border-2 border-[#003566]">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-[#003566] text-white">
              <tr>
                <th className="p-3 border-r border-white/20 w-1/4 font-light">NIS</th>
                <th className="p-3 border-r border-white/20 w-1/3 font-light">Nama Lengkap</th>
                <th className="p-3 border-r border-white/20 w-1/4 font-light">Kelas</th>
                <th className="p-3 text-center w-1/6 font-light">Status</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm text-[#000814]">
              {filteredPemilih.slice(0, 100).map((p, i) => ( // Limit render 100 biar ga berat
                <tr key={p.id} className={`hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                  <td className="p-3 border-r border-gray-300 font-mono">{p.nis}</td>
                  <td className="p-3 border-r border-gray-300 uppercase">{p.nama || "-"}</td>
                  <td className="p-3 border-r border-gray-300">{p.kelas}</td>
                  <td className="p-3 text-center">
                    {p.sudah_vote ? (
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-sm text-xs border border-green-300 shadow-sm">
                        SUDAH
                      </span>
                    ) : (
                      <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-sm text-xs border border-red-300 shadow-sm">
                        BELUM
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredPemilih.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredPemilih.length > 100 && (
          <p className="text-center text-xs text-gray-500 mt-2 font-sans italic">
            * Hanya menampilkan 100 data pertama untuk performa. Gunakan pencarian untuk melihat data spesifik.
          </p>
        )}
      </div>

    </div>
  );
}

// Komponen Kecil untuk Kartu Stat
function StatCard({ title, value, color }: { title: string, value: string | number, color: string }) {
  return (
    <div className={`p-4 border-2 border-[#003566] shadow-solid-sm flex flex-col items-center justify-center ${color}`}>
      <h3 className="text-sm uppercase tracking-widest opacity-80 mb-1">{title}</h3>
      <p className="text-4xl">{value}</p>
    </div>
  );
}