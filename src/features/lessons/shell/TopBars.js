"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, MoreHorizontal, FileText, FileDown, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import ThemeToggle from "@components/ThemeToggle";
import LanguageToggle from "@components/LanguageToggle";
import { SYLLABUS } from "@constants/syllabus";
import AutosaveStatus from "./AutosaveStatus";
import { useLessonActions, MATERIAL_URL } from "./useLessonActions";

export function DesktopTopBar({ step, saveStatus }) {
    const { t } = useTranslation();
    return (
        <div className="sticky top-0 z-30 hidden h-14 items-center justify-between gap-4 border-b border-border bg-background/85 px-8 backdrop-blur lg:flex">
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
                {step ? t('lesson.step_of', { step, total: SYLLABUS.length }) : ""}
            </p>
            <div className="flex items-center gap-3">
                <AutosaveStatus status={saveStatus} />
                <ThemeToggle />
                <LanguageToggle />
            </div>
        </div>
    );
}

function MobileMenu() {
    const { t } = useTranslation();
    const { isExporting, handleExport } = useLessonActions();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onPointer = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("mousedown", onPointer);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onPointer);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const itemClass = "flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-medium hover:bg-surface-subtle";

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label={t('lesson.more_options')}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl hover:bg-surface-subtle"
            >
                <MoreHorizontal size={20} aria-hidden="true" />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl bg-card p-2 shadow-card ring-1 ring-border"
                    >
                        <div className="flex items-center justify-between px-2 py-1.5">
                            <ThemeToggle />
                            <LanguageToggle />
                        </div>
                        <div className="my-1 h-px bg-border" />
                        <a href={MATERIAL_URL} target="_blank" rel="noopener noreferrer" className={itemClass}>
                            <FileText size={17} className="text-secondary" aria-hidden="true" />
                            <span className="flex-1">{t('sidebar.material_btn')}</span>
                            <ExternalLink size={14} className="text-muted" aria-hidden="true" />
                        </a>
                        <button type="button" onClick={handleExport} disabled={isExporting} className={`${itemClass} disabled:opacity-60`}>
                            <FileDown size={17} className="text-secondary" aria-hidden="true" />
                            <span className="flex-1 text-left">{isExporting ? t('sidebar.exporting') : t('sidebar.export_btn')}</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function MobileTopBar({ step, slug, percent, onOpenNav }) {
    const { t } = useTranslation();
    return (
        <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur lg:hidden">
            <div className="flex h-14 items-center justify-between gap-2 px-2">
                <button
                    type="button"
                    onClick={onOpenNav}
                    aria-label={t('lesson.open_navigation')}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl hover:bg-surface-subtle"
                >
                    <Menu size={20} aria-hidden="true" />
                </button>
                <div className="min-w-0 flex-1 text-center">
                    {step ? (
                        <>
                            <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-muted">
                                {t('lesson.step_of', { step, total: SYLLABUS.length })}
                            </p>
                            <p className="truncate text-sm font-semibold">{t(`syllabus.${slug}`)}</p>
                        </>
                    ) : (
                        <p className="font-heading font-bold">WAVES-SSI</p>
                    )}
                </div>
                <MobileMenu />
            </div>
            <div className="h-1 bg-surface-subtle" aria-hidden="true">
                <div className="h-full bg-secondary transition-[width] duration-700" style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}
