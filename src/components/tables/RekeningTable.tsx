import { useQuery } from '@tanstack/react-query';
import {
  getChildren,
  getMasterFilter,
  getMasterRaw,
  getRekening,
  getUrusan,
  type MasterFilter,
  type MasterTree,
  type MasterUrusan,
} from '../../services/MasterService';
import { createColumnHelper } from '@tanstack/react-table';
import { MdKeyboardArrowDown, MdRefresh } from 'react-icons/md';
import Tabel from './Tabel';
import Spinner from '../inputs/Spinner';
import InputButton from '../inputs/InputButton';
import InputSearchBox from '../inputs/InputSearchBox';
import type { OptionItem } from '../inputs/InputSelectBox';
import { useEffect, useState } from 'react';
import InputSelect from '../inputs/InputSelect';
import { boolean } from 'zod';

const RekeningTable = () => {
  const initialFilter: MasterFilter = {
    type: 'subKegiatan',
    id_urusan: undefined,
    id_bidang: undefined,
    id_program: undefined,
    id_kegiatan: undefined,
  };
  const [filter, setFilter] = useState<MasterFilter>(initialFilter);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_rekening', filter],
    queryFn: async () => {
      try {
        const result = await getMasterFilter(filter);
        return result;
      } catch (err) {
        console.error('Terjadi error:', err);
        throw err;
      }
    },
  });

  const columnHelper = createColumnHelper<MasterUrusan>();
  const columns = [
    columnHelper.display({
      header: ' ',
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'flex items-center justify-center',
      },
      cell: ({ row, getValue }) => (
        <div>
          {row.getCanExpand() ? (
            <button
              className={`font-extrabold transition-all ease hover:opacity-80 active:scale-100 ${row.getIsExpanded() ? 'text-red-400' : 'text-blue-400'} scale-125`}
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: 'pointer' },
              }}
            >
              <MdKeyboardArrowDown
                className={`transition-transform ${row.getIsExpanded() ? 'rotate-180' : ''}`}
              />
            </button>
          ) : (
            <span className='font-bold'>-</span>
            // <MdSubdirectoryArrowRight className='scale-[200%] p-2 text-[var(--text-3)] bg-green-500 h-4 rounded-full' />
          )}
          {getValue<boolean>()}
        </div>
      ),
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
    columnHelper.accessor('name', {
      header: 'Nama',
      cell: ({ row, getValue }) => (
        <div
          className='inline-flex items-start'
          style={{
            paddingLeft: `${row.depth * 1}rem`,
          }}
        >
          {/* {row.depth !== 0 && <MdSubdirectoryArrowRight />} */}
          {getValue<boolean>()}
        </div>
      ),
    }),
  ];

  const subRows = (row: MasterTree) =>
    row.bidang ?? row.program ?? row.kegiatan ?? row.subKegiatan ?? undefined;

  const { data: dataUrusan } = useQuery({
    queryKey: ['list_urusan', filter],
    queryFn: getUrusan,
    refetchOnWindowFocus: false,
  });

  const { data: dataBidang } = useQuery({
    queryKey: ['list_bidang', filter],
    queryFn: () => getChildren(filter.id_urusan!),
    enabled: filter.id_urusan !== undefined,
    refetchOnWindowFocus: false,
  });

  const { data: dataProgram } = useQuery({
    queryKey: ['list_program', filter],
    queryFn: () => getChildren(filter.id_bidang!),
    enabled: filter.id_bidang !== undefined,
    refetchOnWindowFocus: false,
  });

  const { data: dataKegiatan } = useQuery({
    queryKey: ['list_kegiatan', filter],
    queryFn: () => getChildren(filter.id_program!),
    enabled: filter.id_program !== undefined,
    refetchOnWindowFocus: false,
  });

  const opsiUrusan =
    dataUrusan?.map((u) => ({
      label: `[${u.kode}] ${u.name}`,
      value: u.id?.toString(),
    })) ?? [];

  const opsiBidang =
    dataBidang?.map((u) => ({
      label: `[${u.kode}] ${u.name}`,
      value: u.id?.toString(),
    })) ?? [];

  const opsiProgram =
    dataProgram?.map((u) => ({
      label: `[${u.kode}] ${u.name}`,
      value: u.id?.toString(),
    })) ?? [];

  const opsiKegiatan =
    dataKegiatan?.map((u) => ({
      label: `[${u.kode}] ${u.name}`,
      value: u.id?.toString(),
    })) ?? [];

  const updateFilter = (key: keyof MasterFilter, value: string | undefined) => {
    setFilter((prev) => {
      const updated = { ...prev, [key]: value };

      if (key === 'id_urusan') {
        updated.id_bidang = undefined;
        updated.id_program = undefined;
        updated.id_kegiatan = undefined;
      } else if (key === 'id_bidang') {
        updated.id_program = undefined;
        updated.id_kegiatan = undefined;
      } else if (key === 'id_program') {
        updated.id_kegiatan = undefined;
      }

      return updated;
    });
  };

  const TableTopbar = () => {
    return (
      <>
        <div className='inline-flex flex-1 gap-2 justify-between'>
          <div className='inline-flex gap-2'>
            {/* Filter Urusan */}
            <div>
              <label htmlFor='urusan'>Urusan</label>
              <InputSearchBox
                tooltip
                id='urusan'
                placeholder='Urusan...'
                btnclassName='bg-white'
                className='w-54'
                value={filter.id_urusan?.toString()}
                onChange={(e) => updateFilter('id_urusan', e || undefined)}
                onChangeClear={() => updateFilter('id_urusan', undefined)}
                options={opsiUrusan as OptionItem[]}
                withSearch
                withClear={Boolean(filter.id_urusan)}
              />
            </div>

            {/* Filter Bidang */}
            <div>
              <label htmlFor='bidang'>Bidang</label>
              <InputSearchBox
                tooltip
                id='bidang'
                placeholder='Bidang...'
                btnclassName='bg-white'
                className='w-54'
                value={filter.id_bidang?.toString()}
                onChange={(e) => updateFilter('id_bidang', e || undefined)}
                onChangeClear={() => updateFilter('id_bidang', undefined)}
                options={opsiBidang as OptionItem[]}
                withSearch
                withClear={Boolean(filter.id_bidang)}
              />
            </div>

            {/* Filter Program */}
            <div>
              <label htmlFor='program'>Program</label>
              <InputSearchBox
                tooltip
                id='program'
                placeholder='Program...'
                btnclassName='bg-white'
                className='w-54'
                value={filter.id_program?.toString()}
                onChange={(e) => updateFilter('id_program', e || undefined)}
                onChangeClear={() => updateFilter('id_program', undefined)}
                options={opsiProgram as OptionItem[]}
                withSearch
                withClear={Boolean(filter.id_program)}
              />
            </div>

            {/* Filter Kegiatan */}
            <div>
              <label htmlFor='kegiatan'>Kegiatan</label>
              <InputSearchBox
                tooltip
                id='kegiatan'
                placeholder='Kegiatan...'
                btnclassName='bg-white'
                className='w-54'
                value={filter.id_kegiatan?.toString()}
                onChange={(e) => updateFilter('id_kegiatan', e || undefined)}
                onChangeClear={() => updateFilter('id_kegiatan', undefined)}
                options={opsiKegiatan as OptionItem[]}
                withSearch
                withClear={Boolean(filter.id_kegiatan)}
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
      </>
    );
  };

  return (
    <>
      <Tabel
        data={data || []}
        columns={columns}
        subRows={subRows}
        tabletop={<TableTopbar />}
      />
    </>
  );
};

export default RekeningTable;
