'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [nis, setNis] = useState('');
  const [token, setToken] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="font-jersey w-full min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#003566] blur-[100px]" />
         <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#FFD60A] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-8 pt-8 pb-6 text-center border-b border-[#D9D9D9]/30">
          <h1 className="text-2xl text-[#000814] tracking-tight">
            Pemilihan Ketua OSIS
          </h1>
          <p className="mt-2 text-sm font-medium text-[#003566] uppercase tracking-wider">
            Young Leaders, Bright Future
          </p>
        </div>

        <form onSubmit={handleLogin} className="px-8 py-8 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="nis" className="block text-sm text-[#000814]">
              NIS (Nomor Induk Siswa)
            </label>
            <input
              id="nis"
              type="text"
              value={nis}
              onChange={(e) => setNis(e.target.value)}
              placeholder="Contoh: 10203"
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-50 border border-[#D9D9D9] rounded-lg text-[#000814] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:border-transparent transition duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="token" className="block text-sm text-[#000814]">
              Token Pemilihan
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Masukkan token unik Anda"
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-50 border border-[#D9D9D9] rounded-lg text-[#000814] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:border-transparent transition duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm text-white bg-[#003566] hover:bg-[#00284d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD60A] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
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
        <div className="px-8 py-4 bg-[#D9D9D9]/20 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Panitia Pemilihan OSIS
          </p>
        </div>
      </div>
    </div>
  );
}
