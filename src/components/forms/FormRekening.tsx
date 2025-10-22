import React, { useEffect, useState } from 'react';
import {
  getChildren,
  getUrusan,
  type Master,
} from '../../services/MasterService';
import { useForm, useStore } from '@tanstack/react-form';
import InputButton from '../inputs/InputButton';
import InputText from '../inputs/InputText';
import ErrorField from './ErrorField';
import { rekeningSchema, rekeningSchemaSubmit } from './schemas/SchemaRekening';
import InputSearchBox, { type OptionItem } from '../inputs/InputSearchBox';
import { useQuery } from '@tanstack/react-query';

interface PilihanParent {
  urusan?: string;
  bidang?: string;
  program?: string;
  kegiatan?: string;
}

interface BaseFormProps {
  children?: React.ReactElement;
  defaultValues: Master;
}

interface FormAddProps extends BaseFormProps {
  type: 'Add';
  onSubmit: (data: Master) => void;
}

interface FormEditProps extends BaseFormProps {
  type: 'Edit';
  onSubmit: (data: { id: number; payload: Master }) => void;
}

type FormProps = FormAddProps | FormEditProps;

const FormRekening: React.FC<FormProps> = ({
  type,
  children,
  onSubmit,
  defaultValues,
}) => {
  // Form
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (type === 'Add') {
        onSubmit(value);
      } else {
        if (value.id == null) {
          return;
        }
        const { id, ...payload } = value;
        onSubmit({ id, payload });
      }
    },
    validators: {
      onChange: ({ value }) => {
        const input = {
          kode: value.kode?.toString() ?? '',
          name: value.name?.toString() ?? '',
          rekening: value.rekening?.toString() ?? '',
          parent: value.parent?.toString() ?? '',
        };

        const result = rekeningSchema.safeParse(input);

        if (result.success) {
          return { fields: {} };
        } else {
          const errors = result.error.format();
          return {
            fields: {
              kode: errors.kode?._errors[0],
              name: errors.name?._errors[0],
              rekening: errors.rekening?._errors[0],
              parent: errors.parent?._errors[0],
            },
          };
        }
      },
      onSubmit: ({ value }) => {
        const input = {
          kode: value.kode?.toString() ?? '',
          name: value.name?.toString() ?? '',
          rekening: value.rekening?.toString() ?? '',
          parent: value.parent?.toString() ?? '',
        };
        const result = rekeningSchemaSubmit.safeParse(input);
        if (result.success) {
          return { fields: {} };
        } else {
          const errors = result.error.format();
          return {
            fields: {
              kode: errors.kode?._errors[0],
              name: errors.name?._errors[0],
              rekening: errors.rekening?._errors[0],
              parent: errors.parent?._errors[0],
            },
          };
        }
      },
    },
  });

  const values = useStore(form.store, (s) => s.values);
  const handleParentChange = ({
    urusan,
    bidang,
    program,
    kegiatan,
  }: PilihanParent) => {
    let parentValue = '';

    switch (values.rekening) {
      case 'urusan':
        // urusan tidak punya parent
        parentValue = '';
        break;

      case 'bidang':
        // bidang harus punya urusan
        if (urusan) parentValue = urusan;
        break;

      case 'program':
        // program harus punya urusan & bidang
        if (urusan && bidang) parentValue = bidang;
        break;

      case 'kegiatan':
        // kegiatan harus punya urusan, bidang & program
        if (urusan && bidang && program) parentValue = program;
        break;

      case 'subKegiatan':
        // sub kegiatan harus punya semua di atas
        if (urusan && bidang && program && kegiatan) parentValue = kegiatan;
        break;

      default:
        parentValue = '';
    }

    form.setFieldValue('parent', parentValue);
  };

  const initPilihanParent: PilihanParent = {
    urusan: '',
    bidang: '',
    program: '',
    kegiatan: '',
  };

  const [pilihanParent, setPilihanParent] =
    useState<PilihanParent>(initPilihanParent);
  const levelKeys = ['urusan', 'bidang', 'program', 'kegiatan'] as const;
  useEffect(() => {
    const updatedPilihan: PilihanParent = { ...pilihanParent };
    let foundEmpty = false;

    for (const key of levelKeys) {
      if (foundEmpty) {
        updatedPilihan[key] = '';
      } else if (updatedPilihan[key] === '') {
        foundEmpty = true;
      }
    }

    if (JSON.stringify(updatedPilihan) !== JSON.stringify(pilihanParent)) {
      setPilihanParent(updatedPilihan);
    }

    handleParentChange(updatedPilihan);
  }, [pilihanParent]);

  const { data: dataUrusan } = useQuery({
    queryKey: ['list_urusan'],
    queryFn: getUrusan,
  });
  const { data: dataBidang } = useQuery({
    queryKey: ['listBidang', pilihanParent.urusan],
    queryFn: () => getChildren(Number(pilihanParent.urusan)),
    enabled: !!pilihanParent.urusan,
  });
  const { data: dataProgram } = useQuery({
    queryKey: ['listProgram', pilihanParent.bidang],
    queryFn: () => getChildren(Number(pilihanParent.bidang)),
    enabled: !!pilihanParent.bidang,
  });
  const { data: dataKegiatan } = useQuery({
    queryKey: ['listKegiatan', pilihanParent.program],
    queryFn: () => getChildren(Number(pilihanParent.program)),
    enabled: !!pilihanParent.program,
  });

  const listRekening = [
    { label: 'Urusan', value: 'urusan' },
    { label: 'Bidang', value: 'bidang' },
    { label: 'Program', value: 'program' },
    { label: 'Kegiatan', value: 'kegiatan' },
    { label: 'Sub Kegiatan', value: 'subKegiatan' },
  ];

  const listUrusan =
    dataUrusan?.map((item) => ({
      label: `[${item.kode} - ${item.id}] ${item.name}`,
      value: item.id?.toString(),
    })) || [];
  const listBidang =
    dataBidang?.map((item) => ({
      label: `[${item.kode} - ${item.id}] ${item.name}`,
      value: item.id?.toString(),
    })) || [];
  const listProgram =
    dataProgram?.map((item) => ({
      label: `[${item.kode} - ${item.id}] ${item.name}`,
      value: item.id?.toString(),
    })) || [];
  const listKegiatan =
    dataKegiatan?.map((item) => ({
      label: `[${item.kode} - ${item.id}] ${item.name}`,
      value: item.id?.toString(),
    })) || [];

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='max-w-md mx-auto space-y-4'
      >
        <div className='space-y-4'>
          <div className='grid grid-cols-[100px_2fr] gap-2'>
            {/* Field Kode */}
            <form.Field name='kode'>
              {(field) => (
                <div className='flex-1'>
                  <label htmlFor='kode'>Kode</label>
                  <InputText
                    inputMode='numeric'
                    type='text'
                    maxLength={8}
                    placeholder='Kode...'
                    id='kode'
                    value={field.state.value ?? ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    invalid={!field.state.meta.isValid}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
            {/* Field Nama */}
            <form.Field name='name'>
              {(field) => (
                <div className='flex-1'>
                  <label htmlFor='name'>
                    Nama{' '}
                    <span className='capitalize'>
                      {values.rekening == 'subKegiatan'
                        ? 'sub kegiatan'
                        : values.rekening}
                    </span>
                  </label>
                  <InputText
                    type='text'
                    placeholder='Nama...'
                    id='name'
                    value={field.state.value ?? ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    invalid={!field.state.meta.isValid}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
          </div>
          <div>
            {/* Field Rekening */}
            <form.Field name='rekening'>
              {(field) => {
                return (
                  <div className='flex-1'>
                    <label htmlFor='rekening'>Rekening</label>
                    <InputSearchBox
                      id='rekening'
                      name='rekening'
                      options={listRekening}
                      value={field.state.value ?? ''}
                      onChange={(val) => {
                        field.handleChange(val);
                        setPilihanParent((prev) => {
                          switch (val) {
                            case 'urusan':
                              return {
                                urusan: '',
                                bidang: '',
                                program: '',
                                kegiatan: '',
                              };
                            case 'bidang':
                              return {
                                urusan: prev.urusan,
                                bidang: '',
                                program: '',
                                kegiatan: '',
                              };
                            case 'program':
                              return {
                                urusan: prev.urusan,
                                bidang: prev.bidang,
                                program: '',
                                kegiatan: '',
                              };
                            case 'kegiatan':
                              return {
                                urusan: prev.urusan,
                                bidang: prev.bidang,
                                program: prev.program,
                                kegiatan: '',
                              };
                            case 'subKegiatan':
                              return {
                                urusan: prev.urusan,
                                bidang: prev.bidang,
                                program: prev.program,
                                kegiatan: prev.kegiatan,
                              };
                            default:
                              return prev;
                          }
                        });
                      }}
                      defaultOptionLabel='Pilih Rekening'
                      className='h-9'
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </div>
                );
              }}
            </form.Field>
          </div>
          {/* Field Parent */}
          {values.rekening && (
            <>
              {values.rekening !== 'urusan' && (
                <div>
                  <label htmlFor='listurusan'>Urusan</label>
                  <InputSearchBox
                    id='listurusan'
                    tooltip
                    options={listUrusan as OptionItem[]}
                    onChange={(e) =>
                      setPilihanParent((prev) => ({ ...prev, urusan: e }))
                    }
                    value={pilihanParent.urusan}
                    onClear={() =>
                      setPilihanParent((prev) => ({ ...prev, urusan: '' }))
                    }
                    defaultOptionLabel='Pilih Urusan'
                    className='h-9'
                    withSearch
                  />
                </div>
              )}
              {!['urusan', 'bidang'].includes(values.rekening!) && (
                <div>
                  <label htmlFor='listbidang'>Bidang</label>
                  <InputSearchBox
                    id='listbidang'
                    tooltip
                    options={listBidang as OptionItem[]}
                    onChange={(e) =>
                      setPilihanParent((prev) => ({ ...prev, bidang: e }))
                    }
                    value={pilihanParent.bidang}
                    onClear={() =>
                      setPilihanParent((prev) => ({ ...prev, bidang: '' }))
                    }
                    defaultOptionLabel='Pilih Bidang'
                    className='h-9'
                    withSearch
                    disabled={!pilihanParent.urusan}
                  />
                </div>
              )}
              {!['urusan', 'bidang', 'program'].includes(values.rekening!) && (
                <div>
                  <label htmlFor='listprogram'>Program</label>
                  <InputSearchBox
                    id='listprogram'
                    tooltip
                    options={listProgram as OptionItem[]}
                    onChange={(e) =>
                      setPilihanParent((prev) => ({ ...prev, program: e }))
                    }
                    value={pilihanParent.program}
                    onClear={() =>
                      setPilihanParent((prev) => ({ ...prev, program: '' }))
                    }
                    defaultOptionLabel='Pilih Program'
                    className='h-9'
                    withSearch
                    disabled={!pilihanParent.bidang}
                  />
                </div>
              )}
              {!['urusan', 'bidang', 'program', 'kegiatan'].includes(
                values.rekening!,
              ) && (
                <div>
                  <label htmlFor='listkegiatan'>Kegiatan</label>
                  <InputSearchBox
                    id='listkegiatan'
                    tooltip
                    options={listKegiatan as OptionItem[]}
                    onChange={(e) =>
                      setPilihanParent((prev) => ({ ...prev, kegiatan: e }))
                    }
                    value={pilihanParent.kegiatan}
                    onClear={() =>
                      setPilihanParent((prev) => ({ ...prev, kegiatan: '' }))
                    }
                    defaultOptionLabel='Pilih Kegiatan'
                    className='h-9'
                    withSearch
                    disabled={!pilihanParent.program}
                  />
                </div>
              )}
            </>
          )}
          {/* HIDDEN */}
          <form.Field name='parent'>
            {(field) => (
              <>
                <input
                  id='parent'
                  name='parent'
                  type='text'
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  readOnly
                />
                <ErrorField field={field} />
              </>
            )}
          </form.Field>
        </div>

        {children ? (
          children
        ) : (
          <InputButton type='submit'>
            {type === 'Add' ? 'Tambah' : 'Simpan'}
          </InputButton>
        )}
      </form>
    </>
  );
};

export default FormRekening;
