"use client";
import { Paperclip } from "lucide-react";
import { useTranslation } from "react-i18next";
import Chip from "@components/Chip";

// Prompt text for a follow-up question inside a QuestionCard.
export default function Instruction({
    title = "",
    description = "",
    refs,
    icon: Icon,
}) {
    const { t } = useTranslation();

    return (
        <div className="mb-3">
            {(Icon || title) &&
                <div className="mb-2 flex items-center gap-3">
                    {Icon && <Icon className="shrink-0 text-secondary" size={20} aria-hidden="true" />}
                    {title && <h3 className="text-base font-semibold">{title}</h3>}
                </div>
            }
            {description && (
                <p className="text-[15px] leading-relaxed text-primary/90">{description}</p>
            )}
            {refs && (
                <Chip icon={Paperclip} className="mt-2">{`${t('common.reference')} ${refs}`}</Chip>
            )}
        </div>
    );
}
