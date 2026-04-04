"use client";
import { createClient } from "@lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Anchor, ArrowRight, Fish } from "lucide-react";
import Button from "@components/Button";
import { SYLLABUS } from "@constants/syllabus";

export default function MissionPage() {
    const supabase = createClient();
    const router = useRouter();

    const startInvestigation = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push("/signin");
            return;
        }

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
    };

    return (
        <div className="pt-28 min-h-screen bg-background text-primary flex flex-col items-center justify-center px-6 py-20 overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 border border-primary rounded-full animate-ping" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 border border-primary/30 rounded-full" />
            </div>

            <div className="max-w-4xl w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-8 text-primary border-b border-primary/20 pb-4"
                >
                    <Anchor size={24} />
                    <span className="text-sm font-mono tracking-widest uppercase">Laporan Penyelidikan: TPI Puger</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="space-y-6 mb-6"
                >
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                        Misi Anda: <span className="text-primary italic">Microplastic Investigation</span>
                    </h1>

                    <p className="text-lg md:text-xl text-secondary dark:text-primary leading-relaxed italic border-l-4 border-primary pl-6 py-2">
                        Anda adalah seorang peneliti biologi kelautan. Anda menemukan data bahwa ikan tongkol di TPI Puger mengandung partikel mikroplastik...
                    </p>

                    <p className="text-secondary dark:text-primary leading-relaxed">
                        Namun, saat Anda turun ke lapangan, Anda menemukan rantai masalah yang kompleks. Masalah ini bukan sekadar sampah, melainkan jeratan sistem ekonomi dan sosial:
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2 }}
                    className="bg-primary border border-primary/30 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6"
                >
                    <div className="bg-background p-4 rounded-full text-primary">
                        <Fish size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-background mb-1">Tujuan Analisis Dasar:</h3>
                        <p className="text-sm text-background/90">
                            Tugas Anda adalah membedah sistem ini dari level <strong>perilaku manusia</strong> hingga ke level <strong>seluler ikan</strong>. Apakah Anda siap?
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="mt-12 flex justify-center"
                >
                    <Button
                        onClick={startInvestigation}
                        size="lg"
                        className="group"
                    >
                        Mulai Penyelidikan <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}