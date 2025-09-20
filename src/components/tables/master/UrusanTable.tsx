import { createColumnHelper } from '@tanstack/react-table';
import MainTable from '../MainTable';
import type { MasterType } from '../../../types/data';
import { useQuery } from '@tanstack/react-query';
import { getUrusan } from '../../../services/MasterService';
import Spinner from '../../inputs/Spinner';
import { MdRefresh } from 'react-icons/md';

const UrusanTable = () => {
  // Data fetching
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['tabel_urusan'],
    queryFn: getUrusan,
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
      header: 'Urusan',
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
      <MainTable data={data || []} columns={columns} tabletop={<TableTopbar />} />
    </>
  );
};

export default UrusanTable;
