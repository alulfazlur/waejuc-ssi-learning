"use client";
import { useEffect, useMemo, useState } from 'react'
import { useRouter, notFound } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from 'sonner';
import { History, X } from "lucide-react";

import { createClient } from "@lib/supabase/client";
import { useAuth } from "@context/AuthContext";
import { useTranslation } from "react-i18next";

import {
    InitialComponent, QualitativeComponent, QuantitativeComponent,
    ExplanationComponent, DecisionComponent, ReflectionComponent, CompletionPage
} from "@features/lessons/components";
import { SYLLABUS } from "@constants/syllabus";
import { cleanDiagram } from "@features/lessons/cleanDiagram";
import { useDraftAutosave } from "@features/lessons/useDraftAutosave";
import { FilledFieldsContext } from "@features/lessons/FilledFieldsContext";
import { useLessonShell } from "@features/lessons/shell/LessonShellContext";
import ActionBar from "@features/lessons/shell/ActionBar";
import { formatTime } from "@features/lessons/shell/AutosaveStatus";

const LEVEL_ORDER = SYLLABUS.map(s => s.id);

const COMPONENT_MAP = {
    "initial": InitialComponent,
    "qualitative": QualitativeComponent,
    "quantitative": QuantitativeComponent,
    "explanation": ExplanationComponent,
    "decision": DecisionComponent,
    "complete": CompletionPage,
    "reflection": ReflectionComponent,
};

const DEFAULT_VALUES = {
    // initial
    initial_main_issue_analysis: '',
    initial_source_analysis: '',
    initial_awareness_analysis: '',
    initial_component_ecosystem: Array(5).fill({ component: "", type: "", role: "" }),
    initial_component_ecosystem_analysis: '',
    // qualitative
    qual_analysis_anomaly_diagram: { nodes: [], edges: [] },
    qual_analysis_anomaly_behaviour: '',
    qual_analysis_microplastic_risk: '',
    // quantitative
    quant_estuary_concentration: '',
    quant_exposure_estimation: '',
    quant_consump_exposure: '',
    quant_consump_limit: '',
    quant_concept_app: '',
    // explanation
    explain_estimation_physical_factor: '',
    explain_human_digestion: '',
    explain_health_impact: '',
    explain_causal_loop: { nodes: [], edges: [] },
    // decision
    decision_strategy: Array(5).fill({ name: "", role: "", solution: "", economy_impact: "", env_impact: "" }),
    decision_conclusion: '',
    // reflection
    reflection_website: null,
    reflection_difficulty: null,
    reflection_enjoyment: null,
};

const buildSchemas = (t) => {
    const richTextValidation = yup.string()
        .required(t('validation.required'))
        .test('not-empty', t('validation.required'), (val) => {
            const stripped = val?.replace(/<[^>]*>?/gm, '').trim();
            return stripped && stripped.length > 0;
        })

    return {
        initial: yup.object({
            initial_main_issue_analysis: richTextValidation,
            initial_source_analysis: richTextValidation,
            initial_awareness_analysis: richTextValidation,
            initial_component_ecosystem: yup.array().of(yup.object({}).shape({
                component: yup.string().required(t('validation.required')),
                type: yup.string().required(t('validation.required')),
                role: yup.string().required(t('validation.required')),
            })),
            initial_component_ecosystem_analysis: richTextValidation,
        }),
        qualitative: yup.object({
            qual_analysis_anomaly_diagram: yup.object({
                nodes: yup.array()
                    .min(5, t('validation.diagram_min_nodes'))
                    .required(t('validation.required')),
                edges: yup.array()
                    .min(2, t('validation.diagram_min_edges'))
                    .required(t('validation.required')),
            }).required(t('validation.required')),
            qual_analysis_anomaly_behaviour: richTextValidation,
            qual_analysis_microplastic_risk: richTextValidation,
        }),
        quantitative: yup.object({
            quant_estuary_concentration: richTextValidation,
            quant_exposure_estimation: richTextValidation,
            quant_consump_exposure: richTextValidation,
            quant_consump_limit: richTextValidation,
            quant_concept_app: richTextValidation,
        }),
        explanation: yup.object({
            explain_estimation_physical_factor: richTextValidation,
            explain_human_digestion: richTextValidation,
            explain_health_impact: richTextValidation,
            explain_causal_loop: yup.object({
                nodes: yup.array()
                    .min(5, t('validation.diagram_min_nodes'))
                    .required(t('validation.required')),
                edges: yup.array()
                    .min(2, t('validation.diagram_min_edges'))
                    .required(t('validation.required')),
            }).required(t('validation.required'))
        }),
        decision: yup.object({
            decision_strategy: yup.array().of(yup.object({}).shape({
                name: yup.string().required(t('validation.required')),
                role: yup.string().required(t('validation.required')),
                solution: yup.string().required(t('validation.required')),
                economy_impact: yup.string().required(t('validation.required')),
                env_impact: yup.string().required(t('validation.required')),
            })),
            decision_conclusion: richTextValidation,
        }),
        reflection: yup.object({
            reflection_website: yup.number().min(1, t('validation.required')).max(5).required(t('validation.required')),
            reflection_difficulty: yup.number().min(1, t('validation.required')).max(5).required(t('validation.required')),
            reflection_enjoyment: yup.number().min(1, t('validation.required')).max(5).required(t('validation.required')),
        }),
    };
};

// Field names of a step whose current value passes that step's schema.
const getFilledFields = (schema, values) => new Set(
    Object.keys(schema.fields).filter((field) => {
        try {
            schema.validateSyncAt(field, values);
            return true;
        } catch {
            return false;
        }
    })
);

