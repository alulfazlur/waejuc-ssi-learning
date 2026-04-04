import "./globals.css";
import { AuthProvider } from '@context/AuthContext';
import { I18nProvider } from '@context/I18nProvider';

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
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
