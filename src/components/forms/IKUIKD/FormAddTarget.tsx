
import toast from 'react-hot-toast';
import { TargetIKUIKDSchema, useM_TargetIKUIKD, useTargetSFData, type TargetIKUIKDSF, } from './FH_targetIKUIKD';
import { useAppForm } from '../form-context';
import type { OptionItem } from '../../inputs/InputSearchBox';
import { useQuery } from '@tanstack/react-query';
import { getIKMaster } from '../../../services/IKUIKDService';
import { getPeriodeMulaiFromCookie } from '../../../lib/usercookie';
interface F_TargetIKUIKDProps {
    data: TargetIKUIKDSF;
    onSuccess?: () => void;
}

export const F_TargetIkuIKD = ({ data, onSuccess }: F_TargetIKUIKDProps) => {
    console.log(data);
    const tahunMulai = Number(getPeriodeMulaiFromCookie());
    const { data: optms = [] } = useQuery({
        queryKey: ["list_ik_master"],
        queryFn: async () => getIKMaster(),
    });

    const master_opt: OptionItem[] = optms;

    // Form
    const { initialValues } = useTargetSFData(data);
    const { mutateWithToast, loading } = useM_TargetIKUIKD();
    const form = useAppForm({
        defaultValues: initialValues,
        onSubmit: ({ value }) => {
            const addPayload = {
                master: value.master,
                name: value.name,
                satuan: value.satuan,
                base_line: value.base_line,
                perhitungan: value.perhitungan,
                is_iku: value.is_iku === "1" ? 1 : 0,
                t_1: value.t_1,
                t_2: value.t_2,
                t_3: value.t_3,
                t_4: value.t_4,
                t_5: value.t_5,
                t_6: value.t_6
            };
            const editPayload = {
                id: value.id,
                master: value.master,
                name: value.name,
                satuan: value.satuan,
                base_line: value.base_line,
                perhitungan: value.perhitungan,
                is_iku: value.is_iku === "1" ? 1 : 0,
                t_1: value.t_1,
                t_2: value.t_2,
                t_3: value.t_3,
                t_4: value.t_4,
                t_5: value.t_5,
                t_6: value.t_6,
                t_1_id: value.t_1_id,
                t_2_id: value.t_2_id,
                t_3_id: value.t_3_id,
                t_4_id: value.t_4_id,
                t_5_id: value.t_5_id,
                t_6_id: value.t_6_id,
            };

            mutateWithToast(Number(value.id) !== 0 ? editPayload : addPayload, () => {
                onSuccess?.();
            });
        },
        onSubmitInvalid: () => {
            toast.error('Validasi gagal\nMohon lengkapi form');
        },
        validators: {
            onSubmit: TargetIKUIKDSchema,
        },
    });

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className='max-w-md mx-auto space-y-4'
            >
                <div className='space-y-5'>
                    {/* Field Nama */}
                    <form.AppField
                        name='master'
                        children={(field) => (
                            <field.SelectField
                                label='Pilih urusan IKU-IKD'
                                placeholder='Pilih urusan IKU-IKD'
                                options={master_opt}
                                tooltip
                                reqLabel
                            />
                        )}
                    />
                    <form.AppField
                        name='name'
                        children={(field) => (
                            <field.TextField
                                label="Indikator Kinerja"
                                placeholder='Nama indikator kinerja ...'
                                reqLabel />
                        )
                        } />
                    <form.AppField
                        name='satuan'
                        children={(field) => (
                            <field.TextField
                                label="Satuan"
                                placeholder='Satuan indikator kinerja ... ex: %'
                                reqLabel />
                        )
                        } />
                    <form.AppField
                        name='base_line'
                        children={(field) => (
                            <field.TextField
                                label={`Kondisi Awal tahun ${tahunMulai - 2}`}
                                placeholder={`Base line tahun ${tahunMulai - 2}`}
                                reqLabel />
                        )
                        } />
                    <div className='flex gap-2'>
                        <form.AppField
                            name='t_1'
                            children={(field) => (
                                <field.TextField
                                    label={`Target tahun ${tahunMulai - 1}`}
                                    placeholder='Target ...'
                                    reqLabel />
                            )
                            } />
                        <form.AppField
                            name='t_2'
                            children={(field) => (
                                <field.TextField
                                    label={`Target tahun ${tahunMulai}`}
                                    placeholder='Target ...'
                                    reqLabel />
                            )
                            } />
                    </div>
                    <div className='flex gap-2'>
                        <form.AppField
                            name='t_3'
                            children={(field) => (
                                <field.TextField
                                    label={`Target tahun ${tahunMulai + 1}`}
                                    placeholder='Target ...'
                                    reqLabel />
                            )
                            } />
                        <form.AppField
                            name='t_4'
                            children={(field) => (
                                <field.TextField
                                    label={`Target tahun ${tahunMulai + 2}`}
                                    placeholder='Target ...'
                                    reqLabel />
                            )
                            } />
                    </div>
                    <div className='flex gap-2'>
                        <form.AppField
                            name='t_5'
                            children={(field) => (
                                <field.TextField
                                    label={`Target tahun ${tahunMulai + 3}`}
                                    placeholder='Target ...'
                                    reqLabel />
                            )
                            } />
                        <form.AppField
                            name='t_6'
                            children={(field) => (
                                <field.TextField
                                    label={`Target tahun ${tahunMulai + 4}`}
                                    placeholder='Target ...'
                                    reqLabel />
                            )
                            } />
                    </div>
                    <form.AppField
                        name='is_iku'
                        children={(field) => (
                            <field.SelectField
                                label='Apakah ini termasuk IKU?'
                                placeholder='Tentukan IKU..'
                                options={[
                                    { label: "Iya", value: "1" },
                                    { label: "Tidak", value: "0" },
                                ]}
                                tooltip
                                reqLabel
                            />
                        )}
                    />
                </div>

                <div className='float-end'>
                    <form.AppForm>
                        <form.SubmitButton isLoading={loading}>Simpan</form.SubmitButton>
                    </form.AppForm>
                </div>
            </form>
        </>
    );
};
