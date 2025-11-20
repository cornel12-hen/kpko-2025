import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  // Clone request object, karena kita akan memodifikasi headers
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Set cookies di response agar Supabase Auth dapat bekerja
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          // Hapus cookies di response
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Menyegarkan sesi otentikasi Supabase. 
  // Jika sesi valid, cookies akan diperbarui di response.
  const { data: { session } } = await supabase.auth.getSession();

  const protectedRoutes = ['/dashboard', '/voting'];
  const currentPath = request.nextUrl.pathname;

  // Cek jika rute saat ini adalah rute yang dilindungi
  if (protectedRoutes.some(route => currentPath.startsWith(route))) {
    if (!session) {
      // Jika tidak ada sesi (belum login), arahkan ke halaman login
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Jika user mencoba mengakses /login padahal sudah login, arahkan ke dashboard
  if (currentPath === '/login' && session) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Lanjutkan request dengan response yang mungkin memiliki cookies yang diperbarui
  return response;
}

// Konfigurasi agar middleware hanya berjalan di rute tertentu
export const config = {
  matcher: [
    /*
     * Mencocokkan semua path except:
     * - _next/static (file statis)
     * - _next/image (file gambar)
     * - favicon.ico (ikon browser)
     * - (API Routes yang tidak memerlukan proteksi)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|manifest.json).*)',
  ],
};