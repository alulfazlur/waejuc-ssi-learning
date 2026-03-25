import "./globals.css";
import { AuthProvider } from '@context/AuthContext';

export const metadata = {
  title: "Waejuc SSI",
  description: "Waejuc SSI by Hikmah Buroidah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
