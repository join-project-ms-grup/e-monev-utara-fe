import { Link, useMatches } from '@tanstack/react-router'
import React from 'react'
import { MdChevronRight, MdHome } from 'react-icons/md'

const Breadcrumb = () => {
  const matches = useMatches()

  const crumbs = matches
    .map(m => ({
      id: m.id,
      path: m.pathname,
      title: m.staticData?.title,
      disabled: m.staticData?.isDisabled,
    }))
    .filter(m => m.title)

  return (
    <nav aria-label="breadcrumb">
      <ol className='list-none inline-flex p-0 m-0 flex-wrap items-center bg-white px-2 rounded-sm shadow-sm'>
        <li className='py-1'>
          <Link to="/"><MdHome className='size-6 text-[#721027]' /></Link>
        </li>
        <li>
          {crumbs.length > 0 && <span><MdChevronRight className='size-10 text-[#72102741] -mx-2 -my-2' /></span>}
        </li>
        {crumbs.map((match, i) => {
          const isLast = i === crumbs.length - 1
          const isDisabled = match.disabled || isLast

          return (
            <React.Fragment key={match.id}>
              <li className="flex items-center">
                {i !== crumbs.length - 1 && !isDisabled ? (
                  <>
                    <Link to={match.path} className="capitalize text-[#721027]">{match.title}</Link>

                  </>
                ) : (
                  <span className="capitalize text-gray-500">{match.title}</span>
                )}
              </li>
              <li>
                {i !== crumbs.length - 1 && <span><MdChevronRight className='size-10 text-[#72102741] -mx-2 -my-2' /></span>}
              </li>
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
