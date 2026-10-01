import { AlertCircle } from "lucide-react";

export default function FieldError({ id, message, className = "" }) {
    if (!message) return null;
    return (
        <p id={id} role="alert" className={`mt-1.5 flex items-start gap-1.5 text-[13px] font-medium text-danger ${className}`}>
            <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{message}</span>
        </p>
    );
}
