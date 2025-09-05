import React, { useState, type ChangeEvent } from 'react'
import type { IconType } from 'react-icons/lib';

interface InputTextProps {
    type?: string;
    id?: string;
    label: string;
    Icon?: IconType;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

const InputText = ({ type = 'text', label, Icon, value, onChange, required, id = `input-${label.replace(/\s+/g, '-')}` }: InputTextProps) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className="relative w-full">
            <input
                id={id}
                type={type}
                value={value}
                required={required}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                style={{ lineHeight: '1.5rem' }}
            />
            <label
                htmlFor={id}
                className={`absolute left-3 flex items-center cursor-text transition-all duration-200 px-1
          ${focused || value
                        ? 'text-sm -top-2.5 text-[#FF6B6B] bg-white'
                        : 'text-gray-400 text-base top-1/2 -translate-y-1/2 bg-transparent'
                    }
        `}
            >
                {Icon && (
                    <Icon
                        className="mr-1 transition-transform duration-200 text-base"
                        style={{ transform: focused || value ? 'scale(0.8)' : 'scale(1.1)' }}
                    />
                )}
                {label}
            </label>
        </div>
    )
}

export default InputText;
