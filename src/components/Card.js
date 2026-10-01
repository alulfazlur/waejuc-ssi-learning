export default function Card({ as: Tag = "div", className = "", children, ...props }) {
    return (
        <Tag className={`rounded-[20px] bg-card shadow-card ${className}`} {...props}>
            {children}
        </Tag>
    );
}
