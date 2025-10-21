import { type ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { MdRefresh } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import InputSearchBox, { type OptionItem } from '../../inputs/InputSearchBox';
import Tabel from '../Tabel';
import RowExpand from '../RowExpand';
import { useQuery } from '@tanstack/react-query';
import { getPeriode } from '../../../services/PeriodeService';

const PaguIndikatifTable = () => {
  const columns: ColumnDef<any>[] = [
    {
      header: ' ',
      cell: (ctx) => <RowExpand {...ctx} />,
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'text-center',
      },
    },
    {
      header: 'No',
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'kode',
      header: 'Kode',
      meta: {
        thClassNames: 'w-[10%]',
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'name',
      header: 'Urusan / Bidang / Program / Kegiatan / Sub Kegiatan',
      enableSorting: false,
      filterFn: 'equalsString',
      meta: {
        tdClassNames: 'text-center capitalize',
      },
    },
    {
      header: 'Pagu',
      meta: {
        thClassNames: 'w-[20%]',
        tdClassNames: 'text-center',
      },
    },
  ];

  const { data: listPeriode } = useQuery({
    queryKey: ['list_periode'],
    queryFn: async () => {
      const periodeResult = await getPeriode();
      return (
        periodeResult?.map((item) => ({
          label: `${item.mulai} - ${item.akhir}`,
          value: item.id?.toString(),
        })) || []
      );
    },
  });

  const [periode, setPeriode] = useState('');

  return (
    <div className='space-y-2'>
      <div className='flex items-end justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='periode'>Periode</label>
            <InputSearchBox
              id='periode'
              className='w-36 h-9'
              btnclassName='bg-white'
              value={periode}
              onChange={(val) => setPeriode(val)}
              options={listPeriode as OptionItem[] || []}
              defaultOptionLabel='Pilih Periode'
            />
          </div>
        </div>
        <div className='flex justify-end items-end'>
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
      <Tabel data={[]} columns={columns} />
    </div>
  );
};

export default PaguIndikatifTable;
