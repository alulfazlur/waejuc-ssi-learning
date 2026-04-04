import * as yup from "yup";

export const FORM_SCHEMAS = {
    "initial": yup.object({
        prediction: yup.string().min(20, "Minimal 20 karakter ya!").required("Wajib diisi"),
        listened: yup.array().min(3, "Dengarkan semua audio terlebih dahulu"),
    }),

    "360-explore": yup.object({
        analysis: yup.string().min(350, "Analisis harus mendalam (min. 350 karakter)").required(),
    }),

    "ar-lab": yup.object({
        qualitative: yup.string().min(20, "Jelaskan mekanisme dengan lebih detail").required(),
        quantitative: yup.string()
            .required("Perhitungan wajib diisi")
            .test("is-number", "Harus mengandung angka perhitungan", (val) => /\d/.test(val)),
    }),
};
