import { ClipboardList } from "lucide-react";

export default function Callout({ icon: Icon = ClipboardList, label, children, className = "" }) {
    return (
        <div className={`flex gap-3 rounded-2xl border border-tertiary/70 dark:border-border bg-surface-subtle p-4 text-[15px] leading-relaxed text-primary ${className}`}>
            <Icon size={20} className="mt-0.5 shrink-0 text-secondary" aria-hidden="true" />
            <div className="min-w-0 flex-1">
                {label && <b>{`${label}: `}</b>}
                {children}
            </div>
        </div>
    );
}
