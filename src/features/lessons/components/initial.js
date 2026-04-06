"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Microscope, ClipboardList, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

import Instruction from "@components/Instruction";
import RichEditor from "@/components/RichTextEditor";
import Input from "@components/Input";

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
                <div className="flex gap-3 text-secondary dark:text-primary p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                    <ClipboardList className="min-w-6" />
                    <p className="text-sm leading-relaxed">
                        <b>{`${t('common.activity')}: `}</b>
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
                        className="text-primary font-bold p-4 bg-tertiary dark:bg-secondary rounded-xl"
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
            </section>

            <section className="space-y-4">
                <Instruction
                    title={t('initial.issue_title')}
                    description={t('initial.issue_description')}
                    icon={MessageSquare}
                />
                <RichEditor
                    {...register("main_issue_analysis")}
                    errors={errors}
                    control={control}
                />
            </section>

            <section className="space-y-4 bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm">
                <Instruction
                    title={t('initial.component_id.title')}
                    description={t('initial.component_id.description')}
                />
                <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-tertiary dark:bg-secondary text-primary uppercase text-xs font-bold">
                            <tr>
                                {t('initial.table_component.headers', { returnObjects: true })?.map((header, idx) => (
                                    <th key={idx} className="px-6 py-4">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <tr>
                                {t('initial.table_component.row', { returnObjects: true })?.map((row, idx) => (
                                    <td key={idx} className="px-6 py-4 opacity-80">{row}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <RichEditor
                    {...register("components_table_analysis")}
                    errors={errors}
                    control={control}
                />
            </section>

            <section className="bg-tertiary dark:bg-secondary p-8 rounded-3xl border border-border dark:border-primary/20">
                <div className="flex items-center gap-3 mb-6">
                    <Microscope className="text-primary" size={28} />
                    <div>
                        <h2 className="text-2xl font-bold">{t('initial.properties.title')}</h2>
                        <p className="text-sm opacity-70">{t('initial.properties.description')}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4 p-6 bg-background rounded-xl border border-border">
                        <div className="flex items-center gap-2 font-bold text-primary pb-2 border-b border-border/50">
                            <span className="bg-primary text-background w-6 h-6 rounded-full flex items-center justify-center text-[10px]">A</span>
                            {t('initial.plastic_form.title')}
                        </div>
                        <div className="space-y-1">
                            <label className="text-[12px] font-bold">{t('initial.properties.name_label')}</label>
                            <Input {...register("plastic_name")} errors={errors} control={control} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold">{t('initial.plastic_form.props_label')}</label>
                            <br />
                            <span className="text-[12px]">{t('initial.plastic_form.props_placeholder')}</span>
                            <RichEditor {...register("plastic_props")} errors={errors} control={control} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold">{t('initial.plastic_form.behave_label')}</label>
                            <br />
                            <span className="text-[12px]">{t('initial.plastic_form.behave_placeholder')}</span>
                            <RichEditor {...register("plastic_behavior_pred")} errors={errors} control={control} />
                        </div>
                    </div>

                    <div className="space-y-4 p-6 bg-background rounded-xl border border-border">
                        <div className="flex items-center gap-2 font-bold text-primary pb-2 border-b border-border/50">
                            <span className="bg-primary text-background w-6 h-6 rounded-full flex items-center justify-center text-[10px]">B</span>
                            {t('initial.organism_form.title')}
                        </div>
                        <div className="space-y-1">
                            <label className="text-[12px] font-bold">{t('initial.properties.name_label')}</label>
                            <Input {...register("organism_name")} errors={errors} control={control} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold">{t('initial.organism_form.props_label')}</label>
                            <br />
                            <span className="text-[12px]">{t('initial.organism_form.props_placeholder')}</span>
                            <RichEditor {...register("organism_props")} errors={errors} control={control} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold">{t('initial.organism_form.behave_label')}</label>
                            <br />
                            <span className="text-[12px]">{t('initial.organism_form.behave_placeholder')}</span>
                            <RichEditor {...register("organism_behavior_pred")} errors={errors} control={control} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};