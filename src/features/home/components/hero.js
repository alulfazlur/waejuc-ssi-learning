"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronsDown } from "lucide-react";
import { useLayout } from "@app/(marketing)/layout"
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";

const HERO_VIDEO = "/videos/hero-bg-720.mp4";

// The poster photo is always rendered underneath, so the hero is never empty.
// The video is only attached on capable connections and fades in once playing.
function HeroMedia() {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const connection = navigator.connection;
        const slowConnection = connection
            && (connection.saveData || ["slow-2g", "2g", "3g"].includes(connection.effectiveType));
        if (reduceMotion || slowConnection) return;

        video.src = HERO_VIDEO;
        video.play().catch(() => {});
    }, []);

    return (
        <div className="absolute inset-0 -z-20" aria-hidden="true">
            <Image
                src="/images/hero-poster.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />
            <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload="none"
                poster="/images/hero-poster.webp"
                onPlaying={() => setIsPlaying(true)}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isPlaying ? "opacity-100" : "opacity-0"}`}
            />
        </div>
    );
}

export const Hero = () => {
    const { scrollToId } = useLayout();
    const { t } = useTranslation();

    return (
        <section id="hero" className="relative isolate flex min-h-svh items-center overflow-hidden px-4 pb-24 pt-28 text-white sm:px-6">
            <HeroMedia />
            <div
                className="absolute inset-0 -z-10 bg-linear-to-r from-[#083a4f]/95 via-[#083a4f]/80 to-[#083a4f]/70 sm:via-[#083a4f]/75 sm:to-[#083a4f]/30"
                aria-hidden="true"
            />

            <div className="mx-auto w-full max-w-6xl">
                <div className="max-w-2xl">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block rounded-full bg-white/15 px-3 py-1 font-mono text-xs font-medium uppercase tracking-widest backdrop-blur-sm"
                    >
                        {t('hero.tag')}
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
                    >
                        {t('hero.title')}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.6 }}
                        className="mt-6 text-base leading-relaxed text-white/90 sm:text-lg"
                    >
                        {t('hero.description')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mt-8 flex flex-wrap gap-3"
                    >
                        <Link
                            href="/learning/mission"
                            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-[#083a4f] transition-colors hover:bg-white/90"
                        >
                            {t('hero.cta_start')}
                            <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                        <button
                            type="button"
                            onClick={() => scrollToId('about')}
                            className="inline-flex min-h-12 cursor-pointer items-center rounded-xl px-6 font-semibold ring-[1.5px] ring-inset ring-white/50 transition-colors hover:bg-white/10"
                        >
                            {t('hero.cta_about')}
                        </button>
                    </motion.div>
                </div>
            </div>

            <button
                type="button"
                onClick={() => scrollToId('about')}
                aria-label={t('hero.scroll_down')}
                className="absolute bottom-6 left-1/2 hidden h-11 w-11 -translate-x-1/2 sm:flex cursor-pointer items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-colors hover:bg-white/25 motion-safe:animate-bounce"
            >
                <ChevronsDown size={22} aria-hidden="true" />
            </button>
        </section>
    )
};
