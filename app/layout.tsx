import type {Metadata} from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'Hogis Cinemas | Your Ticket to Adventure',
  description: 'Book movie tickets, select seats, and enjoy the show at Hogis Cinemas.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="bg-[#0A0A0A] text-white font-sans antialiased selection:bg-[#E50914] selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
