"use client";
import { useState, use, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { useTranslation } from "react-i18next";

import { useAuth } from "@context/AuthContext";
import { SYLLABUS } from "@constants/syllabus";

import HeaderLesson from "@components/HeaderLesson";
import Drawer from "@components/Drawer";
import Sidebar, { getProgress } from "@features/lessons/shell/Sidebar";
import { DesktopTopBar, MobileTopBar } from "@features/lessons/shell/TopBars";
import { LessonShellContext } from "@features/lessons/shell/LessonShellContext";

// Steps with wide tables get more room; text-heavy steps stay at reading width.
const WIDE_STEPS = new Set(["initial", "decision"]);

export default function LearningLayout({ params: paramsPromise, children }) {
    const { t } = useTranslation();
    const params = use(paramsPromise);
    const currentSlug = params.slug;

    const { maxStep, isSyncing, loading, setLoading } = useAuth();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
    const shellValue = useMemo(() => ({ setSaveStatus }), []);

    const currentSyllabus = SYLLABUS.find(s => s.id === currentSlug);
    const { percent } = getProgress(maxStep);

    useEffect(() => {
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <LessonShellContext.Provider value={shellValue}>
                <div className="min-h-screen bg-background text-foreground">
                    <AnimatePresence>
                        {(isSyncing || loading) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-60 flex items-center justify-center bg-background/80 backdrop-blur-md"
                            >
                                <div className="flex flex-col items-center gap-4" role="status">
                                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-transparent" aria-hidden="true" />
                                    <p className="font-mono text-sm text-secondary">
                                        {loading ? t('common.loading') : t('common.load_init')}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <aside className="fixed inset-y-0 left-0 z-40 hidden w-68 border-r border-border lg:block">
                        <Sidebar currentSlug={currentSlug} />
                    </aside>

                    <Drawer open={isDrawerOpen} onClose={closeDrawer} label={t('sidebar.progress_title')}>
                        <Sidebar currentSlug={currentSlug} onNavigate={closeDrawer} onClose={closeDrawer} />
                    </Drawer>

                    <div className="lg:pl-68">
                        <DesktopTopBar step={currentSyllabus?.step} saveStatus={saveStatus} />
                        <MobileTopBar
                            step={currentSyllabus?.step}
                            slug={currentSlug}
                            percent={percent}
                            onOpenNav={() => setIsDrawerOpen(true)}
                        />

                        <main>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlug}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className={`mx-auto px-4 pb-6 pt-8 sm:px-6 lg:pt-10 ${WIDE_STEPS.has(currentSlug) ? "max-w-5xl" : "max-w-3xl"}`}>
                                        {currentSyllabus && (
                                            <HeaderLesson
                                                step={currentSyllabus.step}
                                                id={currentSyllabus.id}
                                                t={t}
                                            />
                                        )}
                                        {children}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </main>
                    </div>
                </div>
            </LessonShellContext.Provider>
        </ThemeProvider>
    );
}
