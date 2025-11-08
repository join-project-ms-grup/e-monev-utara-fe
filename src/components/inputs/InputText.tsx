import React, { useState } from 'react';
import type { IconType } from 'react-icons/lib';
import {
  MdCheck,
  MdClear,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';
import { PiWarningCircle } from 'react-icons/pi';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  Icon?: IconType;
  Iconlabel?: string;
  IconlabelPos?: 'left' | 'right';
  wrapperHeight?: string;
  wrapperClassname?: string;
  disabled?: boolean;
  withButton?: boolean;
  disableButton?: boolean;
  buttonType?: 'button' | 'reset' | 'submit';
  isRibu?: boolean;
  onClear?: () => void;
  tooltip?: string;
  tooltipId?: string;
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
  isRibu = false,
  onClear,
  tooltip,
  tooltipId = 'tooltip',
  IconlabelPos = 'left',
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (inputMode === 'numeric') {
      const inputEvent = e as unknown as InputEvent;
      const nextValue = inputEvent.data;
      if (nextValue && !/[\d.]/.test(nextValue)) {
        e.preventDefault();
      }
    }
    onBeforeInput?.(e as React.InputEvent<HTMLInputElement>);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputMode !== 'numeric') {
      onChange?.(e);
      return;
    }
    let rawValue = e.target.value.replace(/[^\d.]/g, '');
    let cleanValue = rawValue;
    if (isRibu) {
      cleanValue = rawValue.replace(/\./g, '');
      const formatted = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      e.target.value = formatted;
    } else {
      e.target.value = cleanValue;
    }

    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: cleanValue },
      };
      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const formattedValue =
    typeof value === 'string' || typeof value === 'number'
      ? inputMode === 'numeric' && isRibu
        ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        : value.toString()
      : '';

  return (
    <div
      className={`${wrapperClassname} bg-white shadow input-wrapper h-9 inline-flex ${
        disabled ? 'opacity-60' : ''
      }`}
    >
      {Icon && <Icon className='text-4xl h-full pl-2' />}
      {Iconlabel && IconlabelPos === 'left' && (
        <div className='flex items-center pl-2'>
          <span className='cursor-default'>{Iconlabel}</span>
        </div>
      )}
      <input
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        {...props}
        value={formattedValue}
        inputMode={inputMode}
        onBeforeInput={handleBeforeInput}
        onChange={handleChange}
        className='h-full'
        disabled={disabled}
        {...(tooltip ? { 'data-tooltip-id': tooltipId } : {})}
        {...(tooltip ? { 'data-tooltip-content': tooltip } : {})}
      />
      <div className='inline-flex items-center'>
        <PiWarningCircle
          className={`transition-opacity text-red-500 text-lg mr-1 ${
            invalid ? 'block opacity-100' : 'hidden opacity-0'
          }`}
        />
        {onClear && formattedValue && (
          <button
            type='button'
            className='bg-white transition-all text-red-500 hover:text-red-400 px-1'
            onClick={onClear}
          >
            <MdClear className='transition-all active:scale-80' />
          </button>
        )}
        {type === 'password' && (
          <button
            type='button'
            className='bg-white pr-2 text-gray-600 hover:text-gray-800'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </button>
        )}
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
      {Iconlabel && IconlabelPos === 'right' && (
        <div className='flex items-center pr-2'>
          <span className='cursor-default'>{Iconlabel}</span>
        </div>
      )}
    </div>
  );
};

export default InputText;
