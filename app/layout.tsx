import type { Metadata } from "next";
import { Jersey_15 } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Suspense } from "react";

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
        <div className="relative flex justify-center items-center w-full min-h-screen overflow-hidden font-sans">
          <div className="fixed inset-0 -z-10 select-none">
            <Image
              src="/images/BG KPKO small (3).svg"
              alt="Desktop Background"
              fill
              priority
              className="object-cover object-center scale-180 rotate-21" 
            />
          </div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute opacity-20 -top-[16%] -left-[8%] w-[40%] h-[40%] rounded-full bg-[#003566] blur-[150px]" />
            <div className="absolute opacity-20 top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#FFD60A] blur-[120px]" />
            <Image
              src="/images/Group 127.svg"
              alt="Element1"
              width={250}
              height={250}
              className="absolute top-[-12%] right-[-7%] max-lg:hidden"
            />
            <Image
              src="/images/Clip path group-1.svg"
              alt="Element1"
              width={250}
              height={250}
              className="absolute top-[-18%] left-[-10%] max-lg:hidden"
            />
            <Image
              src="/images/Group 128.svg"
              alt="Element1"
              width={250}
              height={250}
              className="absolute bottom-[-11%] left-[-4%] -scale-x-100 max-lg:hidden"
            />
            <Image
              src="/images/Clip path group-2.svg"
              alt="Element1"
              width={250}
              height={250}
              className="absolute bottom-[-11%] right-[-6%] -scale-x-100 max-lg:hidden"
            />
            <Image
              src="/images/Star.svg"
              alt="Element1"
              width={150}
              height={150}
              className="absolute top-[40%] right-[15%] max-lg:hidden"
            />
            <Image
              src="/images/Star.svg"
              alt="Element1"
              width={150}
              height={150}
              className="absolute top-[35%] left-[12%] max-lg:hidden"
            />
          </div>

          {children}
        </div>
      </body>
    </html>
  );
}
