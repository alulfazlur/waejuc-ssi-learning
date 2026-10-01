"use client";
import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, ClipboardCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

const SURVEY_URL = "https://forms.gle/r63MmskQFftzP1Kv8";

export const CompletionPage = () => {
    const { t } = useTranslation();

    return (
        <div className="relative flex flex-col items-center justify-center pt-10 text-primary sm:pt-16">
            <div className="relative z-10 w-full max-w-2xl">
                <motion.div {...fadeUp(0.08)} className="mb-8 flex justify-center">
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-subtle text-secondary">
                        <CheckCircle2 size={40} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                </motion.div>

                <motion.div {...fadeUp(0.16)} className="mb-10 text-center">
                    <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
                        {t('complete.title')}{" "}
                        <span className="font-normal italic text-secondary">
                            {t('complete.thank_you')}
                        </span>
                    </h1>
                    <p className="mx-auto max-w-lg text-base leading-relaxed text-primary/90">
                        {t('complete.description')}
                    </p>
                </motion.div>

                <motion.div
                    {...fadeUp(0.28)}
                    className="rounded-[20px] bg-primary p-6 text-background sm:p-8"
                >
                    <div className="mb-5 flex items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background text-primary">
                            <ClipboardCheck size={20} aria-hidden="true" />
                        </span>
                        <div>
                            <h2 className="mb-1 text-lg font-semibold">
                                {t('complete.one_more_step')}
                            </h2>
                            <p className="text-sm leading-relaxed opacity-85">
                                {t('complete.fill_survey')}
                            </p>
                        </div>
                    </div>
                    <a
                        href={SURVEY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-background px-4 text-sm font-semibold text-primary transition-colors hover:bg-background/90"
                    >
                        {t('complete.survey_link')}
                        <ExternalLink size={14} aria-hidden="true" />
                        <span className="sr-only">{t('common.opens_new_tab')}</span>
                    </a>
                </motion.div>
            </div>
        </div>
    );
};
