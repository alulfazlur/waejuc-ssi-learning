"use client";
import { useState } from "react";
import Image from "next/image";

import { motion, AnimatePresence } from "framer-motion";
import { Download, Beaker, Calculator, X, ZoomIn } from "lucide-react";

import FooterLesson from "@components/FooterLesson";
import Instruction from "@components/Instruction";
import TextArea from "@components/TextArea";
import Button from "@components/Button";

export const MicroLabAR = (props) => {
    const { methods, errors } = props
    const { register, control } = methods;
    const [selectedImage, setSelectedImage] = useState(null);

    const markers = [
        { src: "/images/marker-1.webp", label: "Scene 1" },
        { src: "/images/marker-2.webp", label: "Scene 2-9" }
    ];

    return (
        <>
            <motion.div
                className="mb-12 p-6 rounded-lg bg-primary dark:bg-secondary text-background flex flex-col md:flex-row gap-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
            >
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center text-primary">
                            <Download size={20} />
                        </div>
                        <h3 className="font-bold text-xl text-background">Setup Micro-Lab AR</h3>
                    </div>
                    <p className="italic text-md leading-relaxed">
                        &quot;Unduh aplikasi dan gunakan kedua marker portrait di samping untuk memulai simulasi penetrasi mikroplastik ke level seluler.&quot;
                    </p>
                    <div className="pt-2">
                        <Button href="https://drive.google.com/file/d/1Uujq_DYbMH8Fy75iLCqDQZPa3T4wK-D9/view?usp=sharing" target="_blank" className="w-fit px-10" color="white" size="sm">
                            Download APK
                        </Button>
                    </div>
                </div>

                <div className="flex gap-4 shrink-0 overflow-x-auto pb-2 w-full md:w-auto">
                    {markers.map((marker, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedImage(marker)}
                            className="group relative bg-white p-2 pt-4 rounded-md transition-all shadow-xl cursor-zoom-in"
                        >
                            <div className="relative w-35 h-50">
                                <Image
                                    src={marker.src}
                                    alt={marker.label}
                                    fill
                                    className="object-contain transition-all duration-500 rounded-lg"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                <ZoomIn className="text-white mb-1" size={20} />
                            </div>
                            <p className="text-[10px] font-bold text-primary text-center mt-2">{marker.label}</p>
                        </div>
                    ))}
                </div>
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="fixed inset-0 z-100 bg-black/70 backdrop-blur-md flex items-center justify-center"
                        >
                            <button
                                className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors cursor-pointer"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X size={40} />
                            </button>

                            <motion.div
                                initial={{ scale: 0.8, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.8, y: 20 }}
                                className="relative w-full max-w-2xl aspect-3/4 md:aspect-auto md:h-[90vh] -mt-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src={selectedImage.src}
                                    alt={selectedImage.label}
                                    fill
                                    className="object-contain"
                                    priority
                                />

                                <div className="absolute -bottom-12 left-0 right-0 text-center">
                                    <p className="text-white font-bold tracking-widest uppercase">{selectedImage.label}</p>
                                    <p className="text-white/50 text-xs">Arahkan kamera HP Anda ke layar ini</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <motion.div
                className="mt-10 border-t border-tertiary pt-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
            >
                <Instruction
                    title={<>Mekanisme <i>(Qualitative)</i></>}
                    description="Bagaimana partikel mikroplastik ini menembus sel manusia dan mengapa sistem ekskresi kita gagal mengeluarkannya?"
                    icon={Beaker}
                />

                <TextArea
                    {...register("qualitative")}
                    errors={errors}
                    control={control}
                    placeholder="Tuliskan analisis biologis Anda..."
                />
            </motion.div>

            <motion.div
                className="mt-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
            >
                <Instruction
                    title={<>Data <i>(Quantitative)</i></>}
                    description="Jika setiap kapal menggunakan es kiloan setiap hari (seperti kata Nelayan A), hitunglah potensi akumulasi polimer ini pada penduduk yang mengonsumsi ikan setiap hari."
                    icon={Calculator}
                />
                <TextArea
                    {...register("quantitative")}
                    errors={errors}
                    control={control}
                    placeholder="Tuliskan perhitungan Anda di sini..."
                />

                <FooterLesson
                    description="Lengkapi analisis kualitatif dan perhitungan kuantitatif untuk lanjut."
                />
            </motion.div>
        </>
    );
};