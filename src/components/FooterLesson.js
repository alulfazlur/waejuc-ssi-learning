import Button from "@components/Button";

export default function FooterLesson({
    description = "",
    flex = "default"
}) {
    
    const flexProps = {
        default: "flex-col lg:flex-row",
        row: "flex-row",
        column: "flex-col",
    };

    return (
        <div className={`my-8 flex ${flexProps[flex]} gap-4 justify-between items-center`}>
            <p className="text-xs text-primary/90 italic">
                *{description}
            </p>
            <Button>
                Simpan & Lanjut
            </Button>
        </div>
    );
}