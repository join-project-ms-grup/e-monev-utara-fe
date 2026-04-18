import React, { type InputHTMLAttributes } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import clsx from 'clsx';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
  invalid?: boolean;
  errorIcon?: React.ReactNode;
  float?: boolean;
  numberType?: boolean;
};

const InText: React.FC<TextInputProps> = ({
  leftIcon,
  errorIcon = <FiAlertCircle />,
  invalid = false,
  className,
  numberType,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (numberType) {
      value = value.replace(/[^0-9.,]/g, '');
    }
    e.target.value = value;

    onChange?.(e);
  };

  return (
    <div
      className={clsx(
        'relative flex items-center border rounded-lg px-3 py-2 transition-all duration-200',
        'bg-white',
        invalid
          ? 'border-red-500 focus-within:border-red-600'
          : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100',
        className,
      )}
    >
      {leftIcon && (
        <div className='mr-2 text-gray-400 flex items-center'>{leftIcon}</div>
      )}

      <input
        className='flex-1 outline-none bg-transparent placeholder-gray-400'
        onChange={handleChange}
        {...props}
      />

      {invalid && errorIcon && (
        <div className='ml-2 text-red-500 flex items-center animate-fadeIn'>
          {errorIcon}
        </div>
      )}
    </div>
  );
};

export default InText;
