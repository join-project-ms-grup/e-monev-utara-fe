import { jadwalDummy, type JadwalType } from '../../../dummy/dummy_data';
import { createColumnHelper } from '@tanstack/react-table';
import { MdNewspaper } from 'react-icons/md';
import MainTable from '../MainTable';

const JadwalTable = () => {
  const columnHelper = createColumnHelper<JadwalType>();
  //   const [data, _setData] = useState(() => [...jadwalDummy]);
  const columns = [
    columnHelper.accessor('id', {
      header: 'No',
      cell: (info) => (
        <span className='flex justify-center'>{info.getValue()}</span>
      ),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.tahun, {
      id: 'lastName',
      cell: (info) => (
        <span className='flex justify-center'>{info.getValue()}</span>
      ),
      header: 'Tahun',
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('tipe_tahap', {
      header: 'Tipe Tahap',
      cell: (info) => (
        <span className='flex justify-center'>{info.getValue()}</span>
      ),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('tahap', {
      header: 'Tahap',
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('jadwal', {
      header: 'Jadwal',
      cell: (info) => (
        <span className='flex justify-center'>{info.getValue()}</span>
      ),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span
          className={`flex justify-center ${info.getValue().includes('Selesai') ? ' text-green-700' : 'text-red-700'}`}
        >
          {info.getValue()}
        </span>
      ),
      footer: (info) => info.column.id,
    }),
    columnHelper.display({
      id: 'aksi',
      header: 'Aksi',
      cell: (info) => (
        <div className='flex justify-center'>
          <button
            className='inline-flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
            onClick={() => console.log('Edit', info.row.original)}
          >
            <MdNewspaper /> Durasi Jadwal
          </button>
        </div>
      ),
      footer: (info) => info.column.id,
    }),
  ];

  return (
    <>
      <MainTable data={jadwalDummy} columns={columns} />
    </>
  );
};

export default JadwalTable;
