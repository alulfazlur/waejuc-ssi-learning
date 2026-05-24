"use client";
import { useEffect } from 'react'
import { useRouter, notFound } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from 'sonner';

import { createClient } from "@lib/supabase/client";
import { useAuth } from "@context/AuthContext";
import { useTranslation } from "react-i18next";

import {
    InitialComponent, QualitativeComponent, QuantitativeComponent,
    ExplanationComponent, DecisionComponent, ReflectionComponent, CompletionPage
} from "@features/lessons/components";
import { SYLLABUS } from "@constants/syllabus";
import Button from "@components/Button";

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

export default function LessonController({ slug }) {
    const supabase = createClient()
    const router = useRouter();
    const { t } = useTranslation();
    const { refreshProgress, user, responses } = useAuth();

    const richTextValidation = yup.string()
        .required(t('validation.required'))
        .test('not-empty', t('validation.required'), (val) => {
            const stripped = val?.replace(/<[^>]*>?/gm, '').trim();
            return stripped && stripped.length > 0;
        })

    const schemas = {
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
            qual_analysis_fragmentation: richTextValidation,
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

    const methods = useForm({
        resolver: schemas[slug] ? yupResolver(schemas[slug]) : undefined,
        mode: "onChange",
        reValidateMode: "onChange",
        shouldFocusError: true,
        defaultValues: {
            // initial
            initial_main_issue_analysis: '',
            initial_source_analysis: '',
            initial_awareness_analysis: '',
            initial_component_ecosystem: Array(5).fill({ component: "", type: "", role: "" }),
            initial_component_ecosystem_analysis: '',
            // qualitative
            qual_analysis_fragmentation: '',
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
        }
    });

    const { handleSubmit, formState: { errors } } = methods;

    const cleanDiagram = (diagram) => {
        if (!diagram || typeof diagram !== 'object') return diagram;
        return {
            nodes: (diagram.nodes ?? []).map(n => ({
                id: n.id,
                position: n.position,
                data: n.data,
                ...(n.style ? { style: n.style } : {}),
            })),
            edges: (diagram.edges ?? []).map(e => ({
                id: e.id,
                source: e.source,
                target: e.target,
                ...(e.sourceHandle ? { sourceHandle: e.sourceHandle } : {}),
                ...(e.targetHandle ? { targetHandle: e.targetHandle } : {}),
                data: e.data,
                label: e.label,
            })),
        };
    };


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

            await refreshProgress(user);

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

    const onError = () => toast.error(t('validation.recheck_answer'));

    useEffect(() => {
        const savedContent = responses[slug];
        if (savedContent) {
            methods.reset(savedContent);
        } else {
            methods.reset();
        }
    }, [slug, responses, methods]);

    if (slug === "complete") {
        return <CompletionPage />;
    }

    const ActiveComponent = COMPONENT_MAP[slug];

    if (!ActiveComponent) {
        return notFound();
    }

    return (
        <FormProvider {...methods}>
            <ActiveComponent
                methods={methods}
                errors={errors}
            />
            <div className="flex justify-end sticky bottom-7.5 mt-12 z-50">
                <Button type="submit" onClick={handleSubmit(onSubmit, onError)}>
                    {t('common.submit')}
                </Button>
            </div>
        </FormProvider>
    );
}