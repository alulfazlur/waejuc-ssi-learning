"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";

import ThemeToggle from '@components/ThemeToggle'

const LayoutContext = createContext();

export default function MarketingLayout({ children }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const colorClass = `text-primary dark:${isScrolled ? 'text-primary' : 'text-background'}`;
    const backgroundClass = `bg-background dark:${isScrolled ? 'bg-background' : 'bg-primary'}`;

    const scrollToId = (id = '') => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsOpen(false)
    };

    const navMenu = [
        { id: "objectives", label: "Objectives" },
        { id: "flow", label: "Flow" },
    ]

    useEffect(() => {
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
    }, []);


    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LayoutContext.Provider value={{ scrollToId, isScrolled }}>
                <nav
                    className={`
                        fixed top-0 left-0 right-0 z-60 px-6 py-4 flex justify-between lg:justify-normal items-center duration-200
                        ${isOpen
                            ? "bg-primary backdrop-blur-md border-b border-white/10 shadow-lg text-background"
                            : isScrolled
                                ? "bg-primary/75 dark:bg-primary/90 backdrop-blur-md border-b border-white/10 shadow-lg text-background"
                                : "bg-transparent border-b border-slate-300/10 text-background dark:text-primary"
                        }
            `}
                >
                    <div className="lg:w-1/4">
                        <button className="font-bold text-xl tracking-tight cursor-pointer" onClick={() => scrollToId('hero')}>
                            Waejuc-SSI
                        </button>
                    </div>

                    <div className="hidden lg:flex flex-1 justify-center gap-8">
                        {navMenu.map(({ id, label }) => (
                            <button
                                key={id}
                                className="text-md font-medium cursor-pointer hover:opacity-70 transition-opacity duration-200"
                                onClick={() => scrollToId(id)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2 lg:hidden items-center">
                        <ThemeToggle colorClass={colorClass} backgroundClass={backgroundClass} />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 focus:outline-none"
                        >
                            <div className="w-6 h-5 relative flex flex-col justify-between">
                                <motion.span
                                    animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                    className={`w-full h-0.5 rounded-full transition-colors ${isScrolled || isOpen ? 'bg-background' : 'bg-primary'}`}
                                />
                                <motion.span
                                    animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                                    className={`w-full h-0.5 rounded-full transition-colors ${isScrolled ? 'bg-background' : 'bg-primary'}`}
                                />
                                <motion.span
                                    animate={isOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }}
                                    className={`w-full h-0.5 rounded-full transition-colors ${isScrolled || isOpen ? 'bg-background' : 'bg-primary'}`}
                                />
                            </div>
                        </button>
                    </div>

                    <div className="hidden lg:flex w-1/4 justify-end">
                        <ThemeToggle colorClass={colorClass} backgroundClass={backgroundClass} />
                    </div>
                </nav>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div
                                initial={{ y: "-100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "-200%" }}
                                transition={{ type: "spring", damping: 50, stiffness: 500 }}
                                style={{ top: 69 }}
                                className="fixed left-0 right-0 bg-primary z-50 shadow-2xl border-b border-white/10 lg:hidden"
                            >
                                <div className="flex flex-col p-8 gap-6">
                                    {navMenu.map(({ id, label }) => (
                                        <button
                                            key={id}
                                            className="text-lg font-semibold text-background text-left py-2 border-b border-white/5 last:border-0"
                                            onClick={() => scrollToId(id)}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <main>{children}</main>

                <footer className="text-background dark:text-primary font-bold bg-quaternary dark:bg-secondary py-10 border-t border-white/10 text-center text-sm">
                    &copy; 2026 E-Learning Platform.
                </footer>
            </LayoutContext.Provider>
        </ThemeProvider>
    );
}

export const useLayout = () => useContext(LayoutContext);
