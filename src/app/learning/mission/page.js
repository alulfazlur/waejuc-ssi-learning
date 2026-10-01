"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Anchor, ArrowRight, Fish, Users, TrendingDown, MapPin, AlertTriangle } from "lucide-react";
import Button from "@components/Button";
import { SYLLABUS } from "@constants/syllabus";
import { useAuth } from "@context/AuthContext";
import { useTranslation, Trans } from "react-i18next";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

function StatCard({ label, value, sub, delay }) {
    return (
        <motion.div
            {...fadeUp(delay)}
            className="rounded-2xl bg-card p-4 shadow-card"
        >
            <p className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-muted">{label}</p>
            <p className="mb-1 font-heading text-lg font-semibold leading-none">{value}</p>
            <p className="text-xs text-muted">{sub}</p>
        </motion.div>
    );
}

function ChainItem({ icon: Icon, color, bg, title, sub, delay, isLast }) {
    return (
        <motion.div {...fadeUp(delay)} className="flex flex-col">
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${bg}`}>
                    <Icon size={16} className={color} aria-hidden="true" />
                </div>
                <div>
                    <p className="text-base font-medium">{title}</p>
                    <p className="text-sm text-muted">{sub}</p>
                </div>
            </div>
            {!isLast && (
                <div className="py-0.5 pl-7">
                    <div className="ml-0.5 h-4 w-px bg-border" />
                </div>
            )}
        </motion.div>
    );
}


export default function MissionInfoPage() {
    const router = useRouter();
    const { user, responses } = useAuth();
    const { t } = useTranslation();

    const { setLoading } = useAuth();

    const startInvestigation = async () => {
        setLoading(true)
        if (!user) {
            router.push("/signin");
            return;
        }

        const responseKeys = Object.keys(responses);
        const targetSlug = responseKeys.length > 0
            ? responseKeys[responseKeys.length - 1]
            : SYLLABUS[0].id;

        await router.push(`/learning/${targetSlug}`);
        setLoading(true)
    };

    const STATS = [
        {
            label: t('mission.stats.distance.label'),
            value: t('mission.stats.distance.value'),
            sub: t('mission.stats.distance.sub')
        },
        {
            label: t('mission.stats.scale.label'),
            value: t('mission.stats.scale.value'),
            sub: t('mission.stats.scale.sub')
        },
        {
            label: t('mission.stats.subject.label'),
            value: t('mission.stats.subject.value'),
            sub: t('mission.stats.subject.sub')
        },
    ];

    const CHAIN = [
        {
            icon: Users,
            color: "text-secondary",
            bg: "bg-secondary/15",
            title: t('mission.chain_items.0.title'),
            sub: t('mission.chain_items.0.sub'),
        },
        {
            icon: TrendingDown,
            color: "text-secondary",
            bg: "bg-secondary/10",
            title: t('mission.chain_items.1.title'),
            sub: t('mission.chain_items.1.sub'),
        },
        {
            icon: MapPin,
            color: "text-quaternary",
            bg: "bg-quaternary/15",
            title: t('mission.chain_items.2.title'),
            sub: t('mission.chain_items.2.sub'),
        },
        {
            icon: AlertTriangle,
            color: "text-secondary",
            bg: "bg-secondary/15",
            title: t('mission.chain_items.3.title'),
            sub: t('mission.chain_items.3.sub'),
        },
    ];

    useEffect(() => {
        const targetSlug = Object.keys(responses).length > 0
            ? Object.keys(responses).at(-1)
            : SYLLABUS[0].id;
        router.prefetch(`/learning/${targetSlug}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [responses]);

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12 text-primary sm:px-6 sm:py-16">

            <div className="max-w-2xl w-full relative z-10">

                <motion.div
                    {...fadeUp(0)}
                    className="mb-8 flex items-center gap-2 border-b border-border pb-4 font-mono text-xs uppercase tracking-widest text-secondary"
                >
                    <Anchor size={14} aria-hidden="true" />
                    <span>{t('mission.report_tag')}</span>
                </motion.div>

                <motion.div {...fadeUp(0.08)} className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                        {t('mission.title')}{" "}
                        <span className="font-normal italic text-secondary">
                            {t('mission.subtitle')}
                        </span>
                    </h1>
                    <p className="text-base leading-relaxed text-primary/90">
                        {t('mission.description')}
                    </p>
                </motion.div>

                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {STATS.map((s, i) => (
                        <StatCard key={s.label} {...s} delay={0.14 + i * 0.06} />
                    ))}
                </div>

                <motion.div
                    {...fadeUp(0.32)}
                    className="mb-8 space-y-3 border-l-[3px] border-secondary py-1 pl-5"
                >
                    <p className="text-[15px] leading-relaxed text-primary/90">
                        <Trans i18nKey="mission.context.p1">
                            <strong className="font-semibold text-primary">
                                {t('mission.context.p1_bold')}
                            </strong>
                        </Trans>
                    </p>

                    <p className="text-[15px] leading-relaxed text-primary/90">
                        <Trans i18nKey="mission.context.p2">
                            <strong className="font-semibold text-primary">
                                {t('mission.context.p2_bold')}
                            </strong>
                        </Trans>
                    </p>
                </motion.div>

                <motion.div {...fadeUp(0.38)} className="mb-8">
                    <p className="mb-3 text-base font-semibold">
                        {t('mission.chain_title')}
                    </p>
                    <div className="flex flex-col">
                        {CHAIN.map((item, i) => (
                            <ChainItem
                                key={item.title}
                                {...item}
                                delay={0.42 + i * 0.06}
                                isLast={i === CHAIN.length - 1}
                            />
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    {...fadeUp(0.58)}
                    className="mb-10 flex items-start gap-4 rounded-[20px] bg-primary p-5 sm:p-6"
                >
                    <div className="shrink-0 rounded-xl bg-background p-2.5">
                        <Fish size={20} className="text-primary" aria-hidden="true" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-background mb-1 text-lg">{t('mission.goal.title')}</h3>
                        <p className="text-background/80 text-sm leading-relaxed">
                            <Trans i18nKey="mission.goal.desc">
                                <strong className="text-background font-medium">
                                    {t('mission.goal.desc_bold1')}
                                </strong>
                                <strong className="text-background font-medium">
                                    {t('mission.goal.desc_bold2')}
                                </strong>
                            </Trans>
                        </p>
                    </div>
                </motion.div>

                <motion.div {...fadeUp(0.64)} className="flex justify-center">
                    <Button onClick={startInvestigation} size="lg">
                        {t('mission.cta')}
                        <ArrowRight size={18} aria-hidden="true" />
                    </Button>
                </motion.div>

            </div>
        </div>
    );
}