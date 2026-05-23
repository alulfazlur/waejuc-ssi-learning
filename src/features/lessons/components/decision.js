"use client";
import { ClipboardList, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import Instruction from "@components/Instruction";
import RichEditor from "@components/RichTextEditor";
import Table from "./decision_table";

export const DecisionComponent = (props) => {
    const { t } = useTranslation();
    const { methods, errors } = props;
    const { register, control } = methods;

    return (
        <div className="space-y-8">
            <div className="flex gap-3 text-secondary dark:text-primary p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                <ClipboardList className="min-w-6" />
                <p className="text-sm leading-relaxed">
                    <b>{`${t('common.instruction')}: `}</b>
                    {t('decision.instruction')}
                </p>
            </div>

            <div className="space-y-8">
                <Table control={control} register={register} errors={errors} />

                <section className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm">
                    <Instruction
                        title={t('decision.conclusion.title')}
                        description={(
                            <>
                                <b>{t('decision.conclusion.desc_primary')}</b>
                                <br />
                                <span>{t('decision.conclusion.desc')}</span>
                                <br />
                                <br />
                                <b>{t('decision.conclusion.discuss')}</b>
                                <br />
                                <span className="list-disc list-inside space-y-1">
                                    <span className="list-item">
                                        <b>{t('decision.conclusion.presenter')}: </b>
                                        <br />
                                        {t('decision.conclusion.presenter_desc')}
                                    </span>
                                    <br />
                                    <span className="list-item">
                                        <b>{t('decision.conclusion.audience')}: </b>
                                        <br />
                                        {t('decision.conclusion.audience_desc')}
                                    </span>
                                </span>
                            </>
                        )}
                        icon={FileText}
                    />
                    <RichEditor
                        name="decision_conclusion"
                        errors={errors}
                        control={control}
                        placeholder={t('decision.conclusion.placeholder')}
                    />
                </section>
            </div>
        </div>
    );
};