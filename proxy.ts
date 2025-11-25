import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  // 1. Setup Response Awal
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // 2. Setup Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // 3. PENTING: Menggunakan getUser() untuk keamanan & refresh token otomatis
  // Ini menggantikan getSession() dari kode lamamu dengan cara yang lebih secure.
  const { data: { user } } = await supabase.auth.getUser();

  // Ambil metadata role (jika tidak ada, anggap user biasa/null)
  const userRole = user?.user_metadata?.role;
  const path = request.nextUrl.pathname;

  // --- LOGIKA PROTEKSI RUTE (ROUTING GUARD) ---

  // A. JIKA USER SUDAH LOGIN, TAPI MEMBUKA HALAMAN LOGIN
  if (path === '/login' || path === '/admin/login') {
    if (user) {
      // Admin nyasar ke login -> Lempar ke Admin Dashboard
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      // Siswa nyasar ke login -> Lempar ke Dashboard Siswa
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Jika belum login, biarkan dia buka halaman login
    return response;
  }

  // B. PROTEKSI HALAMAN ADMIN (/admin/dashboard, dll)
  // Kecualikan /admin/login karena sudah dihandle di poin A
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // 1. Belum Login -> Lempar ke Login Admin
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // 2. Login tapi BUKAN Admin -> Tendang ke Dashboard Siswa
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // C. PROTEKSI HALAMAN SISWA (/dashboard, /voting)
  const studentRoutes = ['/dashboard', '/voting'];
  if (studentRoutes.some(route => path.startsWith(route))) {
    // 1. Belum Login -> Lempar ke Login Siswa
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // 2. Login tapi ADMIN -> Lempar ke Dashboard Admin (Opsional, biar rapi)
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // Jika tidak ada kondisi di atas yang terpenuhi, lanjutkan request
  return response;
}

export const config = {
  matcher: [
    /*
     * Matcher ini menangkap semua rute KECUALI file statis, gambar, dan API.
     * PENTING: Kita hapus pengecualian 'login' agar middleware tetap jalan di sana
     * untuk melakukan redirect jika user sudah login.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// import { NextResponse, type NextRequest } from 'next/server';
// import { createServerClient } from '@supabase/ssr';

// export async function proxy(request: NextRequest) {
//   // Clone request object, karena kita akan memodifikasi headers
//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return request.cookies.get(name)?.value;
//         },
//         set(name: string, value: string, options: any) {
//           // Set cookies di response agar Supabase Auth dapat bekerja
//           request.cookies.set({ name, value, ...options });
//           response = NextResponse.next({
//             request: {
//               headers: request.headers,
//             },
//           });
//           response.cookies.set({ name, value, ...options });
//         },
//         remove(name: string, options: any) {
//           // Hapus cookies di response
//           request.cookies.set({ name, value: '', ...options });
//           response = NextResponse.next({
//             request: {
//               headers: request.headers,
//             },
//           });
//           response.cookies.set({ name, value: '', ...options });
//         },
//       },
//     }
//   );

//   // Menyegarkan sesi otentikasi Supabase. 
//   // Jika sesi valid, cookies akan diperbarui di response.
//   const { data: { session } } = await supabase.auth.getSession();

//   const protectedRoutes = ['/dashboard', '/voting'];
//   const currentPath = request.nextUrl.pathname;

//   // Cek jika rute saat ini adalah rute yang dilindungi
//   if (protectedRoutes.some(route => currentPath.startsWith(route))) {
//     if (!session) {
//       // Jika tidak ada sesi (belum login), arahkan ke halaman login
//       const url = request.nextUrl.clone();
//       url.pathname = '/login';
//       return NextResponse.redirect(url);
//     }
//   }

//   // Jika user mencoba mengakses /login padahal sudah login, arahkan ke dashboard
//   if (currentPath === '/login' && session) {
//     const url = request.nextUrl.clone();
//     url.pathname = '/dashboard';
//     return NextResponse.redirect(url);
//   }

//   const { data: { user } } = await supabase.auth.getUser();
//   const userRole = user?.user_metadata?.role;

//   if (currentPath.startsWith('/admin')) {
    
//     // Kasus 1: Sedang di halaman Login Admin (/admin/login)
//     if (currentPath === '/admin/login') {
//       if (user) {
//         // Kalau sudah login sbg Admin -> Lempar ke Dashboard Admin
//         if (userRole === 'admin') {
//           return NextResponse.redirect(new URL('/admin/dashboard', request.url));
//         }
//         // Kalau siswa iseng buka login admin -> Balikin ke Dashboard Siswa
//         return NextResponse.redirect(new URL('/dashboard', request.url));
//       }
//       // Kalau belum login -> Silakan lanjut buka form login admin
//       return response;
//     }

//     // Kasus 2: Halaman Admin Lainnya (/admin/dashboard, dll)
//     // Jika belum login -> Lempar ke Login Admin
//     if (!user) {
//       return NextResponse.redirect(new URL('/admin/login', request.url));
//     }
//     // Jika login tapi BUKAN admin -> Tendang ke Dashboard Siswa
//     if (userRole !== 'admin') {
//       return NextResponse.redirect(new URL('/dashboard', request.url));
//     }
//   }

//   // Lanjutkan request dengan response yang mungkin memiliki cookies yang diperbarui
//   return response;
// }

// // Konfigurasi agar middleware hanya berjalan di rute tertentu
// export const config = {
//   matcher: [
//     /*
//      * Mencocokkan semua path except:
//      * - _next/static (file statis)
//      * - _next/image (file gambar)
//      * - favicon.ico (ikon browser)
//      * - (API Routes yang tidak memerlukan proteksi)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico|login|manifest.json).*)',
//   ],
// };