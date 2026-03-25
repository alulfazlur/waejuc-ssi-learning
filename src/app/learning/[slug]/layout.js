"use client";
import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, BookOpen, Check, Lock, Pencil } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import Link from "next/link";

import { useAuth } from "@context/AuthContext";

import ThemeToggle from '@components/ThemeToggle'
import HeaderLesson from "@components/HeaderLesson";


const syllabus = [
    {
        id: "perspective-gallery",
        step: 1,
        title: "Perspective Gallery",
        page_title: <>Navigasi &quot;Tiga Sudut Pandang <i>(Perspective Gallery)</i>&quot;</>,
        description: "Dengarkan kesaksian para stakeholder untuk memahami akar masalah."
    },
    {
        id: "360-explore",
        step: 2,
        title: "ZONE 360",
        level: "Identifying Components & Properties",
        description: "Gunakan kursor atau sensor gerak HP-mu untuk menjelajahi area TPI Puger."

    },
    {
        id: "ar-lab",
        step: 3,
        title: "MICRO-LAB AR",
        level: "Mechanistic Reasoning",
        description: "Gunakan modul AR untuk membedah mekanisme mikroplastik."
    },
    {
        id: "system-map",
        step: 4,
        title: "System Map",
    },
    {
        id: "action",
        step: 5,
        title: "Action",
    },
];

export default function LearningLayout({ params: paramsPromise, children }) {
    const { theme } = useTheme();

    const params = use(paramsPromise);
    const currentSlug = params.slug;

    const { maxStep, loading } = useAuth();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const currentIndex = syllabus.findIndex(s => s.id === currentSlug);
    const currentSyllabus = syllabus[currentIndex] || {};

    const colorClass = theme === "dark" ? "text-primary" : "text-background";

    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <div className="flex min-h-screen bg-background text-foreground">
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
                                <p className="text-sm font-mono animate-pulse text-primary">Mengambil Data Peneliti...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-tertiary dark:bg-secondary border-r border-border dark:border-primary/20 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

                    <div className="p-6 flex justify-end">
                        <ThemeToggle colorClass={colorClass} />
                    </div>

                    <div className="p-6 pt-5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-secondary dark:text-primary mb-8 flex items-center gap-2">
                            <BookOpen size={18} /> Progres Misi
                        </h3>

                        <div className="relative space-y-0">
                            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-border dark:bg-slate-800 z-0" />

                            {syllabus.map((item) => {
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
                                                <span className={`text-xs font-medium uppercase tracking-tighter opacity-60 ${isActive ? "text-background" : ""}`}>
                                                    Progres {item.step}
                                                </span>
                                                <span className="font-bold text-sm leading-tight">
                                                    {item.title}
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                <main className="flex-1 lg:pl-72 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlug}
                            initial={{ opacity: 0, y: -100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <div className="max-w-7xl mx-auto pt-12 px-6 mb-10 lg:mb-0">

                                <HeaderLesson
                                    step={currentSyllabus.step}
                                    level={currentSyllabus.level}
                                    title={currentSyllabus.page_title || currentSyllabus.title}
                                    description={currentSyllabus.description}
                                />
                                {children}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </main>


                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="fixed bottom-6 right-6 lg:hidden bg-secondary text-white p-4 rounded-full shadow-2xl z-50"
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