"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ colorClass = "text-foreground", backgroundClass = "bg-primary" }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) {
        return (
            <button
                className={`p-2 rounded-xl ${backgroundClass} flex items-center justify-center`}
                aria-hidden="true"
            >
                <div className="w-5 h-5" />
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`relative p-2 rounded-xl ${backgroundClass} transition-colors cursor-pointer overflow-hidden flex items-center justify-center`}
            aria-label="Toggle Theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                    <motion.span
                        key="moon"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="flex items-center"
                    >
                        <Moon size={20} className={colorClass} />
                    </motion.span>
                ) : (
                    <motion.span
                        key="sun"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="flex items-center"
                    >
                        <Sun size={20} className={colorClass} />
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
}