import "./globals.css";
import { AuthProvider } from '@context/AuthContext';
import { I18nProvider } from '@context/I18nProvider';
import { Toaster } from 'sonner';

export const metadata = {
  title: "Waejuc SSI",
  description: "Waejuc SSI by Hikmah Buroidah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <I18nProvider>
          <AuthProvider>
            {children}
            <Toaster position="bottom-center" richColors />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
