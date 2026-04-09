"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, ExternalLink, LogOut } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { useTranslation } from "react-i18next";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

const SURVEY_URL = "https://forms.gle/SNxWawEMEHsf3eRB6";

export const CompletionPage = () => {
    const router = useRouter();
    const { logout } = useAuth();
    const { t } = useTranslation();

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <div className="pt-20 bg-background text-primary flex flex-col items-center justify-center overflow-hidden relative">

            <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 border border-primary rounded-full animate-ping [animation-duration:4s]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-95 h-95 border border-primary/40 rounded-full" />
            </div>

            <div className="max-w-2xl w-full relative z-10">

                <motion.div
                    {...fadeUp(0.08)}
                    className="flex justify-center mb-8"
                >
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle size={40} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping [animation-duration:2.5s]" />
                    </div>
                </motion.div>

                <motion.div {...fadeUp(0.16)} className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                        {t('complete.title')}
                        <span className="text-secondary dark:text-primary/60 italic font-normal">
                            {t('complete.thank_you')}
                        </span>
                    </h1>
                    <p className="text-secondary dark:text-primary leading-relaxed text-base max-w-lg mx-auto">
                        {t('complete.description')}
                    </p>
                </motion.div>

                <motion.div
                    {...fadeUp(0.28)}
                    className="bg-primary border border-primary/20 rounded-2xl p-6 mb-6"
                >
                    <div className="flex gap-4 items-start mb-5">
                        <div className="bg-background p-2.5 rounded-full shrink-0">
                            <ExternalLink size={18} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-background text-lg mb-1">
                                {t('complete.one_more_step')}
                            </h3>
                            <p className="text-background/80 text-sm leading-relaxed">
                                {t('complete.fill_survey')}
                            </p>
                        </div>
                    </div>
                    <a
                        href={SURVEY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-background text-primary font-semibold text-sm rounded-xl hover:bg-background/90 transition-colors"
                    >
                        {t('complete.survey_link')}
                        <ExternalLink size={14} />
                    </a>
                </motion.div>

                <motion.div {...fadeUp(0.36)}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px flex-1 bg-primary/10" />
                        <span className="text-xs text-secondary font-mono tracking-widest">{t('complete.or')}</span>
                        <div className="h-px flex-1 bg-primary/10" />
                    </div>
                </motion.div>

                <motion.div {...fadeUp(0.42)} className="flex justify-center">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm cursor-pointer group"
                    >
                        <LogOut size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                        {t('complete.logout')}
                    </button>
                </motion.div>

            </div>
        </div>
    );
}