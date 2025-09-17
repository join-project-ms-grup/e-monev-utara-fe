import { Link, useMatches } from '@tanstack/react-router';
import React from 'react';
import { MdChevronRight, MdHome } from 'react-icons/md';

interface Breadcrumb extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Breadcrumb = ({...props}: Breadcrumb) => {
  const matches = useMatches();

  const crumbs = matches
    .map((m) => ({
      id: m.id,
      path: m.pathname,
      title: m.staticData?.title,
      disabled: m.staticData?.isDisabled,
    }))
    .filter((m) => m.title);

  return (
    <nav aria-label='breadcrumb' {...props}>
      <ol className='list-none inline-flex p-0 m-0 flex-wrap items-center'>
        <li className='py-1'>
          <Link to='/' className='hover:text-[var(--color-1)]'>
            <MdHome className='size-6 ' />
          </Link>
        </li>
        <li>
          {crumbs.length > 0 && (
            <span>
              <MdChevronRight className='text-2xl opacity-50' />
            </span>
          )}
        </li>
        {crumbs.map((match, i) => {
          const isLast = i === crumbs.length - 1;
          const isDisabled = match.disabled || isLast;

          return (
            <React.Fragment key={match.id}>
              <li className='flex items-center'>
                {i !== crumbs.length - 1 && !isDisabled ? (
                  <>
                    <Link to={match.path} className='capitalize hover:text-[var(--color-1)]'>
                      {match.title}
                    </Link>
                  </>
                ) : (
                  <span className='capitalize opacity-50 cursor-default'>
                    {match.title}
                  </span>
                )}
              </li>
              <li>
                {i !== crumbs.length - 1 && (
                  <span>
                    <MdChevronRight className='text-2xl opacity-50' />
                    {/* <MdChevronRight className='size-10 text-[#72102741] -mx-2 -my-2' /> */}
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
