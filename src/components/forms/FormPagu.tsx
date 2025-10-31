import React, { useEffect, useState } from 'react';
import InputButton from '../inputs/InputButton';
import { useForm } from '@tanstack/react-form';
import type { PaguForm } from '../../services/PaguService';
import ErrorField from './ErrorField';
import InputSearchBox, { type OptionItem } from '../inputs/InputSearchBox';
import { getChildren, getUrusan } from '../../services/MasterService';
import { useQuery } from '@tanstack/react-query';
import { getPeriodeIDFromCookie } from '../../lib/usercookie';
import InputText from '../inputs/InputText';
import {
  mapErrors,
  mapToInput,
  paguSchema,
  paguSchemaSubmit,
} from './schemas/SchemaPagu';
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
  defaultValues: PaguForm;
  onSubmit: (data: PaguForm) => void;
}

interface FormAddProps extends BaseFormProps {
  type: 'Add';
}

interface FormEditProps extends BaseFormProps {
  type: 'Edit';
}

type FormProps = FormAddProps | FormEditProps;
// #endregion

const FormPagu: React.FC<FormProps> = ({
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
      onSubmit(value);
    },
    validators: {
      onChange: ({ value }) => validateWith(paguSchema, value),
      onSubmit: ({ value }) => validateWith(paguSchemaSubmit, value),
    },
  });
  // #endregion

  //#region SKPD
  const idPeriodeCookie = Number(getPeriodeIDFromCookie());
  // const [selectedSKPD, setSelectedSKPD] = useState('');
  const { data: dataSKPDPeriode } = useQuery({
    queryKey: ['list_skpd_periode'],
    queryFn: async () => getSKPDPeriode(idPeriodeCookie),
  });
  const listSKPDPeriode =
    dataSKPDPeriode?.map((item) => ({
      label: `[${item.id}] ${item.name}`,
      value: item.id?.toString(),
    })) || [];
  //#endregion

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
    console.log(selectedRek);
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

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='mx-auto space-y-4'
      >
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
                      invalid={!field.state.meta.isValid && !selectedRek}
                    />
                    {!selectedRek && <ErrorField field={field} />}
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
                          invalid={
                            !field.state.meta.isValid && !pilihanParent.urusan
                          }
                        />
                        {!pilihanParent.urusan && <ErrorField field={field} />}
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
                          invalid={
                            !field.state.meta.isValid && !pilihanParent.bidang
                          }
                        />
                        {!pilihanParent.bidang && <ErrorField field={field} />}
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
                          invalid={
                            !field.state.meta.isValid && !pilihanParent.program
                          }
                        />
                        {!pilihanParent.program && <ErrorField field={field} />}
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
                          invalid={
                            !field.state.meta.isValid && !pilihanParent.kegiatan
                          }
                        />
                        {!pilihanParent.kegiatan && (
                          <ErrorField field={field} />
                        )}
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
                          invalid={
                            !field.state.meta.isValid &&
                            !pilihanParent.subkegiatan
                          }
                        />
                        {!pilihanParent.subkegiatan && (
                          <ErrorField field={field} />
                        )}
                      </div>
                    )}
                  </>
                )}
                <input
                  id='master_id'
                  name='master_id'
                  type='hidden'
                  value={field.state.value ?? ''}
                  readOnly
                />
              </>
            )}
          </form.Field>

          <div>
            {/* Field SKPD Periode Id */}
            <form.Field name='skpd_periode_id'>
              {(field) => (
                <>
                  <label htmlFor='skpd_periode_id'>SKPD</label>
                  <InputSearchBox
                    id='skpd_periode_id'
                    className='h-9'
                    btnclassName='bg-white'
                    placeholder='Pilih SKPD...'
                    value={field.state.value?.toString()}
                    options={listSKPDPeriode as OptionItem[]}
                    onChange={(val) => field.handleChange(val)}
                    onClear={() => field.handleChange('')}
                    withSearch
                    disabled={type === 'Edit'}
                    invalid={!field.state.meta.isValid}
                  />
                  <ErrorField field={field} />
                </>
              )}
            </form.Field>
          </div>

          {type === 'Edit' && (
            <InputText
              value={form.getFieldValue('master_name')}
              onChange={() => {}}
              disabled
              readOnly
            />
          )}
          {/* Target */}
          <div className='grid grid-cols-3 grid-rows-2 gap-2'>
            {[0, 1, 2, 3, 4].map((n) => (
              <div key={n}>
                <form.Field name={`target[${n}].pagu`}>
                  {(field) => (
                    <>
                      <label htmlFor={`target[${n}].pagu`}>
                        Tahun ke {n + 1}
                      </label>
                      <InputText
                        Iconlabel='Rp.'
                        inputMode='numeric'
                        isMoney
                        type='text'
                        placeholder='Target...'
                        id={`target[${n}].pagu`}
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

export default FormPagu;
