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

export const About = () => {
    const { t } = useTranslation();
    const members = t('about.members', { returnObjects: true });

    return (
        <section id="about" className="scroll-mt-16 bg-background py-20 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <motion.div {...reveal} className="max-w-3xl">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('about.title')}</h2>
                    <p className="mt-6 text-lg leading-relaxed">{t('about.p1')}</p>
                    <p className="mt-4 text-base leading-relaxed text-primary/85">{t('about.p2')}</p>
                    <p className="mt-4 text-base leading-relaxed text-primary/85">{t('about.p3')}</p>
                </motion.div>

                <motion.div {...reveal} className="mt-16">
                    <h3 className="text-2xl font-bold tracking-tight">{t('about.team_title')}</h3>

                    <div className="mt-6 grid items-start gap-6 lg:grid-cols-12">
                        <Card className="overflow-hidden lg:col-span-7">
                            <Image
                                src="/images/WAEJUC_Logo_Tiga_Universitas.jpeg"
                                alt={t('about.logo_alt')}
                                width={1800}
                                height={1030}
                                sizes="(min-width: 1024px) 640px, 100vw"
                                className="h-auto w-full"
                            />
                        </Card>

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
