import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { ApiResponse } from "../../../../lib/api";
import { updateMonitorMasalahDAK, type MonitorMasalahDak } from "../../../../services/DAK/DAKMonitoringService";

/**
 * FUNGSI API MONITORING MASALAH DAK
 */
export const useM_MonitorMasalahDAK = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: (payload: MonitorMasalahDak) => {
            setLoading(true);
            return updateMonitorMasalahDAK(payload);
        },

        onSettled: () => setLoading(false),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["list_masalah_dak"] }),
    });

    const mutateWithToast = async (
        payload: MonitorMasalahDak,
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