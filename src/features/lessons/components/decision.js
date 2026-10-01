"use client";
import { useTranslation } from "react-i18next";

import Callout from "@components/Callout";
import QuestionCard from "@components/QuestionCard";
import RichEditor from "@components/RichTextEditor";
import Table from "./decision_table";

export const DecisionComponent = (props) => {
    const { t } = useTranslation();
    const { methods, errors } = props;
    const { register, control } = methods;

    return (
        <div className="space-y-6">
            <Callout label={t('common.instruction')}>
                {t('decision.instruction')}
            </Callout>

            <QuestionCard
                number={1}
                title={t('decision.table_component.title')}
                fields={["decision_strategy"]}
            >
                <Table control={control} register={register} errors={errors} />
            </QuestionCard>

            <QuestionCard
                number={2}
                title={t('decision.conclusion.title')}
                fields={["decision_conclusion"]}
                description={(
                    <div className="space-y-3">
                        <p>
                            <b>{t('decision.conclusion.desc_primary')}</b>
                            <br />
                            {t('decision.conclusion.desc')}
                        </p>
                        <p className="font-semibold">{t('decision.conclusion.discuss')}</p>
                        <ul className="list-disc space-y-2 pl-5">
                            <li>
                                <b>{t('decision.conclusion.presenter')}: </b>
                                {t('decision.conclusion.presenter_desc')}
                            </li>
                            <li>
                                <b>{t('decision.conclusion.audience')}: </b>
                                {t('decision.conclusion.audience_desc')}
                            </li>
                        </ul>
                    </div>
                )}
            >
                <RichEditor
                    name="decision_conclusion"
                    errors={errors}
                    control={control}
                    ariaLabel={t('decision.conclusion.title')}
                    placeholder={t('decision.conclusion.placeholder')}
                />
            </QuestionCard>
        </div>
    );
};
