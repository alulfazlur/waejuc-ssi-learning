"use client";
import {
    ClipboardList,
    Maximize2,
    Microscope,
    ThermometerSun,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import FooterLesson from "@components/FooterLesson";
import Instruction from "@components/Instruction";
import RichEditor from "@/components/RichTextEditor";

export const QualitativeComponent = (props) => {
    const { t } = useTranslation();
    const { methods, errors } = props;
    const { register, control } = methods;

    return (
        <div className="space-y-4">
            {/* HEADER & INSTRUCTION */}
            <div className="flex gap-2 text-secondary dark:text-primary">
                <ClipboardList className="min-w-6" />
                <p>
                    <b>{`${t('common.task')}: `}</b>
                    {t('qualitative.instruction')}
                </p>
            </div>

            {/* ANALYSIS QUESTIONS */}
            <section className="space-y-6">
                {/* Question 1 */}
                <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4">
                    <Instruction
                        title={t('qualitative.analysis.q1_title')}
                        description={t('qualitative.analysis.q1_desc')}
                        icon={Maximize2}
                    />
                    <RichEditor
                        {...register("analysis_physical_change")}
                        placeholder={t('qualitative.analysis.placeholders.q1')}
                        errors={errors}
                        control={control}
                        rows={3}
                    />
                </div>

                {/* Question 2 */}
                <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4">
                    <Instruction
                        title={t('qualitative.analysis.q2_title')}
                        description={t('qualitative.analysis.q2_desc')}
                        icon={ThermometerSun}
                    />
                    <RichEditor
                        {...register("analysis_environmental_factors")}
                        placeholder={t('qualitative.analysis.placeholders.q2')}
                        errors={errors}
                        control={control}
                        rows={3}
                    />
                </div>

                {/* Question 3 */}
                <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4">
                    <Instruction
                        title={t('qualitative.analysis.q3_title')}
                        description={t('qualitative.analysis.q3_desc')}
                        icon={Microscope}
                    />
                    <RichEditor
                        {...register("analysis_fragmentation_process")}
                        placeholder={t('qualitative.analysis.placeholders.q3')}
                        errors={errors}
                        control={control}
                        rows={3}
                    />
                </div>
            </section>

            <FooterLesson
                description={t('qualitative.footer')}
            />
        </div>
    );
};