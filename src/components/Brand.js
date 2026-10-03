import Link from "next/link";

// Same artwork as src/app/icon.svg, inlined so it ships with the bundle.
function Logo() {
    return (
        <svg viewBox="0 0 64 64" className="h-8 w-8 shrink-0" aria-hidden="true">
            <rect width="64" height="64" rx="14" fill="#083a4f" />
            <path d="M10 25c5.5 0 5.5-6 11-6s5.5 6 11 6 5.5-6 11-6 5.5 6 11 6" fill="none" stroke="#ffffff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 39c5.5 0 5.5-6 11-6s5.5 6 11 6 5.5-6 11-6 5.5 6 11 6" fill="none" stroke="#86c6d1" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="22" cy="51" r="3.2" fill="#c9b08a" />
            <circle cx="34" cy="53" r="2.4" fill="#c9b08a" />
            <circle cx="44" cy="50.5" r="2" fill="#c9b08a" />
        </svg>
    );
}

export default function Brand({ href = "/", onClick, className = "" }) {
    const content = (
        <span className="flex items-center gap-2.5">
            <Logo />
            <span className="font-heading text-lg font-bold tracking-tight">
                WAVES<span className="font-semibold opacity-70">-SSI</span>
            </span>
        </span>
    );

    if (onClick) {
        return (
            <button type="button" onClick={onClick} className={`cursor-pointer ${className}`}>
                {content}
            </button>
        );
    }

    return <Link href={href} className={className}>{content}</Link>;
}
