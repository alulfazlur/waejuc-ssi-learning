"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@context/AuthContext";
import ThemeToggle from '@components/ThemeToggle'
import LanguageToggle from '@components/LanguageToggle'

export default function MarketingLayout({ children }) {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);

    const { loading, setLoading } = useAuth();

    const colorClass = 'text-primary dark:text-primary';
    const backgroundClass = 'bg-background dark:bg-background';


    useEffect(() => {
        setLoading(false)
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-60 flex items-center justify-center bg-background/80 backdrop-blur-md"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm font-mono animate-pulse text-primary">
                                {loading ? "Loading..." : t('common.load_init')}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <nav
                className={`
                        fixed top-0 left-0 right-0 z-60 px-6 py-4 flex justify-between lg:justify-normal items-center duration-200
                        bg-primary${isScrolled ? '/75' : ''} dark:bg-primary${isScrolled ? '/90' : ''} backdrop-blur-md border-b border-white/10 shadow-lg text-background
            `}
            >
                <div className="lg:w-1/4">
                    <button className="font-bold text-xl tracking-tight cursor-pointer" onClick={() => router.push('/')}>
                        Waejuc-SSI
                    </button>
                </div>

                <div className="hidden lg:flex flex-1 " />

                <div className="flex lg:hidden gap-3">
                    <ThemeToggle colorClass={colorClass} backgroundClass={backgroundClass} />
                    <LanguageToggle />
                </div>

                <div className="hidden lg:flex w-1/4 justify-end gap-3">
                    <ThemeToggle colorClass={colorClass} backgroundClass={backgroundClass} />
                    <LanguageToggle />
                </div>
            </nav>

            <main>{children}</main>

            <footer className="text-background dark:text-primary font-bold bg-quaternary dark:bg-secondary py-10 border-t border-white/10 text-center text-sm">
                &copy; 2026 FazaTech.
            </footer>
        </ThemeProvider>
    );
}
