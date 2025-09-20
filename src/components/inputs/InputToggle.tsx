import React from 'react';

interface InputProps {
  checked: boolean;
  defaultChecked: boolean;
  onToggle: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  onLabel: string;
  offLabel: string;
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
}: InputProps) => {
  const isControlled = checked !== undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle?.(e.target.checked);
  };

  return (
    <label className={`h-10 toggle-switch ${disabled ? 'disabled' : ''}`}>
      <input
        type='checkbox'
        id={id}
        name={name}
        checked={isControlled ? checked : undefined}
        defaultChecked={!isControlled ? defaultChecked : undefined}
        onChange={handleChange}
        disabled={disabled}
      />
      <span className='slider' />
      <span>
        {(isControlled ? checked : defaultChecked) ? onLabel : offLabel}
      </span>
    </label>
  );
};

export default InputToggle;
