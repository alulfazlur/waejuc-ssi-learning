"use client";
import { Calculator, Pipette, Fish, Waves, Scale, Gauge, Store } from "lucide-react";
import { useTranslation } from "react-i18next";
import Callout from "@components/Callout";
import Card from "@components/Card";
import QuestionCard from "@components/QuestionCard";
import RichEditor from "@/components/RichTextEditor";

import stationsData from "@data/data_stations.json";
import trophicData from "@data/data_trophic.json";

function DataSection({ icon: Icon, title, description, children }) {
    return (
        <Card as="section" className="overflow-hidden">
            <div className="p-5 sm:p-6">
                <div className="mb-2 flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-surface-subtle text-secondary">
                        <Icon size={18} aria-hidden="true" />
                    </span>
                    <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
                </div>
                <p className="text-[15px] leading-relaxed text-primary/90">{description}</p>
            </div>
            <div className="overflow-x-auto border-t border-border">{children}</div>
        </Card>
    );
}

const th = "px-4 py-3 font-semibold sm:px-6";
const td = "px-4 py-3 sm:px-6";

export const QuantitativeComponent = (props) => {
    const { t, i18n } = useTranslation();
    const { methods, errors } = props;
    const { control } = methods;
    const isEn = i18n.language === 'en';

    const question = (number, key, field, Icon, refs) => (
        <QuestionCard
            number={number}
            icon={Icon}
            title={t(`quantitative.questions.${key}_title`)}
            description={t(`quantitative.questions.${key}_desc`)}
            refs={refs}
            fields={[field]}
        >
            <RichEditor
                name={field}
                control={control}
                errors={errors}
                ariaLabel={t(`quantitative.questions.${key}_title`)}
            />
        </QuestionCard>
    );

    return (
        <div className="space-y-6">
            <Callout label={t('common.activity')}>
                {t('quantitative.instruction')}
            </Callout>

            <DataSection icon={Waves} title={t('quantitative.abundance.title')} description={t('quantitative.abundance.description')}>
                <table className="w-full min-w-120 text-left text-sm">
                    <thead className="bg-surface-subtle text-xs uppercase tracking-wide">
                        <tr>
                            <th scope="col" className={th}>{t('quantitative.columns.station')}</th>
                            <th scope="col" className={th}>{t('quantitative.columns.location')}</th>
                            <th scope="col" className={`${th} text-center`}>{t('quantitative.columns.distance')}</th>
                            <th scope="col" className={`${th} text-right`}>{t('quantitative.columns.concentration')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {stationsData.map((row) => (
                            <tr key={row.id}>
                                <td className={`${td} whitespace-nowrap font-medium`}>{row.station}</td>
                                <td className={`${td} text-primary/80`}>{isEn ? row.location_en : row.location_id}</td>
                                <td className={`${td} text-center font-mono`}>{row.distance}</td>
                                <td className={`${td} text-right font-mono font-medium tabular-nums`}>
                                    {row.concentration.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataSection>

            {question(1, "q1", "quant_estuary_concentration", Pipette, "11")}
            {question(2, "q2", "quant_exposure_estimation", Calculator)}

            <DataSection icon={Fish} title={t('quantitative.biomagnification.title')} description={t('quantitative.biomagnification.description')}>
                <table className="w-full min-w-120 text-left text-sm">
                    <thead className="bg-surface-subtle text-xs uppercase tracking-wide">
                        <tr>
                            <th scope="col" className={th}>{t('quantitative.columns.level')}</th>
                            <th scope="col" className={th}>{t('quantitative.columns.species')}</th>
                            <th scope="col" className={`${th} text-right`}>{t('quantitative.columns.load')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {trophicData.map((row, idx) => (
                            <tr key={idx}>
                                <td className={`${td} font-medium`}>{isEn ? row.level_en : row.level_id}</td>
                                <td className={`${td} italic text-primary/80`}>{row.species}</td>
                                <td className={`${td} text-right font-mono font-medium tabular-nums`}>{row.avg_load_mg_kg.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataSection>

            {question(3, "q3", "quant_consump_exposure", Scale)}
            {question(4, "q4", "quant_consump_limit", Gauge)}
            {question(5, "q5", "quant_concept_app", Store)}
        </div>
    );
};
