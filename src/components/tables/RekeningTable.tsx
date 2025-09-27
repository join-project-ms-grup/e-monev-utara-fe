import { useQuery } from '@tanstack/react-query';
import {
  getRekening,
  type MasterTree,
  type MasterUrusan,
} from '../../services/MasterService';
import { createColumnHelper } from '@tanstack/react-table';
import { MdRefresh } from 'react-icons/md';
import Tabel from './Tabel';
import Spinner from '../inputs/Spinner';
import InputButton from '../inputs/InputButton';
import InputSearchBox from '../inputs/InputSearchBox';
import { useEffect, useState } from 'react';
import InputText from '../inputs/InputText';
import RowExpand from './RowExpand';
import RowExpandValue from './RowExpandValue';

const RekeningTable = () => {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_rekening'],
    queryFn: async () => {
      try {
        const result = await getRekening();
        return result;
      } catch (err) {
        console.error('Terjadi error:', err);
        throw err;
      }
    },
    refetchOnWindowFocus: false,
  });

  const columnHelper = createColumnHelper<MasterUrusan>();
  const columns = [
    columnHelper.display({
      header: ' ',
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'flex items-center justify-center',
      },
      cell: (ctx) => <RowExpand {...ctx} />,
    }),
    columnHelper.display({
      header: '#',
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('kode', {
      header: 'Kode',
      meta: {
        thClassNames: 'w-[10%]',
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('rekening', {
      header: 'Rekening',
      enableSorting: false,
      filterFn: 'equalsString',
      meta: {
        thClassNames: 'w-[10%]',
        tdClassNames: 'text-center capitalize',
      },
    }),
    columnHelper.accessor('name', {
      header: 'Nama',
      cell: (ctx) => <RowExpandValue {...ctx} />,
    }),
  ];

  const subRows = (row: MasterTree) =>
    row.bidang ?? row.program ?? row.kegiatan ?? row.subKegiatan ?? undefined;

  const [searchFields, setSearchFields] = useState({
    name: '',
    kode: '',
    rekening: '',
  });
  const [filters, setFilters] = useState<{ field: string; value: string }[]>(
    [],
  );

  useEffect(() => {
    const newFilters = Object.entries(searchFields)
      .filter(([_, value]) => value)
      .map(([field, value]) => ({ field, value }));
    setFilters(newFilters);
  }, [searchFields]);

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='nama'>Nama</label>
            <InputText
              id='nama'
              placeholder='Cari nama...'
              wrapperClassname='bg-white'
              value={searchFields.name}
              onChange={(e) =>
                setSearchFields((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className='w-28'>
            <label htmlFor='kode'>Kode</label>
            <InputText
              id='kode'
              inputMode='numeric'
              maxLength={9}
              placeholder='Cari kode...'
              wrapperClassname='bg-white'
              value={searchFields.kode}
              onChange={(e) =>
                setSearchFields((prev) => ({ ...prev, kode: e.target.value }))
              }
            />
          </div>
          <div>
            <label htmlFor='rekening'>Rekening</label>
            <InputSearchBox
              id='rekening'
              className='w-44'
              btnclassName='bg-white'
              placeholder='Pilih rekening...'
              value={searchFields.rekening}
              options={[
                { label: 'Urusan', value: 'urusan' },
                { label: 'Bidang', value: 'bidang' },
                { label: 'Program', value: 'program' },
                { label: 'Kegiatan', value: 'kegiatan' },
                { label: 'Sub Kegiatan', value: 'sub kegiatan' },
              ]}
              onChange={(e) =>
                setSearchFields((prev) => ({ ...prev, rekening: e }))
              }
              onClear={() =>
                setSearchFields((prev) => ({ ...prev, rekening: '' }))
              }
              withClear
            />
          </div>
        </div>
        <div className='flex justify-end items-end'>
          <InputButton
            className='h-9 w-9'
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
        subRows={subRows}
        subLabels={['Bidang', 'Program', 'Kegiatan', 'SubKegiatan']}
        searchFilters={filters}
      />
    </div>
  );
};

export default RekeningTable;
