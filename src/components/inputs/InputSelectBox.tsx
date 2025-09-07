import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import React, { useState } from 'react';

export interface InputSelectBox<T> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  options: T[];
  className?: string;
  renderOption?: (option: T) => React.ReactNode;
}

export default function InputSelectBox<T extends string | number>({
  value,
  defaultValue,
  onChange,
  options,
  className = '',
  renderOption,
}: InputSelectBox<T>) {
  const [internalValue, setInternalValue] = useState<T>(
    defaultValue ?? options[0],
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (val: T) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  return (
    <Listbox value={currentValue} onChange={handleChange}>
      <ListboxButton
        className={`inline-flex items-center gap-1 bg-white border border-[#ccc] focus:border-[#FF6B6B] py-1 px-2 rounded transition-colors focus:outline-0 ${className}`}
      >
        {renderOption ? renderOption(currentValue) : currentValue}{' '}
        <MdKeyboardArrowDown />
      </ListboxButton>
      <ListboxOptions
        anchor='bottom'
        className='w-(--button-width) p-1 bg-white border border-[#ccc] rounded shadow-lg focus-visible:outline-0'
      >
        {options.map((option) => (
          <ListboxOption
            key={String(option)}
            value={option}
            className='data-focus:bg-[#ffcccc] cursor-pointer py-1 px-2 rounded'
          >
            {renderOption ? renderOption(option) : option}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
