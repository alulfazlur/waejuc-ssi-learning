"use client";
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
            className="bg-primary/5 dark:bg-background/5 rounded-xl p-4 border border-secondary/10"
        >
            <p className="text-[10px] uppercase tracking-widest text-secondary dark:text-primary/50 mb-1 font-mono">{label}</p>
            <p className="text-lg font-semibold text-primary dark:text-primary leading-none mb-1">{value}</p>
            <p className="text-[11px] text-secondary dark:text-primary/50">{sub}</p>
        </motion.div>
    );
}

function ChainItem({ icon: Icon, color, bg, title, sub, delay, isLast }) {
    return (
        <motion.div {...fadeUp(delay)} className="flex flex-col">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-colors">
                <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                    <Icon size={14} className={color} />
                </div>
                <div>
                    <p className="text-[16px] font-medium text-primary">{title}</p>
                    <p className="text-sm text-secondary dark:text-tertiary">{sub}</p>
                </div>
            </div>
            {!isLast && (
                <div className="pl-7 py-0.5">
                    <div className="w-px h-4 bg-secondary/20 ml-3" />
                </div>
            )}
        </motion.div>
    );
}


export default function MissionInfoPage() {
    const router = useRouter();
    const { user, responses } = useAuth();
    const { t } = useTranslation();

    const startInvestigation = () => {
        if (!user) {
            router.push("/signin");
            return;
        }

        const responseKeys = Object.keys(responses);

        if (responseKeys.length > 0) {
            const lastSlug = responseKeys[responseKeys.length - 1];
            router.push(`/learning/${lastSlug}`);
        } else {
            router.push(`/learning/${SYLLABUS[0].id}`);
        }
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
            color: "text-blue-400",
            bg: "bg-blue-500/10",
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
            color: "text-red-400",
            bg: "bg-red-500/10",
            title: t('mission.chain_items.2.title'),
            sub: t('mission.chain_items.2.sub'),
        },
        {
            icon: AlertTriangle,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            title: t('mission.chain_items.3.title'),
            sub: t('mission.chain_items.3.sub'),
        },
    ];

    return (
        <div className="pt-28 min-h-screen bg-background text-primary flex flex-col items-center justify-center px-6 py-20 overflow-hidden relative">

            <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 border border-primary rounded-full animate-ping [animation-duration:4s]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-95 h-95 border border-primary/40 rounded-full" />
            </div>

            <div className="max-w-2xl w-full relative z-10">

                <motion.div
                    {...fadeUp(0)}
                    className="flex items-center gap-2 mb-8 text-secondary dark:text-primary border-b border-primary/10 pb-4 font-mono text-xs tracking-widest uppercase"
                >
                    <Anchor size={14} />
                    <span>{t('mission.report_tag')}</span>
                </motion.div>

                <motion.div {...fadeUp(0.08)} className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                        {t('mission.title')}{" "}
                        <span className="text-secondary dark:text-primary/60 italic font-normal">
                            {t('mission.subtitle')}
                        </span>
                    </h1>
                    <p className="text-secondary dark:text-primary leading-relaxed text-base">
                        {t('mission.description')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                    {STATS.map((s, i) => (
                        <StatCard key={s.label} {...s} delay={0.14 + i * 0.06} />
                    ))}
                </div>

                <motion.div
                    {...fadeUp(0.32)}
                    className="border-l-2 border-primary/30 pl-5 py-1 mb-8 space-y-3"
                >
                    <p className="text-sm text-secondary dark:text-tertiary leading-relaxed">
                        <Trans i18nKey="mission.context.p1">
                            <strong className="text-primary font-medium">
                                {t('mission.context.p1_bold')}
                            </strong>
                        </Trans>
                    </p>

                    <p className="text-sm text-secondary dark:text-tertiary leading-relaxed">
                        <Trans i18nKey="mission.context.p2">
                            <strong className="text-primary font-medium">
                                {t('mission.context.p2_bold')}
                            </strong>
                        </Trans>
                    </p>
                </motion.div>

                <motion.div {...fadeUp(0.38)} className="mb-8">
                    <p className="text-[16px] text-primary font-medium mb-3">
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
                    className="bg-primary border border-primary/20 rounded-2xl p-5 flex gap-4 items-start mb-10"
                >
                    <div className="bg-background p-2.5 rounded-full shrink-0">
                        <Fish size={20} className="text-primary" />
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
                    <Button onClick={startInvestigation} size="lg" className="group">
                        {t('mission.cta')}
                        <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </Button>
                </motion.div>

            </div>
        </div>
    );
}