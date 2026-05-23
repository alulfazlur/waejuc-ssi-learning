"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import {
    Download,
    X,
    ZoomIn,
    Footprints,
    ClipboardList,
    SearchAlert,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import Instruction from "@components/Instruction";
import RichEditor from "@components/RichTextEditor";
import Button from "@components/Button";
import DiagramInput from "@/components/DiagramInput";

export const ExplanationComponent = (props) => {
    const { t } = useTranslation();
    const { methods, errors } = props;
    const { control } = methods;
    const [selectedImage, setSelectedImage] = useState(null);

    const markers = [
        { src: "/images/marker-1.webp", label: "Module: Fragmentation" },
        { src: "/images/marker-2.webp", label: "Module: Cellular Impact" }
    ];

    return (
        <div className="space-y-8">
            <div className="flex gap-3 text-secondary dark:text-primary p-4 bg-secondary/5 dark:bg-tertiary/10 rounded-2xl border border-secondary/10">
                <ClipboardList className="min-w-6" />
                <p className="text-sm leading-relaxed">
                    <b>{`${t('common.task')}: `}</b>
                    {t('explanation.instruction')}
                </p>
            </div>

            <section className="bg-tertiary dark:bg-secondary rounded-2xl border border-border dark:border-primary/20 p-6">
                <Instruction
                    title={t('explanation.setup.title')}
                    icon={Footprints}
                />
                <div className="text-secondary text-[15px] dark:text-primary/80">
                    <ul className="list-disc list-inside space-y-1">
                        <li>{t('explanation.setup.step.0')}</li>
                        <li>{t('explanation.setup.step.1')}</li>
                        <li>{t('explanation.setup.step.2')}</li>
                        <li>{t('explanation.setup.step.3')}</li>
                        <li>{t('explanation.setup.step.4')}</li>
                    </ul>
                </div>
            </section>

            <section className="bg-primary rounded-2xl border border-border dark:border-primary/20 text-background">
                <div className="flex flex-col md:flex-row">
                    <div className="p-8 flex-1 space-y-6 flex flex-col justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-background backdrop-blur-md rounded-2xl flex items-center justify-center text-primary ring-1 ring-white/30">
                                <Download size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{t('explanation.ar_title')}</h3>
                                <p className="text-xs mt-1 uppercase tracking-widest font-semibold">Micro-Lab Simulation</p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button href="https://drive.google.com/file/d/1Uujq_DYbMH8Fy75iLCqDQZPa3T4wK-D9/view?usp=sharing" target="_blank" className="rounded-xl px-8 shadow-lg" color="white" size="sm">
                                Download APK
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm p-6 flex gap-4 md:w-fit items-center justify-center border-l border-white/10">
                        {markers.map((marker, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedImage(marker)}
                                className="group relative bg-white py-2 rounded-xl transition-all shadow-2xl cursor-zoom-in hover:scale-105 active:scale-95"
                            >
                                <div className="relative w-28 h-30">
                                    <Image
                                        src={marker.src}
                                        alt={marker.label}
                                        fill
                                        className="object-contain rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                        <ZoomIn className="text-white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <p className="font-bold text-md leading-relaxed text-secondary dark:text-primary">
                {t('explanation.guide')}
            </p>

            <section className="bg-tertiary dark:bg-secondary rounded-2xl border border-border dark:border-primary/20 p-6">
                <Instruction
                    icon={null}
                    description={t('explanation.question.estimation_physical_factor')}
                />
                <RichEditor
                    name="explain_estimation_physical_factor"
                    control={control}
                    errors={errors}
                />
            </section>

            <section className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm">
                <Instruction
                    icon={null}
                    description={t('explanation.question.human_digestion')}
                />
                <RichEditor
                    name="explain_human_digestion"
                    errors={errors}
                    control={control}
                />
            </section>

            <section className="bg-tertiary dark:bg-secondary rounded-2xl border border-border dark:border-primary/20 p-6">
                <Instruction
                    icon={null}
                    description={t('explanation.question.health_impact')}
                />
                <RichEditor
                    name="explain_health_impact"
                    control={control}
                    errors={errors}
                />
            </section>

            <section className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm">
                <Instruction
                    title={t('explanation.causal_loop.title')}
                    description={t('explanation.causal_loop.desc')}
                    icon={SearchAlert}
                />
                <div className="text-secondary text-[15px] dark:text-primary/80 mb-4">
                    <ul className="list-disc list-inside space-y-1">
                        <li>{t('explanation.causal_loop.point.0')}</li>
                        <li>{t('explanation.causal_loop.point.1')}</li>
                        <li>{t('explanation.causal_loop.point.2')}</li>
                        <li>{t('explanation.causal_loop.point.3')}</li>
                        <li>{t('explanation.causal_loop.point.4')}</li>
                    </ul>
                </div>
                <DiagramInput
                    name="explain_causal_loop"
                    errors={errors}
                    control={control}
                />
            </section>

            <AnimatePresence>
                {selectedImage && (
                    <div
                        className="fixed inset-0 z-999 bg-background/80 backdrop-blur-2xl flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-6 right-6 p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                            <X size={24} />
                        </button>
                        <div
                            className="bg-white p-6 rounded-4xl shadow-2xl max-w-sm w-full border border-primary/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative aspect-3/4 w-full mb-6">
                                <Image src={selectedImage.src} alt={selectedImage.label} fill className="object-contain" priority />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-primary font-black uppercase tracking-widest">{selectedImage.label}</p>
                                <p className="text-secondary/60 text-xs italic">Arahkan kamera AR ke marker ini untuk simulasi.</p>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};