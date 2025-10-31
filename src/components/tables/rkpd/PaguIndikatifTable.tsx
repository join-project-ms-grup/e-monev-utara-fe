import { type ColumnDef } from '@tanstack/react-table';
import { MdAdd, MdRefresh } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import Tabel from '../Tabel';
import {
  addPagu,
  getPaguFlat,
  updatePagu,
  type PaguForm,
  type PaguMaster,
} from '../../../services/PaguService';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
  getRoleId,
} from '../../../lib/usercookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from '../../inputs/Spinner';
import { useEffect, useState, type ReactNode } from 'react';
import DialogModal from '../../inputs/DialogModal';
import FormPagu from '../../forms/FormPagu';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../../../lib/api';
import InputSearchBox, { type OptionItem } from '../../inputs/InputSearchBox';
import { getSKPDPeriode } from '../../../services/PeriodeService';
import InputText from '../../inputs/InputText';

const tableHead = () => {
  const mulai = Number(getPeriodeMulaiFromCookie()!);
  const akhir = Number(getPeriodeAkhirFromCookie()!);

  const periode = Array.from(
    { length: akhir - mulai + 1 },
    (_, i) => mulai + i,
  );

  return (
    <>
      <tr>
        <th rowSpan={2} colSpan={5}>
          Kode
        </th>
        <th rowSpan={2}>Urusan / Bidang / Program / Kegiatan / Sub Kegiatan</th>
        <th rowSpan={1} colSpan={5}>
          Target
        </th>
      </tr>
      <tr>
        {periode.map((thn) => (
          <th key={thn} rowSpan={1}>
            {thn}
          </th>
        ))}
      </tr>
    </>
  );
};

