"use client";
import { useState, useRef, useEffect, useId } from "react";
import { useWatch, Controller } from "react-hook-form";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { get } from "lodash";
import FieldError from "@components/FieldError";

export default function Select({
    name,
    control,
    options = [],
    placeholder = "Pilih opsi...",
    errors,
    error: errorProps
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef(null);
    const listId = useId();

    const currentValue = useWatch({ control, name });
    const selectedIndex = options.findIndex(opt => opt.value === currentValue);
    const selectedOption = options[selectedIndex];

    const error = errorProps || get(errors, name);
    const errorId = error ? `${listId}-error` : undefined;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const open = () => {
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        setIsOpen(true);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, ref } }) => {
                    const choose = (index) => {
                        const option = options[index];
                        if (option) onChange(option.value);
                        setIsOpen(false);
                    };

                    const onKeyDown = (e) => {
                        if (!isOpen && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
                            e.preventDefault();
                            open();
                            return;
                        }
                        if (!isOpen) return;
                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setActiveIndex(i => Math.min(options.length - 1, i + 1));
                        } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setActiveIndex(i => Math.max(0, i - 1));
                        } else if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            choose(activeIndex);
                        } else if (e.key === "Escape" || e.key === "Tab") {
                            setIsOpen(false);
                        }
                    };

                    return (
                        <>
                            <button
                                ref={ref}
                                type="button"
                                role="combobox"
                                aria-haspopup="listbox"
                                aria-expanded={isOpen}
                                aria-controls={listId}
                                aria-activedescendant={isOpen && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
                                aria-invalid={!!error || undefined}
                                aria-describedby={errorId}
                                onClick={() => (isOpen ? setIsOpen(false) : open())}
                                onKeyDown={onKeyDown}
                                className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border-[1.5px] bg-card px-3.5 py-2 text-left text-[15px] text-primary outline-none transition-[border-color,box-shadow]
                                    focus:border-ring focus:ring-[3px] focus:ring-ring/30
                                    ${error ? "border-danger" : "border-input"}`}
                            >
                                <span className={!selectedOption ? "text-muted" : ""}>
                                    {selectedOption ? selectedOption.label : placeholder}
                                </span>
                                <ChevronDown
                                    size={16}
                                    aria-hidden="true"
                                    className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.ul
                                        id={listId}
                                        role="listbox"
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 4 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute z-50 max-h-60 w-full space-y-0.5 overflow-y-auto rounded-xl bg-card p-1 shadow-card ring-1 ring-border"
                                    >
                                        {options.map((option, index) => {
                                            const isSelected = currentValue === option.value;
                                            return (
                                                <li
                                                    key={option.value}
                                                    id={`${listId}-${index}`}
                                                    role="option"
                                                    aria-selected={isSelected}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => choose(index)}
                                                    onMouseEnter={() => setActiveIndex(index)}
                                                    className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors
                                                        ${index === activeIndex ? "bg-surface-subtle" : ""}
                                                        ${isSelected ? "font-semibold text-primary" : "text-primary"}`}
                                                >
                                                    {option.label}
                                                    {isSelected && <Check size={14} className="text-secondary" aria-hidden="true" />}
                                                </li>
                                            );
                                        })}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </>
                    );
                }}
            />
            <FieldError id={errorId} message={error?.message} />
        </div>
    );
}
