"use client";
import { Angry, Frown, Meh, Smile, Laugh, Globe, Brain, Heart } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Callout from "@components/Callout";
import FieldError from "@components/FieldError";
import QuestionCard from "@components/QuestionCard";

const RATING_SCALE = [
    { value: 1, icon: Angry, labelKey: 'reflection.scale.very_bad' },
    { value: 2, icon: Frown, labelKey: 'reflection.scale.bad' },
    { value: 3, icon: Meh, labelKey: 'reflection.scale.neutral' },
    { value: 4, icon: Smile, labelKey: 'reflection.scale.good' },
    { value: 5, icon: Laugh, labelKey: 'reflection.scale.very_good' },
];

const QUESTIONS = [
    { name: 'reflection_website', icon: Globe, titleKey: 'reflection.website_ease.title', descKey: 'reflection.website_ease.desc' },
    { name: 'reflection_difficulty', icon: Brain, titleKey: 'reflection.material_difficulty.title', descKey: 'reflection.material_difficulty.desc' },
    { name: 'reflection_enjoyment', icon: Heart, titleKey: 'reflection.learning_enjoyment.title', descKey: 'reflection.learning_enjoyment.desc' },
];

const SmileyRating = ({ name, control, errors, label }) => {
    const { t } = useTranslation();
    const error = errors?.[name];

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange, ref } }) => (
                <div data-field={name}>
                    <div
                        role="radiogroup"
                        aria-label={label}
                        aria-invalid={!!error || undefined}
                        className="grid grid-cols-5 gap-1.5 sm:gap-3"
                    >
                        {RATING_SCALE.map((option, index) => {
                            const Icon = option.icon;
                            const isSelected = value === option.value;
                            // Roving tabindex: the selected option (or the first) is the tab stop.
                            const isTabStop = isSelected || (!value && index === 0);
                            const move = (e, delta) => {
                                const nextIndex = (index + delta + RATING_SCALE.length) % RATING_SCALE.length;
                                onChange(RATING_SCALE[nextIndex].value);
                                e.currentTarget.parentElement.children[nextIndex]?.focus();
                            };
                            return (
                                <button
                                    key={option.value}
                                    ref={index === 0 ? ref : undefined}
                                    type="button"
                                    role="radio"
                                    aria-checked={isSelected}
                                    tabIndex={isTabStop ? 0 : -1}
                                    onClick={() => onChange(option.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(e, 1); }
                                        if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(e, -1); }
                                    }}
                                    className={`flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-[1.5px] p-2 transition-colors sm:p-3
                                        ${isSelected
                                            ? "border-secondary bg-surface-subtle text-secondary"
                                            : "border-transparent text-muted hover:bg-surface-subtle hover:text-primary"
                                        }`}
                                >
                                    <Icon
                                        className="h-8 w-8 sm:h-10 sm:w-10"
                                        strokeWidth={isSelected ? 2.25 : 1.5}
                                        aria-hidden="true"
                                    />
                                    <span className={`text-center text-[11px] leading-tight sm:text-xs ${isSelected ? "font-bold" : "font-medium"}`}>
                                        {t(option.labelKey)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <FieldError message={error?.message} className="justify-center" />
                </div>
            )}
        />
    );
};

export const ReflectionComponent = ({ methods, errors }) => {
    const { t } = useTranslation();
    const { control } = methods;

    return (
        <div className="space-y-6">
            <Callout label={t('common.activity')}>
                {t('reflection.instruction')}
            </Callout>

            {QUESTIONS.map((q, index) => (
                <QuestionCard
                    key={q.name}
                    number={index + 1}
                    title={t(q.titleKey)}
                    description={t(q.descKey)}
                    fields={[q.name]}
                >
                    <SmileyRating
                        name={q.name}
                        control={control}
                        errors={errors}
                        label={t(q.titleKey)}
                    />
                </QuestionCard>
            ))}
        </div>
    );
};
