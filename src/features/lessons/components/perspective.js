"use client";
import { motion } from "framer-motion";
import { useWatch } from "react-hook-form";
import { Play, UserSearch } from "lucide-react";
import FooterLesson from "@components/FooterLesson";
import Instruction from "@components/Instruction";
import TextArea from "@components/TextArea";

const stakeholders = [
    {
        id: "nelayan-a",
        label: "Nelayan A",
        audio: "/audio/nelayan.mp3",
        summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: "pedagang-b",
        label: "Pedagang B",
        audio: "/audio/pedagang.mp3",
        summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: "pengelola-c",
        label: "Pengelola C",
        audio: "/audio/pengelola.mp3",
        summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    }
];

export const PerspectiveGallery = (props) => {
    const { methods, errors } = props
    const { setValue, register, control } = methods

    const listened = useWatch({
        control,
        name: "listened",
    });

    const handleToggleListen = (id) => {
        if (!listened.includes(id)) {
            setValue("listened", [...listened, id]);
        }
    };

    return (
        <>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                {stakeholders.map((s) => (
                    <motion.div
                        key={s.id}
                        className={'p-6 rounded-lg bg-primary dark:bg-secondary'}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center text-primary">
                                <UserSearch size={20} />
                            </div>
                            <h3 className="font-bold text-xl text-background">{s.label}</h3>
                        </div>
                        <p className="text-sm text-background mb-6 italic">&quot;{s.summary}&quot;</p>

                        <button
                            onClick={() => handleToggleListen(s.id)}
                            className="flex items-center gap-2 text-background font-bold hover:underline cursor-pointer"
                        >
                            <div className="p-2 bg-background text-primary rounded-full">
                                <Play size={10} fill="currentColor" />
                            </div>
                            <div className="text-left text-background">
                                Dengarkan Rekaman
                            </div>
                        </button>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
            >
                <Instruction
                    title={<>Instruksi <i>(Triggering Initial Ideas)</i></>}
                    description={<>Setelah menelaah keluhan Nelayan A tentang es batu plastik dan Pengelola C tentang iuran warga, menurutmu bagaimana masalah ekonomi <span className="text-primary font-mono italic">&quot;Rp20.000&quot;</span> ini bisa berakhir menjadi ancaman biologi di tubuh manusia?</>}
                />

                <TextArea
                    {...register("prediction")}
                    errors={errors}
                    control={control}
                    placeholder="Tuliskan analisis awal Anda di sini..."
                />

                <FooterLesson
                    description="Dengarkan semua rekaman dan isi prediksi (min. 20 karakter) untuk lanjut."
                />
            </motion.div>
        </>
    );
}