import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
  getMasalahDAK,
  type MasalahDAK,
} from '../../../services/DAK/DAKMonitoringService';
import InputSearchBox from '../../inputs/InputSearchBox';
import InputButton from '../../inputs/InputButton';
import Spinner from '../../inputs/Spinner';
import Tabel from '../Tabel';
import { MdAdd, MdEdit, MdRefresh } from 'react-icons/md';
import type { ColumnDef } from '@tanstack/react-table';
import AksiButton from '../../inputs/AksiButton';
import DialogModal from '../../inputs/DialogModal';
import F_MasalahDak from '../../forms/DAK/Master/Masalah/F_MasalahDak';
import type { MasalahDakForm } from '../../forms/DAK/Master/Masalah/FV_MasalahDak';

const MasalahDakTable = () => {
  const [modal, setModal] = useState<'' | 'Add'>('');
  const [kodeJenis, setKodeJenis] = useState(0);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['list_masalah_dak', kodeJenis],
    queryFn: async () => getMasalahDAK(kodeJenis),
    enabled: !!kodeJenis,
  });

  const initMasalahData: MasalahDakForm = {
    id: 0,
    kode_jenis: '',
    keterangan: '',
    name: '',
    status: true,
  };

  const [selectedData, setSelectedData] = useState(initMasalahData);

  const columns: ColumnDef<MasalahDAK>[] = [
    {
      header: 'No',
      meta: {
        thClassNames: 'w-[50px]',
        tdClassNames: 'text-center',
      },
      cell: ({ row }) => `${row.index + 1}`,
    },
    {
      accessorKey: 'name',
      meta: {
        thClassNames: 'w-[45%]',
      },
      header: 'Nama',
    },
    {
      accessorKey: 'keterangan',
      header: 'Keterangan',
    },
    {
      accessorKey: 'status',
      meta: {
        thClassNames: 'w-[150px]',
        tdClassNames: 'text-center',
      },
      header: 'Status',
      cell: (info) => (
        <>
          {Number(info.getValue()) === 1 ? (
            <span className='text-green-700'>Aktif</span>
          ) : (
            <span className='text-red-700'>Nonaktif</span>
          )}
        </>
      ),
    },
    {
      header: 'Aksi',
      meta: {
        thClassNames: 'w-[50px]',
        tdClassNames: 'text-center',
      },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <>
            <AksiButton
              Icon={MdEdit}
              onClick={() => {
                setModal('Add');
                setSelectedData({
                  id: item.id,
                  keterangan: item.keterangan ?? '',
                  kode_jenis: kodeJenis.toString(),
                  name: item.name ?? '',
                  status: item.status,
                });
              }}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='kode_jenis'>Kode Jenis</label>
            <InputSearchBox
              id='kode_jenis'
              className='w-42 h-9'
              btnclassName='bg-white'
              placeholder='Pilih Tahun ke...'
              options={[
                { label: 'Fisik', value: '1' },
                { label: 'Non-Fisik', value: '2' },
              ]}
              onChange={(val) => setKodeJenis(Number(val))}
            />
          </div>
        </div>
        <div className='flex justify-end items-end gap-2'>
          <InputButton
            tooltip='Tambah data'
            className='btn btn-theme w-9 h-9'
            onClick={() => setModal('Add')}
          >
            <MdAdd />
          </InputButton>
          <InputButton
            tooltip='Refresh'
            className='btn btn-theme w-9 h-9'
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? <Spinner color='var(--color-2)' /> : <MdRefresh />}
          </InputButton>
        </div>
      </div>
      <Tabel data={data || []} columns={columns} />
      <DialogModal
        title='Tambah Data Masalah DAK'
        isOpen={modal === 'Add'}
        onClose={() => {
          setModal('');
          setTimeout(() => {
            setSelectedData(initMasalahData);
          }, 200);
        }}
      >
        <F_MasalahDak
          data={selectedData}
          onSuccess={() => {
            setModal('');
            setTimeout(() => {
              setSelectedData(initMasalahData);
            }, 200);
          }}
        />
      </DialogModal>
    </div>
  );
};

export default MasalahDakTable;
