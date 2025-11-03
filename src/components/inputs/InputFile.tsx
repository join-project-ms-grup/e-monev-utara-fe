import React, { useRef, useState } from 'react';
import type { IconType } from 'react-icons/lib';
import { MdCheck, MdUploadFile } from 'react-icons/md';
import { PiWarningCircle } from 'react-icons/pi';

interface InputFileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  Icon?: IconType;
  Iconlabel?: string;
  wrapperHeight?: string;
  wrapperClassname?: string;
  disabled?: boolean;
  withButton?: boolean;
  disableButton?: boolean;
  buttonType?: 'button' | 'reset' | 'submit';
  showFileName?: boolean;
}

const InputFile = ({
  invalid,
  Icon = MdUploadFile,
  Iconlabel,
  withButton = false,
  disableButton = false,
  buttonType,
  onChange,
  wrapperHeight = '10',
  wrapperClassname,
  disabled = false,
  showFileName = true,
  ...props
}: InputFileProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : '');
    onChange?.(e);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div
      className={`${wrapperClassname} bg-white shadow input-wrapper h-9 inline-flex items-center ${
        disabled ? 'opacity-60' : ''
      }`}
    >
      {Icon && <Icon className="text-2xl h-full pl-2 text-gray-500" />}
      {Iconlabel && (
        <div className="flex items-center pl-2">
          <span className="cursor-default">{Iconlabel}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        {...props}
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={handleClick}
        className={`flex-1 h-full px-3 flex items-center cursor-pointer ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
      >
        {showFileName ? (
          <span
            className={`truncate ${
              fileName ? 'text-gray-800' : 'text-gray-400 italic'
            }`}
          >
            {fileName || 'Pilih file...'}
          </span>
        ) : null}
      </div>

      <div className="inline-flex items-center pr-2">
        <PiWarningCircle
          className={`transition-opacity text-red-500 text-lg mr-1 ${
            invalid ? 'block opacity-100' : 'hidden opacity-0'
          }`}
        />
        {withButton && (
          <button
            disabled={disableButton}
            type={buttonType}
            className={`${
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

export default InputFile;