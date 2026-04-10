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
            main_issue_analysis: richTextValidation,
            plastic_name: yup.string().required(t('validation.required')),
            plastic_props: richTextValidation,
            plastic_behavior_pred: richTextValidation,
            organism_name: yup.string().required(t('validation.required')),
            organism_props: richTextValidation,
            organism_behavior_pred: richTextValidation,
            components_table: yup.array().of(yup.object({}).shape({
                component: yup.string().required(t('validation.required')),
                type: richTextValidation,
                role: yup.string().required(t('validation.required')),
            }))
        }),
        qualitative: yup.object({
            analysis_fragmentation: richTextValidation,
            analysis_microplastic_types: richTextValidation,
            analysis_biological_exposure: richTextValidation,
        }),
        quantitative: yup.object({
            calc_runoff_vs_currents: richTextValidation,
            calc_human_exposure: richTextValidation,
            calc_biomagnification: richTextValidation,
        }),
        explanation: yup.object({
            transformation_mechanism: richTextValidation,
        }),
        reflection: yup.object({
            reflection_insight: richTextValidation,
            reflection_feel: richTextValidation,
            reflection_teach: richTextValidation,
            reflection_action: richTextValidation,
        }),
        decision: yup.object({
            policy_name: yup.string().required(t('validation.required')),
            env_benefit: richTextValidation,
            eco_cost: richTextValidation,
            social_impact: richTextValidation,
            policy_conclusion: richTextValidation,
        }),
    };

    const methods = useForm({
        resolver: schemas[slug] ? yupResolver(schemas[slug]) : undefined,
        mode: "onChange",
        reValidateMode: "onChange",
        shouldFocusError: true,
        defaultValues: {
            // initial
            main_issue_analysis: '',
            plastic_name: '',
            plastic_props: '',
            plastic_behavior_pred: '',
            organism_name: '',
            organism_props: '',
            organism_behavior_pred: '',
            components_table: Array(5).fill({ component: "", type: "", role: "" }),
            // qualitative
            analysis_fragmentation: '',
            analysis_microplastic_types: '',
            analysis_biological_exposure: '',
            // quantitative
            calc_runoff_vs_currents: '',
            calc_human_exposure: '',
            calc_biomagnification: '',
            // explanation
            transformation_mechanism: '',
            // reflection
            reflection_insight: '',
            reflection_feel: '',
            reflection_teach: '',
            reflection_action: '',
            // decision
            policy_name: '',
            env_benefit: '',
            eco_cost: '',
            social_impact: '',
            policy_conclusion: '',
        }
    });

    const { handleSubmit, formState: { errors } } = methods;

    const onSubmit = async (formData) => {
        try {
            const { error: dbError } = await supabase
                .from('student_responses')
                .upsert({
                    student_id: user.id,
                    level_slug: slug,
                    content: formData,
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
            methods.reset({ components_table: Array(5).fill({ component: "", type: "", role: "" }) });
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
            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <ActiveComponent
                    methods={methods}
                    errors={errors}
                />
                <div className="flex justify-end sticky bottom-7.5 mt-12 z-50">
                    <Button type="submit">
                        {t('common.submit')}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}