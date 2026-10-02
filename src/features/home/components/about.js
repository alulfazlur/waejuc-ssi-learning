"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Card from "@components/Card";

const reveal = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5, ease: "easeOut" },
};

const UNIVERSITIES = [
    { name: "Universitas Jember", city: "Jember, Indonesia", logo: "/images/logo-unej.png", width: 292, height: 290 },
    { name: "Universitas Negeri Malang", city: "Malang, Indonesia", logo: "/images/logo-um.png", width: 302, height: 302 },
    { name: "Curtin University", city: "Perth, Australia", logo: "/images/logo-curtin.png", width: 462, height: 87 },
];

// Same wave stroke as the WAVES-SSI logo, stretched into a background band.
const WAVE_PATH = "M0 20c25 0 25-14 50-14s25 14 50 14 25-14 50-14 25 14 50 14 25-14 50-14 25 14 50 14 25-14 50-14 25 14 50 14 25-14 50-14 25 14 50 14";

function ConsortiumCard({ t }) {
    return (
        <div className="relative isolate overflow-hidden rounded-[20px] bg-linear-to-br from-[#062f40] via-[#083a4f] to-[#2f6875] p-6 text-white shadow-card sm:p-8">
            {/* Decorative background: dot grid and two wave bands */}
            <div
                className="absolute inset-0 -z-10 opacity-[0.12] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:18px_18px]"
                aria-hidden="true"
            />
            <svg className="absolute inset-x-0 bottom-0 -z-10 h-28 w-full" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">
                <path d={WAVE_PATH} transform="translate(0 4)" fill="none" stroke="#86c6d1" strokeOpacity="0.25" strokeWidth="3" />
                <path d={WAVE_PATH} transform="translate(-25 16)" fill="none" stroke="white" strokeOpacity="0.12" strokeWidth="3" />
            </svg>

            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#86c6d1]">
                {t('about.consortium_label')}
            </p>
            <p className="mt-2 font-heading text-5xl font-extrabold tracking-[0.08em] sm:text-6xl">WAEJUC</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
                Western Australia–East Java Universities Consortium
            </p>

            {/* Partnership route between the two regions */}
            <div className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-white/75" aria-hidden="true">
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#c9b08a] ring-4 ring-[#c9b08a]/20" />
                    Western Australia
                </span>
                <span className="h-px flex-1 border-t border-dashed border-white/35" />
                <span className="flex items-center gap-2">
                    East Java
                    <span className="h-2.5 w-2.5 rounded-full bg-[#86c6d1] ring-4 ring-[#86c6d1]/20" />
                </span>
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {UNIVERSITIES.map((uni) => (
                    <li
                        key={uni.name}
                        className="flex items-center gap-4 rounded-2xl bg-white p-4 text-[#083a4f] shadow-lg shadow-black/10 transition-transform duration-200 hover:-translate-y-0.5 sm:flex-col sm:items-stretch sm:gap-3"
                    >
                        <span className="flex h-14 w-24 shrink-0 items-center justify-center sm:h-20 sm:w-full">
                            <Image
                                src={uni.logo}
                                alt={t('about.logo_of', { name: uni.name })}
                                width={uni.width}
                                height={uni.height}
                                sizes="160px"
                                className="max-h-full w-auto max-w-full object-contain"
                            />
                        </span>
                        <span className="min-w-0 sm:border-t sm:border-[#dbe5e8] sm:pt-3 sm:text-center">
                            <span className="block text-sm font-semibold leading-snug">{uni.name}</span>
                            <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-wider text-[#556274]">{uni.city}</span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export const About = () => {
    const { t } = useTranslation();
    const members = t('about.members', { returnObjects: true });

    return (
        <section id="about" className="scroll-mt-16 bg-background py-20 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <motion.div {...reveal} className="max-w-3xl space-y-4">
                    <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">{t('about.title')}</h2>
                    {["p1", "p2", "p3"].map((key) => (
                        <p key={key} className="text-base leading-relaxed text-primary/90 sm:text-lg">{t(`about.${key}`)}</p>
                    ))}
                </motion.div>

                <motion.div {...reveal} className="mt-16">
                    <h3 className="text-2xl font-bold tracking-tight">{t('about.team_title')}</h3>

                    <div className="mt-6 grid items-start gap-6 lg:grid-cols-12">
                        <div className="lg:col-span-7">
                            <ConsortiumCard t={t} />
                        </div>

                        <ul className="space-y-3 lg:col-span-5">
                            {Array.isArray(members) && members.map((member) => (
                                <li key={member.name}>
                                    <Card className="p-5">
                                        <p className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">{member.role}</p>
                                        <p className="mt-1.5 font-heading text-lg font-semibold">{member.name}</p>
                                        <p className="text-sm text-muted">{member.affiliation}</p>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
