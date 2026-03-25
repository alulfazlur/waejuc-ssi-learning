export default function HeaderLesson({
    step = "",
    level = "",
    title = "",
    description = "",
}) {
    return (
        <>
            <div className="mb-8">
                <div className="flex items-baseline gap-2 text-secondary dark:text-primary font-medium mb-4">
                    <span className="bg-primary/20 rounded-full px-2 py-0.5 text-xs">{step}</span>
                    {!!level &&
                        <>
                            <span className="text-muted-foreground">•</span>
                            <i className="text-xs">{level}</i>
                        </>}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 italic">
                    {title}
                </h1>
                <div className="h-1 w-20 bg-secondary rounded-full" />
            </div>
            <p className="mb-4 text-secondary">{description}</p>
        </>
    );
}