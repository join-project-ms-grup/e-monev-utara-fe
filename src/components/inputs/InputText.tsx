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
  ...props
}: InputProps) => {
  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
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
    let rawValue = e.target.value;

    // hapus semua karakter selain digit dan titik
    rawValue = rawValue.replace(/[^\d.]/g, '');

    // hapus titik dari value yang dikirim ke luar
    const cleanValue = rawValue.replace(/\./g, '');

    // format tampilan dengan titik setiap ribuan
    const formatted = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // update tampilan input
    e.target.value = formatted;

    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: cleanValue, // value yang dikirim tanpa titik
        },
      };
      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const formattedValue =
    typeof value === 'string' || typeof value === 'number'
      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : '';

  return (
    <div
      className={`${wrapperClassname} bg-white shadow input-wrapper h-9 inline-flex ${disabled ? 'opacity-60' : ''}`}
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
      />
      <div className="inline-flex items-center">
        <PiWarningCircle
          className={`transition-opacity text-red-500 text-lg mr-1 ${invalid ? 'block opacity-100' : 'hidden opacity-0'}`}
        />
        {withButton && (
          <button
            disabled={disableButton}
            type={buttonType}
            className={`pr-2 ${disableButton ? 'opacity-50' : 'text-green-500 active:scale-90'}`}
          >
            <MdCheck />
          </button>
        )}
      </div>
    </div>
  );
};

export default InputText;
