// app/signin/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@lib/supabase/client";
import { useAuth } from "@context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@components/Button";

export default function SignIn() {
    const [studentId, setStudentId] = useState("");
    const supabase = createClient();
    const { login, isSyncing } = useAuth();
    const router = useRouter();

    const handleSignIn = async (e) => {
        e.preventDefault();

        const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email: `${studentId}@microlab.com`,
            password: studentId,
        });

        if (error) {
            alert("ID Peneliti tidak terdaftar!");
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
                router.push("/learning/perspective-gallery");
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 border border-primary rounded-xl">
            <AnimatePresence>
                {isSyncing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-md"
                    >
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-primary font-mono text-sm animate-pulse">
                            Menyiapkan Lab & Progres Peneliti...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
            <h2 className="text-2xl font-bold mb-4">Verifikasi Peneliti</h2>
            <form onSubmit={handleSignIn} className="space-y-4">
                <input
                    type="text"
                    placeholder="Masukkan Student ID Anda..."
                    className="w-full p-3 bg-transparent border border-primary rounded-lg"
                    onChange={(e) => setStudentId(e.target.value)}
                />
                <Button>{isSyncing ? "Memverifikasi..." : "Verifikasi & Masuk"}</Button>
            </form>
        </div>
    );
}