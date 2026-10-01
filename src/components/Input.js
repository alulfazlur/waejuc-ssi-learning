import { useController } from "react-hook-form";
import { get } from "lodash";
import FieldError from "@components/FieldError";

export const inputClass = (hasError) => `
    w-full min-h-11 rounded-xl border-[1.5px] bg-card px-3.5 py-2.5 text-[15px] text-primary
    placeholder:text-muted/70 outline-none transition-[border-color,box-shadow] duration-150
    focus:border-ring focus:ring-[3px] focus:ring-ring/30
    ${hasError ? "border-danger" : "border-input"}
`;

export default function Input({
    placeholder = "",
    name = "",
    errors,
    control,
    error: errorProp,
    className = "",
    ...other
}) {
    const {
        field: { value, onChange, onBlur, ref },
    } = useController({ name, control, defaultValue: "" });

    const error = errorProp || get(errors, name);
    const errorId = error ? `${name}-error` : undefined;

    return (
        <div className="w-full">
            <input
                {...other}
                ref={ref}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                aria-invalid={!!error || undefined}
                aria-describedby={errorId}
                className={`${inputClass(!!error)} ${className}`}
            />
            <FieldError id={errorId} message={error?.message} />
        </div>
    );
}
