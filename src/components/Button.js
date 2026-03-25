import Link from "next/link";

export default function Button({
    color = "primary",
    size = "md",
    children,
    href,
    disabled = false,
    className = "",
    ...props
}) {
    const colors = {
        primary: "bg-primary text-background hover:bg-primary/90",
        secondary: "bg-secondary text-background hover:bg-primary/90",
        outline: "border-1 border-primary/20 text-primary hover:bg-primary/5",
        ghost: "bg-transparent text-primary hover:bg-primary/10 shadow-none hover:shadow-none",
        white: "bg-background text-primary hover:bg-background/90 shadow-none hover:shadow-none",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-8 py-3 text-background",
        lg: "px-10 py-4 text-lg",
    };

    const baseClass = `
        ${colors[color] || colors.primary} 
        ${sizes[size]} 
        rounded-full font-bold ${disabled ? "cursor-not-allowed" : "cursor-pointer"} 
        transition-all duration-300 ease-out
        flex items-center justify-center gap-2
        ${disabled ? "" : "hover:-translate-y-1 hover:shadow-xl"}
        ${disabled ? "" : "active:scale-95 active:translate-y-0"}
        shadow-lg
        ${className}
    `;

    if (href) {
        return (
            <Link href={href} className={baseClass} {...props}>
                {children || 'Link'}
            </Link>
        );
    }

    return (
        <button
            className={baseClass}
            disabled={disabled}
            {...props}
        >
            {children || 'Click'}
        </button>
    );
}