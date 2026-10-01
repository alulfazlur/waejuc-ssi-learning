"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Microscope, Network, Lightbulb, BrainCircuit } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from '@components/Button'
import Card from "@components/Card";

const GOAL_ICONS = [Microscope, Network, Lightbulb, BrainCircuit];

export const Objectives = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const titles = t('objectives.items', { returnObjects: true });

    return (
        <section id="objectives" className="bg-surface-subtle/60 py-20 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold tracking-tight sm:text-4xl"
                >
                    {t('objectives.title')}
                </motion.h2>

                <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    {GOAL_ICONS.map((Icon, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <Card className="flex h-full flex-col p-6 sm:p-7">
                                <div className="mb-5 flex items-center justify-between">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                                        <Icon size={24} aria-hidden="true" />
                                    </span>
                                    <span className="font-mono text-sm font-medium text-muted">0{i + 1}</span>
                                </div>
                                <h3 className="mb-2 text-xl font-semibold tracking-tight">
                                    {Array.isArray(titles) ? titles[i] : ""}
                                </h3>
                                <p className="text-[15px] leading-relaxed text-primary/85">
                                    {t(`objectives.goal_${i + 1}`)}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <Button
                        size="lg"
                        onClick={() => router.push('/learning/mission')}
                        onMouseEnter={() => router.prefetch('/learning/mission')}
                    >
                        {t('common.start_mission')}
                        <ArrowRight size={18} aria-hidden="true" />
                    </Button>
                </div>
            </div>
        </section>
    );
};
