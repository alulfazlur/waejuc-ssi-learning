"use client";
import { useState, useRef, useEffect } from "react";
import { useWatch, Controller } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Select({
    name,
    control,
    options = [],
    placeholder = "Pilih opsi...",
    errors,
    error: errorProps
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    
    const currentValue = useWatch({ control, name });
    const selectedOption = options.find(opt => opt.value === currentValue);

    const error = errorProps || (errors && errors[name]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={containerRef}>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange } }) => (
                    <>
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className={`w-full flex items-center justify-between bg-background dark:bg-primary text-primary dark:text-background border rounded-lg p-2 transition-all outline-none
                                ${error ? "border-red-500" : "border-secondary/50 focus:border-primary"}
                                ${isOpen ? "ring-2 ring-primary/10" : ""}`}
                        >
                            <span className={`text-sm ${!selectedOption ? "opacity-50" : ""}`}>
                                {selectedOption ? selectedOption.label : placeholder}
                            </span>
                            <ChevronDown 
                                size={16} 
                                className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
                            />
                        </button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 4 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute z-50 w-full bg-background dark:bg-secondary border border-border rounded-xl shadow-xl overflow-hidden"
                                >
                                    <div className="max-h-60 overflow-y-auto p-1 space-y-1">
                                        {options.map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() => {
                                                    onChange(option.value);
                                                    setIsOpen(false);
                                                }}
                                                className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors
                                                    ${currentValue === option.value 
                                                        ? "bg-primary text-background font-medium" 
                                                        : "hover:bg-primary/10 text-primary"}`}
                                            >
                                                {option.label}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            />
             {error && (
                <p className="text-red-500 text-[11px] mt-1">{error.message}</p>
            )}
        </div>
    );
}