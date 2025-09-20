import { createColumnHelper } from '@tanstack/react-table';
import MainTable from '../MainTable';
import type { MasterType } from '../../../types/data';
import { useQuery } from '@tanstack/react-query';
import { getChildren, getUrusan } from '../../../services/MasterService';
import Spinner from '../../inputs/Spinner';
import { MdRefresh } from 'react-icons/md';

const BidangTable = () => {
  // Data fetching
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_bidang'],
    queryFn: async () => {
      const urusanList = await getUrusan();
      const urusanMap = urusanList.reduce((acc: Record<number, string>, u) => {
        acc[u.id] = `[${u.kode}] ${u.name}`;
        return acc;
      }, {});

      const ids = urusanList.map((u) => u.id);
      const bidangList = await Promise.all(ids.map((id) => getChildren(id)));

      const withUrusan = bidangList.flat().map((b) => ({
        ...b,
        group: urusanMap[b.parent_id] ?? null,
      }));

      return withUrusan;
    },
  });

  // Kolom
  const columnHelper = createColumnHelper<MasterType>();
  const columns = [
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
      header: 'Bidang',
    }),
  ];

  const TableTopbar = () => {
    return (
      <>
        <div className='inline-flex flex-1 gap-2 justify-end'>
          <button
            className='table-button w-9 h-9'
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? <Spinner color='var(--text-1)' /> : <MdRefresh />}
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <MainTable
        groupHeader='Urusan'
        data={data || []}
        columns={columns}
        tabletop={<TableTopbar />}
      />
    </>
  );
};

export default BidangTable;
