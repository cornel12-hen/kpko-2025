import type { Metadata } from "next";
import { Jersey_15 } from "next/font/google";
import "./globals.css";



const jersey15 = Jersey_15({
  variable: "--font-jersey",
  subsets: ["latin"],
  weight: ["400"],

});

export const metadata: Metadata = {
  title: "KPKO 2025",
  description: "Website KPKO 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jersey15.variable} font-jersey antialiased`}>
        <div className="relative flex justify-center items-center min-h-screen overflow-hidden font-sans">
        
          {/* <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-[#000814]"></div>
            
            <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#003566] rounded-full blur-[150px] opacity-40 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#003566] rounded-full blur-[150px] opacity-30"></div>
            <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[30vw] h-[30vw] bg-[#FFD60A] rounded-full blur-[200px] opacity-10"></div>
            
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          </div> */}

          {children}
        </div>
      </body>
    </html>
  );
}
