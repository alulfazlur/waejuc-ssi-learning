"use client";
import { Waves, ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";
import Instruction from "@components/Instruction";
import RichEditor from "@components/RichTextEditor";

export const ReflectionComponent = ({ control, errors }) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-8">
            <div className="flex gap-3 text-secondary dark:text-primary p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                <ClipboardList className="min-w-6" />
                <p className="text-sm leading-relaxed">
                    <b>{`${t('common.activity')}: `}</b>
                    {t('reflection.instruction')}
                </p>
            </div>

            <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4">
                <Instruction
                    title={t('reflection.insight')}
                    description={t('reflection.insight_desc')}
                    icon={Waves}
                />
                <RichEditor
                    name="reflection_insight"
                    control={control}
                    errors={errors}
                />
            </div>

            <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4">
                <Instruction
                    title={t('reflection.feel')}
                    description={t('reflection.feel_desc')}
                    icon={Waves}
                />
                <RichEditor
                    name="reflection_feel"
                    control={control}
                    errors={errors}
                />
            </div>

            <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4">
                <Instruction
                    title={t('reflection.teach')}
                    description={t('reflection.teach_desc')}
                    icon={Waves}
                />
                <RichEditor
                    name="reflection_teach"
                    control={control}
                    errors={errors}
                />
            </div>

            <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4">
                <Instruction
                    title={t('reflection.action')}
                    description={t('reflection.action_desc')}
                    icon={Waves}
                />
                <RichEditor
                    name="reflection_action"
                    control={control}
                    errors={errors}
                />
            </div>
        </div>
    );
}