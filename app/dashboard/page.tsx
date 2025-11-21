// app/dashboard/page.tsx
import { createAuthServerClient } from '@/lib/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import { Pemilih } from '@/types'; // Import tipe yang sudah kita buat

export default async function DashboardPage() {
  const supabase = await createAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: pemilih, error } = await supabase
    .from('pemilih')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !pemilih) {
    return <div>Error: Data pemilih tidak ditemukan. Hubungi panitia.</div>;
  }

  const dataSiswa = pemilih as Pemilih;

  return (
    <div className="w-full h-full mx-auto py-6 bg-white border-t-2 border-[#003566] overflow-y-scroll">
      <div className="flex flex-col justify-center items-center pb-4 max-sm:pb-6">          
        <h1 className="text-2xl text-[#003566]">Selamat Datang</h1>
        <p className="text-gray-500 text-lg/4 text-center px-4">Pemilihan Ketua OSIS SMK Telkom Purwokerto 2026/2027</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-10 gap-4 px-4">
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-sm border border-gray-300">
            <div className="w-16 h-16 bg-[#003566] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
              {dataSiswa.nama ? dataSiswa.nama.charAt(0) : 'A'}
            </div>
            
            <h2 className="text-xl text-[#000814]">{dataSiswa.nama}</h2>
            <p className="text-lg text-gray-500">{dataSiswa.kelas}</p>
            <div className="  text-gray-400 font-mono">NIS: {dataSiswa.nis}</div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-2">Status Pemilihan:</p>
              {dataSiswa.sudah_vote ? (
                <span className="inline-flex items-center px-3 py-1 rounded-sm text-sm bg-green-100 text-green-800">
                  Sudah Memilih
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-sm text-sm bg-yellow-100 text-yellow-800">
                  Belum Memilih
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="bg-white p-6 pt-4 rounded-sm border border-gray-300 h-fit">
            <h2 className="text-2xl text-center text-[#003566] mb-2 flex items-center">
              Tata Tertib & Panduan
            </h2>
            
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <div>
                <h3 className="text-[#000814] text-lg">1. Asas LUBER JURDIL</h3>
                <p className='text-base/4'>Pemilihan dilakukan secara Langsung, Umum, Bebas, Rahasia, Jujur, dan Adil tanpa adanya paksaan dari pihak manapun.</p>
              </div>

              <div>
                <h3 className="text-[#000814] text-lg">2. Satu Suara</h3>
                <p className='text-base/4'>Setiap pemilih hanya memiliki <span className='text-black'>1 kesempatan</span> untuk memberikan suara. Pastikan pilihan Anda sudah final sebelum menekan tombol "Pilih".</p>
              </div>

              <div>
                <h3 className="text-[#000814] text-lg">3. Kerahasiaan & Dokumentasi</h3>
                <p className='text-base/4'>Pilihan Anda bersifat rahasia. Dilarang keras memfoto, merekam, atau menyebarkan tangkapan layar saat berada di halaman pemilihan/bilik suara untuk menjaga kondusivitas.</p>
              </div>

              <div>
                <h3 className="text-[#000814] text-lg">4. Alur Pemilihan</h3>
                <ul className="list-decimal pl-6 pr-2 py-2 text-base/4 space-y-2 bg-[#f2f2f2] rounded-sm border border-[#d9d9d9]">
                  <li>Klik tombol <span className='text-black'>"Masuk ke Bilik Suara"</span> di samping kiri.</li>
                  <li>Pelajari profil, visi, dan misi dari setiap paslon.</li>
                  <li>Klik tombol vote pada paslon pilihan Anda.</li>
                  <li>Sistem akan mencatat suara dan status Anda akan berubah menjadi "Sudah Memilih".</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}