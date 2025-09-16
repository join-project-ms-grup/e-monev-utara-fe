import React, { useState, type ChangeEvent } from 'react';
import type { IconType } from 'react-icons/lib';

interface InputTextProps {
  type?: 'text' | 'password' | 'email' | 'number';
  id?: string;
  label: string;
  name: string;
  Icon?: IconType;
  value: string | number | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  min?: number;
  max?: number;
  tooltip?: string; // tambahan
}

const InputText = ({
  type = 'text',
  label,
  name,
  Icon,
  value,
  onChange,
  required,
  id = `input-${label.replace(/\s+/g, '-')}`,
  className,
  min,
  max,
  tooltip,
}: InputTextProps) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
      if (onlyNumbers !== '') {
        const num = Number(onlyNumbers);
        if (
          (min !== undefined && num < min) ||
          (max !== undefined && num > max)
        ) {
          return;
        }
      }
      e.target.value = onlyNumbers;
    }
    onChange(e);
  };

  return (
    <div className={`relative w-full group ${className}`}>
      <input
        id={id}
        type={type}
        value={value == null ? '' : value}
        name={name}
        required={required}
        onChange={handleChange}
        min={min}
        max={max}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className='w-full border border-[#ccc] rounded px-3 py-2 focus:border-[var(--color-2)] focus:outline-none'
        style={{ lineHeight: '1.5rem' }}
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
        <span
          className='absolute -top-8 right-0 px-2 py-1 text-sm text-[var(--text-3)] bg-[var(--color-2)] rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-default'
        >
          {tooltip}
        </span>
      )}
    </div>
  );
};

export default InputText;
