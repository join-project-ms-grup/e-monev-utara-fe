import React from 'react';
import type { IconType } from 'react-icons/lib';
import { MdCheck } from 'react-icons/md';
import { PiWarningCircle } from 'react-icons/pi';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  Icon?: IconType;
  Iconlabel?: string;
  wrapperHeight?: string;
  wrapperClassname?: string;
  disabled?: boolean;
  withButton?: boolean;
  disableButton?: boolean;
  buttonType?: 'button' | 'reset' | 'submit';
  isMoney?: boolean;
}

const InputText = ({
  type = 'text',
  invalid,
  Icon,
  Iconlabel,
  withButton = false,
  disableButton = false,
  buttonType,
  inputMode,
  onBeforeInput,
  onChange,
  wrapperHeight = '10',
  wrapperClassname,
  disabled = false,
  value,
  isMoney = false,
  ...props
}: InputProps) => {
  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
    // hanya batasi jika benar-benar numeric
    if (inputMode === 'numeric') {
      const inputEvent = e as unknown as InputEvent;
      const nextValue = inputEvent.data;

      // izinkan angka dan titik
      if (nextValue && !/[\d.]/.test(nextValue)) {
        e.preventDefault();
      }
    }

    if (onBeforeInput) {
      onBeforeInput(e as React.InputEvent<HTMLInputElement>);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // kalau bukan numeric, biarkan seperti biasa
    if (inputMode !== 'numeric') {
      onChange?.(e);
      return;
    }

    let rawValue = e.target.value.replace(/[^\d.]/g, '');

    let cleanValue = rawValue;
    if (isMoney) {
      cleanValue = rawValue.replace(/\./g, '');
      const formatted = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      e.target.value = formatted;
    } else {
      e.target.value = cleanValue;
    }

    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: cleanValue,
        },
      };
      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const formattedValue =
    typeof value === 'string' || typeof value === 'number'
      ? inputMode === 'numeric' && isMoney
        ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        : value.toString()
      : '';

  return (
    <div
      className={`${wrapperClassname} bg-white shadow input-wrapper h-9 inline-flex ${
        disabled ? 'opacity-60' : ''
      }`}
    >
      {Icon && <Icon className="text-4xl h-full pl-2" />}
      {Iconlabel && (
        <div className="flex items-center pl-2">
          <span className="cursor-default">{Iconlabel}</span>
        </div>
      )}
      <input
        type={type}
        {...props}
        value={formattedValue}
        inputMode={inputMode}
        onBeforeInput={handleBeforeInput}
        onChange={handleChange}
        className="h-full"
        disabled={disabled}
      />
      <div className="inline-flex items-center">
        <PiWarningCircle
          className={`transition-opacity text-red-500 text-lg mr-1 ${
            invalid ? 'block opacity-100' : 'hidden opacity-0'
          }`}
        />
        {withButton && (
          <button
            disabled={disableButton}
            type={buttonType}
            className={`pr-2 ${
              disableButton ? 'opacity-50' : 'text-green-500 active:scale-90'
            }`}
          >
            <MdCheck />
          </button>
        )}
      </div>
    </div>
  );
};

export default InputText;
