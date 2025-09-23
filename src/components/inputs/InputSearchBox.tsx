import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/react';
import { MdClear, MdKeyboardArrowDown } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import React, { useRef, useState } from 'react';
import { PiWarningCircle } from 'react-icons/pi';

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
  onChangeClear?: () => void;
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
  tooltip,
  onChangeClear,
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

  return (
    <div
      className={`listbox ${className}`}
      {...(tooltip && {
        'data-tooltip-id': 'tooltip',
        'data-tooltip-content': currentLabel,
      })}
    >
      <Listbox value={currentValue} onChange={handleChange} disabled={disabled}>
        <ListboxButton
          id={id}
          ref={buttonRef}
          className={`${btnclassName ?? ''} bg-gray-50 listbox-btn`}
        >
          {/* {currentLabel ?? placeholder ?? '\u00A0'} */}
          {/* {currentLabel ??
            (placeholder ? (
              <span className='text-gray-400'>{placeholder}</span>
            ) : (
              '\u00A0'
            ))} */}
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
        {withClear && (
          <button className='bg-white transition-all text-red-500 hover:text-red-400 px-1' onClick={onChangeClear}>
            <MdClear className='transition-all active:scale-80' />
          </button>
        )}
        <ListboxOptions anchor='bottom' className='listbox-menu p-2'>
          {withSearch && (
            <input
              type='text'
              placeholder='Cari...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='w-full rounded border px-2 py-1 mb-2 text-sm'
            />
          )}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <ListboxOption
                data-tooltip-id='tooltip'
                data-tooltip-content={option.label}
                disabled={option.value === ''}
                key={String(option.value)}
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
