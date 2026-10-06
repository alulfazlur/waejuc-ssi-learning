import "./globals.css";
import { DM_Mono, DM_Sans, Sora } from "next/font/google";
import { AuthProvider } from '@context/AuthContext';
import { I18nProvider } from '@context/I18nProvider';
import { Toaster } from 'sonner';

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const sora = Sora({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-sora", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });

export const metadata = {
  title: "WAVES-SSI",
  description: "Web-based Augmented & Virtual Environmental SSI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${dmSans.variable} ${sora.variable} ${dmMono.variable}`}>
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
