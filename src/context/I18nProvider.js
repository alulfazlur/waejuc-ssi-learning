"use client";
import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import "@i18n/config";
import { I18nextProvider } from "react-i18next";
import i18n from "@i18n/config";

export function I18nProvider({ children }) {
    useEffect(() => {
        const syncLang = (lng) => { document.documentElement.lang = lng?.split("-")[0] || "id"; };
        syncLang(i18n.language);
        i18n.on("languageChanged", syncLang);
        return () => i18n.off("languageChanged", syncLang);
    }, []);

    return (
        <I18nextProvider i18n={i18n}>
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </I18nextProvider>
    );
}
