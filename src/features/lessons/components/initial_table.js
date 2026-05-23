"use client";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import Input from "@components/Input";
import Select from "@components/Select";

const ComponentsTable = ({ control, register, errors }) => {
    const { t } = useTranslation();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "initial_component_ecosystem",
    });

    const tableErrors = errors?.initial_component_ecosystem;
    const rootError = tableErrors?.root?.message || tableErrors?.message;

    const addRow = () => {
        append({ component: "", type: "", role: "" });
    };

    const TYPE_OPTIONS = [
        { value: "Biotic", label: t("initial.table_component.biotic") },
        { value: "Abiotic", label: t("initial.table_component.abiotic") },
    ];

    return (
        <div className="space-y-4 min-w-0">
            <div className="min-w-0 overflow-x-auto rounded-2xl border border-border shadow-sm">
                <table className="text-sm text-left" style={{ minWidth: "320px", width: "100%" }}>
                    <thead className="bg-tertiary dark:bg-secondary text-primary uppercase text-xs font-bold">
                        <tr>
                            <th className="px-4 py-3 w-8 text-center">#</th>
                            <th className="px-4 py-3 min-w-44">
                                {t('initial.table_component.headers.0')}
                            </th>
                            <th className="px-4 py-3 w-44">
                                {t('initial.table_component.headers.1')}
                            </th>
                            <th className="px-4 py-3 min-w-44">
                                {t('initial.table_component.headers.2')}
                            </th>
                            <th className="px-4 py-3 w-10" />
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        <tr className="font-normal italic text-secondary dark:text-primary bg-tertiary/60 dark:bg-secondary/60 border-t border-border">
                            <td className="px-4 py-2 text-center opacity-40 text-xs">{t('common.example')}</td>
                            {t('initial.table_component.row', { returnObjects: true })?.map((cell, idx) => (
                                <td key={idx} className="px-4 py-2 opacity-60 text-xs">{cell}</td>
                            ))}
                            <td />
                        </tr>
                        {fields.map((field, index) => {
                            const rowError = tableErrors?.[index];
                            return (
                                <tr key={field.id} className="align-top">
                                    <td className="px-4 py-3 text-center text-xs text-secondary align-middle">
                                        {index + 1}
                                    </td>

                                    <td className="px-4 py-3">
                                        <Input
                                            {...register(`initial_component_ecosystem.${index}.component`)}
                                            placeholder={t('initial.table_component.name_placeholder')}
                                            errors={errors}
                                            error={rowError?.component}
                                            control={control}
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <Select
                                            {...register(`initial_component_ecosystem.${index}.type`)}
                                            placeholder={t('common.select_placeholder')}
                                            errors={errors}
                                            error={rowError?.type}
                                            control={control}
                                            options={TYPE_OPTIONS}
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <Input
                                            {...register(`initial_component_ecosystem.${index}.role`)}
                                            placeholder={t('initial.table_component.role_placeholder')}
                                            errors={errors}
                                            error={rowError?.role}
                                            control={control}
                                        />
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