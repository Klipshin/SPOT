import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Header from './components/Header'; 
// FIX: Added '/src' to the path to match your folder structure
import { ThemeProvider } from './components/ThemeContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'SPOT',
  description: 'Species Protection & Online Tracking',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
