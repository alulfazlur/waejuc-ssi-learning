"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { useTranslation } from "react-i18next";
import { useAuth } from "@context/AuthContext";

import Brand from "@components/Brand";
import Link from "next/link";
import ThemeToggle from '@components/ThemeToggle'
import LanguageToggle from '@components/LanguageToggle'

const LayoutContext = createContext();

export default function MarketingLayout({ children }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const { t } = useTranslation();
    const { user, setLoading } = useAuth();

    const scrollToId = (id = '') => {
        const element = document.getElementById(id);
        if (element) {
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        }
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);

        handleScroll();
        setLoading(false)

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <LayoutContext.Provider value={{ scrollToId, isScrolled }}>
                <nav
                    className={`fixed inset-x-0 top-0 z-60 transition-colors duration-200
                        ${isScrolled
                            ? "border-b border-border bg-card/90 text-primary backdrop-blur-md"
                            : "border-b border-transparent bg-transparent text-white"
                        }`}
                >
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
                        <Brand onClick={() => scrollToId('hero')} />
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <ThemeToggle />
                            <LanguageToggle />
                            <Link
                                href={user ? "/learning/mission" : "/signin"}
                                className={`ml-1 inline-flex min-h-10 items-center rounded-xl px-4 text-sm font-semibold transition-colors
                                    ${isScrolled ? "bg-primary text-background hover:bg-primary/90" : "bg-white text-[#083a4f] hover:bg-white/90"}`}
                            >
                                {user ? t('nav.continue') : t('nav.signin')}
                            </Link>
                        </div>
                    </div>
                </nav>

                <main>{children}</main>

                <footer className="bg-primary py-8 text-center text-sm text-background dark:bg-card dark:text-primary">
                    <div className="mx-auto max-w-6xl px-4">
                        {t('footer.copyright')}
                    </div>
                </footer>
            </LayoutContext.Provider>
        </ThemeProvider>
    );
}

export const useLayout = () => useContext(LayoutContext);
