import { useController } from "react-hook-form";

export default function Input({
    placeholder = "",
    name = "",
    errors,
    control,
    error: errorProp,
    ...other
}) {
    const {
        field: { value, onChange, onBlur, ref },
    } = useController({ name, control, defaultValue: "" });

    const error = errorProp || errors?.[name];

    return (
        <>
            <div className="relative w-full">
                <input
                    {...other}
                    ref={ref}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`w-full bg-background dark:bg-primary text-primary dark:text-background border
                        ${error ? "border-red-500" : "border-secondary/50"}
                        rounded-lg p-2 outline-none transition-all pr-12`}
                />
            </div>
            {error && (
                <p className="text-red-500 text-[11px] mt-1">{error.message}</p>
            )}
        </>
    );
}