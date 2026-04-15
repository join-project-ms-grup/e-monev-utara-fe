import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef, type Table } from '@tanstack/react-table';
import Spinner from '../../inputs/Spinner';
import { MdAdd, MdEdit, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import DialogModal from '../../inputs/DialogModal';
import InputButton from '../../inputs/InputButton';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../lib/api';
import { getRoleId, isAdmin, isDev } from '../../../lib/usercookie';
import Tabel from '../Tabel';
import {
  useBidangDakData,
  useSubBidangDAK,
} from '../../../hooks/DAK/TabelDataDak';
import InputSearchBox from '../../inputs/InputSearchBox';
import {
  addBidangDAK,
  addSubBidangDAK,
  flatSubBidangDAK,
  updateBidangDAK,
  updateSubBidangDAK,
  type BidangDAK,
  type BidangDAKForm,
} from '../../../services/DAK/DAKBidangService';
import { useListBidangDAK } from '../../../hooks/DAK/ListDataDAK';
import FormBidangDak from '../../forms/DAK/MonitoringDAK/FormBidangDak';

const BidangDakTable = () => {
  const queryClient = useQueryClient();
  // Modal
  const [modalState, setModalState] = useState<'Add' | 'Edit' | 'Delete'>(
    'Add',
  );
  const [openModal, setOpenModal] = useState(false);

  // Form Data
  const initialFormData: BidangDAKForm = {
    id: Number(''),
    name: '',
    keterangan: '',
    jenis_dak: 1,
    id_bidang: 0,
    status: true,
    type: 'bidang',
  };

  const [formData, setFormData] = useState<BidangDAKForm>(initialFormData);
  // Clear form
  useEffect(() => {
    if (!openModal) {
      const timeout = setTimeout(() => {
        setFormData(initialFormData);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [openModal]);

  //#region DATA
  const [jenisDak, setJenisDak] = useState('1');
  const {
    data: dataBidang,
    refetch: refetchBid,
    isFetching: isFetchBid,
  } = useBidangDakData(Number(jenisDak));
  const [bidangDak, setBidangDak] = useState('');
  const listBidangDak = useListBidangDAK(Number(jenisDak));
  const {
    data: dataSubBidang,
    refetch: refetchSub,
    isFetching: isFetchSub,
  } = useSubBidangDAK(Number(bidangDak));
  const data = bidangDak ? flatSubBidangDAK(dataSubBidang ?? []) : dataBidang;
  //#endregion

  // Add
  const addMutation = useMutation({
    mutationFn: async (payload: BidangDAKForm) => {
      if (payload.type === 'bidang') {
        addBidangDAK({
          jenis_dak: payload.jenis_dak,
          name: payload.name,
          keterangan: payload.keterangan,
        });
      } else {
        addSubBidangDAK({
          id_bidang: payload.id_bidang,
          name: payload.name,
          keterangan: payload.keterangan,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_bidang_dak'] });
      refetchSub();
      setFormData(initialFormData);
      setOpenModal(false);
      toast.success('Data berhasil ditambahkan');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.response?.status === 400) {
        toast.error(`Gagal menambahkan data\n${error.response?.data.message}`);
      }
    },
  });
  // Update
  const updateMutation = useMutation({
    mutationFn: async (payload: BidangDAKForm) => {
      if (!payload.id_bidang) {
        updateBidangDAK({
          id: payload.id,
          name: payload.name,
          keterangan: payload.keterangan,
          status: payload.status,
        });
      } else {
        updateSubBidangDAK({
          id: payload.id,
          name: payload.name,
          keterangan: payload.keterangan,
          status: payload.status,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabel_bidang_dak'] });
      refetchSub();
      setOpenModal(false);
      toast.success('Data berhasil diperbarui');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.response?.status === 400) {
        toast.error(`Gagal memperbarui data\n${error.response.data.message}`);
      }
    },
  });

  // Kolom
  const columns: ColumnDef<BidangDAK>[] = [
    {
      header: 'No',
      meta: {
        thClassNames: 'w-[5%]',
      },
    },
    {
      header: 'Jenis',
      meta: {
        thClassNames: 'w-[150px]',
      },
    },
    {
      header: 'Nama',
      meta: {
        thClassNames: 'w-[400px]',
      },
    },
    {
      header: 'Keterangan',
      accessorKey: 'keterangan',
    },
    {
      header: 'Status',
    },
    {
      header: 'Aksi',
      meta: {
        thClassNames: 'w-[5%]',
      },
    },
  ];

  const tableBody = (table: Table<BidangDAK & { level?: string }>) => {
    const rows = table.getRowModel().rows;
    let nomor = 1;

    return (
      <>
        {rows.map((row, i) => {
          const item = row.original;
          if (item.level === 'bidang') {
            return (
              <tr key={i}>
                <td colSpan={6}>
                  <span className='font-bold'>Bidang DAK: {item.name}</span>
                </td>
              </tr>
            );
          }

          return (
            <tr key={i}>
              <td className='text-center'>{nomor++}</td>
              <td className='text-center'>
                {jenisDak === '1' ? 'Fisik' : 'Non-Fisik'}
              </td>
              <td>{item.name}</td>
              <td>{item.keterangan}</td>
              <td className='text-center'>
                <span
                  className={`text-white px-2 py-1 rounded-full font-bold ${item.status ? ' bg-green-700' : 'bg-red-700'}`}
                >
                  {item.status ? 'Aktif' : 'Nonaktif'}
                </span>
              </td>
              <td className='text-center'>
                <div className='inline-flex gap-1'>
                  <button
                    className='p-1 transition-all rounded-full hover:bg-blue-400 hover:text-[var(--text-3)] active:scale-90'
                    onClick={() => {
                      setModalState('Edit');
                      setFormData({
                        id: item.id ?? 0,
                        name: item.name ?? '',
                        keterangan: item.keterangan ?? '',
                        status: item.status,
                        id_bidang: item.dak_bidangId,
                        jenis_dak: Number(jenisDak),
                      });
                      setOpenModal(true);
                    }}
                  >
                    <MdEdit className='text-xl' />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </>
    );
  };

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex flex-1 gap-2 justify-start'>
          <div>
            <label htmlFor='jenisDak'>Jenis DAK</label>
            <InputSearchBox
              id='jenisDak'
              placeholder='Pilih Jenis DAK'
              className='h-9 w-32'
              value={jenisDak}
              options={[
                { label: 'Fisik', value: '1' },
                { label: 'Non-Fisik', value: '2' },
              ]}
              onChange={(val) => {
                setJenisDak(val);
                setBidangDak('');
              }}
            />
          </div>
          <div>
            <label htmlFor='bidang'>Bidang</label>
            <InputSearchBox
              id='bidang'
              placeholder='Pilih Bidang'
              tooltip
              className='h-9 w-80'
              value={bidangDak}
              options={listBidangDak}
              onChange={(val) => setBidangDak(val)}
              onClear={() => setBidangDak('')}
              withSearch
            />
          </div>
        </div>
        <div className='flex justify-end items-end gap-2'>
          {(isDev() || isAdmin()) && (
            <InputButton
              tooltip='Tambah data'
              className='btn btn-theme w-9 h-9'
              onClick={() => {
                setModalState('Add');
                setOpenModal(true);
              }}
            >
              <MdAdd />
            </InputButton>
          )}

          <InputButton
            tooltip='Refresh'
            className='btn btn-theme w-9 h-9'
            onClick={() => {
              if (!bidangDak) {
                refetchBid();
              } else {
                refetchSub();
              }
            }}
            disabled={isFetchBid || isFetchSub}
          >
            {isFetchBid || isFetchSub ? (
              <Spinner color='var(--color-2)' />
            ) : (
              <MdRefresh />
            )}
          </InputButton>
        </div>
      </div>
      <Tabel
        data={data || []}
        columns={columns}
        renderBody={(table) => tableBody(table)}
      />
      {modalState === 'Add' && (
        <DialogModal
          title='Tambah data Bidang'
          isOpen={openModal}
          onClose={() => {
            setFormData(initialFormData);
            setOpenModal(false);
          }}
        >
          <FormBidangDak
            type='Add'
            defaultValues={formData}
            onSubmit={(data) => {
              addMutation.mutate(data);
            }}
          >
            <div className='flex gap-2 justify-end'>
              <InputButton type='submit' className='btn btn-theme w-24'>
                Simpan
              </InputButton>
            </div>
          </FormBidangDak>
        </DialogModal>
      )}
      {modalState === 'Edit' && (
        <DialogModal
          title='Ubah data Bidang'
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        >
          <FormBidangDak
            type='Edit'
            defaultValues={formData}
            onSubmit={(data) => {
              updateMutation.mutate(data);
            }}
          >
            <div className='flex gap-2 justify-end'>
              <InputButton type='submit' className='btn btn-theme w-24'>
                Simpan
              </InputButton>
            </div>
          </FormBidangDak>
        </DialogModal>
      )}
    </div>
  );
};

export default BidangDakTable;
