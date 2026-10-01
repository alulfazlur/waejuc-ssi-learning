"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X, ZoomIn, Footprints, SearchAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

import Callout from "@components/Callout";
import Card from "@components/Card";
import Instruction from "@components/Instruction";
import QuestionCard from "@components/QuestionCard";
import RichEditor from "@components/RichTextEditor";
import Button from "@components/Button";
import DiagramInput from "@/components/DiagramInput";

const APK_URL = "https://drive.google.com/file/d/1Uujq_DYbMH8Fy75iLCqDQZPa3T4wK-D9/view?usp=sharing";

export const ExplanationComponent = (props) => {
    const { t } = useTranslation();
    const { methods, errors } = props;
    const { control } = methods;
    const [selectedImage, setSelectedImage] = useState(null);

    const markers = [
        { src: "/images/marker-1.webp", label: "Module: Fragmentation" },
        { src: "/images/marker-2.webp", label: "Module: Cellular Impact" }
    ];

    useEffect(() => {
        if (!selectedImage) return;
        const onKey = (e) => { if (e.key === "Escape") setSelectedImage(null); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [selectedImage]);

    const question = (number, key, field, refs) => (
        <QuestionCard
            number={number}
            description={t(`explanation.question.${key}`)}
            refs={refs}
            fields={[field]}
        >
            <RichEditor
                name={field}
                control={control}
                errors={errors}
                ariaLabel={t(`explanation.question.${key}`)}
            />
        </QuestionCard>
    );

    return (
        <div className="space-y-6">
            <Callout label={t('common.task')}>
                {t('explanation.instruction')}
            </Callout>

            <Card as="section" className="p-5 sm:p-6">
                <Instruction title={t('explanation.setup.title')} icon={Footprints} />
                <ol className="list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-primary/90">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <li key={i}>{t(`explanation.setup.step.${i}`)}</li>
                    ))}
                </ol>
            </Card>

            <section className="overflow-hidden rounded-[20px] bg-primary text-background">
                <div className="flex flex-col md:flex-row">
                    <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
                        <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background text-primary">
                                <Download size={22} aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-xl font-bold">{t('explanation.ar_title')}</h2>
                                <p className="mt-1 font-mono text-xs uppercase tracking-widest opacity-75">Micro-Lab Simulation</p>
                            </div>
                        </div>
                        <div>
                            <Button href={APK_URL} target="_blank" rel="noopener noreferrer" color="white" size="sm">
                                <Download size={16} aria-hidden="true" />
                                Download APK
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 border-t border-background/15 bg-background/10 p-6 md:border-l md:border-t-0">
                        {markers.map((marker) => (
                            <button
                                key={marker.src}
                                type="button"
                                onClick={() => setSelectedImage(marker)}
                                aria-label={`${t('explanation.zoom_marker')}: ${marker.label}`}
                                className="group relative cursor-zoom-in rounded-xl bg-white p-2 shadow-lg transition-transform hover:scale-[1.03]"
                            >
                                <span className="relative block h-30 w-28">
                                    <Image src={marker.src} alt="" fill sizes="112px" className="rounded-lg object-contain" />
                                    <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-primary/30 opacity-0 transition-opacity group-hover:opacity-100">
                                        <ZoomIn className="text-white" aria-hidden="true" />
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <p className="text-[15px] font-semibold leading-relaxed">
                {t('explanation.guide')}
            </p>

            {question(1, "estimation_physical_factor", "explain_estimation_physical_factor", "1, 2")}
            {question(2, "human_digestion", "explain_human_digestion", "9")}
            {question(3, "health_impact", "explain_health_impact", "9")}

            <QuestionCard
                number={4}
                title={t('explanation.causal_loop.title')}
                description={(
                    <div className="space-y-2">
                        <p>{t('explanation.causal_loop.desc')}</p>
                        <ul className="list-disc space-y-1 pl-5">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <li key={i}>{t(`explanation.causal_loop.point.${i}`)}</li>
                            ))}
                        </ul>
                    </div>
                )}
                icon={SearchAlert}
                fields={["explain_causal_loop"]}
            >
                <DiagramInput
                    name="explain_causal_loop"
                    errors={errors}
                    control={control}
                />
            </QuestionCard>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label={selectedImage.label}
                        className="fixed inset-0 z-999 flex items-center justify-center bg-background/80 p-4 backdrop-blur-xl"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            type="button"
                            autoFocus
                            aria-label={t('common.close')}
                            className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-card shadow-card"
                        >
                            <X size={22} aria-hidden="true" />
                        </button>
                        <div
                            className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative mb-6 aspect-3/4 w-full">
                                <Image src={selectedImage.src} alt={selectedImage.label} fill sizes="384px" className="object-contain" priority />
                            </div>
                            <div className="space-y-1 text-center">
                                <p className="font-heading font-bold uppercase tracking-widest text-[#083a4f]">{selectedImage.label}</p>
                                <p className="text-xs italic text-[#556274]">Arahkan kamera AR ke marker ini untuk simulasi.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
