import { createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import MainTable from '../MainTable';
import { MdPrint, MdRefresh } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import toast from 'react-hot-toast';
import InputSearchBox from '../../inputs/InputSearchBox';
import { exportDaftarDak } from '../../../services/ExcelService';
import Tabel from '../Tabel';

interface DaftarDAKType {
  no: number;
  uraian: string;
  pagu: number;
  realisasi_tw1: number;
  realisasi_tw2: number;
  realisasi_tw3: number;
  realisasi_tw4: number;
  total: number;
  sisa: number;
}

export const DaftarDakTable = () => {
  const [tahunDAK, setTahunDAK] = useState('2025');
  // Kolom
  const columnHelper = createColumnHelper<DaftarDAKType>();
  const columns = [
    columnHelper.display({
      header: 'No',
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('uraian', {
      header: 'Uraian Dana Alokasi Khusus',
    }),
    columnHelper.accessor('pagu', {
      header: 'Pagu',
    }),
    columnHelper.accessor('realisasi_tw1', {
      header: 'Realisasi TW I',
    }),
    columnHelper.accessor('realisasi_tw2', {
      header: 'Realisasi TW II',
    }),
    columnHelper.accessor('realisasi_tw3', {
      header: 'Realisasi TW III',
    }),
    columnHelper.accessor('realisasi_tw4', {
      header: 'Realisasi TW IV',
    }),
    columnHelper.accessor('total', {
      header: 'Total',
    }),
    columnHelper.accessor('sisa', {
      header: 'Sisa',
    }),
  ];

  // Dummy data
  const data = [
    {
      no: 1,
      uraian: 'Pendidikan',
      pagu: 100000000,
      realisasi_tw1: 25000000,
      realisasi_tw2: 20000000,
      realisasi_tw3: 30000000,
      realisasi_tw4: 15000000,
      total: 90000000,
      sisa: 10000000,
    },
    {
      no: 2,
      uraian: 'Kesehatan',
      pagu: 80000000,
      realisasi_tw1: 20000000,
      realisasi_tw2: 25000000,
      realisasi_tw3: 10000000,
      realisasi_tw4: 15000000,
      total: 70000000,
      sisa: 10000000,
    },
  ];

  const TableTopbar = () => {
    return (
      <>
        <div className='inline-flex flex-1 gap-1 justify-between'>
          <div className='inline-flex items-center gap-1'>
            <label htmlFor='tahun'>Tahun</label>
            <InputSearchBox
              id='tahun'
              className='h-9'
              //   defaultValue='2025'
              value={tahunDAK}
              onChange={(value) => {
                setTahunDAK(value);
              }}
              options={[
                { label: '2020', value: '2020' },
                { label: '2021', value: '2021' },
                { label: '2022', value: '2022' },
                { label: '2023', value: '2023' },
                { label: '2024', value: '2024' },
                { label: '2025', value: '2025' },
              ]}
            />
          </div>
          <div className='inline-flex flex-1 gap-1 justify-end'>
            <InputButton
              tooltip='Print'
              className='btn btn-theme w-9 h-9'
              onClick={() => {
                toast.success('Printing...');
                exportDaftarDak(data, tahunDAK);
              }}
            >
              <MdPrint />
            </InputButton>
            <InputButton
              tooltip='Refresh'
              className='btn btn-theme w-9 h-9'
              onClick={() => toast.success('Refreshing...')}
              // disabled={isFetching}
            >
              {/* {isFetching ? <Spinner color='var(--text-1)' /> : <MdRefresh />} */}
              <MdRefresh />
            </InputButton>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex flex-1 gap-2 justify-end'>
          <InputButton
            tooltip='Print'
            className='btn btn-theme w-9 h-9'
            onClick={() => {
              toast.success('Printing...');
              exportDaftarDak(data, tahunDAK);
            }}
          >
            <MdPrint />
          </InputButton>
          <InputButton
            tooltip='Refresh'
            className='btn btn-theme w-9 h-9'
            // onClick={() => refetch()}
            // disabled={isFetching}
          >
            {/* {isFetching ? <Spinner color='var(--text-1)' /> : <MdRefresh />} */}
            <MdRefresh />
          </InputButton>
        </div>
      </div>
      <Tabel data={data} columns={columns} sorting={false} />
    </div>
  );
};
