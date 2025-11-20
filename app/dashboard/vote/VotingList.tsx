"use client";

import { Kandidat } from "@/types";
import { submitVote } from "@/app/actions/vote";
import { createBrowserClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function VotingList({ kandidat }: { kandidat: Kandidat[] }) {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleVote = async (kandidatId: string, namaPaslon: string) => {
    const isSure = confirm(`Apakah Anda yakin ingin memilih paslon nomor ${namaPaslon}? Pilihan tidak dapat diubah.`);
    if (!isSure) return;

    setLoadingId(kandidatId);

    try {
      const result = await submitVote(kandidatId);

      if (!result.success) {
        alert(result.message);
        setLoadingId(null);
        return;
      }

      alert("✅ Terima kasih! Suara Anda telah berhasil direkam.");

      await supabase.auth.signOut();

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan koneksi.");
      setLoadingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 px-8 md:grid-cols-2 gap-8 justify-center items-stretch">
      {kandidat.map((k) => (
        <div key={k.id} className="bg-white rounded-lg overflow-hidden border-2 border-[#003566] transition-all duration-300 flex flex-col">
          {/* Header Nomor Urut */}
          <div className="bg-[#003566] p-4 text-center relative">
            <div className="inline-block w-12 h-12 rounded-full bg-[#FFD60A] text-[#000814] font-bold text-2xl leading-12 shadow-lg">{k.nomor_urut}</div>
          </div>

          {/* Foto Kandidat */}
          <div className="relative w-full h-64 bg-gray-200 overflow-clip">
            {k.foto_url ? <Image src={k.foto_url} alt={`Kandidat ${k.nomor_urut}`} fill className="object-cover object-top -rotate-90" /> : <div className="flex items-center justify-center h-full text-gray-400">No Image</div>}
          </div>

          {/* Detail Kandidat */}
          <div className="grow flex flex-col text-[#000814]">
            <div className="text-center my-4 border-b border-gray-200 pb-4">
              <p className="text-sm text-gray-500">Ketua</p>
              <h2 className="text-xl/5 uppercase mb-3">{k.nama_ketua}</h2>
              <p className="text-sm text-gray-500">Wakil Ketua</p>
              <h2 className="text-xl/5 uppercase">{k.nama_wakil}</h2>
            </div>

            <div className="space-y-4 grow px-6 pb-4">
              <div>
                <h3 className="text-lg text-[#003566]">Visi:</h3>
                <p className="text-sm text-gray-700">{k.visi}</p>
              </div>
              <div>
                <h3 className="text-lg text-[#003566]">Misi:</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{k.misi}</p>
              </div>
            </div>
          </div>

          {/* Tombol Action */}
          <div className="p-6 pt-0 mt-auto">
            <button
              onClick={() => handleVote(k.id, `${k.nomor_urut}`)}
              disabled={loadingId !== null}
              className={`w-full py-4 rounded-xl text-lg uppercase tracking-wider transition transform active:scale-95 ${
                loadingId === k.id
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : loadingId !== null
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#003566] text-white hover:bg-[#00284d]"
              }`}
            >
              {loadingId === k.id ? "Merekam Suara..." : `Pilih Paslon ${k.nomor_urut}`}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