const scrollToFirstError = (fieldOrder, errors) => {
    // Wait for the error state to render so aria-invalid markers exist.
    requestAnimationFrame(() => requestAnimationFrame(() => {
        const first = fieldOrder.find((field) => errors[field]);
        const container = (first && document.querySelector(`[data-field="${first}"]`))
            || document.querySelector('[aria-invalid="true"]');
        if (!container) return;
        // Prefer the answer area itself over toolbar buttons that come before it.
        const focusable = container.matches('input, textarea, button, [contenteditable="true"]')
            ? container
            : [
                'input[aria-invalid="true"], button[aria-invalid="true"], [contenteditable="true"][aria-invalid="true"]',
                '[contenteditable="true"]',
                'input, textarea',
                '[role="radio"][tabindex="0"]',
                'button',
            ]
                .map((selector) => container.querySelector(selector))
                .find(Boolean);
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        (focusable || container).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        focusable?.focus({ preventScroll: true });
    }));
};

export default function LessonController({ slug }) {
    const supabase = createClient()
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { refreshProgress, user, responses } = useAuth();
    const { setSaveStatus } = useLessonShell();

    const schemas = useMemo(() => buildSchemas(t), [t]);
    const schema = schemas[slug];
    const fieldOrder = useMemo(() => (schema ? Object.keys(schema.fields) : []), [schema]);

    const methods = useForm({
        resolver: schema ? yupResolver(schema) : undefined,
        mode: "onChange",
        reValidateMode: "onChange",
        shouldFocusError: false,
        defaultValues: DEFAULT_VALUES,
    });

    const { handleSubmit, formState: { errors, isSubmitting } } = methods;

    const autosave = useDraftAutosave({
        userId: user?.id,
        slug,
        methods,
        baseline: responses[slug],
        defaults: DEFAULT_VALUES,
        enabled: !!schema,
    });

    useEffect(() => {
        setSaveStatus(schema ? autosave.status : null);
    }, [autosave.status, schema, setSaveStatus]);

    useEffect(() => () => setSaveStatus(null), [setSaveStatus]);

    const [filled, setFilled] = useState(() => new Set());
    useEffect(() => {
        if (!schema) return;
        let timer;
        const compute = () => setFilled(getFilledFields(schema, methods.getValues()));
        compute();
        const subscription = methods.watch(() => {
            clearTimeout(timer);
            timer = setTimeout(compute, 300);
        });
        return () => {
            subscription.unsubscribe();
            clearTimeout(timer);
        };
    }, [schema, methods]);

    const onSubmit = async (formData) => {
        try {
            const cleaned = {
                ...formData,
                ...(formData.qual_analysis_anomaly_diagram && {
                    qual_analysis_anomaly_diagram: cleanDiagram(formData.qual_analysis_anomaly_diagram),
                }),
            };

            const { error: dbError } = await supabase
                .from('student_responses')
                .upsert({
                    student_id: user.id,
                    level_slug: slug,
                    content: cleaned,
                }, {
                    onConflict: 'student_id, level_slug'
                });

            if (dbError) throw dbError;

            autosave.clear();
            await refreshProgress(user, { silent: true });

            const currentIndex = LEVEL_ORDER.indexOf(slug);
            const nextIndex = currentIndex + 1;

            if (nextIndex < LEVEL_ORDER.length && nextIndex < 6) {
                const nextSlug = LEVEL_ORDER[nextIndex];
                toast.success(t('toast.success'))
                router.push(`/learning/${nextSlug}`);
            } else {
                router.push("/learning/complete");
            }

        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Error saving:", err.message);
            toast.error(err.message || t('toast.error'));
        }
    };

    const onError = (formErrors) => {
        toast.error(t('validation.recheck_answer'));
        scrollToFirstError(fieldOrder, formErrors);
    };

    if (slug === "complete") {
        return <CompletionPage />;
    }

    const ActiveComponent = COMPONENT_MAP[slug];

    if (!ActiveComponent) {
        return notFound();
    }

    const currentIndex = LEVEL_ORDER.indexOf(slug);
    const prevSlug = currentIndex > 0 ? LEVEL_ORDER[currentIndex - 1] : null;

    return (
        <FormProvider {...methods}>
            <FilledFieldsContext.Provider value={filled}>
                {autosave.restoredAt && (
                    <div
                        role="status"
                        className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-tertiary/70 dark:border-border bg-surface-subtle px-4 py-3 text-sm"
                    >
                        <span className="flex items-center gap-2">
                            <History size={16} className="shrink-0 text-secondary" aria-hidden="true" />
                            {t('autosave.restored', { time: formatTime(autosave.restoredAt, i18n.language) })}
                        </span>
                        <span className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={autosave.discardDraft}
                                className="min-h-9 cursor-pointer rounded-lg px-3 font-semibold text-secondary hover:bg-card"
                            >
                                {t('autosave.discard')}
                            </button>
                            <button
                                type="button"
                                onClick={autosave.dismissRestored}
                                aria-label={t('common.close')}
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted hover:bg-card"
                            >
                                <X size={16} aria-hidden="true" />
                            </button>
                        </span>
                    </div>
                )}

                <ActiveComponent
                    methods={methods}
                    errors={errors}
                />

                <ActionBar
                    prevHref={prevSlug ? `/learning/${prevSlug}` : null}
                    onSubmit={handleSubmit(onSubmit, onError)}
                    submitting={isSubmitting}
                    filledCount={fieldOrder.filter((f) => filled.has(f)).length}
                    totalCount={fieldOrder.length}
                    status={autosave.status}
                />
            </FilledFieldsContext.Provider>
        </FormProvider>
    );
}
