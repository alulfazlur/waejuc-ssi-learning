"use client";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import Input from "@components/Input";
import Select from "@components/Select";
import Button from "@components/Button";
import FieldError from "@components/FieldError";

// Below md each row renders as a stacked card; cells carry their own labels.
const cellLabel = "mb-1.5 block text-xs font-semibold text-muted md:hidden";

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

    const headers = [0, 1, 2].map((i) => t(`initial.table_component.headers.${i}`));
    const example = t('initial.table_component.row', { returnObjects: true });

    return (
        <div data-field="initial_component_ecosystem" className="min-w-0 space-y-3">
            <div className="rounded-2xl border border-dashed border-border bg-surface-subtle/60 px-4 py-3 text-sm italic text-muted">
                <span className="mr-2 font-mono text-xs not-italic uppercase tracking-wider">{t('common.example')}</span>
                {Array.isArray(example) && example.join(" · ")}
            </div>

            <div className="min-w-0 md:overflow-x-auto md:rounded-2xl md:border md:border-border">
                <table className="block w-full text-left text-sm md:table">
                    <thead className="hidden bg-surface-subtle text-xs font-semibold uppercase tracking-wide text-primary md:table-header-group">
                        <tr>
                            <th scope="col" className="w-10 px-3 py-3 text-center">#</th>
                            <th scope="col" className="min-w-44 px-3 py-3">{headers[0]}</th>
                            <th scope="col" className="w-44 px-3 py-3">{headers[1]}</th>
                            <th scope="col" className="min-w-44 px-3 py-3">{headers[2]}</th>
                            <th scope="col" className="w-12 px-3 py-3"><span className="sr-only">{t('common.actions')}</span></th>
                        </tr>
                    </thead>

                    <tbody className="block space-y-3 md:table-row-group md:space-y-0 md:divide-y md:divide-border">
                        {fields.map((field, index) => {
                            const rowError = tableErrors?.[index];
                            return (
                                <tr key={field.id} className="relative block rounded-2xl border border-border p-4 align-top md:table-row md:rounded-none md:border-0 md:p-0">
                                    <td className="mb-3 block font-mono text-xs text-muted md:mb-0 md:table-cell md:px-3 md:py-3 md:text-center md:align-middle">
                                        <span className="md:hidden">{t('common.row')} </span>{index + 1}
                                    </td>

                                    <td className="mb-3 block md:mb-0 md:table-cell md:px-3 md:py-3">
                                        <span className={cellLabel}>{headers[0]}</span>
                                        <Input
                                            {...register(`initial_component_ecosystem.${index}.component`)}
                                            placeholder={t('initial.table_component.name_placeholder')}
                                            aria-label={`${headers[0]} ${index + 1}`}
                                            errors={errors}
                                            error={rowError?.component}
                                            control={control}
                                        />
                                    </td>

                                    <td className="mb-3 block md:mb-0 md:table-cell md:px-3 md:py-3">
                                        <span className={cellLabel}>{headers[1]}</span>
                                        <Select
                                            {...register(`initial_component_ecosystem.${index}.type`)}
                                            placeholder={t('common.select_placeholder')}
                                            errors={errors}
                                            error={rowError?.type}
                                            control={control}
                                            options={TYPE_OPTIONS}
                                        />
                                    </td>

                                    <td className="block md:table-cell md:px-3 md:py-3">
                                        <span className={cellLabel}>{headers[2]}</span>
                                        <Input
                                            {...register(`initial_component_ecosystem.${index}.role`)}
                                            placeholder={t('initial.table_component.role_placeholder')}
                                            aria-label={`${headers[2]} ${index + 1}`}
                                            errors={errors}
                                            error={rowError?.role}
                                            control={control}
                                        />
                                    </td>

                                    <td className="absolute right-2 top-2 md:static md:table-cell md:px-2 md:py-3 md:align-middle">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            disabled={fields.length <= 5}
                                            aria-label={`${t('common.delete_row')} ${index + 1}`}
                                            title={t('common.delete_row')}
                                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted"
                                        >
                                            <Trash2 size={16} aria-hidden="true" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <FieldError message={rootError} className="mt-0" />
                <Button color="outline" size="sm" onClick={addRow} className="ml-auto">
                    <Plus size={16} aria-hidden="true" />
                    {t('initial.table_component.add_row')}
                </Button>
            </div>
        </div>
    );
};

export default ComponentsTable;
