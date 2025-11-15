import type { AnyFieldApi } from '@tanstack/react-form';
import type { ZodError } from 'zod';

// Baru
const FieldError = ({ field }: { field: AnyFieldApi }) => {
  const hasError = field.state.meta.isTouched && !field.state.meta.isValid;
  return field.state.meta.errors.map(({ message }: ZodError, index) => (
    <em
      key={index}
      className={`
           block text-sm italic text-red-500 transition-all duration-200 overflow-hidden
           ${hasError ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}
         `}
    >
      {message ? message : '\u00A0'}
    </em>
  ));
};

export default FieldError;
