import {
  useListSubJenisDAK,
  useListBidangDAK,
  useListSubBidangDAK,
  useListTahunDAK,
  useListOPDDAK,
  useListRekUrusanDAK,
  useListRekBidangDAK,
  useListRekProgramDAK,
  useListRekKegiatanDAK,
  useListRekSubKegiatanDAK,
} from '../../../hooks/DAK/ListDataDAK';
import InputSearchBox from '../../inputs/InputSearchBox';
import InputText from '../../inputs/InputText';
import ErrorField from '../ErrorField';

const FormIdentJenisBidangDak = ({
  form,
  formValues,
}: {
  form: any;
  formValues: any;
}) => {
  //#region JENIS BIDANG PROGRAM KEGIATAN DAK
  const listSubJenisDAK = useListSubJenisDAK(Number(formValues.n_jenisDAK));
  const listBidangDAK = useListBidangDAK();
  const listSubBidangDAK = useListSubBidangDAK(Number(formValues.n_bidangDAK));
  const listTahunDAK = useListTahunDAK();
  const listOPDDAK = useListOPDDAK();

  const listRekUrusanDAK = useListRekUrusanDAK();
  const listRekBidangDAK = useListRekBidangDAK(Number(formValues.n_idUrusan));
  const listRekProgramDAK = useListRekProgramDAK(
    Number(formValues.n_idUrusan),
    Number(formValues.n_idBidang),
  );
  const listRekKegiatanDAK = useListRekKegiatanDAK(
    Number(formValues.n_idUrusan),
    Number(formValues.n_idBidang),
    Number(formValues.n_idProgram),
  );
  const listRekSubKegiatanDAK = useListRekSubKegiatanDAK(
    Number(formValues.n_idUrusan),
    Number(formValues.n_idBidang),
    Number(formValues.n_idProgram),
    Number(formValues.n_idKegiatan),
  );
  //#endregion

  return (
    <>
      {/* MARK: JENIS BIDANG PROGRAM KEGIATAN DAK */}
      <div className='max-w-4xl mx-auto '>
        <div className='flex items-center justify-center mb-4'>
          <div className='flex-grow h-px bg-[var(--color-3)]'></div>
          <h5 className='whitespace-nowrap mx-3'>
            Jenis, Bidang, Program & Kegiatan DAK
          </h5>
          <div className='flex-grow h-px bg-[var(--color-3)]'></div>
        </div>

        <div className='space-y-2 '>
          <div className='grid lg:grid-cols-2 gap-2'>
            {/* MARK: JENIS DAK */}
            <form.Field name='n_jenisDAK'>
              {(field: any) => (
                <div>
                  <label htmlFor='n_jenisDAK'>
                    Jenis DAK{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputSearchBox
                    id='n_jenisDAK'
                    className='h-9'
                    btnclassName='bg-white'
                    options={[
                      { label: 'Fisik', value: '1' },
                      { label: 'Non-Fisik', value: '2' },
                    ]}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e);
                      form.setFieldValue('sub_jenis_id', 0);
                    }}
                    onClear={() => {
                      field.handleChange('');
                      form.setFieldValue('sub_jenis_id', 0);
                    }}
                    invalid={!field.state.meta.isValid}
                    placeholder='Pilih Sub-Jenis DAK'
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>

            {/* MARK: SUB JENIS DAK */}
            <form.Field name='sub_jenis_id'>
              {(field: any) => (
                <div>
                  <label htmlFor='sub_jenis_id'>
                    Sub-Jenis DAK{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputSearchBox
                    id='subJenisDak'
                    className='h-9'
                    btnclassName='bg-white'
                    options={listSubJenisDAK}
                    disabled={!formValues.n_jenisDAK}
                    placeholder='Pilih Sub-Jenis DAK'
                    value={field.state.value.toString()}
                    onChange={(e) => field.handleChange(Number(e))}
                    onClear={() => field.handleChange(0)}
                    invalid={!field.state.meta.isValid}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
            {/* MARK: BIDANG DAK */}
            <form.Field name='n_bidangDAK'>
              {(field: any) => (
                <div>
                  <label htmlFor='n_bidangDAK'>
                    Bidang DAK{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputSearchBox
                    id='n_bidangDAK'
                    className='h-9'
                    btnclassName='bg-white'
                    options={listBidangDAK}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e)}
                    onClear={() => {
                      field.handleChange('');
                      form.setFieldValue('sub_bidang_id', 0);
                    }}
                    invalid={!field.state.meta.isValid}
                    placeholder='Pilih Bidang DAK'
                    withSearch
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
            {/* MARK: SUB BIDANG DAK */}
            <form.Field name='sub_bidang_id'>
              {(field: any) => (
                <div>
                  <label htmlFor='sub_bidang_id'>
                    Sub-Bidang DAK{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputSearchBox
                    id='sub_bidang_id'
                    className='h-9'
                    btnclassName='bg-white'
                    options={listSubBidangDAK}
                    value={field.state.value.toString()}
                    onChange={(e) => field.handleChange(Number(e))}
                    onClear={() => field.handleChange(0)}
                    invalid={!field.state.meta.isValid}
                    disabled={!formValues.n_bidangDAK}
                    placeholder='Pilih Sub-Bidang DAK'
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
          </div>
          <div className='grid lg:grid-cols-[1fr_2fr_2fr] gap-2'>
            {/* MARK: TAHUN DAK */}
            <form.Field name='tahun'>
              {(field: any) => (
                <div>
                  <label htmlFor='tahun'>
                    Tahun{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputSearchBox
                    id='tahun'
                    className='h-9'
                    btnclassName='bg-white'
                    options={listTahunDAK}
                    value={field.state.value.toString()}
                    onChange={(e) => field.handleChange(Number(e))}
                    onClear={() => field.handleChange(0)}
                    invalid={!field.state.meta.isValid}
                    placeholder='Pilih Tahun'
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
            {/* MARK: OPD DAK */}
            <form.Field name='opd_id'>
              {(field: any) => (
                <div>
                  <label htmlFor='opd_id'>
                    OPD{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputSearchBox
                    id='opd_id'
                    className='h-9'
                    btnclassName='bg-white'
                    options={listOPDDAK}
                    value={field.state.value.toString()}
                    onChange={(e) => field.handleChange(Number(e))}
                    onClear={() => field.handleChange(0)}
                    invalid={!field.state.meta.isValid}
                    placeholder='Pilih OPD'
                    withSearch
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
            {/* MARK: BIDANG OPD DAK */}
            <form.Field name='bidang_opd'>
              {(field: any) => (
                <div>
                  <label htmlFor='bidang_opd'>
                    Bidang OPD{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputText
                    id='bidang_opd'
                    placeholder='Bidang OPD...'
                    value={field.state.value.toString()}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onClear={() => field.handleChange('')}
                    invalid={!field.state.meta.isValid}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
          </div>
          <div className='space-y-2'>
            {/* MARK: REKENING URUSAN */}
            <form.Field name='n_idUrusan'>
              {(field: any) => (
                <div>
                  <label htmlFor='n_idUrusan'>
                    Urusan{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputSearchBox
                    id='n_idUrusan'
                    className='h-9'
                    btnclassName='bg-white'
                    options={listRekUrusanDAK}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e);
                      form.setFieldValue('n_idBidang', '');
                      form.setFieldValue('n_idProgram', '');
                      form.setFieldValue('n_idKegiatan', '');
                    }}
                    onClear={() => {
                      field.handleChange('');
                      form.setFieldValue('n_idBidang', '');
                      form.setFieldValue('n_idProgram', '');
                      form.setFieldValue('n_idKegiatan', '');
                    }}
                    invalid={!field.state.meta.isValid}
                    withSearch
                    placeholder='Pilih Urusan'
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>

            {/* MARK: REKENING BIDANG */}
            <form.Field name='n_idBidang'>
              {(field: any) => (
                <div>
                  <label htmlFor='n_idBidang'>
                    Bidang{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputSearchBox
                    id='n_idBidang'
                    className='h-9'
                    btnclassName='bg-white'
                    options={listRekBidangDAK}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e);
                      form.setFieldValue('n_idProgram', '');
                      form.setFieldValue('n_idKegiatan', '');
                    }}
                    onClear={() => {
                      field.handleChange('');
                      form.setFieldValue('n_idProgram', '');
                      form.setFieldValue('n_idKegiatan', '');
                      form.setFieldValue('sub_kegiatan_id', 0);
                    }}
                    invalid={!field.state.meta.isValid}
                    withSearch
                    placeholder='Pilih Bidang'
                    disabled={!formValues.n_idUrusan}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
            {/* MARK: REKENING PROGRAM */}
            <form.Field name='n_idProgram'>
              {(field: any) => (
                <div>
                  <label htmlFor='program'>
                    Program{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputSearchBox
                    id='program'
                    className='h-9'
                    btnclassName='bg-white'
                    options={listRekProgramDAK}
                    withSearch
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e);
                      form.setFieldValue('n_idKegiatan', '');
                      form.setFieldValue('sub_kegiatan_id', 0);
                    }}
                    onClear={() => {
                      field.handleChange('');
                      form.setFieldValue('n_idKegiatan', '');
                      form.setFieldValue('sub_kegiatan_id', 0);
                    }}
                    invalid={!field.state.meta.isValid}
                    placeholder='Pilih Program'
                    disabled={!formValues.n_idBidang}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>

            {/* MARK: REKENING KEGIATAN */}
            <form.Field name='n_idKegiatan'>
              {(field: any) => (
                <div>
                  <label htmlFor='n_idKegiatan'>
                    Kegiatan{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputSearchBox
                    id='n_idKegiatan'
                    className='h-9'
                    btnclassName='bg-white'
                    options={listRekKegiatanDAK}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e);
                      form.setFieldValue('sub_kegiatan_id', 0);
                    }}
                    onClear={() => {
                      field.handleChange('');
                      form.setFieldValue('sub_kegiatan_id', 0);
                    }}
                    invalid={!field.state.meta.isValid}
                    withSearch
                    placeholder='Pilih Kegiatan'
                    disabled={!formValues.n_idProgram}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>

            {/* MARK: REKENING SUB KEGIATAN */}
            <form.Field name='sub_kegiatan_id'>
              {(field: any) => (
                <div>
                  <label htmlFor='sub_kegiatan_id'>
                    Sub Kegiatan{' '}
                    <code className='text-red-500 text-xs align-text-top'>
                      (*)
                    </code>
                  </label>
                  <InputSearchBox
                    id='sub_kegiatan_id'
                    className='h-9'
                    btnclassName='bg-white'
                    options={listRekSubKegiatanDAK}
                    value={field.state.value.toString()}
                    onChange={(e) => field.handleChange(Number(e))}
                    onClear={() => field.handleChange(0)}
                    invalid={!field.state.meta.isValid}
                    withSearch
                    placeholder='Pilih Sub Kegiatan'
                    disabled={!formValues.n_idKegiatan}
                  />
                  <ErrorField field={field} />
                </div>
              )}
            </form.Field>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormIdentJenisBidangDak;
