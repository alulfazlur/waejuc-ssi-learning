"use client";
import {
    ClipboardList,
    Layers,
    Wind,
    Fish,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Instruction from "@components/Instruction";
import RichEditor from "@/components/RichTextEditor";

export const QualitativeComponent = (props) => {
    const { t } = useTranslation();
    const { methods, errors } = props;
    const { register, control } = methods;

    return (
        <div className="space-y-8">
            <div className="flex gap-3 text-secondary dark:text-primary p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                <ClipboardList className="min-w-6" />
                <p className="text-sm leading-relaxed">
                    <b>{`${t('common.task')}: `}</b>
                    {t('qualitative.instruction')}
                </p>
            </div>

            <section className="space-y-6">
                <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4">
                    <Instruction
                        title={t('qualitative.analysis.q1_title')}
                        description={t('qualitative.analysis.q1_desc')}
                        icon={Wind}
                    />
                    <RichEditor
                        {...register("analysis_fragmentation")}
                        errors={errors}
                        control={control}
                    />
                </div>

                <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4">
                    <Instruction
                        title={t('qualitative.analysis.q2_title')}
                        description={t('qualitative.analysis.q2_desc')}
                        icon={Layers}
                    />
                    <RichEditor
                        {...register("analysis_microplastic_types")}
                        errors={errors}
                        control={control}
                    />
                </div>

                <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4">
                    <Instruction
                        title={t('qualitative.analysis.q3_title')}
                        description={t('qualitative.analysis.q3_desc')}
                        icon={Fish}
                    />
                    <RichEditor
                        {...register("analysis_biological_exposure")}
                        errors={errors}
                        control={control}
                    />
                </div>
            </section>
        </div>
    );
};