import React, { useState, type ChangeEvent } from 'react';
import type { IconType } from 'react-icons/lib';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  Icon?: IconType;
  tooltip?: string;
}

export const InputField = ({
  type = 'text',
  label,
  Icon,
  tooltip,
  className,
  value,
  onChange,
  inputMode,
  ...rest
}: InputTextProps) => {
  const [focused, setFocused] = useState(false);

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (inputMode === 'numeric') {
      const onlyNumbers = rawValue.replace(/[^0-9]/g, '');
      if (onlyNumbers !== rawValue) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: onlyNumbers,
          },
        } as ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
        return;
      }
    }
    onChange?.(e);
  };

  const id = rest.id ?? `input-${label.replace(/\s+/g, '-')}`;

  return (
    <div className={`relative w-full group ${className ?? ''}`}>
      <input
        id={id}
        type={type}
        value={value == null ? '' : value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className='w-full border border-[#ccc] rounded px-3 py-2 focus:border-[var(--color-2)] focus:outline-none'
        style={{ lineHeight: '1.5rem' }}
        {...rest}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 flex items-center cursor-text transition-all duration-200 px-1
          ${
            focused || value
              ? `text-sm -top-2.5 ${!focused && value ? 'text-gray-400' : 'text-[var(--color-2)]'} bg-white`
              : 'text-gray-400 text-base top-1/2 -translate-y-1/2 bg-transparent'
          }
        `}
      >
        {Icon && (
          <Icon
            className='mr-1 transition-transform duration-200 text-base'
            style={{
              transform: focused || value ? 'scale(0.8)' : 'scale(1.1)',
            }}
          />
        )}
        {label}
      </label>

      {tooltip && (
        <span className='absolute -top-8 right-0 px-2 py-1 text-sm text-[var(--text-3)] bg-[var(--color-2)] rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-default'>
          {tooltip}
        </span>
      )}
    </div>
  );
};
