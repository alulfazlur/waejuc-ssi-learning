"use client";
import { Calculator, Pipette, Fish, Waves, ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";
import Instruction from "@components/Instruction";
import RichEditor from "@/components/RichTextEditor";

import stationsData from "@data/data_stations.json";
import trophicData from "@data/data_trophic.json";

export const QuantitativeComponent = (props) => {
    const { t, i18n } = useTranslation();
    const { methods, errors } = props;
    const { register, control } = methods;
    const isEn = i18n.language === 'en';

    return (
        <div className="space-y-12">
            <div className="flex gap-3 text-secondary dark:text-primary p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                <ClipboardList className="min-w-6" />
                <p className="text-sm leading-relaxed">
                    <b>{`${t('common.activity')}: `}</b>
                    {t('qualitative.instruction')}
                </p>
            </div>
          
            <section className="space-y-6">
                <Instruction
                    title={t('quantitative.sections.abundance')}
                    icon={Waves}
                />

                <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-tertiary dark:bg-secondary text-primary uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">{t('quantitative.columns.station')}</th>
                                <th className="px-6 py-4">{t('quantitative.columns.location')}</th>
                                <th className="px-6 py-4 text-center">{t('quantitative.columns.distance')}</th>
                                <th className="px-6 py-4 text-right">{t('quantitative.columns.concentration')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {stationsData.map((row) => (
                                <tr key={row.id} className="hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-4 font-medium">{row.station}</td>
                                    <td className="px-6 py-4 opacity-80">{isEn ? row.location_en : row.location_id}</td>
                                    <td className="px-6 py-4 text-center font-mono">{row.distance}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-primary">
                                        {row.concentration.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4">
                    <Instruction
                        title={t('quantitative.questions.q1_title')}
                        description={t('quantitative.questions.q1_desc')}
                        icon={Pipette}
                    />
                    <RichEditor
                        {...register("calc_runoff_vs_currents")}
                        control={control}
                        errors={errors}
                    />
                </div>

                <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4">
                    <Instruction
                        title={t('quantitative.questions.q2_title')}
                        description={t('quantitative.questions.q2_desc')}
                        icon={Calculator}
                    />
                    <RichEditor
                        {...register("calc_human_exposure")}
                        control={control}
                        errors={errors}
                    />
                </div>
            </section>

            <section className="space-y-6">
                <Instruction
                    title={t('quantitative.sections.biomagnification')}
                    icon={Fish}
                />

                <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-tertiary dark:bg-secondary text-primary uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">{t('quantitative.columns.level')}</th>
                                <th className="px-6 py-4">{t('quantitative.columns.species')}</th>
                                <th className="px-6 py-4 text-right">{t('quantitative.columns.load')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {trophicData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-4 font-medium">{isEn ? row.level_en : row.level_id}</td>
                                    <td className="px-6 py-4 italic opacity-80">{row.species}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-primary">{row.avg_load_mg_kg.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4">
                    <Instruction
                        title={t('quantitative.questions.q3_title')}
                        description={t('quantitative.questions.q3_desc')}
                        icon={Calculator}
                    />
                    <RichEditor
                        {...register("calc_biomagnification")}
                        control={control}
                        errors={errors}
                        rows={4}
                    />
                </div>
            </section>
        </div>
    );
};