import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Providers from "./providers";
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from '@/components/SessionProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Art Realm - Discover & Buy Original Artwork",
  description: "Discover and purchase original artwork from talented artists around the world.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
          <Toaster position="bottom-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
