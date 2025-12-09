import React from 'react';
import type { IconType } from 'react-icons/lib';
import { MdCheck, MdClear } from 'react-icons/md';
import { PiWarningCircle } from 'react-icons/pi';

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  Icon?: IconType;
  Iconlabel?: string;
  wrapperHeight?: string | number;
  wrapperClassname?: string;
  disabled?: boolean;
  withButton?: boolean;
  disableButton?: boolean;
  buttonType?: 'button' | 'reset' | 'submit';
  onClear?: () => void;
}

const InputTextArea = ({
  invalid,
  Icon,
  Iconlabel,
  withButton = false,
  disableButton = false,
  buttonType,
  onChange,
  wrapperHeight = 20,
  wrapperClassname,
  disabled = false,
  value,
  onClear,
  ...props
}: TextAreaProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
  };

  const formattedValue =
    typeof value === 'string' || typeof value === 'number'
      ? value.toString()
      : '';

  return (
    <div
      className={`${wrapperClassname} bg-white shadow input-wrapper flex flex-col w-full ${
        disabled ? 'opacity-60' : ''
      }`}
    >
      <div className='absolute top-1 right-1 flex items-center'>
        {Icon && <Icon className='text-4xl pl-2' />}
        {Iconlabel && (
          <div className='flex items-center pl-2'>
            <span className='cursor-default'>{Iconlabel}</span>
          </div>
        )}
        <div className='ml-auto inline-flex items-center mt-0 -mr-1'>
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

      <textarea
        {...props}
        value={formattedValue}
        onChange={handleChange}
        disabled={disabled}
        className='w-full p-2 resize-y focus:outline-none focus:ring-0'
      />
    </div>
  );
};

export default InputTextArea;
