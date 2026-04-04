"use client";
import { motion } from "framer-motion";
import {
    ClipboardList,
    Leaf,
    BadgeDollarSign,
    Users,
    Lightbulb,
    FileText
} from "lucide-react";
import { useTranslation } from "react-i18next";

import FooterLesson from "@components/FooterLesson";
import RichTextEditor from "@components/RichTextEditor";
import Input from "@components/Input";

const PolicySection = ({ icon: Icon, title, description, name, placeholder, control, errors }) => (
    <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-4 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl`}>
                <Icon size={20} />
            </div>
            <div className="flex-col items-center gap-3">
                <h4 className="font-bold text-primary text-sm tracking-wide">{title}</h4>
                <h5 className="font-bold text-primary italic text-sm tracking-wide">({description})</h5>
            </div>
        </div>
        <RichTextEditor
            name={name}
            control={control}
            errors={errors}
            placeholder={placeholder}
        />
    </div>
);

export const DecisionComponent = (props) => {
    const { t } = useTranslation();
    const { methods, errors } = props;
    const { register, control } = methods;

    return (
        <div className="space-y-8">
            {/* HEADER INSTRUCTION */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 text-secondary dark:text-primary"
            >
                <ClipboardList className="min-w-6" />
                <p>
                    <b>{`${t('common.task')}: `}</b>
                    {t('decision.instruction')}
                </p>
            </motion.div>

            <div className="space-y-8">
                {/* STRATEGY NAME - HIGH PROMINENCE */}
                <section className="p-8 bg-tertiary dark:bg-secondary rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="text-primary" size={24} />
                        <h3 className="text-xl font-black text-primary">{t('decision.labels.strategy_name')}</h3>
                    </div>
                    <Input
                        {...register("policy_name")}
                        placeholder={t('decision.questions.placeholders.strategy')}
                        errors={errors}
                        control={control}
                    />
                    {errors.policy_name && <p className="text-red-500 text-xs mt-2 italic">{errors.policy_name.message}</p>}
                </section>

                {/* DIMENSIONS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <PolicySection
                        icon={Leaf}
                        title={t('decision.labels.env_benefit')}
                        description={t('decision.labels.env_benefit_desc')}
                        name="env_benefit"
                        placeholder={t('decision.questions.placeholders.general')}
                        control={control}
                        errors={errors}
                    />
                    <PolicySection
                        icon={BadgeDollarSign}
                        title={t('decision.labels.eco_cost')}
                        description={t('decision.labels.eco_cost_desc')}
                        name="eco_cost"
                        placeholder={t('decision.questions.placeholders.general')}
                        control={control}
                        errors={errors}
                    />
                    <PolicySection
                        icon={Users}
                        title={t('decision.labels.social_impact')}
                        description={t('decision.labels.social_impact_desc')}
                        name="social_impact"
                        placeholder={t('decision.questions.placeholders.general')}
                        control={control}
                        errors={errors}
                    />
                </div>

                {/* PROFESSIONAL CONCLUSION */}
                <motion.section
                    className="mt-12 p-8 bg-primary dark:bg-secondary rounded-2xl text-background shadow-xl relative overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                >
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-2xl dark:text-primary">{t('decision.labels.conclusion')}</h3>
                                <p className="text-white/60 text-sm">{t('decision.questions.conclusion_desc')}</p>
                            </div>
                        </div>

                        <RichTextEditor
                            name="policy_conclusion"
                            control={control}
                            errors={errors}
                            placeholder={t('decision.questions.placeholders.final')}
                        />
                    </div>

                </motion.section>
            </div>

            <FooterLesson
                description="Selamat! Anda telah menyelesaikan seluruh rangkaian investigasi polusi mikroplastik dari hulu ke hilir."
            />
        </div>
    );
};