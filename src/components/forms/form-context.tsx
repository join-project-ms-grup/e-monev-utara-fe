import {
  createFormHook,
  createFormHookContexts,
  useStore,
} from '@tanstack/react-form';
import InputText from '../inputs/InputText';
import InputSearchBox, { type OptionItem } from '../inputs/InputSearchBox';
import InputButton from '../inputs/InputButton';
import FieldError from './FieldError';
import InputFile from '../inputs/InputFile';
import InputTextArea from '../inputs/InputTextArea';

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

//#region Field Components
type FieldProps = {
  label: string;
  placeholder?: string;
  options?: OptionItem[];
  reqLabel?: boolean;
  disabled?: boolean;
  Rupiah?: boolean;
  Nomor?: boolean;
  onClear?: () => void;
};

const TextField = ({
  label,
  reqLabel = false,
  placeholder,
  disabled = false,
  Rupiah = false,
  Nomor = false,
  onClear,
}: FieldProps) => {
  const field = useFieldContext<string>();
  
  return (
    <div>
      <label htmlFor={field.name}>
        {label}
        {reqLabel && (
          <code className='text-red-500 text-xs align-text-top'> (*)</code>
        )}
      </label>
      <InputText
        id={field.name}
        value={field.state.value}
        {...(Rupiah
          ? { Iconlabel: 'Rp', isRibu: true, inputMode: 'numeric' }
          : {})}
        {...(Nomor ? { inputMode: 'numeric' } : {})}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onClear={() => {
          field.handleChange('');
          onClear?.();
        }}
      />
      <FieldError field={field} />
    </div>
  );
};

const TextAreaField = ({
  label,
  reqLabel = false,
  placeholder,
  disabled = false,
  onClear,
}: FieldProps) => {
  const field = useFieldContext<string>();
  
  return (
    <div>
      <label htmlFor={field.name}>
        {label}
        {reqLabel && (
          <code className='text-red-500 text-xs align-text-top'> (*)</code>
        )}
      </label>
      <InputTextArea
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onClear={() => {
          field.handleChange('');
          onClear?.();
        }}
      />
      <FieldError field={field} />
    </div>
  );
};

const SelectField = ({
  label,
  options,
  reqLabel,
  onClear,
  placeholder,
  disabled = false,
}: FieldProps) => {
  const field = useFieldContext<string>();
  
  return (
    <div>
      <label htmlFor={field.name}>
        {label}
        {reqLabel && (
          <code className='text-red-500 text-xs align-text-top'> (*)</code>
        )}
      </label>
      <InputSearchBox
        id={field.name}
        value={field.state.value.toString()}
        onChange={(e) => field.handleChange(e)}
        options={options || []}
        className='h-9'
        btnclassName='bg-white'
        onClear={() => {
          field.handleChange('');
          onClear?.();
        }}
        invalid={!field.state.meta.isValid}
        placeholder={placeholder}
        disabled={disabled}
        withSearch
      />
      <FieldError field={field} />
    </div>
  );
};

const FileField = ({
  label,
  reqLabel,
  onClear,
  placeholder,
  disabled = false,
}: FieldProps) => {
  const field = useFieldContext<File | null>();
  
  return (
    <div>
      <label htmlFor={field.name}>
        {label}
        {reqLabel && (
          <code className='text-red-500 text-xs align-text-top'> (*)</code>
        )}
      </label>
      <InputFile
        id={field.name}
        accept='image/*'
        // value={field.state.value?.name}
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          field.handleChange(file);
        }}
        onClear={() => {
          field.handleChange(null);
          onClear?.();
        }}
        invalid={!field.state.meta.isValid}
        placeholder={placeholder}
        disabled={disabled}
        tooltip
      />
      <FieldError field={field} />
    </div>
  );
};

type SubmitButtonProps = {
  children: React.ReactNode;
  isLoading?: boolean
};

const SubmitButton = ({ children, isLoading }: SubmitButtonProps) => {
  const form = useFormContext();
  const [isSubmitting, canSubmit] = useStore(form.store, (state) => [
    state.isSubmitting,
    state.canSubmit,
  ]);

  return (
    <InputButton
      className='px-2'
      type='submit'
      disabled={isSubmitting || !canSubmit}
      isLoading={isLoading}
    >
      {children}
    </InputButton>
  );
};
//#endregion

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
    FileField,
    TextAreaField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
