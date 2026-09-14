import { z } from 'zod';
import { getPeriodeMulaiFromCookie } from '../../../lib/usercookie';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addTargetIKUIKD, updateTargetIKUIKD, type payloadTargetIKUIKD, type payloadUpdateTargetIKUIKD } from '../../../services/IKUIKDService';

// =========================
// Reusable Validator
// =========================

const numericRangeRegex = /^\d+(\.\d+)?(-\d+(\.\d+)?)?$/;

const numericRangeSchema = z
    .string()
    .min(1, {
        message: 'Field wajib diisi'
    })
    .regex(numericRangeRegex, {
        message:
            'Hanya boleh berupa angka atau rentang angka, contoh: 45 atau 2.5-45'
    });

// =========================
// Main Schema
// =========================

export const TargetIKUIKDSchema = z.object({
    id: z.number().nullish().optional(),

    master: z
        .union([z.string(), z.number()])
        .refine(
            (val) => val !== '' && val !== undefined && val !== null,
            {
                message: 'Field wajib diisi'
            }
        ),

    name: z
        .string()
        .min(1, {
            message: 'Field wajib diisi'
        })
        .min(3, {
            message: 'Minimal 3 karakter'
        })
        .max(100, {
            message: 'Maksimal 100 karakter'
        }),

    satuan: z
        .union([z.string(), z.number()])
        .refine(
            (val) => val !== '' && val !== undefined && val !== null,
            {
                message: 'Field wajib diisi'
            }
        ),

    base_line: numericRangeSchema,

    perhitungan: z
        .union([z.string(), z.number()])
        .refine(
            (val) => val !== '' && val !== undefined && val !== null,
            {
                message: 'Field wajib diisi'
            }
        ),

    is_iku: z.union([z.string(), z.number()]),
    t_1: numericRangeSchema,
    t_2: numericRangeSchema,
    t_3: numericRangeSchema,
    t_4: numericRangeSchema,
    t_5: numericRangeSchema,
    t_6: numericRangeSchema,

    // ID target, hanya ada ketika edit
    t_1_id: z.number().nullish().optional(),
    t_2_id: z.number().nullish().optional(),
    t_3_id: z.number().nullish().optional(),
    t_4_id: z.number().nullish().optional(),
    t_5_id: z.number().nullish().optional(),
    t_6_id: z.number().nullish().optional(),

});

export type TargetIKUIKDSF = z.infer<typeof TargetIKUIKDSchema>;

export interface TargetPerTahunIKUIKD {
    tahun: number;
    tahun_ke: number;
    target: string;
}

export const initTargetIKUIKDSF: TargetIKUIKDSF = {
    id: 0,
    master: 0,
    name: "",
    satuan: "",
    base_line: "",
    perhitungan: "Akumulatif",
    is_iku: "0",
    t_1: "",
    t_2: "",
    t_3: "",
    t_4: "",
    t_5: "",
    t_6: "",
    t_1_id: 0,
    t_2_id: 0,
    t_3_id: 0,
    t_4_id: 0,
    t_5_id: 0,
    t_6_id: 0
};

export const useTargetSFData = (data?: TargetIKUIKDSF) => {
    console.log(data);

    const initialValues: TargetIKUIKDSF = data
        ? {
            ...initTargetIKUIKDSF,
            ...data,
        }
        : initTargetIKUIKDSF;

    return { initialValues, data };
};


export const useM_TargetIKUIKD = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (payload: TargetIKUIKDSF) => {
            const tahunMulai = Number(getPeriodeMulaiFromCookie());

            const { id, ...dfpayload } = payload;
            const newPayload = {
                master: Number(dfpayload.master),
                name: dfpayload.name,
                satuan: dfpayload.satuan,
                base_line: dfpayload.base_line,
                perhitungan: dfpayload.perhitungan,
                is_iku: Number(dfpayload.is_iku),
            }

            if (id) {
                const target = Array.from({ length: 6 }, (_, i) => {
                    return {
                        id: Number(payload[`t_${i + 1}_id` as keyof typeof payload]),
                        target: payload[`t_${i + 1}` as keyof typeof payload],
                    }
                })
                return updateTargetIKUIKD(Number(id), { ...newPayload, target } as payloadUpdateTargetIKUIKD);

            }

            const target = Array.from({ length: 6 }, (_, i) => {
                return {
                    tahun: tahunMulai + i,
                    tahun_ke: i + 1,
                    target: payload[`t_${i + 1}` as keyof typeof payload],
                }
            })

            return addTargetIKUIKD({ ...newPayload, target } as payloadTargetIKUIKD);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tabel_target_iku_ikd"],
            });
        },
    });

    const mutateWithToast = async (
        payload: TargetIKUIKDSF,
        onSuccessCallback?: (data: any) => void
    ) => {
        const isUpdate = Boolean(payload.id);

        const text = isUpdate
            ? {
                loading: "Memperbarui data...",
                success: "Data berhasil diperbarui",
                error: "Gagal memperbarui data",
            }
            : {
                loading: "Menyimpan data...",
                success: "Data berhasil ditambahkan",
                error: "Gagal menambahkan data",
            };

        return toast.promise(
            mutation.mutateAsync(payload).then((data) => {
                onSuccessCallback?.(data);
                return data;
            }),
            {
                loading: text.loading,
                success: text.success,
                error: text.error,
            }
        );
    };

    return {
        ...mutation,
        loading: mutation.isPending,
        mutateWithToast,
    };
};
