import React, { useEffect, useState } from 'react';
import InputButton from '../inputs/InputButton';
import { useForm } from '@tanstack/react-form';
import ErrorField from './ErrorField';
import InputSearchBox, { type OptionItem } from '../inputs/InputSearchBox';
import { getChildren, getUrusan } from '../../services/MasterService';
import { useQuery } from '@tanstack/react-query';
import { getPeriodeIDFromCookie } from '../../lib/usercookie';
import InputText from '../inputs/InputText';
import type { IndikatorForm } from '../../services/IndikatorService';
import {
  indikatorSchema,
  indikatorSchemaSubmit,
  mapErrors,
  mapToInput,
} from './schemas/SchemaIndikator';
import { getSKPDPeriode } from '../../services/PeriodeService';

// #region Types
interface PilihanParent {
  urusan?: string;
  bidang?: string;
  program?: string;
  kegiatan?: string;
  subkegiatan?: string;
}

interface BaseFormProps {
  children?: React.ReactElement;
  defaultValues: IndikatorForm;
}

interface FormAddProps extends BaseFormProps {
  type: 'Add';
  onSubmit: (data: IndikatorForm) => void;
}

interface FormEditProps extends BaseFormProps {
  type: 'Edit';
  onSubmit: (data: { id: number; payload: IndikatorForm }) => void;
}

type FormProps = FormAddProps | FormEditProps;
// #endregion

