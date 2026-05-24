"use client";
import { motion } from "framer-motion";
import { useLayout } from "@app/(marketing)/layout"
import { useTranslation } from "react-i18next";
import Image from "next/image";

export const Hero = () => {
    const { scrollToId } = useLayout();
    const { t } = useTranslation();

    return (
        <section id="hero" className="relative flex flex-col items-center justify-center py-20 px-6 text-center h-screen gap-12">

            <div className="absolute inset-0 -z-20 w-full h-full">
                {/* <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    poster="/images/hero-poster.webp"
                >
                    <source src="/videos/hero-bg.webm" type="video/webm" />
                    <source src="/videos/hero-bg.mp4" type="video/mp4" />
                    {t('error.video_not_supported')}
                </video> */}
                <Image src="/images/hero-poster.webp" alt="hero" layout="fill" objectFit="cover" priority />
            </div>
            <div className="absolute inset-0 -z-10 bg-black/40 backdrop-blur-[1px]" />

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="will-change-transform text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-background dark:text-primary"
            >
                {t('hero.title')}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg md:text-xl max-w-7xl mx-auto leading-relaxed text-background dark:text-primary"
            >
                {t('hero.description')}
            </motion.p>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
                onClick={() => scrollToId('objectives')}
            >
                <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="flex flex-col items-center gap-2 opacity-100 hover:opacity-90 transition-opacity bg-primary p-2 rounded-full shadow-lg"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-background"
                    >
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    )
};