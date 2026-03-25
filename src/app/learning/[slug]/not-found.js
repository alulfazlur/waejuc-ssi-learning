import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
            <AlertTriangle size={64} className="text-primary mb-4" />
            <h2 className="text-3xl font-bold mb-2">Misi Tidak Ditemukan</h2>
            <p className="text-secondary mb-8">
                Sepertinya kamu tersesat di tengah laut. Level yang kamu cari belum tersedia.
            </p>
            <Link
                href="/learning/perspective-gallery"
                className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:scale-105 transition-transform"
            >
                Kembali ke Navigasi
            </Link>
        </div>
    );
}