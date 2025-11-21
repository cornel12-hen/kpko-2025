'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  type: 'confirm' | 'info';
  title: string;
  message: React.ReactNode;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function Modal({
  isOpen,
  type,
  title,
  message,
  isLoading = false,
  onConfirm,
  onCancel,
}: ModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = 'hidden';
    } else {
      setShow(false);
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center font-sans">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" /> 
      <div className={`
        z-50
        flex flex-col w-[90%] max-w-md p-3 rounded-sm bg-[#d9d9d9] border-2 border-[#003566] gap-3 shadow-2xl
        transform transition-all duration-200
        ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        
        <div className="w-full h-8 flex justify-between items-center">
          <p className="text-lg pl-2 text-[#000814]">
             {title}
          </p>
          
          <button 
            onClick={onCancel}
            disabled={isLoading}
            className="w-6 h-6 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold rounded-sm border-[1.5px] border-[#003566] leading-none"
          >
            <X className='size-4'/>
          </button>
        </div>

        <div className="w-full mx-auto rounded-sm flex flex-col flex-1 bg-[#f2f2f2] border-2 border-[#003566] overflow-hidden p-6 text-center">

          <div className="text-[#000814] text-xl/6 font-medium mb-6">
            {message}
          </div>

          <div className="flex justify-center gap-3 mt-auto">
            {type === 'confirm' ? (
              <>
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="px-6 py-2 rounded-sm border-2 border-[#003566] text-[#003566] font-bold hover:bg-gray-200 transition disabled:opacity-50 uppercase tracking-wide"
                >
                  Batal
                </button>

                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="px-6 py-2 rounded-sm bg-[#003566] border-2 border-[#003566] text-white font-bold hover:bg-[#00284d] transition shadow-sm disabled:opacity-70 flex items-center gap-2 uppercase tracking-wide"
                >
                  {isLoading ? '...' : 'Ya, Pilih'}
                </button>
              </>
            ) : (
              <button
                onClick={onConfirm}
                className="w-full py-2 rounded-sm bg-[#003566] border-2 border-[#003566] text-white font-bold hover:bg-[#00284d] transition uppercase tracking-wide"
              >
                Tutup
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}