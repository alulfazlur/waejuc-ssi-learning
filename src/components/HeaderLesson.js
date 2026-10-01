export default function HeaderLesson({
    step = "",
    id = "",
    t,
}) {
    return (
        <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t(`syllabus.${id}`)}
            </h1>
            {(step == 4 || step == 5) &&
                <p className="mt-2 font-heading text-xl font-medium italic text-secondary">
                    ({t(`syllabus.${id}_subtitle`)})
                </p>
            }
        </header>
    );
}
