import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { addUser, updateUser, type UserForm } from '../../../../services/UserService';

// *FH (FORM HOOK)

// =============================
// SCHEMA SUBMIT (WAJIB DIISI)
// =============================
export const UserSchema = z
    .object({
        id: z.number().nullish().optional(),
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
        role_id: z
            .union([z.string(), z.number()])
            .refine((val) => val !== '' && val !== undefined, { message: 'Field wajib diisi' }),
        skpd_id: z
            .union([z.string(), z.number(), z.null()])
            .refine((val) => val !== '', { message: 'Field wajib diisi' }),
        password: z.string().optional(),
        passwordConfirm: z.string().optional()
    })
    .superRefine((d, ctx) => {
        if (!d.id) {
            if (!d.password) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['password'],
                    message: 'Field wajib diisi'
                });
            } else if (d.password.length < 6) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['password'],
                    message: 'Minimal 6 karakter'
                });
            }

            if (!d.passwordConfirm) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['passwordConfirm'],
                    message: 'Field wajib diisi'
                });
            } else if (d.passwordConfirm.length < 6) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['passwordConfirm'],
                    message: 'Minimal 6 karakter'
                });
            }

            if (d.password && d.passwordConfirm && d.password !== d.passwordConfirm) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['passwordConfirm'],
                    message: 'Konfirmasi password tidak cocok'
                });
            }
        }
    })


// *SF (SCHEMA FORM)
export type UserSF = z.infer<typeof UserSchema>;

export const initUserSF: UserSF = {
    id: 0,
    email: '',
    fullname: '',
    name: '',
    password: '',
    passwordConfirm: '',
    role_id: '',
    skpd_id: '',
};

export const useUserSFData = (data?: UserSF) => {

    const initialValues: UserSF = data
        ? {
            ...initUserSF,
            ...data,
        }
        : initUserSF;

    return { initialValues, data };
};

/**
 * FUNGSI API REKENING DAK
 */
export const useM_User = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: (payload: UserForm) => {
            setLoading(true);
            const { id, ...Newpayload } = payload

            if (id) {
                return updateUser(id, Newpayload);
            }

            return addUser(Newpayload);
        },

        onSettled: () => setLoading(false),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["tabel_user"] }),
    });

    const mutateWithToast = async (
        payload: UserForm,
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
                error: () => txt.fail
            }
        );
    };


    return { ...mutation, loading, mutateWithToast };
};