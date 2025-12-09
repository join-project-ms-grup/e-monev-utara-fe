import type { AnyFieldApi } from '@tanstack/react-form';
// HAPUS ?
const ErrorField = ({ field }: { field: AnyFieldApi }) => {
  const hasError = field.state.meta.isTouched && !field.state.meta.isValid;
  const errorMessage = hasError ? field.state.meta.errors.join(', ') : '';

  return (
    <>
      <em
        className={`
          block text-sm italic text-red-500 transition-all duration-200 overflow-hidden
          ${hasError ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        {errorMessage ? errorMessage : '\u00A0'}
      </em>
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  );
};

export default ErrorField;
