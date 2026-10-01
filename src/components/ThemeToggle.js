"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ThemeToggle({ className = "" }) {
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const base = `flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${className}`;

    if (!mounted) {
        return <span className={base} aria-hidden="true" />;
    }

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`${base} cursor-pointer hover:bg-current/10`}
            aria-label={isDark ? t('common.theme_light') : t('common.theme_dark')}
            title={isDark ? t('common.theme_light') : t('common.theme_dark')}
        >
            {isDark ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
        </button>
    );
}
