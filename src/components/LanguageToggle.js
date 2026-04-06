"use client";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function LanguageToggle({ 
    colorClass = "text-primary", 
    backgroundClass = "bg-background" 
}) {
    const { i18n } = useTranslation();
    const currentLang = i18n.language?.split('-')[0] || "id";

    const languages = [
        { code: "id", label: "ID" },
        { code: "en", label: "EN" },
    ];

    return (
        <div className={`flex items-center p-1 rounded-2xl border border-white/10 shadow-inner relative z-0 transition-colors duration-200 ${backgroundClass}`}>
            <div className="flex relative">
                {languages.map((lang) => {
                    const isActive = currentLang === lang.code;

                    return (
                        <button
                            key={lang.code}
                            onClick={() => i18n.changeLanguage(lang.code)}
                            
                            className={`
                                cursor-pointer relative px-4 py-1.5 rounded-lg text-[11px] font-black tracking-widest
                                transition-colors duration-300 flex items-center justify-center min-w-11.25
                                ${isActive 
                                    ? "text-background" 
                                    : colorClass + " opacity-40 hover:opacity-100"
                                }
                            `}
                        >
                            <span className="relative z-10 uppercase">{lang.label}</span>

                            {isActive ? (
                                <motion.div
                                    layoutId="activeLanguageTab"
                                    className="absolute inset-0 bg-primary shadow-md rounded-xl"
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 35
                                    }}
                                />
                            ): <div />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}