import "./globals.css";
import { Exo, Inter, Roboto_Mono } from "next/font/google";
import { AuthProvider } from '@context/AuthContext';
import { I18nProvider } from '@context/I18nProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const exo = Exo({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-exo", display: "swap" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-roboto-mono", display: "swap" });

export const metadata = {
  title: "WAVES-SSI",
  description: "Web-based Augmented & Virtual Environmental SSI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${exo.variable} ${robotoMono.variable}`}>
      <body>
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
