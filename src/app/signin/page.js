"use client";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Beaker, ShieldCheck, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { createClient } from "@lib/supabase/client";
import { useAuth } from "@context/AuthContext";

import Brand from "@components/Brand";
import Button from "@components/Button";
import { inputClass } from "@components/Input";
import { SYLLABUS } from "@constants/syllabus";

import ThemeToggle from '@components/ThemeToggle'
import LanguageToggle from '@components/LanguageToggle'

export default function SignIn() {
    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { login, isSyncing, setLoading } = useAuth();
    const { t } = useTranslation();
    const supabase = createClient();
    const router = useRouter();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email: `${studentId}@microlab.com`,
            password: password,
        });

        if (error) {
            setError(t('signin.error'));
            setSubmitting(false);
        } else {
            await login(user);
            const { data } = await supabase
                .from('student_responses')
                .select('level_slug')
                .eq('student_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1);

            if (data && data.length > 0) {
                router.push(`/learning/${data[0].level_slug}`);
            } else {
                router.push(`/learning/${SYLLABUS[0].id}`);
            }
        }
    };

    useEffect(() => {
        setLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const iconWrap = "pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted";

    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <AnimatePresence>
                {isSyncing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        role="status"
                        className="fixed inset-0 z-70 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl"
                    >
                        <div className="relative">
                            <div className="h-16 w-16 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary" aria-hidden="true" />
                            <Beaker className="absolute inset-0 m-auto text-secondary" size={24} aria-hidden="true" />
                        </div>
                        <p className="mt-6 font-mono text-xs tracking-[0.2em] text-secondary">
                            {t('common.load_init')}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid min-h-svh bg-background lg:grid-cols-2">
                {/* Brand panel: desktop only */}
                <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-[#083a4f] to-[#2f6875] p-12 text-white lg:flex">
                    <Brand />
                    <div className="max-w-md">
                        <p className="font-heading text-4xl font-bold leading-tight">{t('signin.tagline')}</p>
                        <p className="mt-4 text-white/80">{t('signin.tagline_sub')}</p>
                    </div>
                    <p className="font-mono text-xs text-white/60">{t('footer.copyright')}</p>
                    <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-white/10" aria-hidden="true" />
                    <div className="pointer-events-none absolute -bottom-32 -right-10 h-80 w-80 rounded-full border border-white/10" aria-hidden="true" />
                </div>

                <div className="flex flex-col">
                    <header className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
                        <span className="lg:invisible"><Brand /></span>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <LanguageToggle />
                        </div>
                    </header>

                    <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-4 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-md rounded-3xl bg-card p-6 shadow-card sm:p-10"
                        >
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold tracking-tight">{t('signin.title')}</h1>
                                <p className="mt-2 text-[15px] text-muted">{t('signin.description')}</p>
                            </div>

                            <form onSubmit={handleSignIn} className="space-y-5" noValidate>
                                {error && (
                                    <div role="alert" className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-3 text-sm font-medium text-danger">
                                        <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="student-id" className="mb-1.5 block text-sm font-semibold">{t('signin.label')}</label>
                                    <div className="relative">
                                        <span className={iconWrap}><ShieldCheck size={18} aria-hidden="true" /></span>
                                        <input
                                            id="student-id"
                                            type="text"
                                            required
                                            autoFocus
                                            autoComplete="username"
                                            autoCapitalize="none"
                                            spellCheck={false}
                                            placeholder={t('signin.placeholder')}
                                            aria-invalid={!!error || undefined}
                                            className={`${inputClass(!!error)} pl-11`}
                                            value={studentId}
                                            onChange={(e) => { setStudentId(e.target.value); setError('') }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">{t('signin.password_label')}</label>
                                    <div className="relative">
                                        <span className={iconWrap}><Lock size={18} aria-hidden="true" /></span>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            autoComplete="current-password"
                                            placeholder={t('signin.password_placeholder')}
                                            aria-invalid={!!error || undefined}
                                            className={`${inputClass(!!error)} pl-11 pr-12`}
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setError('') }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? t('signin.hide_password') : t('signin.show_password')}
                                            aria-pressed={showPassword}
                                            className="absolute inset-y-0 right-1 my-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-muted hover:text-primary"
                                        >
                                            {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    loading={submitting}
                                    disabled={!studentId || !password}
                                    className="w-full"
                                >
                                    {t('signin.button')}
                                </Button>
                            </form>
                        </motion.div>
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
}
