import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/react';
import { MdClear, MdKeyboardArrowDown } from 'react-icons/md';
import React, { useRef, useState } from 'react';
import { PiWarningCircle } from 'react-icons/pi';
import clsx from 'clsx';

export interface OptionItem {
  label: string;
  value: string;
}

export interface InputSelectBoxProps {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  defaultOptionLabel?: string;
  onChange?: (
    value: string,
    event?: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  options: OptionItem[];
  className?: string;
  btnclassName?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  withSearch?: boolean;
  withClear?: boolean;
  placeholder?: string;
  tooltip?: boolean;
  onClear?: () => void;
}

export default function InputSearchBox({
  id,
  name,
  value,
  defaultValue,
  defaultOptionLabel,
  onChange,
  options,
  className,
  btnclassName,
  required = false,
  disabled = false,
  invalid = false,
  withSearch = false,
  withClear = false,
  placeholder,
  tooltip = false,
  onClear,
}: InputSelectBoxProps) {
  const allOptions = defaultOptionLabel
    ? [{ label: defaultOptionLabel, value: '' }, ...options]
    : options;

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ?? '',
  );
  const [query, setQuery] = useState('');

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (val: string) => {
    if (!isControlled) setInternalValue(val);

    const fakeEvent = {
      target: { name, value: val },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    onChange?.(val, fakeEvent);
  };

  const currentLabel =
    allOptions.find((o) => o.value === currentValue)?.label ?? null;

  const filteredOptions =
    query === ''
      ? allOptions
      : allOptions.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase()),
        );

  const wrapperClass = clsx('relative flex', className);
  const btnClass = clsx(
    btnclassName,
    'w-full inline-flex justify-between items-center gap-1 bg-white shadow-sm rounded-b-none py-2 px-3 rounded whitespace-nowrap overflow-hidden focus:outline-none',
    'focus:outline-none',
    `after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-gray-200 after:transition-all after:opacity-100`,
    'focus:after:bg-[var(--color-2)] focus:after:opacity-50',
    `${disabled ? 'opacity-60' : ''}`,
  );
  const menuClass = clsx(
    '[--anchor-gap:0] [--anchor-max-height:12rem] w-(--button-width) p-1 bg-gray-50 rounded-b shadow-lg focus-visible:outline-0 z-[9999]',
  );

  return (
    <div className={wrapperClass}>
      <Listbox value={currentValue} onChange={handleChange} disabled={disabled}>
        <ListboxButton
          id={id}
          ref={buttonRef}
          className={btnClass}
          {...(tooltip &&
            currentValue && {
              'data-tooltip-id': 'tooltip',
              'data-tooltip-content': currentLabel,
            })}
        >
          <span
            className={`truncate flex-1 text-left ${!currentValue && 'text-gray-400'}`}
          >
            {currentLabel ?? placeholder ?? '\u00A0'}
          </span>
          <MdKeyboardArrowDown className='shrink-0 ml-2' />
          <PiWarningCircle
            className={`absolute transition-opacity text-red-500 text-lg top-1/2 -translate-y-1/2 right-8 ${invalid ? 'opacity-100' : 'opacity-0'}`}
          />
        </ListboxButton>
        {withClear && currentValue !== '' && (
          <button
            type='button'
            className='bg-white transition-all text-red-500 hover:text-red-400 px-1'
            onClick={onClear}
          >
            <MdClear className='transition-all active:scale-80' />
          </button>
        )}
        <ListboxOptions anchor='bottom' className={menuClass}>
          {withSearch && (
            <input
              type='text'
              placeholder='Cari...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className='w-full rounded border px-2 py-1 mb-2 text-sm'
            />
          )}
          {filteredOptions.length > 1 ? (
            filteredOptions.map((option, index) => (
              <ListboxOption
                {...(tooltip &&
                  option.value && {
                    'data-tooltip-id': 'tooltip',
                    'data-tooltip-content': option.label,
                  })}
                disabled={option.value === ''}
                key={index}
                value={option.value}
                className={`truncate data-focus:bg-[var(--color-2)] data-focus:text-[var(--text-3)] cursor-pointer py-1 px-2 rounded ${
                  option.value === '' ? 'text-gray-400' : ''
                }`}
              >
                {option.label}
              </ListboxOption>
            ))
          ) : (
            <div className='px-2 py-1 text-gray-400 text-sm'>
              Tidak ada hasil
            </div>
          )}
        </ListboxOptions>
      </Listbox>
      {required && (
        <select
          name={name}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          value={currentValue}
          onChange={() => {}}
          className='absolute left-0 bottom-0 w-full h-px opacity-0 pointer-events-none'
        >
          {allOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
