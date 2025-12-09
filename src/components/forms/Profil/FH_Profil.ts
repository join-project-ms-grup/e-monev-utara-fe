import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { updatePassProfil, updateProfil, type ProfilForm, type ProfilPassForm } from '../../../services/UserService';
import { getUserFromCookie } from '../../../lib/usercookie';
import Cookies from 'js-cookie';

// *FH (FORM HOOK)

// =============================
// SCHEMA SUBMIT (WAJIB DIISI)
// =============================
export const ProfilSchema = z
    .object({
        name: z
            .string()
            .nonempty({ message: 'Field wajib diisi' })
            .min(3, { message: 'Minimal 3 karakter' })
            .max(30, { message: 'Maksimal 30 karakter' }),
        fullname: z
            .string()
            .nonempty({ message: 'Field wajib diisi' })
            .min(3, { message: 'Minimal 3 karakter' })
            .max(100, { message: 'Maksimal 100 karakter' })
            .regex(/^[A-Za-z\s]+$/, { message: 'Hanya boleh berisi huruf dan spasi' }),
        email: z
            .string()
            .nonempty({ message: 'Field wajib diisi' }),
    })

// *SF (SCHEMA FORM)
export type ProfilSF = z.infer<typeof ProfilSchema>;

export const initProfilSF: ProfilSF = {
    email: '',
    fullname: '',
    name: '',
};

export const useProfilSFData = (data?: ProfilSF) => {

    const initialValues: ProfilSF = data
        ? {
            ...initProfilSF,
            ...data,
        }
        : initProfilSF;

    return { initialValues, data };
};

/**
 * FUNGSI API
 */
export const useM_Profil = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const userCookie = getUserFromCookie();

    const mutation = useMutation({
        mutationFn: (payload: ProfilForm) => {
            setLoading(true);
            Cookies.set('me', JSON.stringify({
                nama: payload.fullname,
                username: payload.name,
                email: payload.email,
                roleId: userCookie?.roleId,
                roleName: userCookie?.roleName,
                userSKPDId: userCookie?.userSKPDId,
            }), {
                sameSite: 'strict',
            });
            return updateProfil(payload);
        },

        onSettled: () => setLoading(false),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["tabel_user"] }),
    });

    const mutateWithToast = async (
        payload: ProfilForm,
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
                error: () => txt.fail
            }
        );
    };


    return { ...mutation, loading, mutateWithToast };
};

//#region PASSOWRD FORM
export const ProfilPassSchema = z.object({
    password: z.string().nonempty({ message: 'Field wajib diisi' }).min(6, { message: 'Minimal 6 karakter' }),
    passwordConfirm: z.string().nonempty({ message: 'Field wajib diisi' }).min(6, { message: 'Minimal 6 karakter' })
}).refine((data) => data.password === data.passwordConfirm, {
    message: 'Konfirmasi password tidak cocok',
    path: ['passwordConfirm']
});

export type ProfilPassSF = z.infer<typeof ProfilPassSchema>;

export const initProfilPassSF: ProfilPassSF = {
    password: '',
    passwordConfirm: '',
};

export const useProfilPassSFData = (data?: ProfilPassSF) => {

    const initialValues: ProfilPassSF = data
        ? {
            ...initProfilPassSF,
            ...data,
        }
        : initProfilPassSF;

    return { initialValues, data };
};

export const useM_ProfilPass = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: (payload: ProfilPassForm) => {
            setLoading(true);
            // return alert(JSON.stringify(payload, null, 2))
            return updatePassProfil(payload);
        },

        onSettled: () => setLoading(false),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["tabel_user"] }),
    });

    const mutateWithToast = async (
        payload: ProfilPassForm,
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
                error: () => txt.fail
            }
        );
    };


    return { ...mutation, loading, mutateWithToast };
};
//#endregion