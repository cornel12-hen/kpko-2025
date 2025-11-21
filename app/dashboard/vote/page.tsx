import { createAuthServerClient } from '@/lib/server';
import { redirect } from 'next/navigation';
import VotingList from './VotingList';
import { Kandidat, Pemilih } from '@/types';

export default async function VotingPage() {
  const supabase = await createAuthServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: pemilih } = await supabase
    .from('pemilih')
    .select('sudah_vote')
    .eq('id', user.id)  
    .single();

  const dataSiswa = pemilih as Pemilih;

  const { data: kandidatList, error } = await supabase
    .from('kandidat')
    .select('*')
    .order('nomor_urut', { ascending: true })
    .returns<Kandidat[]>();

  if (error || !kandidatList) {
    return <div className="text-center p-10 text-white">Gagal memuat data kandidat.</div>;
  }

  return (
    <div className="w-full h-full mx-auto py-6 bg-white border-t-2 border-[#003566] overflow-y-scroll">
      <div className="max-w-6xl mx-auto px-4 max-sm:px-0">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl text-[#003566]">
            Bilik Suara
          </h1>
          <p className="text-gray-400 text-base/4 px-4">
            Gunakan hak suara Anda dengan bijak dan bertanggung jawab!
          </p>
        </div>

        <VotingList kandidat={kandidatList} siswa={dataSiswa} />
        
      </div>
    </div>
  );
}