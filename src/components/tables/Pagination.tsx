import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import InputButton from '../inputs/InputButton';
import InputSelectBox from '../inputs/InputSelectBox';
import type { Table } from '@tanstack/react-table';

type PaginationProps<TData> = {
  table: Table<TData>;
};

const Pagination = <TData,>({ table }: PaginationProps<TData>) => {
  return (
    <div className='flex flex-row items-center justify-between mt-2'>
      <div className='flex items-center gap-1'>
        <span className='opacity-85'>Tampilkan</span>
        <InputSelectBox
          btnclassName='bg-white'
          className='h-9'
          value={table.getState().pagination.pageSize.toString()}
          options={[
            { label: '10', value: '10' },
            { label: '20', value: '20' },
            { label: '30', value: '30' },
            { label: '40', value: '40' },
            { label: '50', value: '50' },
            { label: '100', value: '100' },
            { label: '200', value: '200' },
          ]}
          onChange={(value) => table.setPageSize(Number(value))}
        />
        <span className='opacity-85'>
          dari {table.getRowCount().toLocaleString()} data
        </span>
      </div>
      <div className='flex flex-row gap-1'>
        <InputButton
          className='w-9 h-9'
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <MdKeyboardDoubleArrowLeft />
        </InputButton>
        <InputButton
          className='w-9 h-9'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <MdKeyboardArrowLeft />
        </InputButton>
        <div className='flex items-center gap-1'>
          <input
            type='number'
            min='1'
            max={table.getPageCount()}
            value={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              let page = Number(e.target.value) - 1;

              if (isNaN(page)) page = 0;
              if (page < 0) page = 0;
              if (page >= table.getPageCount()) page = table.getPageCount() - 1;

              table.setPageIndex(page);
            }}
            className='pagination-input h-9'
          />
          <span className='opacity-85'>
            dari {table.getPageCount().toLocaleString()}
          </span>
        </div>
        <InputButton
          className='w-9 h-9'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <MdKeyboardArrowRight />
        </InputButton>
        <InputButton
          className='w-9 h-9'
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <MdKeyboardDoubleArrowRight />
        </InputButton>
      </div>
    </div>
  );
};

export default Pagination;
