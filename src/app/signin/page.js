// app/signin/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@lib/supabase/client";
import Button from "@components/Button";

export default function SignIn() {
    const [studentId, setStudentId] = useState("");
    const supabase = createClient();
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
            <h2 className="text-2xl font-bold mb-4">Verifikasi Peneliti</h2>
            <form onSubmit={handleSignIn} className="space-y-4">
                <input
                    type="text"
                    placeholder="Masukkan Student ID Anda..."
                    className="w-full p-3 bg-transparent border border-primary rounded-lg"
                    onChange={(e) => setStudentId(e.target.value)}
                />
                <Button>Verifikasi & Masuk</Button>
            </form>
        </div>
    );
}