import React from 'react';
import type { IconType } from 'react-icons/lib';
import { PiWarningCircle } from 'react-icons/pi';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  Icon?: IconType;
  wrapperHeight?: string;
}

const InputText = ({
  type = 'text',
  invalid,
  Icon,
  inputMode,
  onBeforeInput,
  wrapperHeight = '10',
  ...props
}: InputProps) => {
  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (inputMode === 'numeric') {
      const inputEvent = e as unknown as InputEvent;
      const nextValue = inputEvent.data;

      if (nextValue && !/^\d+$/.test(nextValue)) {
        e.preventDefault();
      }
    }

    if (onBeforeInput) {
      onBeforeInput(e as React.InputEvent<HTMLInputElement>);
    }
  };
  return (
    <div className={`input-wrapper h-10 inline-flex`}>
      {Icon && <Icon className='text-4xl h-full bg-gray-50 pl-2' />}
      <input
        type={type}
        {...props}
        inputMode={inputMode}
        onBeforeInput={handleBeforeInput}
        className='h-full'
      />
      <PiWarningCircle
        className={`absolute transition-opacity text-red-500 text-lg top-1/2 -translate-y-1/2 right-2 ${invalid ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export default InputText;
