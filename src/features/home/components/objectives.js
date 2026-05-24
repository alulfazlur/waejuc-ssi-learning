"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from '@components/Button'
import { useTranslation } from "react-i18next";
import {
    Microscope,
    Network,
    Lightbulb,
    BrainCircuit,
} from "lucide-react";

export const Objectives = () => {
    const router = useRouter();
    const { t } = useTranslation();

    const goals = [
        {
            icon: <Microscope size={28} />,
            title: "Analyze Impact",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            icon: <Network size={28} />,
            title: "Evaluate Complexity",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
        },
        {
            icon: <Lightbulb size={28} />,
            title: "Propose Solution",
            color: "text-secondary",
            bg: "bg-secondary/10",
        },
        {
            icon: <BrainCircuit size={28} />,
            title: "Systems Thinking",
            color: "text-red-400",
            bg: "bg-red-500/10",
        },
    ];

    return (
        <section id="objectives" className="py-24 relative overflow-hidden bg-background">
            <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-75 h-75 bg-primary/10 rounded-full blur-[80px] -z-10" />

            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-primary tracking-tight"
                    >
                        {t('objectives.title')}
                    </motion.h2>
                    <div className="w-20 h-1.5 bg-primary mx-auto mt-6 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {goals.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-white dark:bg-secondary/40 p-8 rounded-[2.3rem] h-full flex flex-col items-start transition-all">
                                <div className="flex justify-between items-start w-full mb-6">
                                    <div className={`p-4 rounded-2xl ${item.bg} text-current`}>
                                        <div className={`${item.color} text-background dark:text-primary group-hover:scale-110 transition-transform duration-300`}>
                                            {item.icon}
                                        </div>
                                    </div>
                                    <span className="font-mono text-4xl font-black opacity-20 group-hover:opacity-10 transition-opacity">
                                        0{i + 1}
                                    </span>
                                </div>

                                <h3 className="font-black text-xl text-primary mb-3 tracking-tight flex items-center gap-2">
                                    {item.title}
                                </h3>

                                <p className="text-secondary/70 dark:text-white/60 leading-relaxed text-sm font-medium">
                                    {t(`objectives.goal_${i + 1}`)}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-12 flex flex-col items-center gap-4"
                >
                    <Button
                        onClick={() => router.push('/learning/mission')}
                        onMouseEnter={() => router.prefetch('/learning/mission')}
                        className="px-12 py-6 rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all"
                    >
                        {t('common.start_mission')}
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};