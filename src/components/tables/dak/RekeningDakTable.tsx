import { useQuery } from '@tanstack/react-query';
import { type ColumnDef, type Table } from '@tanstack/react-table';
import {
  MdAdd,
  MdEdit,
  MdRefresh,
  MdSubdirectoryArrowRight,
} from 'react-icons/md';
import { useEffect, useState, type JSX } from 'react';
import {
  getRekeningDAK,
  getRekeningDAKFlat,
  type DAKMasterUrusan,
} from '../../../services/DAK/DAKRekeningService';
import InputText from '../../inputs/InputText';
import InputSearchBox from '../../inputs/InputSearchBox';
import InputButton from '../../inputs/InputButton';
import Spinner from '../../inputs/Spinner';
import Tabel from '../Tabel';
import { isAdmin, isDev } from '../../../lib/usercookie';
import F_RekDak from '../../forms/DAK/Master/Rekening/F_RekDak';
import DialogModal from '../../inputs/DialogModal';
import AksiButton from '../../inputs/AksiButton';
import type { RekDakForm } from '../../forms/DAK/Master/Rekening/FV_RekDak';

const tableHead = () => {
  return (
    <tr>
      <th className='w-[50px]'>No</th>
      <th>Kode</th>
      <th>Nama</th>
      <th>Aksi</th>
    </tr>
  );
};

