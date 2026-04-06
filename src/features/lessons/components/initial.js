"use client";
import { motion } from "framer-motion";
import { Play, Microscope, ClipboardList, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

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
            <section className="space-y-6 border-b border-b-tertiary pb-8">
                <div className="flex gap-3 text-secondary dark:text-primary p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                    <ClipboardList className="min-w-6" />
                    <p className="text-sm leading-relaxed">
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
                        whileHover={{ y: -3, scale: 1.02 }}
                    >
                        Video 1
                    </motion.a>
                    <motion.a
                        href="https://www.youtube.com/watch?v=Gr-4f81zgzc&feature=youtu.be"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-bold p-4 bg-tertiary dark:bg-secondary rounded-xl"
                        whileHover={{ y: -3, scale: 1.02 }}
                    >
                        Video 2
                    </motion.a>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {stakeholders.map((s) => (
                        <div key={s.id} className="p-5 rounded-2xl bg-tertiary dark:bg-secondary border border-border flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg mb-2 text-primary">
                                    {t(`initial.stakeholders.list.${s.id}.label`)}
                                </h3>
                                <p className="text-sm italic opacity-80">
                                    &quot;{t(`initial.stakeholders.list.${s.id}.summary`)}&quot;
                                </p>
                            </div>
                            <button
                                type="button"
                                className="mt-4 flex items-center gap-2 text-primary font-bold hover:opacity-80 cursor-pointer transition-opacity">
                                <div className="p-1.5 bg-primary text-tertiary dark:text-secondary rounded-full group-hover:scale-110 transition-transform">
                                    <Play size={10} fill="currentColor" />
                                </div>
                                <span className="text-xs">{t('initial.stakeholders.listen_btn')}</span>
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <Instruction
                    title={t('initial.issue_title')}
                    description={t('initial.issue_description')}
                    icon={MessageSquare}
                />
                <RichEditor
                    {...register("main_issue_analysis")}
                    errors={errors}
                    control={control}
                />
            </section>

            <section className="space-y-4 bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm">
                <Instruction
                    title={t('initial.component_id.title')}
                    description={t('initial.component_id.description')}
                />
                <RichEditor
                    {...register("components_table_analysis")}
                    errors={errors}
                    control={control}
                />
            </section>

            <section className="bg-tertiary dark:bg-secondary p-8 rounded-3xl border border-border dark:border-primary/20">
                <div className="flex items-center gap-3 mb-6">
                    <Microscope className="text-primary" size={28} />
                    <div>
                        <h2 className="text-2xl font-bold">{t('initial.properties.title')}</h2>
                        <p className="text-sm opacity-70">{t('initial.properties.description')}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4 p-6 bg-background rounded-xl border border-border">
                        <div className="flex items-center gap-2 font-bold text-primary pb-2 border-b border-border/50">
                            <span className="bg-primary text-background w-6 h-6 rounded-full flex items-center justify-center text-[10px]">A</span>
                            {t('initial.plastic_form.title')}
                        </div>
                        <div className="space-y-1">
                            <label className="text-[12px] font-bold">{t('initial.properties.name_label')}</label>
                            <Input
                                {...register("plastic_name")}
                                errors={errors}
                                control={control}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold">{t('initial.plastic_form.props_label')}</label>
                            <br />
                            <span className="text-[12px]">{t('initial.plastic_form.props_placeholder')}</span>
                            <RichEditor
                                {...register("plastic_props")}
                                errors={errors}
                                control={control}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold">{t('initial.plastic_form.behave_label')}</label>
                            <br />
                            <span className="text-[12px]">{t('initial.plastic_form.behave_placeholder')}</span>
                            <RichEditor
                                {...register("plastic_behavior_pred")}
                                errors={errors}
                                control={control}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 p-6 bg-background rounded-xl border border-border">
                        <div className="flex items-center gap-2 font-bold text-primary pb-2 border-b border-border/50">
                            <span className="bg-primary text-background w-6 h-6 rounded-full flex items-center justify-center text-[10px]">A</span>
                            {t('initial.organism_form.title')}
                        </div>
                        <div className="space-y-1">
                            <label className="text-[12px] font-bold">{t('initial.properties.name_label')}</label>
                            <Input
                                {...register("organism_name")}
                                errors={errors}
                                control={control}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold">{t('initial.organism_form.props_label')}</label>
                            <br />
                            <span className="text-[12px]">{t('initial.organism_form.props_placeholder')}</span>
                            <RichEditor
                                {...register("organism_props")}
                                errors={errors}
                                control={control}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold">{t('initial.organism_form.behave_label')}</label>
                            <br />
                            <span className="text-[12px]">{t('initial.organism_form.behave_placeholder')}</span>
                            <RichEditor
                                {...register("organism_behavior_pred")}
                                errors={errors}
                                control={control}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};