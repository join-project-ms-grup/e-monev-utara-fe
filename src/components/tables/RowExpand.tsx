import React from 'react';
import { MdHorizontalRule, MdKeyboardArrowDown } from 'react-icons/md';
import type { CellContext } from '@tanstack/react-table';

interface RowExpandProps<TData, TValue> extends CellContext<TData, TValue> {
  showValue?: boolean;
}

function RowExpand<TData, TValue>({
  row,
  getValue,
  showValue = true,
}: RowExpandProps<TData, TValue>) {
  return (
    <div className='inline-flex items-center'>
      {row.getCanExpand() ? (
        <button
          className={`font-extrabold transition-all ease hover:opacity-80 active:scale-100 ${
            row.getIsExpanded() ? 'text-red-400' : 'text-blue-400'
          } scale-125`}
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
        <MdHorizontalRule className='scale-x-75'></MdHorizontalRule>
      )}
      {showValue && (getValue() as React.ReactNode)}
    </div>
  );
}

export default RowExpand;
