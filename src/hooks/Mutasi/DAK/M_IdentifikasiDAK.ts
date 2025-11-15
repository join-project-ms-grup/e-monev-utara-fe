import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { ApiResponse } from "../../../lib/api";
import { type IdentifikasiDAKFormSubmit, addIdentifikasiDAK, editIdentifikasiDAK } from "../../../services/DAK/DAKIdentifikasiService";

/**
 * FUNGSI API IDENTIFIKASI DAK
 */
export const useM_IdentDAK = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: (payload: IdentifikasiDAKFormSubmit) => {
            setLoading(true);

            if (payload.id_ident) {
                return editIdentifikasiDAK(payload);
            }

            return addIdentifikasiDAK(payload);
        },

        onSettled: () => setLoading(false),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["list_identifikasi_dak"] }),
    });

    const mutateWithToast = async (
        payload: IdentifikasiDAKFormSubmit,
        onSuccessCallback?: (data: any) => void
    ) => {
        const isUpdate = Boolean(payload.id_ident);

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