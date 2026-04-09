export default function Input({
    placeholder = "",
    name = "",
    errors,
    error: errorProps,
    value,
    ...other
}) {
    const error = errorProps || (errors && errors[name])
    return (
        <>
            <div className="relative w-full">
                <input
                    {...other}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    className={`w-full bg-background dark:bg-primary text-primary dark:text-background border
                        ${error ? "border-red-500" : "border-secondary/50"}
                        rounded-lg p-2 outline-none transition-all resize-none pr-12`}
                />
            </div>
            {error && (
                <p className="text-red-500 text-[11px] mt-1">{error.message}</p>
            )}
        </>
    );
}