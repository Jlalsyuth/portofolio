import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ToastProvider } from '@/components/ToastProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { InteractiveBackground } from '@/components/InteractiveBackground';

export const metadata: Metadata = {
  title: 'Jalaluddin Assyuyuti | Full-Stack Developer & Business Enabler',
  description: 'Portofolio resmi Jalaluddin Assyuyuti, Lulusan S1 Sistem Informasi Universitas Brawijaya yang berfokus pada pengembangan Web App, Mobile App, Business Intelligence, dan solusi digital.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b12] text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
        {/* Subtle grid and ambient lighting overlays */}
        <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-60 z-0" />
        <div className="fixed top-0 inset-x-0 h-[700px] bg-radial-gradient pointer-events-none z-0" />
        
        {/* Dynamic & Interactive Background with Ambient Glowing Cursor */}
        <InteractiveBackground />

        {/* World-Class Custom Floating Cursor */}
        <CustomCursor />

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <ToastProvider />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
