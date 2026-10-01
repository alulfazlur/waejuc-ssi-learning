import Link from "next/link";

export default function Brand({ href = "/", onClick, className = "" }) {
    const content = (
        <span className="font-heading text-lg font-bold tracking-tight">
            WAVES<span className="font-semibold opacity-70">-SSI</span>
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
