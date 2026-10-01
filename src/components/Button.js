import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function Button({
    color = "primary",
    size = "md",
    children,
    href,
    disabled = false,
    loading = false,
    className = "",
    ...props
}) {
    const colors = {
        primary: "bg-primary text-background hover:bg-primary/90",
        secondary: "bg-secondary text-background hover:bg-secondary/90",
        outline: "bg-card text-primary ring-[1.5px] ring-inset ring-input hover:bg-surface-subtle",
        ghost: "bg-transparent text-secondary hover:bg-surface-subtle",
        white: "bg-background text-primary hover:bg-background/90",
        danger: "bg-transparent text-danger hover:bg-danger/10",
    };

    const sizes = {
        sm: "min-h-10 px-4 py-2 text-sm",
        md: "min-h-11 px-6 py-2.5 text-[15px]",
        lg: "min-h-12 px-8 py-3 text-base",
    };

    const isDisabled = disabled || loading;

    const baseClass = `
        ${colors[color] || colors.primary}
        ${sizes[size] || sizes.md}
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-colors duration-200 select-none
        ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer active:scale-[0.98]"}
        ${className}
    `;

    const content = (
        <>
            {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            {children}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={baseClass} {...props}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            className={baseClass}
            disabled={isDisabled}
            aria-busy={loading || undefined}
            {...props}
        >
            {content}
        </button>
    );
}
