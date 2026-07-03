import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { ApiResponse } from "../../../../lib/api";
import { realisasiMonitoringDAK, type RealisasiMonitoringDAKForm } from "../../../../services/DAK/DAKMonitoringService";

/**
 * FUNGSI API MONITORING MASALAH DAK
 */
export const useM_RealisasiDAK = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: (payload: RealisasiMonitoringDAKForm) => {
            setLoading(true);
            return realisasiMonitoringDAK(payload);
        },

        onSettled: () => setLoading(false),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["list_monitoring_dak"] }),
    });

    const mutateWithToast = async (
        payload: RealisasiMonitoringDAKForm,
        onSuccessCallback?: (data: any) => void
    ) => {
        return toast.promise(
            mutation.mutateAsync(payload).then((data) => {
                onSuccessCallback?.(data);
                return data;
            }),
            {
                loading: 'Memperbarui data...',
                success: () => 'Data berhasil diperbarui',
                error: (err: AxiosError<ApiResponse<unknown>>) =>
                    err?.response?.data?.message || 'Gagal memperbarui data'
            }
        );
    };


    return { ...mutation, loading, mutateWithToast };
};