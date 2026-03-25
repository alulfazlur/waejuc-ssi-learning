"use client";
import { motion } from "framer-motion";

import FooterLesson from "@components/FooterLesson";
import Instruction from "@components/Instruction";
import TextArea from "@components/TextArea";

export const Explore = (props) => {
    const { methods, errors } = props
    const { register, control } = methods;
   
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2 sticky top-4 bg-background"
            >
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl border border-primary/20 bg-black">
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src="https://www.youtube.com/embed/VIDEO_ID_360?rel=0&showinfo=0"
                        title="YouTube 360 Video Player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="mt-4 p-4 bg-tertiary rounded-2xl">
                    <p className="text-xs text-primary leading-relaxed">
                        <span className="text-primary font-bold">Tips:</span> Klik dan tarik layar video untuk melihat sekeliling 360°. Perhatikan tumpukan material di dekat jalur sandar kapal.
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="lg:col-span-1"
            >
                <Instruction
                    description={(
                        <>
                            Identifikasi komponen sampah yang paling dominan di area TPI.
                            <br />
                            Berdasarkan pengamatanmu, sebutkan properti fisik sampah tersebut (ketahanan, ukuran) yang membuatnya berbahaya bagi jalur pelayaran nelayan sekaligus menjadi cikal bakal mikroplastik.
                        </>
                    )}
                />
                <TextArea
                    {...register("analysis")}
                    errors={errors}
                    control={control}
                    placeholder="Contoh: Saya melihat banyak kantong plastik tipis dan jaring bekas yang terlilit..."
                />

                <FooterLesson
                    description="Analisis minimal 20 karakter untuk membuka kunci level berikutnya."
                    flex="column"
                />
            </motion.div>
        </div>
    );
};