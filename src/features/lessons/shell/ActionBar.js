"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "@components/Button";
import AutosaveStatus from "./AutosaveStatus";

export default function ActionBar({ prevHref, onSubmit, submitting, filledCount, totalCount, status }) {
    const { t } = useTranslation();

    return (
        <div className="sticky bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 mt-10">
            <div className="flex items-center gap-3 rounded-2xl bg-card/95 p-2 shadow-card ring-1 ring-border backdrop-blur supports-[backdrop-filter]:bg-card/85 sm:p-2.5">
                {prevHref ? (
                    <Button href={prevHref} color="outline" aria-label={t('lesson.previous')} className="shrink-0 px-3.5 sm:px-5">
                        <ArrowLeft size={18} aria-hidden="true" />
                        <span className="hidden sm:inline">{t('lesson.previous')}</span>
                    </Button>
                ) : <span className="hidden sm:block sm:w-2" />}

                <div className="min-w-0 flex-1 text-center">
                    <p className="hidden text-sm text-muted sm:block">
                        {t('lesson.filled_count', { filled: filledCount, total: totalCount })}
                    </p>
                    <AutosaveStatus status={status} className="sm:hidden" />
                </div>

                <Button
                    type="submit"
                    onClick={onSubmit}
                    loading={submitting}
                    className="shrink-0"
                >
                    {t('lesson.submit_next')}
                    {!submitting && <ArrowRight size={18} aria-hidden="true" />}
                </Button>
            </div>
        </div>
    );
}