const PaguIndikatifTable = () => {
  const queryClient = useQueryClient();
  const idPeriodeCookie = Number(getPeriodeIDFromCookie());
  //#region SKPD
  const [selectedSKPD, setSelectedSKPD] = useState('');
  const { data: dataSKPDPeriode } = useQuery({
    queryKey: ['list_skpd_periode'],
    queryFn: async () => getSKPDPeriode(idPeriodeCookie),
  });
  const listSKPDPeriode =
    dataSKPDPeriode?.map((item) => ({
      label: `[${item.id}] ${item.name}`,
      value: item.id?.toString(),
    })) || [];
  //#endregion

  //#region Modal, FormData & Tabel Data
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_pagu', selectedSKPD],
    queryFn: () => getPaguFlat(Number(selectedSKPD)),
    enabled: !!selectedSKPD,
    refetchOnWindowFocus: false,
  });
  // Modal
  const [openModal, setOpenModal] = useState(false);
  // Form Data
  const initialFormData: PaguForm = {
    skpd_periode_id: '',
    master_id: '',
    master_name: '',
    target: [
      { tahun_ke: '1', pagu: '' },
      { tahun_ke: '2', pagu: '' },
      { tahun_ke: '3', pagu: '' },
      { tahun_ke: '4', pagu: '' },
      { tahun_ke: '5', pagu: '' },
    ],
  };
  const [formData, setFormData] = useState<PaguForm>(initialFormData);
  // Clear form
  useEffect(() => {
    if (!openModal) {
      const timeout = setTimeout(() => {
        setFormData(initialFormData);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      console.log('PaguIndikatifTable.tsx', formData);
    }
  }, [openModal]);
  //#endregion

  //#region Mutasi
  const [loadingMutation, setLoadingMutation] = useState(false);
  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: PaguForm) => {
      setLoadingMutation(true);
      return addPagu({
        master_id: Number(payload.master_id),
        skpd_periode_id: Number(payload.skpd_periode_id),
        target: payload.target?.slice(0, 5).map((t) => ({
          pagu: Number(t.pagu),
          tahun_ke: Number(t.tahun_ke),
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_pagu'] });
      setFormData(initialFormData);
      setOpenModal(false);
      toast.success('Data berhasil ditambahkan');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal menambahkan data\n${error.response?.data.message}`);
      }
    },
    onSettled: () => {
      setLoadingMutation(false);
    },
  });
  // Update
  const updateMutation = useMutation({
    mutationFn: async (payload: PaguForm) => {
      setLoadingMutation(true);
      return updatePagu({
        master_id: Number(payload.master_id),
        skpd_periode_id: Number(payload.skpd_periode_id),
        target: payload.target?.slice(0, 5).map((t) => ({
          pagu: Number(t.pagu),
          tahun_ke: Number(t.tahun_ke),
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_pagu'] });
      setOpenModal(false);
      toast.success('Data berhasil diperbarui');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal memperbarui data\n${error.response?.data.message}`);
      }
    },
    onSettled: () => {
      setLoadingMutation(false);
    },
  });
  //#endregion

  // #region Kolom Tabel
  const columns: ColumnDef<PaguMaster>[] = [
    {
      id: 'kode',
      columns: ['Urusan', 'Bidang', 'Program', 'Kegiatan', 'Sub Kegiatan'].map(
        (label, index) => ({
          id: `kode_${label}`,
          meta: {
            tdClassNames: 'w-[30px]',
          },
          accessorFn: (row) => row.kodeFull?.[index],
          cell: ({ getValue }) => {
            const value = getValue();
            return value ?? '';
          },
        }),
      ),
    },
    {
      accessorKey: 'name',
      cell: ({ getValue, row }) => {
        const typeBold = ['urusan', 'bidang'];
        const isBold = !!typeBold.find((item) => item === row.original.type);
        return (
          <>
            <span className={isBold ? 'font-bold' : undefined}>
              {getValue() as ReactNode}
            </span>
          </>
        );
      },
    },
    {
      header: 'Target',
      meta: {
        tdClassNames: 'text-center',
      },
      columns: [1, 2, 3, 4, 5].map((tahun) => ({
        id: `pagu${tahun}`,
        header: `Pagu ${tahun}`,
        meta: { tdClassNames: 'text-center' },
        accessorFn: (row) => {
          const item = row.pagu?.find((p) => p.tahun_ke === tahun);
          return item ? item.pagu : null;
        },
        cell: ({ row, getValue }) => {
          const data = row.original;
          const initialValue = getValue();
          const [target, setTarget] = useState(initialValue);
          const [disBtn, setDisBtn] = useState(true);

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setTarget(newValue);
            setDisBtn(!newValue || Number(initialValue) === Number(newValue));
          };

          const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const mappedPagu = data.pagu?.map((p) => ({
              tahun_ke: p.tahun_ke,
              pagu:
                Number(p.tahun_ke) === Number(tahun)
                  ? Number(target)
                  : Number(p.pagu) || 0,
            })) || [
              {
                tahun_ke: tahun,
                pagu: Number(target) || 0,
              },
            ];

            updateMutation.mutate({
              skpd_periode_id: Number(selectedSKPD),
              master_id: data.id,
              target: mappedPagu,
            });
          };

          return (
            <>
              {getValue() && (
                <>
                  <form id={`form_target_${tahun}`} onSubmit={handleSubmit}>
                    <InputText
                      id={`input_target_${tahun}`}
                      Iconlabel='Rp.'
                      inputMode='numeric'
                      type='text'
                      placeholder='Target...'
                      value={target}
                      onChange={handleChange}
                      withButton
                      disableButton={disBtn}
                      buttonType='submit'
                      invalid={!target}
                    />
                  </form>
                </>
              )}
            </>
          );
        },
      })),
    },
  ];
  // #endregion

  return (
    <div className='space-y-2'>
      <div className='flex items-end justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='skpd'>SKPD</label>
            <InputSearchBox
              id='skpd'
              className='w-72 h-9'
              btnclassName='bg-white'
              placeholder='Pilih SKPD...'
              value={selectedSKPD.toString()}
              options={listSKPDPeriode as OptionItem[]}
              onChange={(val) => setSelectedSKPD(val)}
              onClear={() => {
                setSelectedSKPD('');
              }}
              withSearch
            />
          </div>
        </div>
        <div className='flex justify-between gap-2 items-end'>
          {getRoleId() !== 3 && (
            <InputButton
              tooltip='Tambah data'
              className='btn btn-theme w-9 h-9'
              onClick={() => {
                setOpenModal(true);
              }}
            >
              <MdAdd />
            </InputButton>
          )}
          <InputButton
            tooltip='Refresh'
            className='btn btn-theme w-9 h-9'
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? <Spinner color='var(--text-1)' /> : <MdRefresh />}
          </InputButton>
        </div>
      </div>
      <Tabel
        data={data || []}
        columns={columns}
        renderHeader={tableHead}
        tblClassName='lg:min-w-[1500px]'
      />
      <DialogModal
        title='Tambah data Pagu'
        isOpen={openModal}
        onClose={() => {
          setFormData(initialFormData);
          setOpenModal(false);
        }}
      >
        <FormPagu
          type='Add'
          defaultValues={formData}
          onSubmit={(data: PaguForm) => {
            console.log('Data dari form modal:', data);
            addMutation.mutate({
              skpd_periode_id: data.skpd_periode_id,
              master_id: data.master_id,
              target: data.target,
            });
          }}
        >
          <div className='flex gap-2 justify-end'>
            <InputButton
              type='submit'
              className='btn btn-theme w-24'
              isLoading={loadingMutation}
            >
              Simpan
            </InputButton>
          </div>
        </FormPagu>
      </DialogModal>
    </div>
  );
};

export default PaguIndikatifTable;
