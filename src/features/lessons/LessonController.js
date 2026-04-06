"use client";
import { useEffect } from 'react'
import { useRouter, notFound } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { createClient } from "@lib/supabase/client";
import { useAuth } from "@context/AuthContext";

import { FORM_SCHEMAS } from "@features/lessons/logic/form-configs";
import { InitialComponent, QualitativeComponent, QuantitativeComponent, ExplanationComponent, DecisionComponent, CompletionPage } from "@features/lessons/components";
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
};

export default function LessonController({ slug }) {
    const supabase = createClient()
    const router = useRouter();
    const { refreshProgress, user, responses } = useAuth();

    const schema = FORM_SCHEMAS[slug];
    const isCompletePage = slug === "complete";

    const methods = useForm({
        resolver: schema ? yupResolver(schema) : undefined,
        mode: "onChange",
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

            if (nextIndex < LEVEL_ORDER.length && nextIndex < 5) {
                const nextSlug = LEVEL_ORDER[nextIndex];
                alert("Data tersimpan! Melanjutkan ke level berikutnya...");
                router.push(`/learning/${nextSlug}`);
            } else {
                alert("Selamat! Anda telah menyelesaikan semua level praktikum.");
                router.push("/learning/complete");
            }

        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Error saving:", err.message);
            alert("Gagal menyimpan data.");
        }
    };

    useEffect(() => {
        const savedContent = responses[slug];
        if (savedContent) {
            methods.reset(savedContent);
        }
    }, [slug, responses, methods]);

    if (isCompletePage && !responses["decision"]) {
        alert("Anda harus menyelesaikan level sebelumnya terlebih dahulu.");
        router.push("/learning/decision");
        return null;
    }

    if (isCompletePage) {
        return <CompletionPage />;
    }
    
    const ActiveComponent = COMPONENT_MAP[slug];

    if (!ActiveComponent) {
        return notFound();
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ActiveComponent
                    methods={methods}
                    errors={errors}
                />
                <div className="my-8 flex justify-end">
                    <Button type="submit">
                        Simpan & Lanjut
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}