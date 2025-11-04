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

  const getListQuery = (key: string, parentId?: string) =>
    useQuery({
      queryKey: [key, parentId],
      queryFn: () => (parentId ? getChildren(Number(parentId)) : getUrusan()),
      enabled: key === 'listUrusan' || !!parentId,
    });

  const { data: dataUrusan } = getListQuery('listUrusan');
  const { data: dataBidang } = getListQuery('listBidang', pilihanParent.urusan);
  const { data: dataProgram } = getListQuery(
    'listProgram',
    pilihanParent.bidang,
  );
  const { data: dataKegiatan } = getListQuery(
    'listKegiatan',
    pilihanParent.program,
  );
  const { data: dataSubKegiatan } = getListQuery(
    'listSubKegiatan',
    pilihanParent.kegiatan,
  );

  const mapList = (data?: any[]) =>
    data?.map((item) => ({
      label: `[${item.kode} - ${item.id}] ${item.name}`,
      value: item.id?.toString(),
    })) || [];

  const listUrusan = mapList(dataUrusan);
  const listBidang = mapList(dataBidang);
  const listProgram = mapList(dataProgram);
  const listKegiatan = mapList(dataKegiatan);
  const listSubKegiatan = mapList(dataSubKegiatan);

  const levelKeys = [
    'urusan',
    'bidang',
    'program',
    'kegiatan',
    'subkegiatan',
  ] as const;

  const handleChangeLevel = (level: keyof PilihanParent, value: string) => {
    const levelIndex = levelKeys.indexOf(level);

    const updated: PilihanParent = { ...pilihanParent };
    updated[level] = value;

    for (let i = levelIndex + 1; i < levelKeys.length; i++) {
      updated[levelKeys[i]] = '';
    }

    setPilihanParent(updated);
  };

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
                      onChange={(val) => {
                        setSelectedRek(val);
                        setPilihanParent(initPilihanParent);
                      }}
                      onClear={() => {
                        setSelectedRek('');
                        setPilihanParent(initPilihanParent);
                      }}
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
                          value={pilihanParent.urusan}
                          onChange={(e) => handleChangeLevel('urusan', e)}
                          onClear={() => handleChangeLevel('urusan', '')}
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
                          value={pilihanParent.bidang}
                          onChange={(e) => handleChangeLevel('bidang', e)}
                          onClear={() => handleChangeLevel('bidang', '')}
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
                          value={pilihanParent.program}
                          onChange={(e) => handleChangeLevel('program', e)}
                          onClear={() => handleChangeLevel('program', '')}
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
                          value={pilihanParent.kegiatan}
                          onChange={(e) => handleChangeLevel('kegiatan', e)}
                          onClear={() => handleChangeLevel('kegiatan', '')}
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
                          value={pilihanParent.subkegiatan}
                          onChange={(e) => handleChangeLevel('subkegiatan', e)}
                          onClear={() => handleChangeLevel('subkegiatan', '')}
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
