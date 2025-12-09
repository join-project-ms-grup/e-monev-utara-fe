import React from 'react';
import type { IconType } from 'react-icons/lib';

interface InputButtonType
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  loadingSize?: number;
  loadingColor?: string;
  isLoading?: boolean;
  Icon?: IconType;
  tooltip?: string;
  tooltipId?: string;
}

const InputButton = ({
  children,
  className,
  iconClassName,
  loadingSize = 16,
  loadingColor = '#fff',
  isLoading = false,
  Icon,
  tooltip,
  tooltipId = 'tooltip',
  ...props
}: InputButtonType) => {
  return (
    <button
      {...(tooltip ? { 'data-tooltip-id': tooltipId } : {})}
      {...(tooltip ? { 'data-tooltip-content': tooltip } : {})}
      className={`${className} flex flex-row items-center justify-center
        gap-2 bg-[var(--color-2)] text-white py-2 rounded-md
        hover:opacity-80 active:scale-[95%] disabled:opacity-50 transition-all duration-100 disabled:scale-100 disabled:cursor-default!`}
      {...props}
    >
      {Icon && <Icon className={iconClassName} />}
      {children}
      {isLoading && (
        <svg
          width={loadingSize}
          fill={loadingColor}
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z'
            opacity='.25'
          />
          <path d='M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z'>
            <animateTransform
              attributeName='transform'
              type='rotate'
              dur='0.75s'
              values='0 12 12;360 12 12'
              repeatCount='indefinite'
            />
          </path>
        </svg>
      )}
    </button>
  );
};

export default InputButton;
