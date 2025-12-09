import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { ApiResponse } from "../../../../../lib/api";
import { addMasalahDAK, updateMasalahDAK, type MasalahDAK } from "../../../../../services/DAK/DAKMonitoringService";

/**
 * FUNGSI API MASALAH DAK
 */
export const useM_MasalahDAK = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: (payload: MasalahDAK) => {
            setLoading(true);

            if (payload.id) {
                return updateMasalahDAK(payload);
            }

            return addMasalahDAK(payload);
        },

        onSettled: () => setLoading(false),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["list_masalah_dak"] }),
    });

    const mutateWithToast = async (
        payload: MasalahDAK,
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