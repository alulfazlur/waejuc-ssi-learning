"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import {
    Download,
    X,
    ZoomIn,
    Dna,
    ClipboardList
} from "lucide-react";
import { useTranslation } from "react-i18next";

import Instruction from "@components/Instruction";
import RichTextEditor from "@components/RichTextEditor";
import Button from "@components/Button";

export const ExplanationComponent = (props) => {
    const { t } = useTranslation();
    const { methods, errors } = props;
    const { register, control } = methods;
    const [selectedImage, setSelectedImage] = useState(null);

    const markers = [
        { src: "/images/marker-1.webp", label: "Module: Fragmentation" },
        { src: "/images/marker-2.webp", label: "Module: Cellular Impact" }
    ];

    return (
        <div className="space-y-8">
            <div className="flex gap-3 text-secondary dark:text-primary p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                <ClipboardList className="min-w-6" />
                <p className="text-sm leading-relaxed">
                    <b>{`${t('common.task')}: `}</b>
                    {t('explanation.instruction')}
                </p>
            </div>

            <div
                className="mb-12 overflow-hidden rounded-3xl bg-linear-to-br from-primary to-primary/90 dark:from-secondary dark:to-secondary/80 text-background shadow-2xl"
            >
                <div className="flex flex-col md:flex-row">
                    <div className="p-8 flex-1 space-y-6 flex flex-col justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white ring-1 ring-white/30">
                                <Download size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-2xl tracking-tight leading-none">{t('explanation.ar_setup_title')}</h3>
                                <p className="text-white/60 text-xs mt-1 uppercase tracking-widest font-semibold">Micro-Lab Simulation</p>
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
                                className="group relative bg-white p-2 pb-6 rounded-xl transition-all shadow-2xl cursor-zoom-in hover:scale-105 active:scale-95"
                            >
                                <div className="relative w-28 h-40 md:w-32 md:h-44">
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
                                <p className="absolute bottom-1.5 left-0 right-0 text-[8px] font-black text-primary/40 text-center uppercase tracking-tighter">
                                    {marker.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <section className="space-y-6">

                <div
                    className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4"
                >
                    <Instruction
                        title={t('explanation.q_title')}
                        icon={Dna}
                    />
                    <div className="text-secondary text-[15px] dark:text-primary/80">
                        <ul className="list-disc list-inside space-y-1">
                            <li>{t('explanation.q1')}</li>
                            <li>{t('explanation.q2')}</li>
                            <li>{t('explanation.q3')}</li>
                        </ul>
                    </div>

                    <RichTextEditor
                        {...register("qualitative_explanation")}
                        name="qualitative_explanation"
                        control={control}
                        errors={errors}
                    />
                </div>
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