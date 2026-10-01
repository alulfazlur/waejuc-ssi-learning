"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "@context/AuthContext";
import { exportResponsesToPDF } from "@lib/exportPDF";

export const MATERIAL_URL = "https://drive.google.com/drive/folders/1WQWxrB1EAxhhXoZL-qx5zgb7o6eQBvTn?usp=sharing";

// Export and logout actions shared by the sidebar and the mobile menu.
export function useLessonActions() {
    const { t } = useTranslation();
    const router = useRouter();
    const { user, responses, logout } = useAuth();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            await exportResponsesToPDF({ user, responses, t });
            toast.success(t('sidebar.export_success'));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Export PDF failed:', err);
            toast.error(t('sidebar.export_error'));
        } finally {
            setIsExporting(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return { isExporting, handleExport, handleLogout };
}
