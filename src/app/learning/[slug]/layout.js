"use client";
import { useState, use, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, BookOpen, Check, Lock, Pencil, LogOut, FileText, ExternalLink, TrendingUp } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useAuth } from "@context/AuthContext";
import { SYLLABUS } from "@constants/syllabus";

import ThemeToggle from '@components/ThemeToggle';
import LanguageToggle from '@components/LanguageToggle';
import HeaderLesson from "@components/HeaderLesson";

const MATERIAL_URL = "https://drive.google.com/drive/folders/1WQWxrB1EAxhhXoZL-qx5zgb7o6eQBvTn?usp=sharing";

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

    // ===== Progress calculation =====
    const totalCount = SYLLABUS.length;
    const completedCount = SYLLABUS.filter(s => maxStep > s.step).length;
    const progressPercent = Math.min(100, Math.round((completedCount / totalCount) * 100));
    const isAllCompleted = progressPercent === 100;

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    useEffect(() => {
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    flex flex-col
                    `}>

                    {/* Top: theme + language */}
                    <div className="flex justify-between items-center p-6 pb-4 shrink-0">
                        <ThemeToggle colorClass={colorClass} />
                        <LanguageToggle />
                    </div>

                    {/* Progress Overview */}
                    <div className="px-6 pb-3 shrink-0">
                        <div className="rounded-2xl bg-background/40 dark:bg-primary/10 border border-secondary/15 dark:border-primary/15 p-4 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-secondary dark:text-primary">
                                    <TrendingUp size={14} />
                                    <span className="text-[11px] font-bold uppercase tracking-widest">
                                        {t('sidebar.progress_overview')}
                                    </span>
                                </div>
                                <span className="text-[11px] font-mono text-secondary dark:text-primary opacity-70 tabular-nums">
                                    {completedCount}/{totalCount}
                                </span>
                            </div>

                            <div className="flex items-end justify-between mb-3">
                                <div className="flex items-baseline gap-1 text-secondary dark:text-primary">
                                    <span className="text-3xl font-bold tabular-nums leading-none">
                                        {progressPercent}
                                    </span>
                                    <span className="text-base font-semibold opacity-60">%</span>
                                </div>
                                {isAllCompleted && (
                                    <motion.span
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                                        className="text-base"
                                        aria-label="completed"
                                    >
                                        🎉
                                    </motion.span>
                                )}
                            </div>

                            <div className="h-2 bg-secondary/15 dark:bg-primary/15 rounded-full overflow-hidden">
                                <motion.div
                                    key={progressPercent}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="h-full bg-linear-to-r from-secondary to-primary dark:from-tertiary dark:to-primary rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Material Link */}
                    <div className="px-6 pb-4 shrink-0">
                        <motion.a
                            href={MATERIAL_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-between gap-3 p-3 rounded-xl
                                bg-primary text-background
                                shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30
                                font-bold text-sm
                                transition-shadow"
                        >
                            <span className="flex items-center gap-2">
                                <FileText size={16} />
                                {t('sidebar.material_btn')}
                            </span>
                            <ExternalLink size={14} className="opacity-70" />
                        </motion.a>
                    </div>

                    {/* Syllabus list - scrollable */}
                    <div className="px-6 pt-2 flex-1 overflow-y-auto">
                        <h3 className="text-sm font-bold tracking-wide text-secondary dark:text-primary mb-6 flex items-center gap-2">
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

                    {/* Logout */}
                    <div className="p-6 pt-3 shrink-0 border-t border-secondary/15 dark:border-primary/10">
                        <button
                            onClick={handleLogout}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 p-3 rounded-xl
                                hover:bg-red-500/10 hover:text-red-500
                                dark:hover:bg-red-500/10 dark:hover:text-red-400
                                transition-all font-bold text-sm tracking-wider"
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