import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: "JB's Note Taker",
  description: 'A charming note-taking application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
