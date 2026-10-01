"use client";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import { useAuth } from "@context/AuthContext";
import Brand from "@components/Brand";
import ThemeToggle from '@components/ThemeToggle'
import LanguageToggle from '@components/LanguageToggle'

export default function MissionLayout({ children }) {
    const { t } = useTranslation();
    const { loading, setLoading } = useAuth();

    useEffect(() => {
        setLoading(false)
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
                        role="status"
                        className="fixed inset-0 z-60 flex items-center justify-center bg-background/80 backdrop-blur-md"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-transparent" aria-hidden="true" />
                            <p className="font-mono text-sm text-secondary">{t('common.loading')}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <nav className="sticky top-0 z-50 border-b border-border bg-card/90 text-primary backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
                    <Brand />
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <LanguageToggle />
                    </div>
                </div>
            </nav>

            <main>{children}</main>

            <footer className="bg-primary py-8 text-center text-sm text-background dark:bg-card dark:text-primary">
                {t('footer.copyright')}
            </footer>
        </ThemeProvider>
    );
}
