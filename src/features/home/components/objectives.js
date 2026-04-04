"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from '@components/Button'

const GOALS = [
    {
        title: "Pemahaman Konsep",
        desc: "Menguasai teori dasar dengan materi yang ringkas.",
        icon: "💡"
    },
    {
        title: "Implementasi",
        desc: "Menerapkan teori ke dalam studi kasus nyata.",
        icon: "🛠️"
    },
    {
        title: "Evaluasi",
        desc: "Menguji kemampuan melalui quiz interaktif.",
        icon: "📝"
    },
    {
        title: "Pemahaman Konsep",
        desc: "Menguasai teori dasar dengan materi yang ringkas.",
        icon: "💡"
    },
    {
        title: "Implementasi",
        desc: "Menerapkan teori ke dalam studi kasus nyata.",
        icon: "🛠️"
    },
    {
        title: "Evaluasi",
        desc: "Menguji kemampuan melalui quiz interaktif.",
        icon: "📝"
    }
];

export const Objectives = () => {
    const router = useRouter();

    return (
        <section id="objectives" className="pt-20 mb-20 items-center relative overflow-hidden ">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw/2)] h-[calc(100vh/2)] bg-background/20 dark:bg-background/20 blur-[100px] rounded-full z-5" />

                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-center mb-16 text-primary tracking-tight z-10"
                >
                    Tujuan Pembelajaran
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
                    {GOALS.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: i * 0.1,
                                duration: 0.5,
                                ease: "easeOut"
                            }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl border border-tertiary/30 bg-primary/80 dark:bg-primary/90 hover:dark:bg-primary backdrop-blur-xl hover:bg-primary transition-colors group shadow-2xl"
                        >
                            <div className="text-5xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 inline-block">
                                {item.icon}
                            </div>

                            <h3 className="font-bold text-2xl text-background dark:text-background mb-3">
                                {item.title}
                            </h3>

                            <p className="text-tertiary dark:text-background leading-relaxed text-sm font-medium">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 flex justify-center"
                >
                    <Button onClick={() => router.push('/learning/mission')}>
                        Mulai Sekarang
                    </Button>
                </motion.div>
        </section>
    )
};