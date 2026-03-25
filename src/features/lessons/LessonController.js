"use client";
import { useEffect } from 'react'
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { createClient } from "@lib/supabase/client";
import { useAuth } from "@context/AuthContext";

import { FORM_SCHEMAS } from "@features/lessons/logic/form-configs";
import { PerspectiveGallery, Explore, MicroLabAR } from "@features/lessons/components";

const LEVEL_ORDER = [
    "perspective-gallery", // Level 1
    "360-explore",         // Level 2
    "ar-lab",              // Level 3
    "system-map",          // Level 4
    "final-report"         // Level 5
];

const COMPONENT_MAP = {
    "perspective-gallery": PerspectiveGallery,
    "360-explore": Explore,
    "ar-lab": MicroLabAR,
};

export default function LessonController({ slug }) {
    const supabase = createClient()
    const router = useRouter();
    const { refreshProgress, user, responses } = useAuth();

    const schema = FORM_SCHEMAS[slug];

    const methods = useForm({
        resolver: schema ? yupResolver(schema) : undefined,
        mode: "onChange",
    });

    const { handleSubmit, formState: { errors } } = methods;

    const onSubmit = async (formData) => {
        console.log({ formData })
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
                router.push("/learning/mission-complete");
            }

        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Error saving:", err.message);
            alert("Gagal menyimpan data.");
        }
    };

    const ActiveComponent = COMPONENT_MAP[slug];

    useEffect(() => {
        const savedContent = responses[slug];
        if (savedContent) {
            methods.reset(savedContent);
        }
    }, [slug, responses, methods]);

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ActiveComponent
                    methods={methods}
                    errors={errors}
                />
            </form>
        </FormProvider>
    );
}