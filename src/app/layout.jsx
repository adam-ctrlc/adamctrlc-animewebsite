import './globals.css';
import { Inter } from 'next/font/google';
import { AnimeProvider } from './utils/AnimeContext';
import Navbar from './components/Navbar'; // We'll create this
import Footer from './components/Footer'; // We'll create this

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Watch Anime', // Update title
  description: 'Your place to watch the latest and greatest anime!',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <AnimeProvider>
          {' '}
          {/* Wrap application with the context provider */}
          <div className='flex flex-col min-h-screen'>
            <Navbar />
            <main className='flex-grow container mx-auto px-4'>{children}</main>
            <Footer />
          </div>
        </AnimeProvider>
      </body>
    </html>
  );
}
