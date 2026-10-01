"use client";
import { CheckCircle2, Paperclip } from "lucide-react";
import { useTranslation } from "react-i18next";
import Card from "@components/Card";
import Chip from "@components/Chip";
import { useFieldsFilled } from "@features/lessons/FilledFieldsContext";

export default function QuestionCard({
    number,
    title,
    description,
    refs,
    icon: Icon,
    fields = [],
    className = "",
    children,
}) {
    const { t } = useTranslation();
    const isFilled = useFieldsFilled(fields);

    return (
        <Card as="section" className={`p-5 sm:p-6 ${className}`}>
            <div className="flex items-start gap-3 sm:gap-4">
                {number != null ? (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-primary font-mono text-sm font-medium text-background">
                        {number}
                    </span>
                ) : Icon ? (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-surface-subtle text-secondary">
                        <Icon size={18} aria-hidden="true" />
                    </span>
                ) : null}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                        {title && <h2 className="text-lg font-semibold leading-snug sm:text-xl">{title}</h2>}
                        {fields.length > 0 && isFilled && (
                            <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-secondary">
                                <CheckCircle2 size={15} aria-hidden="true" />
                                {t('lesson.answered')}
                            </span>
                        )}
                    </div>
                    {description && (
                        <div className="mt-1.5 text-[15px] leading-relaxed text-primary/90">{description}</div>
                    )}
                    {refs && (
                        <Chip icon={Paperclip} className="mt-2.5">{`${t('common.reference')} ${refs}`}</Chip>
                    )}
                </div>
            </div>
            {children && <div className="mt-5 space-y-6">{children}</div>}
        </Card>
    );
}
