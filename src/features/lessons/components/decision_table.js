"use client";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import Input from "@components/Input";
import Select from "@components/Select";
import Button from "@components/Button";
import FieldError from "@components/FieldError";
import RichEditor from "@/components/RichTextEditor";

const EMPTY_ROW = { name: "", role: "", solution: "", economy_impact: "", env_impact: "" };

// Each strategy is a card; on wide screens the stakeholder/solution column and
// the impact column sit side by side, matching the old two-column table.
const ComponentsTable = ({ control, register, errors }) => {
    const { t } = useTranslation();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "decision_strategy",
    });

    const tableErrors = errors?.decision_strategy;
    const rootError = tableErrors?.root?.message || tableErrors?.message;

    const ROLE_OPTIONS = [
        { value: "fisherman", label: t("decision.table_component.roles.0") },
        { value: "seller", label: t("decision.table_component.roles.1") },
        { value: "government", label: t("decision.table_component.roles.2") },
    ];

    const label = "mb-1.5 block text-sm font-semibold";

    return (
        <div data-field="decision_strategy" className="min-w-0 space-y-4">
            <ol className="space-y-4">
                {fields.map((field, index) => {
                    const rowError = tableErrors?.[index];
                    return (
                        <li key={field.id} className="rounded-2xl border border-border p-4 sm:p-5">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
                                    {t('decision.table_component.strategy')} {index + 1}
                                </span>
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
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <span className={label}>
                                            {t('decision.table_component.headers.0')} / {t('decision.table_component.headers.1')}
                                        </span>
                                        <div className="space-y-3">
                                            <Input
                                                {...register(`decision_strategy.${index}.name`)}
                                                errors={errors}
                                                error={rowError?.name}
                                                control={control}
                                                aria-label={`${t('decision.table_component.headers.0')} ${index + 1}`}
                                                placeholder={t('decision.table_component.name_placeholder')}
                                            />
                                            <Select
                                                {...register(`decision_strategy.${index}.role`)}
                                                placeholder={t('common.select_placeholder')}
                                                errors={errors}
                                                error={rowError?.role}
                                                control={control}
                                                options={ROLE_OPTIONS}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <span className={label}>{t('decision.table_component.headers.2')}</span>
                                        <RichEditor
                                            name={`decision_strategy.${index}.solution`}
                                            control={control}
                                            errors={errors}
                                            ariaLabel={`${t('decision.table_component.headers.2')} ${index + 1}`}
                                            placeholder={t('decision.table_component.solution_placeholder')}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <span className={`${label} md:hidden`}>{t('decision.table_component.headers.3')}</span>
                                    <div className="rounded-xl bg-surface-subtle p-3.5">
                                        <p className="mb-2.5 text-sm leading-relaxed">
                                            <b>{t('decision.table_component.economy_impact.title')}: </b>
                                            {t('decision.table_component.economy_impact.description')}
                                        </p>
                                        <RichEditor
                                            name={`decision_strategy.${index}.economy_impact`}
                                            control={control}
                                            errors={errors}
                                            ariaLabel={`${t('decision.table_component.economy_impact.title')} ${index + 1}`}
                                        />
                                    </div>
                                    <div className="rounded-xl bg-surface-subtle p-3.5">
                                        <p className="mb-2.5 text-sm leading-relaxed">
                                            <b>{t('decision.table_component.env_impact.title')}: </b>
                                            {t('decision.table_component.env_impact.description')}
                                        </p>
                                        <RichEditor
                                            name={`decision_strategy.${index}.env_impact`}
                                            control={control}
                                            errors={errors}
                                            ariaLabel={`${t('decision.table_component.env_impact.title')} ${index + 1}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <FieldError message={rootError} className="mt-0" />
                <Button color="outline" size="sm" onClick={() => append(EMPTY_ROW)} className="ml-auto">
                    <Plus size={16} aria-hidden="true" />
                    {t('initial.table_component.add_row')}
                </Button>
            </div>
        </div>
    );
};

export default ComponentsTable;