const FormIndikator: React.FC<FormProps> = ({
  type,
  children,
  onSubmit,
  defaultValues,
}) => {
  // #region Form
  const validateWith = (schema: any, value: any) => {
    const input = mapToInput(value);
    const result = schema.safeParse(input);
    return result.success
      ? { fields: {} }
      : { fields: mapErrors(result.error.format()) };
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      console.log(value);
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
      onChange: ({ value }) => validateWith(indikatorSchema, value),
      onSubmit: ({ value }) => validateWith(indikatorSchemaSubmit, value),
    },
  });
  // #endregion

  // #region Master ID
  const [selectedRek, setSelectedRek] = useState('');
  const listRekening = [
    { label: 'Program', value: 'program' },
    { label: 'Kegiatan', value: 'kegiatan' },
    { label: 'Sub Kegiatan', value: 'subKegiatan' },
  ];
  const initPilihanParent: PilihanParent = {
    urusan: '',
    bidang: '',
    program: '',
    kegiatan: '',
    subkegiatan: '',
  };

  const [pilihanParent, setPilihanParent] =
    useState<PilihanParent>(initPilihanParent);
  const levelKeys = [
    'urusan',
    'bidang',
    'program',
    'kegiatan',
    'subkegiatan',
  ] as const;
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
  }, [pilihanParent, selectedRek]);
  const handleParentChange = ({
    urusan,
    bidang,
    program,
    kegiatan,
    subkegiatan,
  }: PilihanParent) => {
    let parentValue = '';

    switch (selectedRek) {
      case 'urusan':
        if (urusan) parentValue = urusan;
        break;

      case 'bidang':
        if (urusan && bidang) parentValue = bidang;
        break;

      case 'program':
        if (urusan && bidang && program) parentValue = program;
        break;

      case 'kegiatan':
        if (urusan && bidang && program && kegiatan) parentValue = kegiatan;
        break;

      case 'subKegiatan':
        if (urusan && bidang && program && kegiatan && subkegiatan)
          parentValue = subkegiatan;
        break;

      default:
        parentValue = '';
    }
    if (type === 'Add') {
      form.setFieldValue('master_id', parentValue);
    }
  };
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
  const { data: dataSubKegiatan } = useQuery({
    queryKey: ['listSubKegiatan', pilihanParent.kegiatan],
    queryFn: () => getChildren(Number(pilihanParent.kegiatan)),
    enabled: !!pilihanParent.kegiatan,
  });

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
  const listSubKegiatan =
    dataSubKegiatan?.map((item) => ({
      label: `[${item.kode} - ${item.id}] ${item.name}`,
      value: item.id?.toString(),
    })) || [];
  // #endregion

  // #region SKPD ID
  const { data: dataSKPDPeriode } = useQuery({
    queryKey: ['list_skpd_periode'],
    queryFn: async () => getSKPDPeriode(Number(getPeriodeIDFromCookie())),
  });
  const listSKPDPeriode =
    dataSKPDPeriode?.map((item) => ({
      label: `[${item.id}] ${item.name}`,
      value: item.id?.toString(),
    })) || [];
  // #endregion

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='mx-auto space-y-4'
      >
        <form.Field name='id'>
          {(field) => <input type='hidden' value={field.state.value ?? ''} />}
        </form.Field>
        <div className='flex flex-col space-y-4'>
          {/* Field Master Id */}
          <form.Field name='master_id'>
            {(field) => (
              <>
                {type === 'Add' && (
                  <div>
                    <InputSearchBox
                      defaultOptionLabel='Pilih Tujuan'
                      options={listRekening}
                      value={selectedRek}
                      onChange={(val) => setSelectedRek(val)}
                      onClear={() => setSelectedRek('')}
                      invalid={!field.state.meta.isValid}
                    />
                  </div>
                )}
                {type === 'Add' && selectedRek && (
                  <>
                    {
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
                            setPilihanParent((prev) => ({
                              ...prev,
                              urusan: '',
                            }))
                          }
                          defaultOptionLabel='Pilih Urusan'
                          className='h-9'
                          withSearch
                          invalid={!field.state.meta.isValid}
                        />
                      </div>
                    }
                    {!['urusan'].includes(selectedRek!) && (
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
                            setPilihanParent((prev) => ({
                              ...prev,
                              bidang: '',
                            }))
                          }
                          defaultOptionLabel='Pilih Bidang'
                          className='h-9'
                          withSearch
                          disabled={!pilihanParent.urusan}
                        />
                      </div>
                    )}
                    {!['urusan', 'bidang'].includes(selectedRek!) && (
                      <div>
                        <label htmlFor='listprogram'>Program</label>
                        <InputSearchBox
                          id='listprogram'
                          tooltip
                          options={listProgram as OptionItem[]}
                          onChange={(e) =>
                            setPilihanParent((prev) => ({
                              ...prev,
                              program: e,
                            }))
                          }
                          value={pilihanParent.program}
                          onClear={() =>
                            setPilihanParent((prev) => ({
                              ...prev,
                              program: '',
                            }))
                          }
                          defaultOptionLabel='Pilih Program'
                          className='h-9'
                          withSearch
                          disabled={!pilihanParent.bidang}
                        />
                      </div>
                    )}
                    {!['urusan', 'bidang', 'program'].includes(
                      selectedRek!,
                    ) && (
                      <div>
                        <label htmlFor='listkegiatan'>Kegiatan</label>
                        <InputSearchBox
                          id='listkegiatan'
                          tooltip
                          options={listKegiatan as OptionItem[]}
                          onChange={(e) =>
                            setPilihanParent((prev) => ({
                              ...prev,
                              kegiatan: e,
                            }))
                          }
                          value={pilihanParent.kegiatan}
                          onClear={() =>
                            setPilihanParent((prev) => ({
                              ...prev,
                              kegiatan: '',
                            }))
                          }
                          defaultOptionLabel='Pilih Kegiatan'
                          className='h-9'
                          withSearch
                          disabled={!pilihanParent.program}
                        />
                      </div>
                    )}
                    {!['urusan', 'bidang', 'program', 'kegiatan'].includes(
                      selectedRek!,
                    ) && (
                      <div>
                        <label htmlFor='listsubkegiatan'>Sub Kegiatan</label>
                        <InputSearchBox
                          id='listsubkegiatan'
                          tooltip
                          options={listSubKegiatan as OptionItem[]}
                          onChange={(e) =>
                            setPilihanParent((prev) => ({
                              ...prev,
                              subkegiatan: e,
                            }))
                          }
                          value={pilihanParent.subkegiatan}
                          onClear={() =>
                            setPilihanParent((prev) => ({
                              ...prev,
                              subkegiatan: '',
                            }))
                          }
                          defaultOptionLabel='Pilih Sub Kegiatan'
                          className='h-9'
                          withSearch
                          disabled={!pilihanParent.kegiatan}
                        />
                      </div>
                    )}
                  </>
                )}
                <ErrorField field={field} />
              </>
            )}
          </form.Field>

          <div className='grid grid-cols-[2fr_1fr] gap-2'>
            <div>
              <form.Field name='name'>
                {(field) => (
                  <>
                    <label htmlFor='name'>Indikator</label>
                    <InputText
                      type='text'
                      placeholder='Nama indikator...'
                      id='name'
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </>
                )}
              </form.Field>
            </div>
            <div>
              {/* Field SKPD Periode Id */}
              <form.Field name='skpd_periode_id'>
                {(field) => (
                  <div>
                    <label htmlFor='skpd'>SKPD</label>
                    <InputSearchBox
                      id='skpd'
                      className='w-64 h-9'
                      btnclassName='bg-white'
                      placeholder='Pilih SKPD...'
                      value={field.state.value?.toString() ?? ''}
                      options={listSKPDPeriode as OptionItem[]}
                      onChange={(val) => field.handleChange(val)}
                      onClear={
                        type !== 'Edit'
                          ? () => field.handleChange('')
                          : undefined
                      }
                      invalid={!field.state.meta.isValid}
                      disabled={type === 'Edit'}
                      withSearch
                    />
                    <ErrorField field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Target */}
          <div className='grid grid-cols-3 grid-rows-2 gap-2'>
            {[0, 1, 2, 3, 4].map((n) => (
              <div key={n}>
                <form.Field name={`target[${n}].target`}>
                  {(field) => (
                    <>
                      <label htmlFor={`target[${n}].target`}>
                        Tahun ke {n + 1}
                      </label>
                      <InputText
                        inputMode='numeric'
                        type='text'
                        placeholder='Target...'
                        id={`target[${n}].target`}
                        value={field.state.value ?? ''}
                        onChange={(e) => field.handleChange(e.target.value)}
                        invalid={!field.state.meta.isValid}
                      />
                      <ErrorField field={field} />
                    </>
                  )}
                </form.Field>
                <form.Field name={`target[${n}].tahun_ke`}>
                  {(field) => (
                    <>
                      <input
                        type='hidden'
                        value={field.state.value ?? ''}
                        readOnly
                      />
                      {/* <ErrorField field={field} /> */}
                    </>
                  )}
                </form.Field>
              </div>
            ))}
            {/* Satuan */}
            <div>
              <form.Field name='satuan'>
                {(field) => (
                  <>
                    <label htmlFor='satuan'>Satuan</label>
                    <InputText
                      type='text'
                      placeholder='Satuan...'
                      id='satuan'
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      invalid={!field.state.meta.isValid}
                    />
                    <ErrorField field={field} />
                  </>
                )}
              </form.Field>
            </div>
          </div>
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

export default FormIndikator;
