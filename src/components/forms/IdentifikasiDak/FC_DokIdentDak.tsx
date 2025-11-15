import { withForm } from '../form-context';
import { initIdentDAKForm } from './FV_IdentDak';

export const FC_DokIdentDak = withForm({
  defaultValues: initIdentDAKForm,
  props: {
    title: '',
  },
  render: function Render({ form, title }) {
    const listDokName = [
      { kode: 0, name: 'PERENCANAAN' },
      { kode: 1, name: 'PMK (Alokasi dan Pedoman Umum)' },
      { kode: 2, name: 'Petunjuk Teknis (Juknis)' },
      { kode: 3, name: 'Penyusunan Rencana Kerja dan Anggaran SKPD' },
      { kode: 4, name: 'Penetapan DPA - SKPD' },
      { kode: 0, name: 'PELAKSANAAN' },
      { kode: 5, name: 'SK Penetapan Pelaksanaan Kegiatan' },
      { kode: 6, name: 'Pelaksanaan Tender Pekerjaan Kontrak' },
      { kode: 7, name: 'Persiapan Pekerjaan Swakelola' },
      { kode: 8, name: 'Pelaksanaan Pekerjaan Kontrak' },
      { kode: 9, name: 'Pelaksanaan Pekerjaan Swakelola' },
      { kode: 10, name: 'Penerbitan Surat Permintaan Pembayaran (SPP)' },
      { kode: 11, name: 'Penerbitan Surat Perintah Membayar (SPM)' },
      { kode: 12, name: 'Penerbitan Surat Perintah Pencairan Dana (SP2D)' },
    ];

    return (
      <>
        <div className='flex items-center justify-center mb-4'>
          <div className='flex-grow h-px bg-[var(--color-3)]'></div>
          {/* MARK: CHECKLIST DOKUMEN DAN KEGIATAN PELAKSANAAN */}
          <h5 className='whitespace-nowrap mx-3'>{title}</h5>
          <div className='flex-grow h-px bg-[var(--color-3)]'></div>
        </div>
        <i className='opacity-75'>
          *Maks. @File Upload <b>98 MB</b>- Format:{' '}
          <b>doc, docx, xls, xlsx, pdf</b>
        </i>

        <div className='table-responsive'>
          <table className='w-full'>
            <thead>
              <tr>
                <th>Kode Berkas</th>
                <th>Checklist</th>
                <th>Berkas</th>
                <th>Kesesuaian</th>
                <th>Waktu</th>
                <th>Keterangan</th>
                <th>Pesan Verifikasi</th>
                <th>Tanggal & Jam Upload</th>
              </tr>
            </thead>

            <tbody>
              {/* MARK: 12 DOKUMEN */}
              {listDokName.map((dok, index) => {
                if (dok.kode === 0) {
                  return (
                    <tr key={`${index}_${dok.kode}`}>
                      <td></td>
                      <td colSpan={7}>
                        <b>{dok.name}</b>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={`${index}_${dok.kode}`}>
                    <td className='text-center'>{dok.kode}</td>
                    <td>
                      <b>{dok.name}</b>
                    </td>
                    <td>
                      <form.AppField
                        name={`dokumen[${dok.kode - 1}].file`}
                        children={(field) => <field.FileField label='' />}
                      />
                      {/* <form.Field name={`dokumen[${dok.kode - 1}].file`}>
                        {(field: any) => (
                          <div>
                            <InputFile
                              tooltip
                              id={`dokumen[${dok.kode - 1}].file`}
                              accept='.doc,.docx,.xls,.xlsx,.pdf'
                              wrapperClassname='w-[200px]!'
                              onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                field.handleChange(file);
                              }}
                              invalid={!field.state.meta.isValid}
                            />
                            <ErrorField field={field} />
                          </div>
                        )}
                      </form.Field> */}
                    </td>
                    <td></td>
                    <td>
                      <form.AppField
                        name={`dokumen[${dok.kode - 1}].Waktu`}
                        children={(field) => (
                          <field.TextAreaField
                            label=''
                            placeholder='Waktu...'
                          />
                        )}
                      />
                      {/* <form.Field name={`dokumen[${dok.kode - 1}].Waktu`}>
                        {(field: any) => (
                          <div>
                            <InputTextArea
                              id={`dokumen[${dok.kode - 1}].Waktu`}
                              placeholder='Waktu...'
                              value={field.state.value ?? ''}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onClear={() => field.handleChange('')}
                              invalid={!field.state.meta.isValid}
                            />
                            <ErrorField field={field} />
                          </div>
                        )}
                      </form.Field> */}
                    </td>
                    <td>
                      <form.AppField
                        name={`dokumen[${dok.kode - 1}].Keterangan`}
                        children={(field) => (
                          <field.TextAreaField
                            label=''
                            placeholder='Keterangan...'
                          />
                        )}
                      />
                      {/* <form.Field name={`dokumen[${dok.kode - 1}].Keterangan`}>
                        {(field: any) => (
                          <div>
                            <InputTextArea
                              id={`dokumen[${dok.kode - 1}].Keterangan`}
                              placeholder='Keterangan...'
                              value={field.state.value ?? ''}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onClear={() => field.handleChange('')}
                              invalid={!field.state.meta.isValid}
                            />
                            <ErrorField field={field} />
                          </div>
                        )}
                      </form.Field> */}
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  },
});
