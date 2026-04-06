import { MessageSquareQuote } from "lucide-react";

export default function Instruction({
    title = "Instruksi",
    description = "",
    icon: Icon = MessageSquareQuote
}) {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
                <Icon className="text-primary shrink-0" size={24} />
                <h3 className="text-xl text-primary font-bold">{title}</h3>
            </div>
            <p className="text-secondary text-[15px] dark:text-primary/80">
                {description}
            </p>
        </div>
    );
}