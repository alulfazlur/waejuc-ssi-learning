import { useWatch } from "react-hook-form";

export default function TextArea({
    placeholder = "",
    name = "",
    errors,
    control,
    ...other
}) {
    const value = useWatch({
        control,
        name,
    }) || '';
    const charCount = value?.length || 0;
    const error = errors[name]
    return (
        <>
            <div className="relative w-full">
                <textarea
                    {...other}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    className={`w-full h-40 bg-background border
                    ${error ? "border-red-500" : "border-primary"}
                    rounded-lg p-3 outline-none transition-all text-primary resize-none pr-12`}
                />
                <div className={`absolute bottom-3 right-3 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border 
                ${error ? "bg-red-50 text-red-500 border-red-200" : "bg-primary/10 text-primary border-primary/20"}`}
                >
                    {charCount} chars
                </div>
            </div>
            {error && (
                <p className="text-red-500 text-xs italic">{error.message}</p>
            )}
        </>
    );
}