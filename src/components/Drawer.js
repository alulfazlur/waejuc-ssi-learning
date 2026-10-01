"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

// Left-side modal panel: traps focus, closes on Escape or backdrop tap,
// and returns focus to whatever opened it.
export default function Drawer({ open, onClose, label, children }) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const opener = document.activeElement;
        const panel = panelRef.current;
        panel?.querySelector(FOCUSABLE)?.focus();

        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }
            if (e.key !== "Tab" || !panel) return;
            const items = [...panel.querySelectorAll(FOCUSABLE)];
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = overflow;
            opener?.focus?.();
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] dark:bg-black/50"
                    />
                    <motion.aside
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label={label}
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 w-[85vw] max-w-80 shadow-2xl"
                    >
                        {children}
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    );
}
