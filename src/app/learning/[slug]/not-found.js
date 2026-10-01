"use client";

import { AlertTriangle, Home } from "lucide-react";
import { SYLLABUS } from "@constants/syllabus";
import { useTranslation } from "react-i18next";
import Button from "@components/Button";

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
            <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-subtle text-secondary">
                <AlertTriangle size={32} aria-hidden="true" />
            </span>

            <h2 className="mb-3 text-3xl font-bold tracking-tight">
                {t('error.phase_not_found')}
            </h2>

            <p className="mb-8 max-w-md leading-relaxed text-muted">
                {t('error.phase_not_found_desc')}
            </p>

            <Button href={`/learning/${SYLLABUS[0].id}`}>
                <Home size={18} aria-hidden="true" />
                {t('common.back')}
            </Button>
        </div>
    );
}
