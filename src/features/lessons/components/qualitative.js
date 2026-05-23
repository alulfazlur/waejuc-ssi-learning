"use client";
import {
    ClipboardList,
    SearchAlert,
    Wind,
    Container,
    Sparkles,
    Spline
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Instruction from "@components/Instruction";
import RichEditor from "@/components/RichTextEditor";
import DiagramInput from "@/components/DiagramInput";

export const QualitativeComponent = (props) => {
    const { t } = useTranslation();
    const { methods, errors } = props;
    const { control } = methods;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-3 text-secondary dark:text-primary p-4 bg-secondary/5 dark:bg-tertiary/10 rounded-2xl border border-secondary/10">
                <div className="flex gap-3">
                    <ClipboardList className="min-w-6 text-primary" />
                    <p className="text-sm leading-relaxed">
                        <b>{`${t('common.task')}: `}</b>
                        {t('qualitative.instruction')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-background dark:bg-secondary/20 rounded-xl border border-secondary/10 shadow-sm group">
                        <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                            <Container size={32} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold">{t('qualitative.illustration.plastic')}</h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-background dark:bg-secondary/20 rounded-xl border border-secondary/10 shadow-sm group">
                        <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg relative">
                            <Spline size={32} />
                            <Sparkles size={14} className="absolute top-2 right-2 animate-pulse text-sky-500" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold">{t('qualitative.illustration.fiber')}</h4>
                        </div>
                    </div>

                </div>
            </div>

            <section className="space-y-6">
                <div className="bg-tertiary dark:bg-secondary rounded-2xl border border-border dark:border-primary/20 p-6">
                    <Instruction
                        title={t('qualitative.analysis.q1_title')}
                        description={t('qualitative.analysis.q1_desc')}
                        icon={Wind}
                    />
                    <RichEditor
                        name="qual_analysis_fragmentation"
                        errors={errors}
                        control={control}
                    />
                </div>

                <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm">
                    <Instruction
                        title={t('qualitative.analysis.q2_title')}
                        description={t('qualitative.analysis.q2_desc')}
                        icon={SearchAlert}
                    />
                    <div className="mb-6">
                        <Instruction
                            description={t('qualitative.analysis.q2_step1')}
                            icon={null}
                        />
                        <DiagramInput
                            name="qual_analysis_anomaly_diagram"
                            errors={errors}
                            control={control}
                        />
                    </div>
                    <div className="mb-6">
                        <Instruction
                            description={t('qualitative.analysis.q2_step2')}
                            icon={null}
                        />
                        <RichEditor
                            name="qual_analysis_anomaly_behaviour"
                            errors={errors}
                            control={control}
                        />
                    </div>
                    <div>
                        <Instruction
                            description={t('qualitative.analysis.q2_step3')}
                            icon={null}
                        />
                        <RichEditor
                            name="qual_analysis_microplastic_risk"
                            errors={errors}
                            control={control}
                        />
                    </div>
                </div>

            </section>
        </div>
    );
};