
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>JB's Note Taker - Turbo AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
        <style>{`
          body { font-family: 'DM Sans', sans-serif; background-color: #FBF7F0; color: #4A3B2C; }
          h1, h2, h3, h4, h5, h6, .serif { font-family: 'Playfair Display', serif; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #D7CCC8; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #BCAAA4; }
        `}</style>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
