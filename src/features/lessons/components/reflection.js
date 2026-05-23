"use client";
import { Angry, Frown, Meh, Smile, Laugh, ClipboardList, Globe, Brain, Heart } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Instruction from "@components/Instruction";

const RATING_SCALE = [
    { value: 1, icon: Angry, labelKey: 'reflection.scale.very_bad', color: '#ef4444' },
    { value: 2, icon: Frown, labelKey: 'reflection.scale.bad', color: '#f97316' },
    { value: 3, icon: Meh, labelKey: 'reflection.scale.neutral', color: '#eab308' },
    { value: 4, icon: Smile, labelKey: 'reflection.scale.good', color: '#84cc16' },
    { value: 5, icon: Laugh, labelKey: 'reflection.scale.very_good', color: '#22c55e' },
];

const QUESTIONS = [
    { name: 'reflection_website', icon: Globe, titleKey: 'reflection.website_ease.title', descKey: 'reflection.website_ease.desc' },
    { name: 'reflection_difficulty', icon: Brain, titleKey: 'reflection.material_difficulty.title', descKey: 'reflection.material_difficulty.desc' },
    { name: 'reflection_enjoyment', icon: Heart, titleKey: 'reflection.learning_enjoyment.title', descKey: 'reflection.learning_enjoyment.desc' },
];

const SmileyRating = ({ name, control, errors }) => {
    const { t } = useTranslation();
    const error = errors?.[name];

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => (
                <div className="space-y-3">
                    <div className="flex justify-between gap-1 sm:gap-3 py-2">
                        {RATING_SCALE.map((option) => {
                            const Icon = option.icon;
                            const isSelected = value === option.value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => onChange(option.value)}
                                    aria-label={t(option.labelKey)}
                                    className={`group flex flex-1 flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-2xl transition-all duration-300 cursor-pointer ${isSelected
                                            ? 'bg-primary/10 dark:bg-primary/20 scale-105 shadow-sm'
                                            : 'hover:bg-primary/5 hover:scale-105'
                                        }`}
                                >
                                    <Icon
                                        className={`w-8 h-8 sm:w-12 sm:h-12 transition-all duration-300 ${isSelected ? 'drop-shadow-md' : 'opacity-40 group-hover:opacity-100'
                                            }`}
                                        style={{ color: isSelected ? option.color : undefined }}
                                        strokeWidth={isSelected ? 2 : 1.5}
                                    />
                                    <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight transition-opacity ${isSelected ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'
                                        }`}>
                                        {t(option.labelKey)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {error && (
                        <p className="text-danger text-sm text-center font-medium">
                            {error.message}
                        </p>
                    )}
                </div>
            )}
        />
    );
};

export const ReflectionComponent = ({ methods, errors }) => {
    const { t } = useTranslation();
    const { control } = methods;

    return (
        <div className="space-y-8">
            <div className="flex gap-3 text-secondary dark:text-primary p-4 bg-secondary/5 dark:bg-tertiary/10 rounded-2xl border border-secondary/10">
                <ClipboardList className="min-w-6" />
                <p className="text-sm leading-relaxed">
                    <b>{`${t('common.activity')}: `}</b>
                    {t('reflection.instruction')}
                </p>
            </div>

            {QUESTIONS.map((q) => (
                <div
                    key={q.name}
                    className="bg-background dark:bg-primary/5 rounded-2xl border border-border p-6 shadow-sm space-y-4"
                >
                    <Instruction
                        title={t(q.titleKey)}
                        description={t(q.descKey)}
                        icon={q.icon}
                    />
                    <SmileyRating
                        name={q.name}
                        control={control}
                        errors={errors}
                    />
                </div>
            ))}
        </div>
    );
};