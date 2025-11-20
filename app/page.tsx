import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="font-jersey w-full max-w-md bg-white p-8 rounded-xl shadow-2xl text-center">
      <h1 className="text-4xl text-[#003566] mb-4">
        E-Voting KETOS 2024
      </h1>
      <p className="text-gray-600 mb-8">
        Selamat datang di platform pemilihan ketua OSIS daring. Gunakan NISN dan Token Anda untuk memberikan suara.
      </p>
      
      <Link 
        href="/login"
        className="w-full inline-block py-3 px-6 bg-[#003566] text-white rounded-lg shadow-md hover:bg-[#003566] transition duration-300 transform hover:scale-105"
      >
        Mulai Voting (Masuk)
      </Link>
    </div>
  );
}