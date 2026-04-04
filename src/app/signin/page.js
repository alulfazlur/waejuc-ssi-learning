"use client";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Beaker, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { createClient } from "@lib/supabase/client";
import { useAuth } from "@context/AuthContext";

import Button from "@components/Button";
import { SYLLABUS } from "@constants/syllabus";

import ThemeToggle from '@components/ThemeToggle'
import LanguageToggle from '@components/LanguageToggle'

export default function SignIn() {
    const [studentId, setStudentId] = useState("");
    const { login, isSyncing, loading, setLoading } = useAuth();
    const { t } = useTranslation();
    const supabase = createClient();
    const router = useRouter();

    const [isScrolled, setIsScrolled] = useState(false);

    const colorClass = 'text-primary dark:text-primary';
    const backgroundClass = 'bg-background dark:bg-background';

    const handleSignIn = async (e) => {
        setLoading(true);
        e.preventDefault();

        const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email: `${studentId}@microlab.com`,
            password: studentId,
        });

        if (error) {
            alert(t('auth.error_msg') || "ID Peneliti tidak terdaftar!");
            setLoading(false);
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
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <nav
                className={`
                        fixed top-0 left-0 right-0 z-60 px-6 py-4 flex justify-between lg:justify-normal items-center duration-200
                        bg-primary${isScrolled ? '/75' : ''} dark:bg-primary${isScrolled ? '/90' : ''} backdrop-blur-md border-b border-white/10 shadow-lg text-background
            `}
            >
                <div className="lg:w-1/4">
                    <button className="font-bold text-xl tracking-tight cursor-pointer" onClick={() => router.push('/')}>
                        Waejuc-SSI
                    </button>
                </div>

                <div className="hidden lg:flex flex-1 " />

                <div className="flex lg:hidden gap-3">
                    <ThemeToggle colorClass={colorClass} backgroundClass={backgroundClass} />
                    <LanguageToggle />
                </div>

                <div className="hidden lg:flex w-1/4 justify-end gap-3">
                    <ThemeToggle colorClass={colorClass} backgroundClass={backgroundClass} />
                    <LanguageToggle />
                </div>
            </nav>

            <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">

                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                <AnimatePresence>
                    {(isSyncing || loading) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <Beaker className="absolute inset-0 m-auto text-primary animate-pulse" size={24} />
                            </div>
                            <p className="mt-6 text-primary font-mono text-xs tracking-[0.2em] animate-pulse">
                                {t('common.load_init')}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-background dark:bg-secondary border border-primary/10 rounded-[2.5rem] p-10 shadow-2xl relative z-10 backdrop-blur-sm"
                >
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-background shadow-lg shadow-primary/20 mb-6 rotate-3">
                            <Fingerprint size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-primary tracking-tight">
                            Micro-Lab <span className="font-light opacity-50">Auth</span>
                        </h2>
                        <p className="text-secondary/60 text-sm dark:text-primary mt-2">
                            {t('signin.description')}
                        </p>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-blacktext-primary/40 dark:text-primary ml-1">
                                {t('signin.label')}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center text-primary/30 group-focus-within:text-primary transition-colors dark:text-background/50 dark:group-focus-within:text-background">
                                    <ShieldCheck size={20} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    placeholder={t('signin.placeholder')}
                                    className={`w-full pl-12 bg-background dark:bg-primary text-primary dark:text-background border border-secondary/50
                                        rounded-lg p-2 outline-none transition-all resize-none pr-12`}
                                    onChange={(e) => setStudentId(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button className="w-full py-4 rounded-2xl text-md font-bold shadow-xl shadow-primary/10">
                            {t('signin.button')}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </ThemeProvider>
    );
}