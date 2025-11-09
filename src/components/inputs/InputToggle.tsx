import React from 'react';
import { MdCheck, MdClose } from 'react-icons/md';

interface InputProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onToggle: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  onLabel?: string;
  offLabel?: string;
  tooltip?: string;
  tooltipId?: string;
}

const InputToggle = ({
  checked,
  defaultChecked,
  onToggle,
  disabled = false,
  id,
  name,
  onLabel = 'On',
  offLabel = 'Off',
  tooltip,
  tooltipId = 'tooltip',
}: InputProps) => {
  const isControlled = checked !== undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onToggle(e.target.checked);
    }
  };

  return (
    <label
      {...(tooltip ? { 'data-tooltip-id': tooltipId } : {})}
      {...(tooltip ? { 'data-tooltip-content': tooltip } : {})}
      htmlFor={id}
      className={`h-9 relative inline-grid grid-cols-2 rounded-full shadow-sm ${checked ? 'bg-green-500' : 'bg-red-500'} font-bold select-none overflow-hidden transition-all duration-300 ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      }`}
    >
      <input
        id={id}
        name={name}
        type='checkbox'
        checked={isControlled ? checked : undefined}
        defaultChecked={!isControlled ? defaultChecked : undefined}
        onChange={handleChange}
        disabled={disabled}
        className='peer hidden'
      />

      <span
        className={`absolute flex items-center justify-center z-10 left-full -translate-x-9 top-0 h-full w-9 rounded-full bg-white transition-all duration-300 peer-checked:left-0 peer-checked:translate-x-0`}
      >
        {checked ? <MdCheck /> : <MdClose />}
      </span>
      <div
        className={`py-1.5 px-4 text-center z-0 transition-all duration-300 text-[var(--text-3)] opacity-100 peer-checked:opacity-0`}
      >
        {offLabel}
      </div>
      <div
        className={`py-1.5 text-center z-0 transition-all duration-300 text-[var(--text-3)] opacity-0 peer-checked:opacity-100`}
      >
        <span>{onLabel}</span>
      </div>
    </label>
  );
};

export default InputToggle;
