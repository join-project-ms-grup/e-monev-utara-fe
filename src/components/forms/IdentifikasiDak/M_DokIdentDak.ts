import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { type FileIdentifikasiDAK, updateFileIdentifikasiDAK } from "../../../services/DAK/DAKIdentifikasiService";

/**
 * FUNGSI API DOKUMEN IDENTIFIKASI DAK
 */
export const useM_DokIdentDAK = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: (payload: FileIdentifikasiDAK) => {
            setLoading(true);

            return updateFileIdentifikasiDAK(payload);
        },

        onSettled: () => setLoading(false),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["detail_identifikasi_dak"] }),
    });

    const mutateWithToast = async (
        payload: FileIdentifikasiDAK,
        onSuccessCallback?: (data: any) => void
    ) => {
        const txt = { load: "Memperbarui data...", success: "Data berhasil diperbarui", fail: "Gagal memperbarui data" }

        return toast.promise(
            mutation.mutateAsync(payload).then((data) => {
                onSuccessCallback?.(data);
                return data;
            }),
            {
                loading: txt.load,
                success: () => txt.success,
                error: () =>
                    txt.fail
            }
        );
    };


    return { ...mutation, loading, mutateWithToast };
};