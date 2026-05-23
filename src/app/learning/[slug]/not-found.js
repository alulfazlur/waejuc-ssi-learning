"use client";

import Link from "next/link";
import { AlertTriangle, Home } from "lucide-react";
import { SYLLABUS } from "@constants/syllabus";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
            >
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 rotate-3">
                    <AlertTriangle size={48} />
                </div>

                <h2 className="text-3xl md:text-4xl font-black mb-3 text-primary uppercase tracking-tight">
                    {t('error.phase_not_found')}
                </h2>

                <p className="text-secondary/60 max-w-md mb-10 leading-relaxed italic">
                    &quot;{t('error.phase_not_found_desc')}&quot;
                </p>

                <Link
                    href={`/learning/${SYLLABUS[0].id}`}
                    className="group flex items-center gap-3 px-8 py-4 bg-primary text-background rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95"
                >
                    <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                    {t('common.back')}
                </Link>
            </motion.div>
        </div>
    );
}