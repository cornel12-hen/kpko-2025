import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'evqhcwtcxjmoiodolwbu.supabase.co', // Ganti dengan hostname project kamu jika berbeda
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  headers: async () => {
    return [
      {
        // Target: Semua file di folder public/images
        source: '/images/:all*',
        headers: [
          {
            key: 'Cache-Control',
            // public: Boleh disimpan siapa saja
            // max-age=31536000: Simpan selama 1 TAHUN (dalam detik)
            // immutable: File ini tidak akan pernah berubah isinya
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Target: Semua file SVG/PNG/JPG di root (jika ada)
        source: '/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
