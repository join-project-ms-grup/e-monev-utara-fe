import type { CellContext } from '@tanstack/react-table';

function RowExpandValue<TData, TValue>({
  row,
  getValue,
}: CellContext<TData, TValue>) {
  return (
    <div
      className='inline-flex items-start'
      style={{
        paddingLeft: `${row.depth * 1}rem`,
      }}
    >
      {getValue<boolean>()}
    </div>
  );
}

export default RowExpandValue;
