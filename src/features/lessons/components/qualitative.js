"use client";
import { Container, Sparkles, Spline } from "lucide-react";
import { useTranslation } from "react-i18next";
import Callout from "@components/Callout";
import Instruction from "@components/Instruction";
import QuestionCard from "@components/QuestionCard";
import RichEditor from "@/components/RichTextEditor";
import DiagramInput from "@/components/DiagramInput";

export const QualitativeComponent = (props) => {
    const { t } = useTranslation();
    const { methods, errors } = props;
    const { control } = methods;

    return (
        <div className="space-y-6">
            <Callout label={t('common.task')}>
                {t('qualitative.instruction')}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl bg-card p-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-quaternary/15 text-quaternary">
                            <Container size={24} aria-hidden="true" />
                        </span>
                        <span className="text-sm font-semibold">{t('qualitative.illustration.plastic')}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-card p-3">
                        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                            <Spline size={24} aria-hidden="true" />
                            <Sparkles size={11} className="absolute right-1.5 top-1.5" aria-hidden="true" />
                        </span>
                        <span className="text-sm font-semibold">{t('qualitative.illustration.fiber')}</span>
                    </div>
                </div>
            </Callout>

            <QuestionCard
                number={1}
                title={t('qualitative.analysis.q1_title')}
                description={(
                    <div className="space-y-2">
                        <p>{t('qualitative.analysis.q1_desc')}</p>
                        <p>{t('qualitative.analysis.q2_desc')}</p>
                    </div>
                )}
                fields={["qual_analysis_anomaly_diagram", "qual_analysis_anomaly_behaviour", "qual_analysis_microplastic_risk"]}
            >
                <div>
                    <Instruction description={t('qualitative.analysis.q2_step1')} refs="1, 2, 3, 10" />
                    <DiagramInput
                        name="qual_analysis_anomaly_diagram"
                        errors={errors}
                        control={control}
                    />
                </div>
                <div>
                    <Instruction description={t('qualitative.analysis.q2_step2')} refs="6, 7" />
                    <RichEditor
                        name="qual_analysis_anomaly_behaviour"
                        errors={errors}
                        control={control}
                        ariaLabel={t('qualitative.analysis.q2_step2')}
                    />
                </div>
                <div>
                    <Instruction description={t('qualitative.analysis.q2_step3')} refs="6, 7" />
                    <RichEditor
                        name="qual_analysis_microplastic_risk"
                        errors={errors}
                        control={control}
                        ariaLabel={t('qualitative.analysis.q2_step3')}
                    />
                </div>
            </QuestionCard>
        </div>
    );
};
