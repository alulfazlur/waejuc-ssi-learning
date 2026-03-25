"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@lib/supabase/client";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [maxStep, setMaxStep] = useState(1);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const supabase = createClient();

    const refreshProgress = async (currentUser) => {
        setIsSyncing(true);
        try {
            const { data } = await supabase
                .from("student_responses")
                .select("level_slug, content")
                .eq("student_id", currentUser.id);

            if (data) {
                const responsesMap = {};
                data.forEach(item => {
                    responsesMap[item.level_slug] = item.content;
                });
                setResponses(responsesMap);
                setMaxStep(data.length + 1);
            }
        } finally {
            setIsSyncing(false);
        }
    };

    const login = async (currentUser) => {
        setUser(currentUser);
        await refreshProgress(currentUser);
    };

    useEffect(() => {
        const initAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                await refreshProgress(user);
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, maxStep, responses, loading, refreshProgress, login, isSyncing }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);