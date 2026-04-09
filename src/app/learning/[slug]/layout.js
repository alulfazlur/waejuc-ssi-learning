"use client";
import { useState, use, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, BookOpen, Check, Lock, Pencil, LogOut } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next";

import { useAuth } from "@context/AuthContext";
import { SYLLABUS } from "@constants/syllabus";

import ThemeToggle from '@components/ThemeToggle'
import LanguageToggle from '@components/LanguageToggle'
import HeaderLesson from "@components/HeaderLesson";

export default function LearningLayout({ params: paramsPromise, children }) {
    const { theme } = useTheme();
    const { t } = useTranslation();

    const params = use(paramsPromise);
    const router = useRouter();
    const currentSlug = params.slug;

    const { maxStep, isSyncing, loading, setLoading, logout } = useAuth();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const currentIndex = SYLLABUS.findIndex(s => s.id === currentSlug);
    const currentSyllabus = SYLLABUS[currentIndex] || {};

    const colorClass = theme === "dark" ? "text-primary" : "text-background";

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    useEffect(() => {
        setLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <div className="flex min-h-screen bg-background text-foreground">
                <AnimatePresence>
                    {(isSyncing || loading) && (
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

                <aside className={`fixed inset-y-0 left-0 z-40 w-72 
                    bg-tertiary dark:bg-secondary border-r border-border dark:border-primary/20 
                    transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    flex flex-col justify-between
                    `}>

                    <div className="flex justify-between items-center p-6">
                        <div className="flex items-center justify-between">
                            <ThemeToggle colorClass={colorClass} />
                        </div>
                        <LanguageToggle />
                    </div>

                    <div className="p-6 pt-5 flex-1">
                        <h3 className="text-sm font-bold tracking-wide text-secondary dark:text-primary mb-8 flex items-center gap-2">
                            <BookOpen size={18} />
                            {t('sidebar.progress_title')}
                        </h3>

                        <div className="relative space-y-0">
                            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-border dark:bg-slate-800 z-0" />

                            {SYLLABUS.map((item) => {
                                const isCompleted = maxStep > item.step;
                                const isActive = currentSlug === item.id;
                                const isLocked = item.step > maxStep;

                                return (
                                    <div key={item.id} className="relative z-10">
                                        <Link
                                            href={isLocked ? "#" : `/learning/${item.id}`}
                                            className={`flex items-center gap-4 p-3 rounded-2xl transition-all mb-4 group ${isActive
                                                ? "bg-primary text-background shadow-lg shadow-primary/20"
                                                : isLocked ? "cursor-not-allowed" : "hover:bg-primary/10"
                                                }`}
                                        >
                                            <div className={`
                                                shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                                                ${isActive ? "bg-background border-background shadow-md text-primary" :
                                                    isCompleted ? "bg-primary border-primary text-background" :
                                                        "bg-secondary border-border text-background"}
                                            `}>
                                                {isCompleted ? (
                                                    <Check size={18} strokeWidth={3} />
                                                ) : isLocked ? (
                                                    <Lock size={14} />
                                                ) : (
                                                    <Pencil size={18} />
                                                )}
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm leading-tight">
                                                    {t(`syllabus.${item.id}`)}
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-6 flex justify-end">
                        <button
                            onClick={handleLogout}
                            className="flex cursor-pointer items-center justify-center gap-2 p-3 rounded-xl dark:hover:bg-red-500/10 transition-all font-bold text-sm tracking-wider"
                        >
                            <LogOut size={18} />
                            {t('sidebar.logout')}
                        </button>
                    </div>
                </aside>

                <main className="flex-1 lg:pl-72 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlug}
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <div className="max-w-7xl mx-auto pt-12 px-6">
                                {currentIndex >= 0 && (
                                    <HeaderLesson
                                        step={currentSyllabus.step}
                                        id={currentSyllabus?.id}
                                        t={t}
                                    />
                                )}
                                {children}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </main>


                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="fixed bottom-25 right-6 lg:hidden bg-secondary text-white p-4 rounded-full shadow-2xl z-50"
                >
                    <Menu />
                </button>
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 z-30 lg:hidden backdrop-blur-sm"
                        />
                    )}
                </AnimatePresence>
            </div>
        </ThemeProvider>
    );
}