"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { useAuth } from "@context/AuthContext";

import ThemeToggle from '@components/ThemeToggle'
import LanguageToggle from '@components/LanguageToggle'

const LayoutContext = createContext();

export default function MarketingLayout({ children }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { setLoading } = useAuth();

    const colorClass = `text-primary dark:${isScrolled ? 'text-primary' : 'text-background'}`;
    const backgroundClass = `bg-background dark:${isScrolled ? 'bg-background' : 'bg-primary'}`;

    const scrollToId = (id = '') => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsOpen(false)
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        handleScroll();
        setLoading(false)

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
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
                    <div className="flex-1 lg:w-1/4">
                        <button className="font-bold text-xl tracking-tight cursor-pointer" onClick={() => scrollToId('hero')}>
                            Waejuc-SSI
                        </button>
                    </div>

                    <div className="flex gap-2 items-center">
                        <ThemeToggle colorClass={colorClass} backgroundClass={backgroundClass} />
                        <LanguageToggle />
                    </div>
                </nav>

                <main>{children}</main>

                <footer className="text-background dark:text-primary font-bold bg-quaternary dark:bg-secondary py-10 border-t border-white/10 text-center text-sm">
                    &copy; 2026 E-Learning Platform.
                </footer>
            </LayoutContext.Provider>
        </ThemeProvider>
    );
}

export const useLayout = () => useContext(LayoutContext);
