"use client";
import Link from "next/link";
import { Check, Lock, FileText, ExternalLink, FileDown, LogOut, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@context/AuthContext";
import { SYLLABUS } from "@constants/syllabus";
import Brand from "@components/Brand";
import { useLessonActions, MATERIAL_URL } from "./useLessonActions";

export const getProgress = (maxStep) => {
    const total = SYLLABUS.length;
    const completed = SYLLABUS.filter(s => maxStep > s.step).length;
    return { total, completed, percent: Math.min(100, Math.round((completed / total) * 100)) };
};

const accountId = (user) => user?.email?.split("@")[0] ?? "";

export default function Sidebar({ currentSlug, onNavigate, onClose }) {
    const { t } = useTranslation();
    const { maxStep, user } = useAuth();
    const { isExporting, handleExport, handleLogout } = useLessonActions();
    const { total, completed, percent } = getProgress(maxStep);

    return (
        <div className="flex h-full flex-col bg-card text-primary">
            <div className="flex items-center justify-between px-5 pb-4 pt-5">
                <Brand />
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t('common.close')}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-muted hover:bg-surface-subtle"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                )}
            </div>

            <div className="px-5 pb-5">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                    <span>{t('sidebar.progress_overview')}</span>
                    <span className="font-mono font-medium text-muted tabular-nums">{completed}/{total} · {percent}%</span>
                </div>
                <div
                    className="h-1.5 overflow-hidden rounded-full bg-surface-subtle"
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={t('sidebar.progress_overview')}
                >
                    <div className="h-full rounded-full bg-secondary transition-[width] duration-700" style={{ width: `${percent}%` }} />
                </div>
            </div>

            <nav aria-label={t('sidebar.progress_title')} className="flex-1 overflow-y-auto px-3">
                <p className="mb-2 px-2 font-mono text-[11px] font-medium uppercase tracking-widest text-muted">
                    {t('sidebar.progress_title')}
                </p>
                <ol className="space-y-0.5">
                    {SYLLABUS.map((item) => {
                        const isCompleted = maxStep > item.step;
                        const isActive = currentSlug === item.id;
                        const isLocked = item.step > maxStep;
                        const label = t(`syllabus.${item.id}`);

                        const dot = (
                            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium
                                ${isActive ? "bg-primary text-background"
                                    : isCompleted ? "bg-secondary text-background"
                                        : "bg-surface-subtle text-muted"}`}
                            >
                                {isCompleted && !isActive ? <Check size={14} strokeWidth={3} aria-hidden="true" />
                                    : isLocked ? <Lock size={12} aria-hidden="true" />
                                        : item.step}
                            </span>
                        );

                        const rowClass = "flex min-h-11 items-center gap-3 rounded-xl px-2.5 py-2 text-sm";

                        return (
                            <li key={item.id}>
                                {isLocked ? (
                                    <span aria-disabled="true" className={`${rowClass} cursor-not-allowed text-muted`}>
                                        {dot}
                                        <span>{label}</span>
                                        <span className="sr-only">{t('sidebar.locked')}</span>
                                    </span>
                                ) : (
                                    <Link
                                        href={`/learning/${item.id}`}
                                        onClick={onNavigate}
                                        aria-current={isActive ? "step" : undefined}
                                        className={`${rowClass} transition-colors ${isActive
                                            ? "bg-surface-subtle font-semibold shadow-[inset_3px_0_0_var(--primary)]"
                                            : "hover:bg-surface-subtle"}`}
                                    >
                                        {dot}
                                        <span>{label}</span>
                                        {isCompleted && !isActive && <span className="sr-only">{t('sidebar.completed')}</span>}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>

            <div className="space-y-1 px-3 pb-3 pt-4">
                <p className="mb-1 px-2 font-mono text-[11px] font-medium uppercase tracking-widest text-muted">
                    {t('sidebar.resources')}
                </p>
                <a
                    href={MATERIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 text-sm font-medium hover:bg-surface-subtle"
                >
                    <span className="flex items-center gap-2.5">
                        <FileText size={17} className="text-secondary" aria-hidden="true" />
                        {t('sidebar.material_btn')}
                    </span>
                    <ExternalLink size={14} className="text-muted" aria-hidden="true" />
                    <span className="sr-only">{t('common.opens_new_tab')}</span>
                </a>
                <button
                    type="button"
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 text-sm font-medium hover:bg-surface-subtle disabled:cursor-wait disabled:opacity-60"
                >
                    <span className="flex items-center gap-2.5">
                        <FileDown size={17} className={`text-secondary ${isExporting ? "animate-pulse" : ""}`} aria-hidden="true" />
                        {isExporting ? t('sidebar.exporting') : t('sidebar.export_btn')}
                    </span>
                    <span className="rounded bg-surface-subtle px-1.5 py-0.5 font-mono text-[11px] text-muted">PDF</span>
                </button>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
                <div className="min-w-0">
                    <p className="truncate font-mono text-sm font-medium">{accountId(user)}</p>
                    <p className="text-xs text-muted">{t('sidebar.account')}</p>
                </div>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex min-h-10 cursor-pointer items-center gap-2 rounded-xl px-3 text-sm font-semibold text-danger hover:bg-danger/10"
                >
                    <LogOut size={16} aria-hidden="true" />
                    {t('sidebar.logout')}
                </button>
            </div>
        </div>
    );
}
