"use client";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, PlayCircle, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

import Callout from "@components/Callout";
import Card from "@components/Card";
import Instruction from "@components/Instruction";
import QuestionCard from "@components/QuestionCard";
import RichEditor from "@/components/RichTextEditor";
import Table from "./initial_table";

function formatTime(secs) {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function StakeholderCard({ audio, label, listenLabel, stopLabel }) {
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

    const seekBy = (delta) => {
        const a = getAudio();
        const next = Math.max(0, Math.min(duration || 0, a.currentTime + delta));
        a.currentTime = next;
        setCurrentTime(next);
    };

    const onSeekKey = (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); seekBy(5); }
        if (e.key === "ArrowLeft") { e.preventDefault(); seekBy(-5); }
    };

    return (
        <Card className="flex flex-col justify-between gap-4 p-4">
            <h3 className="text-base font-semibold">{label}</h3>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={toggle}
                    aria-label={`${isPlaying ? stopLabel : listenLabel}: ${label}`}
                    aria-pressed={isPlaying}
                    className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors
                        ${isPlaying
                            ? "bg-primary text-background"
                            : "bg-surface-subtle text-primary hover:bg-tertiary/60 dark:hover:bg-border"
                        }`}
                >
                    {isPlaying
                        ? <Pause size={14} fill="currentColor" aria-hidden="true" />
                        : <Play size={14} fill="currentColor" className="ml-0.5" aria-hidden="true" />
                    }
                </button>

                <div
                    role="slider"
                    tabIndex={0}
                    aria-label={label}
                    aria-valuemin={0}
                    aria-valuemax={Math.round(duration || 0)}
                    aria-valuenow={Math.round(currentTime)}
                    aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
                    onClick={seek}
                    onKeyDown={onSeekKey}
                    className="relative flex h-6 flex-1 cursor-pointer items-center"
                >
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
                        <div className="h-full rounded-full bg-secondary" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <span className="shrink-0 font-mono text-xs tabular-nums text-muted">
                    {formatTime(currentTime)}<span className="opacity-50"> / </span>{formatTime(duration)}
                </span>
            </div>
        </Card>
    );
}

const VIDEOS = [
    { label: "Video 1", href: "https://www.youtube.com/watch?v=nrze0IfAmkw" },
    { label: "Video 2", href: "https://www.youtube.com/watch?v=Gr-4f81zgzc&feature=youtu.be" },
];

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
        <div className="space-y-6">
            <Callout>
                <span className="font-semibold">{t('initial.instruction')}</span>
            </Callout>

            <div className="grid gap-3 sm:grid-cols-2">
                {VIDEOS.map((video) => (
                    <a
                        key={video.href}
                        href={video.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-h-16 items-center gap-3 rounded-2xl bg-card p-3 shadow-card transition-colors hover:bg-surface-subtle"
                    >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-background">
                            <PlayCircle size={22} aria-hidden="true" />
                        </span>
                        <span className="flex-1">
                            <span className="block font-semibold">{video.label}</span>
                            <span className="text-sm text-muted">YouTube</span>
                        </span>
                        <ExternalLink size={16} className="text-muted" aria-hidden="true" />
                        <span className="sr-only">{t('common.opens_new_tab')}</span>
                    </a>
                ))}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                {stakeholders.map((s) => (
                    <StakeholderCard
                        key={s.id}
                        audio={s.audio}
                        label={t(`initial.stakeholders.list.${s.id}.label`)}
                        listenLabel={t('initial.stakeholders.listen_btn')}
                        stopLabel={t('initial.stakeholders.stop_btn', { defaultValue: "Stop" })}
                    />
                ))}
            </div>

            <p className="text-[15px] leading-relaxed text-primary/90">
                {t('initial.description')}
            </p>

            <QuestionCard
                number={1}
                title={t('initial.issue_title')}
                description={t('initial.issue_description')}
                fields={["initial_main_issue_analysis"]}
            >
                <RichEditor
                    name="initial_main_issue_analysis"
                    errors={errors}
                    control={control}
                    ariaLabel={t('initial.issue_title')}
                />
            </QuestionCard>

            <QuestionCard
                number={2}
                title={t('initial.plastic_identification')}
                fields={["initial_source_analysis", "initial_awareness_analysis"]}
            >
                <div>
                    <Instruction description={t('initial.source_question')} />
                    <RichEditor
                        name="initial_source_analysis"
                        errors={errors}
                        control={control}
                        ariaLabel={t('initial.source_question')}
                    />
                </div>
                <div>
                    <Instruction description={t('initial.awareness_question')} />
                    <RichEditor
                        name="initial_awareness_analysis"
                        errors={errors}
                        control={control}
                        ariaLabel={t('initial.awareness_question')}
                    />
                </div>
            </QuestionCard>

            <QuestionCard
                number={3}
                title={t('initial.component_ecosystem.title')}
                description={t('initial.component_ecosystem.description')}
                fields={["initial_component_ecosystem", "initial_component_ecosystem_analysis"]}
            >
                <Table control={control} register={register} errors={errors} />
                <div>
                    <Instruction
                        description={t('initial.component_ecosystem.question')}
                        refs="4, 5, 12"
                    />
                    <RichEditor
                        name="initial_component_ecosystem_analysis"
                        errors={errors}
                        control={control}
                        ariaLabel={t('initial.component_ecosystem.question')}
                    />
                </div>
            </QuestionCard>
        </div>
    );
};
