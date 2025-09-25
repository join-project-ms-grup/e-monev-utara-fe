import React from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import type { CellContext } from '@tanstack/react-table'

function RowExpand<TData, TValue>({ row, getValue }: CellContext<TData, TValue>) {
  return (
    <div>
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
        <span className="font-bold">-</span>
      )}
      {getValue() as React.ReactNode}
    </div>
  )
}

export default RowExpand