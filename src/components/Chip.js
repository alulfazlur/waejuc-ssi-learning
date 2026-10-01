export default function Chip({ icon: Icon, className = "", children }) {
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-surface-subtle px-2.5 py-1 font-mono text-xs font-medium text-secondary ${className}`}>
            {Icon && <Icon size={12} aria-hidden="true" />}
            {children}
        </span>
    );
}
