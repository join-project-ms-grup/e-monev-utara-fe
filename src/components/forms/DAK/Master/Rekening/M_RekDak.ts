import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { ApiResponse } from "../../../../../lib/api";
import { type DAKRekeningForm, updateDAKRek, addDAKRek } from "../../../../../services/DAK/DAKRekeningService";

/**
 * FUNGSI API REKENING DAK
 */
export const useM_RekDAK = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: (payload: DAKRekeningForm) => {
            setLoading(true);

            if (payload.id) {
                return updateDAKRek(payload);
            }

            return addDAKRek(payload);
        },

        onSettled: () => setLoading(false),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["dak_rekening"] }),
    });

    const mutateWithToast = async (
        payload: DAKRekeningForm,
        onSuccessCallback?: (data: any) => void
    ) => {
        const isUpdate = Boolean(payload.id);

        const txt = isUpdate
            ? { load: "Memperbarui data...", success: "Data berhasil diperbarui", fail: "Gagal memperbarui data" }
            : { load: "Menyimpan data...", success: "Data berhasil ditambahkan", fail: "Gagal menambahkan data" };

        return toast.promise(
            mutation.mutateAsync(payload).then((data) => {
                onSuccessCallback?.(data);
                return data;
            }),
            {
                loading: txt.load,
                success: () => txt.success,
                error: (err: AxiosError<ApiResponse<unknown>>) =>
                    err?.response?.data?.message || txt.fail
            }
        );
    };


    return { ...mutation, loading, mutateWithToast };
};