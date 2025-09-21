import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
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
  invalid = false,
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
    <div className={`listbox ${className}`}>
      <Listbox value={currentValue} onChange={handleChange} disabled={disabled}>
        <ListboxButton
          id={id}
          ref={buttonRef}
          className={`listbox-btn ${btnclassName ?? ''}`}
        >
          {currentLabel}
          <MdKeyboardArrowDown />
          <PiWarningCircle
            className={`absolute transition-opacity text-red-500 text-lg top-1/2 -translate-y-1/2 right-8 ${invalid ? 'opacity-100' : 'opacity-0'}`}
          />
        </ListboxButton>
        <ListboxOptions
          anchor='bottom'
          className='listbox-menu'
        >
          {allOptions.map((option) => (
            <ListboxOption
              disabled={option.value === ''}
              key={String(option.value)}
              value={option.value}
              className={`data-focus:bg-[var(--color-2)] data-focus:text-[var(--text-3)] cursor-pointer py-1 px-2 rounded ${
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
          // aria-hidden='true'
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
