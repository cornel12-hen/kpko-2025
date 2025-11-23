'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/client';
import CloseButton from '@/components/CloseButton';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [nis, setNis] = useState('');
  const [token, setToken] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showToken, setShowToken] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const email = `${nis}@osistel.sch.id`;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: token,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('NIS atau Token pemilihan salah.');
        }
        throw error;
      }

      router.refresh(); 
      router.push('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-jersey w-full h-screen flex items-center justify-center px-4 py-12">
      <div className="z-20 flex flex-col w-full max-w-md max-h-[calc(100vh-128px)] mx-auto p-3 rounded-sm bg-[#d9d9d9] border-2 border-[#003566] shadow-solid-md gap-3">
        <div className="w-full h-8 flex justify-between items-center">
          <p className="text-lg pl-2">KPKO 2025.exe</p>
          <CloseButton />
        </div>
        <div className="relative z-10 w-full max-w-md bg-white rounded-sm border-2 border-[#003566] overflow-hidden">
          <div className="px-8 pt-6 pb-4 text-center border-b border-[#D9D9D9]/30">
            <h1 className="text-2xl/5 text-[#000814]">
              Aplikasi E-KPKO 2025
            </h1>
            <p className="text-sm font-medium text-[#003566] uppercase tracking-wider">
              Young Leaders, Bright Future
            </p>
          </div>

          <form onSubmit={handleLogin} className="px-8 py-8 space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm text-center animate-pulse">
                {error}
              </div>
            )}

            <div className='space-y-1'>
              <label htmlFor="nis" className="block text-base text-[#000814]">
                NIS (Nomor Induk Siswa)
              </label>
              <input
                id="nis"
                type="text"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                placeholder="Contoh: 5412xxxxx"
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-50 border border-[#D9D9D9] rounded-sm text-[#000814] placeholder-[#a5a5a5] focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:border-transparent transition duration-200"
              />
            </div>

            <div className='space-y-1'>
              <label htmlFor="token" className="block text-base text-[#000814]">
                Token Vote
              </label>
              <div className='relative'>
                <input
                  id="token"
                  type={showToken ? "text" : "password"}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Masukkan token unik Anda"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border border-[#D9D9D9] rounded-sm text-[#000814] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:border-transparent transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#000814] focus:outline-none"
                >
                  {showToken ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 stroke-[#003566]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 stroke-[#003566]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center shadow-solid-b hover:shadow-none hover:translate-y-1 py-3.5 px-4 border border-transparent rounded-sm shadow-sm text-sm text-white bg-[#003566] hover:bg-[#00284d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD60A] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                'MASUK SEKARANG'
              )}
            </button>
          </form>

          {/* Footer/Copyright */}
          <div className="px-8 py-4 bg-[#d9d9d9]/20 text-center">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Panitia KPKO OSISTEL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
