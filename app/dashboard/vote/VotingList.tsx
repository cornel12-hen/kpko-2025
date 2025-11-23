"use client";

import { Kandidat, Pemilih } from "@/types";
import { submitVote } from "@/app/actions/vote";
import { createBrowserClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Modal from "@/components/Modal";

export default function VotingList({ kandidat, siswa }: { kandidat: Kandidat[], siswa: Pemilih }) {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const [isModalLoading, setIsModalLoading] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'info';
    title: string;
    message: React.ReactNode;
    selectedKandidatId?: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const initiateVote = (kandidatId: string, nomorUrut: number) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Konfirmasi Pilihan',
      message: (
        <span>
          Apakah Anda yakin ingin memilih paslon nomor <strong>{nomorUrut}</strong>?<br />
          Pilihan tidak dapat diubah setelah ini.
        </span>
      ),
      selectedKandidatId: kandidatId,
    });
  };

  const handleConfirmVote = async () => {
    const kandidatId = modalConfig.selectedKandidatId;
    if (!kandidatId) return;

    setIsModalLoading(true);
    setLoadingId(kandidatId);

    try {
      const result = await submitVote(kandidatId);

      if (!result.success) {
        setModalConfig({
          ...modalConfig,
          type: 'info',
          title: 'Gagal',
          message: result.message,
        });
        setLoadingId(null);
      } else {
        setModalConfig({
          isOpen: true,
          type: 'info',
          title: 'Terima Kasih!',
          message: 'Terima kasih! Suara Anda telah berhasil direkam. Anda akan dialihkan keluar.',
          selectedKandidatId: undefined,
        });
      }
    } catch (error) {
      console.error(error);
      setModalConfig({
        ...modalConfig,
        type: 'info',
        title: 'Error',
        message: 'Terjadi kesalahan koneksi.',
      });
      setLoadingId(null);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleCloseModal = async () => {
    if (modalConfig.title === 'Terima Kasih!') {
       await supabase.auth.signOut();
       router.replace("/");
       router.refresh();
    }
    
    // Tutup modal biasa
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <Modal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        isLoading={isModalLoading}
        onConfirm={modalConfig.type === 'confirm' ? handleConfirmVote : handleCloseModal}
        onCancel={handleCloseModal}
      />

      <div className="grid grid-cols-1 px-8 max-sm:px-4 lg:grid-cols-2 gap-8 justify-center items-stretch">
        {kandidat.map((k) => (
          <div key={k.id} className="bg-white rounded-lg overflow-hidden border-2 border-[#003566] transition-all duration-300 flex flex-col">
            <div className="bg-[#003566] p-4 text-center relative">
              <div className="inline-block w-12 h-12 rounded-full bg-[#FFD60A] text-[#000814] font-bold text-2xl leading-12 shadow-lg">{k.nomor_urut}</div>
            </div>

            <div className="relative w-full h-80 max-sm:h-80 max-lg:h-96 bg-gray-200 overflow-clip">
              {k.foto_url ? 
                <Image src={k.foto_url} alt={`Kandidat ${k.nomor_urut}`} fill className="object-cover object-[center_40%] max-sm:object-[center_35%] max-lg:object-[center_35%]" /> 
                : 
                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
              }
            </div>

            <div className="grow flex flex-col text-[#000814]">
              <div className="text-center my-4 mt-3 border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-500">Ketua</p>
                <h2 className="text-xl/5 uppercase mb-3">{k.nama_ketua}</h2>
                <p className="text-sm text-gray-500">Wakil Ketua</p>
                <h2 className="text-xl/5 uppercase">{k.nama_wakil}</h2>
              </div>

              <div className="space-y-4 grow px-6 pb-4">
                <div>
                  <h3 className="text-lg text-[#003566]">Visi:</h3>
                  <p className="text-sm/4 text-gray-700 whitespace-pre-wrap">{k.visi}</p>
                </div>
                <div>
                  <h3 className="text-lg text-[#003566]">Misi:</h3>
                  {k.misi ? (
                    <ol className="list-decimal list-outside pl-5 space-y-1 text-sm/4 text-gray-700">
                      {k.misi.split('\n').filter(line => line.trim() !== '').map((item, index) => (
                        <li key={index}>
                          {item.replace(/^[0-9-]+\.\s*/, '')} 
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Tidak ada data misi</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 mt-auto">
              {siswa.sudah_vote ? (
                <p className="w-full py-4 rounded-xl text-lg uppercase tracking-wider bg-[#d9d9d9] text-[#000814] text-center">
                  Anda sudah memilih
                </p>
              ) : (
                <button
                  onClick={() => initiateVote(k.id, k.nomor_urut)}
                  disabled={loadingId !== null}
                  className={`w-full py-4 rounded-md text-lg uppercase tracking-wider transition transform active:scale-95 ${
                    loadingId === k.id
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : loadingId !== null
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#003566] text-white hover:translate-y-1 shadow-solid-b hover:shadow-none hover:bg-[#00284d] hover:cursor-pointer"
                  }`}
                >
                  {loadingId === k.id ? "Merekam Suara..." : `Pilih Paslon ${k.nomor_urut}`}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}