"use client";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
    { code: "id", label: "ID", name: "Bahasa Indonesia" },
    { code: "en", label: "EN", name: "English" },
];

export default function LanguageToggle({ className = "" }) {
    const { i18n, t } = useTranslation();
    const currentLang = i18n.language?.split('-')[0] || "id";

    return (
        <div
            role="group"
            aria-label={t('common.language')}
            className={`flex items-center gap-0.5 rounded-xl p-1 ring-1 ring-inset ring-current/20 ${className}`}
        >
            {LANGUAGES.map((lang) => {
                const isActive = currentLang === lang.code;
                return (
                    <button
                        key={lang.code}
                        type="button"
                        lang={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        aria-pressed={isActive}
                        aria-label={lang.name}
                        className={`min-h-8 min-w-10 cursor-pointer rounded-lg px-2.5 font-mono text-xs font-medium tracking-wider transition-colors
                            ${isActive ? "bg-current/15" : "opacity-60 hover:opacity-100"}`}
                    >
                        {lang.label}
                    </button>
                );
            })}
        </div>
    );
}