const RekeningDakTable = () => {
  // Data fetching
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['dak_rekening'],
    queryFn: async () => {
      const dak = await getRekeningDAK();
      const dakflat = await getRekeningDAKFlat(dak);
      return dakflat;
    },
  });

  const initSelectedData: RekDakForm = {
    id: 0,
    name: '',
    kode: '',
    status: true,
    type: '',
  };

  const [selectedData, setSelectedData] = useState(initSelectedData);

  const tableBody = ({
    table,
    selectedRekening,
  }: {
    table: Table<DAKMasterUrusan & { depth: number }>;
    selectedRekening: string;
  }) => {
    if (!data)
      return (
        <tr>
          <td colSpan={7}>TIDAK ADA DATA</td>
        </tr>
      );

    const levels = ['urusan', 'bidang', 'program', 'kegiatan', 'subKegiatan'];
    const levelIndex = selectedRekening ? levels.indexOf(selectedRekening) : -1;

    // Filter berdasarkan selectedRekening
    let filteredData =
      levelIndex >= 0
        ? data.filter((item) => item.rekening === selectedRekening)
        : data;

    // Filter kode
    const kodeFilter = searchFields.kode?.trim();
    if (kodeFilter) {
      filteredData = filteredData.filter((item) =>
        (item.kodeFull || []).join('.').startsWith(kodeFilter),
      );
    }

    // Filter nama
    const nameFilter = searchFields.name?.trim().toLowerCase();
    if (nameFilter) {
      filteredData = filteredData.filter((item) =>
        item.name?.toLowerCase().includes(nameFilter),
      );
    }

    // Pagination
    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    const paginatedData = filteredData.slice(
      pageIndex * pageSize,
      (pageIndex + 1) * pageSize,
    );

    // Mapping kodeFull ke item untuk header parent
    const parentMap: Record<string, DAKMasterUrusan> = {};
    data.forEach((item) => {
      const key = item.kodeFull?.join('.') || '-';
      parentMap[key] = item;
    });

    const rows: JSX.Element[] = [];

    paginatedData.forEach((item, idx) => {
      if (levelIndex >= 0) {
        // Tambahkan header parent dari Urusan sampai parent level terpilih
        const parentCodes = item.kodeFull?.slice(0, levelIndex) || [];
        parentCodes.forEach((code, i) => {
          const key = parentCodes.slice(0, i + 1).join('.');
          const nameItem = parentMap[key];
          if (nameItem) {
            const exists = rows.some(
              (r) => (r.key as string) === `header-${key}`,
            );
            if (!exists) {
              rows.push(
                <tr key={`header-${key}`} className='bg-gray-200 font-bold'>
                  <td colSpan={7}>
                    <div
                      className='inline-flex items-center gap-1'
                      style={{ paddingLeft: `${i * 16}px` }}
                    >
                      {i > 0 && <MdSubdirectoryArrowRight />}
                      <span>
                        [{parentCodes.slice(0, i + 1).join('.')}]{' '}
                        {nameItem.name}
                      </span>
                    </div>
                  </td>
                </tr>,
              );
            }
          }
        });
      }

      // Baris data level terpilih
      rows.push(
        <tr key={`row-${idx}`}>
          <td className='text-center'>{idx + 1}</td>
          <td className='text-left w-[50px]'>
            {item.kodeFull?.join('.') ?? ''}
          </td>
          <td>{item.name}</td>
          <td className='text-center w-[50px]'>
            <AksiButton
              Icon={MdEdit}
              onClick={() => {
                setModal('Add');
                setSelectedData({
                  id: item.id ?? 0,
                  kode: item.kode?.toString() ?? '',
                  name: item.name ?? '',
                  status: true,
                });
              }}
            />
          </td>
        </tr>,
      );
    });

    return <>{rows}</>;
  };

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

  const columns: ColumnDef<DAKMasterUrusan & { depth: number }>[] = [
    {
      header: 'No',
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'rekening',
      header: 'Rekening',
      enableSorting: false,
      filterFn: 'equalsString',
      meta: {
        tdClassNames: 'capitalize',
      },
      cell: ({ getValue }) =>
        getValue() === 'subKegiatan' ? 'Sub Kegiatan' : getValue(),
    },
    {
      id: 'kode',
      columns: ['Urusan', 'Bidang', 'Program', 'Kegiatan', 'Sub Kegiatan'].map(
        (label, index) => ({
          id: `kode_${label}`,
          accessorFn: (row) => row.kodeFull?.[index],
          cell: ({ getValue }) => {
            const value = getValue();
            return value ?? '';
          },
        }),
      ),
      filterFn: (row, filterValue) => {
        const kodeArray = row.original.kodeFull || [];
        const joined = kodeArray.join('.');
        const search = String(filterValue).trim();
        return joined.startsWith(search);
      },
    },
    {
      accessorKey: 'name',
      header: 'Nama',
    },
    {
      header: 'Aksi',
    },
  ];

  const [modal, setModal] = useState<'' | 'Add'>('');

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex gap-2'>
          <div className='w-96'>
            <label htmlFor='nama'>Nama</label>
            <InputText
              id='nama'
              placeholder='Cari nama...'
              wrapperClassname='bg-white'
              value={searchFields.name}
              onChange={(e) =>
                setSearchFields((prev) => ({ ...prev, name: e.target.value }))
              }
              onClear={() => setSearchFields((prev) => ({ ...prev, name: '' }))}
            />
          </div>
          <div className='w-42'>
            <label htmlFor='kode'>Kode</label>
            <InputText
              id='kode'
              inputMode='numeric'
              maxLength={20}
              placeholder='Cari kode...'
              wrapperClassname='bg-white'
              value={searchFields.kode}
              onChange={(e) => {
                setSearchFields((prev) => ({ ...prev, kode: e.target.value }));
              }}
              onClear={() => setSearchFields((prev) => ({ ...prev, kode: '' }))}
            />
          </div>
          <div>
            <label htmlFor='rekening'>Rekening</label>
            <InputSearchBox
              id='rekening'
              className='h-9'
              btnclassName='bg-white'
              placeholder='Pilih rekening...'
              value={searchFields.rekening}
              options={[
                { label: 'Urusan', value: 'urusan' },
                { label: 'Bidang', value: 'bidang' },
                { label: 'Program', value: 'program' },
                { label: 'Kegiatan', value: 'kegiatan' },
                { label: 'Sub Kegiatan', value: 'subKegiatan' },
              ]}
              onChange={(e) =>
                setSearchFields((prev) => ({ ...prev, rekening: e }))
              }
              onClear={() =>
                setSearchFields((prev) => ({ ...prev, rekening: '' }))
              }
            />
          </div>
        </div>
        <div className='flex justify-end items-end gap-2'>
          {(isDev() || isAdmin()) && (
            <InputButton
              tooltip='Tambah data'
              className='btn btn-theme w-9 h-9'
              onClick={() => {
                setModal('Add');
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
            {isFetching ? <Spinner color='var(--color-2)' /> : <MdRefresh />}
          </InputButton>
        </div>
      </div>
      <Tabel
        data={data || []}
        columns={columns}
        searchFilters={filters}
        renderHeader={tableHead}
        renderBody={(table) =>
          tableBody({ table, selectedRekening: searchFields.rekening })
        }
      />
      <DialogModal
        title={`${selectedData.id ? 'Ubah' : 'Tambah'} Data Rekening DAK`}
        isOpen={modal === 'Add'}
        onClose={() => {
          setModal('');
          setSelectedData(initSelectedData);
        }}
      >
        <F_RekDak
          data={selectedData}
          onSuccess={() => {
            setModal('');
            setSelectedData(initSelectedData);
          }}
        />
      </DialogModal>
    </div>
  );
};

export default RekeningDakTable;
