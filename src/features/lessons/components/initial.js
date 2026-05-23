"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Microscope, ClipboardList, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

import Instruction from "@components/Instruction";
import RichEditor from "@/components/RichTextEditor";
import Table from "./initial_table";

function formatTime(secs) {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function StakeholderCard({ audio, label }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const rafRef = useRef(null);

    const getAudio = () => {
        if (!audioRef.current) {
            const a = new Audio(audio);
            a.onloadedmetadata = () => setDuration(a.duration);
            a.onended = () => {
                setIsPlaying(false);
                setCurrentTime(0);
                cancelAnimationFrame(rafRef.current);
            };
            audioRef.current = a;
        }
        return audioRef.current;
    };

    const startTracking = () => {
        const tick = () => {
            if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
    };

    const toggle = () => {
        const a = getAudio();
        if (isPlaying) {
            a.pause();
            setIsPlaying(false);
            cancelAnimationFrame(rafRef.current);
        } else {
            // eslint-disable-next-line no-console
            a.play().catch(console.error);
            setIsPlaying(true);
            startTracking();
        }
    };

    const seek = (e) => {
        const a = getAudio();
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = ratio * (duration || 0);
        a.currentTime = newTime;
        setCurrentTime(newTime);
    };

    useEffect(() => {
        return () => {
            cancelAnimationFrame(rafRef.current);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, []);

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="p-5 rounded-2xl bg-tertiary dark:bg-secondary border border-border flex flex-col justify-between gap-4">
            <div>
                <h3 className="font-bold text-lg mb-2 text-primary">{label}</h3>
                {/* <p className="text-sm italic opacity-80">&quot;{summary}&quot;</p> */}
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggle}
                        className={`cursor-pointer p-2 rounded-full shrink-0 transition-all
                            ${isPlaying
                                ? "bg-primary text-background scale-105"
                                : "bg-primary/10 text-primary hover:bg-primary/20"
                            }`}
                    >
                        {isPlaying
                            ? <Pause size={12} fill="currentColor" />
                            : <Play size={12} fill="currentColor" />
                        }
                    </button>

                    <div
                        className="flex-1 h-1.5 bg-primary/10 rounded-full cursor-pointer relative overflow-hidden"
                        onClick={seek}
                    >
                        <div
                            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-none"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <span className="text-[10px] font-mono text-secondary shrink-0 tabular-nums">
                        {formatTime(currentTime)}<span className="opacity-40"> / </span>{formatTime(duration)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export const InitialComponent = (props) => {
    const { t } = useTranslation();
    const { methods, errors } = props;
    const { register, control } = methods;

    const stakeholders = [
        { id: "sailor", audio: "/audio/sailor.m4a" },
        { id: "seller", audio: "/audio/seller.m4a" },
        { id: "official", audio: "/audio/official.m4a" },
    ];

    return (
        <div className="space-y-8">
            <section className="space-y-6 border-b border-b-tertiary pb-8">
                <div className="flex gap-3 text-secondary dark:text-primary p-4 bg-secondary/5 dark:bg-tertiary/10 rounded-2xl border border-secondary/10">
                    <ClipboardList className="min-w-6" />
                    <p className="text-md leading-relaxed font-bold">
                        {t('initial.instruction')}
                    </p>
                </div>

                <div className="flex gap-2">
                    <motion.a
                        href="https://www.youtube.com/watch?v=nrze0IfAmkw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-bold p-4 bg-tertiary dark:bg-secondary rounded-xl"
                        whileHover={{ y: -3, scale: 1.02 }}
                    >
                        Video 1
                    </motion.a>
                    <motion.a
                        href="https://www.youtube.com/watch?v=Gr-4f81zgzc&feature=youtu.be"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primarya font-bold p-4 bg-tertiary dark:bg-secondary rounded-xl"
                        whileHover={{ y: -3, scale: 1.02 }}
                    >
                        Video 2
                    </motion.a>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {stakeholders.map((s) => (
                        <StakeholderCard
                            key={s.id}
                            id={s.id}
                            audio={s.audio}
                            label={t(`initial.stakeholders.list.${s.id}.label`)}
                            summary={t(`initial.stakeholders.list.${s.id}.summary`)}
                            listenLabel={t('initial.stakeholders.listen_btn')}
                            stopLabel={t('initial.stakeholders.stop_btn', { defaultValue: "Stop" })}
                        />
                    ))}
                </div>

                <p className="text-md leading-relaxed text-secondary dark:text-primary">
                    {t('initial.description')}
                </p>
            </section>


            <section className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm">
                <Instruction
                    title={t('initial.issue_title')}
                    description={t('initial.issue_description')}
                    icon={MessageSquare}
                />
                <RichEditor
                    name="initial_main_issue_analysis"
                    errors={errors}
                    control={control}
                />
            </section>

            <section className="bg-tertiary dark:bg-secondary rounded-2xl border border-border dark:border-primary/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Microscope className="text-primary" size={28} />
                    <div>
                        <h2 className="text-2xl font-bold">{t('initial.plastic_identification')}</h2>
                    </div>
                </div>

                <div className="mb-6">
                    <Instruction
                        description={t('initial.source_question')}
                        icon={null}
                    />
                    <RichEditor
                        name="initial_source_analysis"
                        errors={errors}
                        control={control}
                    />
                </div>
                <div>
                    <Instruction
                        description={t('initial.awareness_question')}
                        icon={null}
                    />
                    <RichEditor
                        name="initial_awareness_analysis"
                        errors={errors}
                        control={control}
                    />
                </div>
            </section>

            <section className="space-y-4 bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm">
                <Instruction
                    title={t('initial.component_ecosystem.title')}
                    description={t('initial.component_ecosystem.description')}
                />
                <Table control={control} register={register} errors={errors} />
                <div className="mt-6">
                    <Instruction
                        description={t('initial.component_ecosystem.question')}
                        icon={null}
                    />
                    <RichEditor
                        name="initial_component_ecosystem_analysis"
                        errors={errors}
                        control={control}
                    />
                </div>
            </section>

        </div>
    );
};