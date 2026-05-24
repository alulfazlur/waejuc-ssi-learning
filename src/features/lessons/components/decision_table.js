"use client";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import Input from "@components/Input";
import Select from "@components/Select";
import RichEditor from "@/components/RichTextEditor";

const ComponentsTable = ({ control, register, errors }) => {
    const { t } = useTranslation();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "decision_strategy",
    });

    const tableErrors = errors?.decision_strategy;
    const rootError = tableErrors?.root?.message || tableErrors?.message;

    const addRow = () => {
        append({ component: "", type: "", role: "" });
    };

    const ROLE_OPTIONS = [
        { value: "fisherman", label: t("decision.table_component.roles.0") },
        { value: "seller", label: t("decision.table_component.roles.1") },
        { value: "government", label: t("decision.table_component.roles.2") },
    ];

    return (
        <div className="space-y-4 min-w-0">
            <div className="min-w-0 overflow-x-auto rounded-2xl border border-border shadow-sm">
                <table className="text-sm text-left" style={{ minWidth: "320px", width: "100%" }}>
                    <thead className="bg-tertiary dark:bg-secondary text-primary uppercase text-xs font-bold">
                        <tr>
                            <th className="px-4 py-3 w-[1%] text-center">#</th>
                            <th className="px-4 py-3 w-[47.5%]">
                                {t('decision.table_component.headers.0')} / {t('decision.table_component.headers.1')}
                                <br />
                                {t('decision.table_component.headers.2')}
                            </th>
                            <th className="px-4 py-3 w-[47.5%]">
                                {t('decision.table_component.headers.3')}
                            </th>
                            <th className="px-4 py-3 w-[5%]" />
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {fields.map((field, index) => {
                            const rowError = tableErrors?.[index];
                            return (
                                <tr key={field.id} className="align-top">
                                    <td className="px-4 py-3 text-center text-xs text-secondary align-middle">
                                        {index + 1}
                                    </td>

                                    <td className="px-4 py-3 place-content-center">
                                        <div className="flex flex-col gap-3">
                                            <Input
                                                {...register(`decision_strategy.${index}.component`)}
                                                errors={errors}
                                                error={rowError?.component}
                                                control={control}
                                                placeholder={t('decision.table_component.name_placeholder')}
                                            />
                                            <Select
                                                {...register(`decision_strategy.${index}.role`)}
                                                placeholder={t('common.select_placeholder')}
                                                errors={errors}
                                                error={rowError?.type}
                                                control={control}
                                                options={ROLE_OPTIONS}
                                            />
                                            <RichEditor
                                                name={`decision_strategy.${index}.solution`}
                                                control={control}
                                                errors={errors}
                                                rows={4}
                                                fullHeight
                                                placeholder={t('decision.table_component.solution_placeholder')}
                                            />
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 flex flex-col gap-3">
                                        <div className="flex flex-col gap-3 text-secondary dark:text-primary p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                                            <span>
                                                <b>{t('decision.table_component.economy_impact.title')} : </b>
                                                {t('decision.table_component.economy_impact.description')}
                                            </span>
                                            <RichEditor
                                                name={`decision_strategy.${index}.economy_impact`}
                                                control={control}
                                                errors={errors}
                                                rows={4}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3 text-secondary dark:text-primary p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                                            <span>
                                                <b>{t('decision.table_component.env_impact.title')} : </b>
                                                {t('decision.table_component.env_impact.description')}
                                            </span>
                                            <RichEditor
                                                name={`decision_strategy.${index}.env_impact`}
                                                control={control}
                                                errors={errors}
                                                rows={4}
                                            />
                                        </div>
                                    </td>

                                    <td className="px-3 py-3 align-middle">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            disabled={fields.length <= 5}
                                            className="cursor-pointer p-1.5 rounded-lg text-secondary hover:text-red-500 hover:bg-red-50
                                                dark:hover:bg-red-500/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                                            title="Delete"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {rootError && (
                        <p className="text-red-500 text-xs italic">{rootError}</p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={addRow}
                    className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-primary
                        px-3 py-2 rounded-xl border border-primary/20 bg-primary/5
                        hover:bg-primary/10 transition-colors"
                >
                    <Plus size={13} />
                    {t('initial.table_component.add_row')}
                </button>
            </div>
        </div>
    );
};

export default ComponentsTable;