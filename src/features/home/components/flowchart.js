"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
    { id: 1, title: "Pelajari Materi", desc: "Eksplorasi modul utama" },
    { id: 2, title: "Pahami Konsep", desc: "Pendalaman materi teknis" },
    { id: 3, title: "Uji Kemampuan", desc: "Selesaikan tantangan quiz" },
    { id: 4, title: "Uji Kemampuan", desc: "Selesaikan tantangan quiz" },
    { id: 5, title: "Uji Kemampuan", desc: "Selesaikan tantangan quiz" },
    { id: 6, title: "Uji Kemampuan", desc: "Selesaikan tantangan quiz" },
]

const Arrow = ({ rotate = 0, className = "" }) => (
    <motion.div
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={`flex justify-center items-center text-secondary dark:text-primary ${className}`}
        style={{ rotate: `${rotate}deg` }}
    >
        <svg width="32" height="40" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0V46M12 46L6 40M12 46L18 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </motion.div>
);

const Card = ({ step, className = {} }) => {
    const stepData = steps.find(s => s.id === parseInt(step));
    const { title, desc } = stepData || {};

    return (
        <Link href={`/learning/materi-${step}`} className={`w-full max-w-xs z-10 ${className}`}>
            <motion.div
                variants={{
                    hidden: { y: 30, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ scale: 1.05, y: -5, boxShadow: "0px 20px 40px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.98 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-primary border-b-4 border-secondary text-center cursor-pointer shadow-xl"
            >
                <span className="text-background text-xs uppercase tracking-[0.2em] block mb-2 opacity-70">Step {step}</span>
                <h3 className="font-bold text-xl text-background">{title}</h3>
                <p className="text-tertiary dark:text-background leading-relaxed text-sm font-medium mt-2">{desc}</p>
            </motion.div>
        </Link>
    )
};

export function Flowchart() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };


    return (
        <section id="flow" className="py-30 px-6 relative overflow-hidden min-h-screen">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw/2)] h-[calc(100vh/2)] bg-secondary/20 dark:bg-primary/20 blur-[100px] rounded-full -z-10" />

            <motion.h2
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-center mb-16 text-foregorund tracking-tight relative z-10"
            >
                Alur Pembelajaran
            </motion.h2>

            {/* Desktop */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="hidden lg:grid grid-cols-5 gap-y-20 items-center justify-items-center w-full"
            >
                <Card step="1" />
                <Arrow rotate={-90} />
                <Card step="2" />
                <Arrow rotate={-90} />
                <Card step="3" />

                {[...Array(4)].map((_, i) => <div key={i} />)}
                <Arrow />

                <Card step="6" />
                <Arrow rotate={90} />
                <Card step="5" />
                <Arrow rotate={90} />
                <Card step="4" />

            </motion.div>

            {/* Tablet */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="hidden md:grid lg:hidden grid-cols-3 gap-y-6 items-center justify-items-center w-full"
            >
                <Card step="1" />
                <Arrow rotate={-90} />
                <Card step="2" />

                {[...Array(2)].map((_, i) => <div key={i} />)}
                <Arrow />

                <Card step="4" />
                <Arrow rotate={90} />
                <Card step="3" />

                <Arrow />
                {[...Array(2)].map((_, i) => <div key={i} />)}

                <Card step="5" />
                <Arrow rotate={-90} />
                <Card step="6" />
            </motion.div>

            {/* Mobile */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:hidden grid-cols-1 gap-y-6 items-center justify-items-center w-full"
            >
                <Card step="1" />
                <Arrow />
                <Card step="2" />
                <Arrow />
                <Card step="3" />
                <Arrow />
                <Card step="4" />
                <Arrow />
                <Card step="5" />
                <Arrow />
                <Card step="6" />
            </motion.div>
        </section>
    );
}