import { urusanDummy, type UrusanType } from '../../dummy/dummy_data';
import { createColumnHelper } from '@tanstack/react-table';
import MainTable from './MainTable';

const UrusanTable = () => {
  const columnHelper = createColumnHelper<UrusanType>();
  //   const [data, _setData] = useState(() => [...jadwalDummy]);
  const columns = [
    columnHelper.accessor('id', {
      header: 'No',
      cell: (info) => (
        <span className='flex justify-center'>{info.getValue()}</span>
      ),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('kode_urusan', {
      header: 'Kode Urusan',
      cell: (info) => (
        <span className='flex justify-center'>{info.getValue()}</span>
      ),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('urusan', {
      header: 'Urusan',
      footer: (info) => info.column.id,
    }),
  ];

  console.log(urusanDummy)

  return (
    <>
      <MainTable data={urusanDummy} columns={columns} />
    </>
  );
};

export default UrusanTable;
