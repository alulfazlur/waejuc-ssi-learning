export default function HeaderLesson({
    step = "",
    id = "",
    t,
}) {
    return (
        <>
            <div className="mb-8">
                <div className="flex items-start gap-3">
                    <div className="flex items-baseline gap-2 text-background font-medium mb-4">
                        <span className="bg-primary rounded-full px-2 py-0.5 text-sm">{step}</span>
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            {t(`syllabus.${id}`)}
                        </h1>
                        {step >= 4 &&
                            <h2 className="text-2xl font-medium tracking-tight italic mt-2">
                               ({t(`syllabus.${id}_subtitle`)})
                            </h2>
                        }
                    </div>
                </div>
                <div className="h-1 w-20 bg-secondary rounded-full my-4" />
            </div>
        </>
    );
}