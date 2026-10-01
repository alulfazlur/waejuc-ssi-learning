"use client";
import { CloudOff, Check, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

// Time of day for today's timestamps, otherwise date and time.
export const formatTime = (timestamp, locale) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const isToday = date.toDateString() === new Date().toDateString();
    return new Intl.DateTimeFormat(locale, isToday
        ? { hour: "2-digit", minute: "2-digit" }
        : { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }
    ).format(date);
};

export default function AutosaveStatus({ status, className = "" }) {
    const { t, i18n } = useTranslation();
    if (!status || status.state === "idle") return null;

    const content = {
        saving: { Icon: Loader2, text: t('autosave.saving'), iconClass: "animate-spin" },
        saved: { Icon: Check, text: t('autosave.saved', { time: formatTime(status.savedAt, i18n.language) }) },
        unavailable: { Icon: CloudOff, text: t('autosave.unavailable'), tone: "text-danger" },
    }[status.state];

    if (!content) return null;
    const { Icon, text, iconClass = "", tone = "text-muted" } = content;

    return (
        <span role="status" aria-live="polite" className={`inline-flex items-center gap-1.5 text-xs font-medium ${tone} ${className}`}>
            <Icon size={14} className={iconClass} aria-hidden="true" />
            {text}
        </span>
    );
}
