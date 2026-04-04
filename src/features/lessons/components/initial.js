"use client";
import { motion } from "framer-motion";
import { Play, Microscope, ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";

import FooterLesson from "@components/FooterLesson";
import Instruction from "@components/Instruction";
import RichEditor from "@/components/RichTextEditor";
import Input from "@components/Input";

export const InitialComponent = (props) => {
    const { t } = useTranslation();
    const { methods, errors } = props;
    const { register, control } = methods;

    const stakeholders = [
        { id: "sailor", audio: "/audio/sailor.mp3" },
        { id: "seller", audio: "/audio/seller.mp3" },
        { id: "official", audio: "/audio/official.mp3" }
    ];

    return (
        <div className="space-y-8">
            {/* SECTION 1: STAKEHOLDER INTERVIEWS */}
            <section className="space-y-6 border-b border-b-tertiary pb-8">
                <div className="flex gap-2 text-secondary dark:text-primary">
                    <ClipboardList className="min-w-6" />
                    <p>
                        <b>{`${t('common.activity')}: `}</b>
                        {t('initial.instruction')}
                    </p>
                </div>

                <div className="flex gap-2">
                    <motion.a
                        href="https://www.youtube.com/watch?v=nrze0IfAmkw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-bold p-4 bg-tertiary dark:bg-secondary rounded-xl"
                        whileHover={{ y: -5 }}
                    >
                        Video 1
                    </motion.a>
                    <motion.a
                        href="https://www.youtube.com/watch?v=Gr-4f81zgzc&feature=youtu.be"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-bold p-4 bg-tertiary dark:bg-secondary rounded-xl"
                        whileHover={{ y: -5 }}
                    >
                        Video 2
                    </motion.a>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {stakeholders.map((s) => (
                        <div
                            key={s.id}
                            className="p-6 rounded-2xl bg-tertiary dark:bg-secondary border border-border dark:border-primary/20 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="font-bold text-lg mb-2 text-primary">
                                    {t(`initial.stakeholders.list.${s.id}.label`)}
                                </h3>
                                <p className="text-sm italic opacity-80 leading-relaxed text-foreground">
                                    &quot;{t(`initial.stakeholders.list.${s.id}.summary`)}&quot;
                                </p>
                            </div>

                            <button
                                type="button"
                                className="mt-6 flex items-center gap-2 text-primary font-bold hover:underline cursor-pointer group"
                            >
                                <div className="p-2 bg-primary text-tertiary dark:text-secondary rounded-full group-hover:scale-110 transition-transform">
                                    <Play size={10} fill="currentColor" />
                                </div>
                                <span className="text-sm">{t('initial.stakeholders.listen_btn')}</span>
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 2: COMPONENT IDENTIFICATION */}
            <section className="space-y-6">
                <div className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4">
                    <Instruction
                        title={t('initial.component_id.title')}
                        description={t('initial.component_id.description')}
                    />
                    <RichEditor
                        {...register("components_list")}
                        placeholder={t('initial.component_id.placeholder')}
                        errors={errors}
                        control={control}
                    />
                </div>

                {/* SECTION 3: PROPERTIES */}
                <div className="bg-tertiary dark:bg-secondary p-8 rounded-3xl border border-border dark:border-primary/20">
                    <div className="flex items-center gap-3 mb-6">
                        <Microscope className="text-primary" size={28} />
                        <h2 className="text-2xl font-bold">{t('initial.properties.title')}</h2>
                    </div>
                    <p className="text-sm mb-8 opacity-80">
                        {t('initial.properties.description')}
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Component A */}
                        <div className="space-y-4 p-6 bg-background rounded-xl border border-border">
                            <div className="flex items-center gap-2 font-bold text-primary pb-2 border-b border-border/50">
                                <span className="bg-primary text-background w-6 h-6 rounded-full flex items-center justify-center text-[10px]">A</span>
                                {t('initial.properties.label_a')}
                            </div>
                            <Input
                                {...register("comp_a_name")}
                                placeholder={t('initial.properties.placeholder_name')}
                                errors={errors}
                                control={control}
                            />
                            <RichEditor
                                {...register("comp_a_property")}
                                placeholder={t('initial.properties.placeholder_desc')}
                                errors={errors}
                                control={control}
                                rows={3}
                            />
                        </div>

                        {/* Component B */}
                        <div className="space-y-4 p-6 bg-background rounded-xl border border-border">
                            <div className="flex items-center gap-2 font-bold text-primary pb-2 border-b border-border/50">
                                <span className="bg-primary text-background w-6 h-6 rounded-full flex items-center justify-center text-[10px]">B</span>
                                {t('initial.properties.label_b')}
                            </div>
                            <Input
                                {...register("comp_b_name")}
                                placeholder={t('initial.properties.placeholder_name')}
                                errors={errors}
                                control={control}
                            />
                            <RichEditor
                                {...register("comp_b_property")}
                                placeholder={t('initial.properties.placeholder_desc')}
                                errors={errors}
                                control={control}
                                rows={3}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <FooterLesson
                description={t('initial.footer')}
            />
        </div>
    );
};