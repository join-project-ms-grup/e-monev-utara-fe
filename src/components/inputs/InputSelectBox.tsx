import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import React, { useRef, useState } from 'react';

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
}

export default function InputSelectBox({
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
}: InputSelectBoxProps) {
  const allOptions = defaultOptionLabel
    ? [{ label: defaultOptionLabel, value: '' }, ...options]
    : options;

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ?? '',
  );
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
    allOptions.find((o) => o.value === currentValue)?.label ?? '';

  return (
    <div className={`relative flex ${className}`}>
      <Listbox value={currentValue} onChange={handleChange} disabled={disabled}>
        <ListboxButton
          id={id}
          ref={buttonRef}
          className={`w-full inline-flex justify-between items-center gap-1 bg-white border border-[#ccc] hover:border-[var(--color-2)] focus:border-[var(--color-2)] data-open:border-[var(--color-2)] focus:outline-none py-2 px-3 rounded transition-colors ${btnclassName}`}
        >
          {currentLabel} <MdKeyboardArrowDown />
        </ListboxButton>
        <ListboxOptions
          anchor='bottom'
          className='w-(--button-width) p-1 bg-white border border-[#ccc] rounded shadow-lg focus-visible:outline-0 z-[9999]'
        >
          {allOptions.map((option) => (
            <ListboxOption
              disabled={option.value === ''}
              key={String(option.value)}
              value={option.value}
              className={`data-focus:bg-[#ffcccc] cursor-pointer py-1 px-2 rounded ${
                option.value === '' ? 'text-gray-400' : ''
              }`}
            >
              {option.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
      {required && (
        <select
          name={name}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden='true'
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
