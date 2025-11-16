import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatUang } from '../../../lib/helper';
import {
  getIdentifikasiDetailDAK,
  setStatusIdentDak,
} from '../../../services/DAK/DAKIdentifikasiService';
import InputSearchBox from '../../inputs/InputSearchBox';
import toast from 'react-hot-toast';
import { useAppForm } from '../form-context';
import {
  SchemaFormDokIdentDak,
  useDokIdentDakFormData,
} from './FV_DokIdentDak';
import AksiButton from '../../inputs/AksiButton';
import { MdCheck, MdEdit } from 'react-icons/md';
import { useState } from 'react';

const DetailIdentifikasiDak = ({ id_ident }: { id_ident: number }) => {
  const { data } = useQuery({
    queryKey: ['detail_identifikasi_dak', id_ident],
    queryFn: () => getIdentifikasiDetailDAK(id_ident),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: { id_ident: number; status: string }) => {
      return setStatusIdentDak(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['detail_identifikasi_dak', id_ident],
      });
    },
  });

  const handleStatus = (data: { id_ident: number; status: string }) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: 'Memperbarui status...',
      success: 'Status berhasil diubah',
      error: 'Terjadi kesalahan',
    });
  };

  const mapBerkas = Object.fromEntries(
    data?.dokumen.map((d) => [d.id_berkas, d]) ?? [],
  );

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

  const { initialValues } = useDokIdentDakFormData();
  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value));
    },
    onSubmitInvalid: () => {
      toast.error('Validasi gagal\nMohon lengkapi form');
    },
    validators: {
      onSubmit: SchemaFormDokIdentDak,
    },
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const startEdit = (kode: number) => {
    const d = mapBerkas[kode];

    form.setFieldValue('id_dok', kode);
    form.setFieldValue('Kesesuaian', d?.Kesesuaian ?? '');
    form.setFieldValue('Waktu', d?.Waktu ?? '');
    form.setFieldValue('Keterangan', d?.Keterangan ?? '');
    form.setFieldValue('pesan', d?.pesan ?? '');

    setEditingId(kode);
  };

  return (
    <>
      <div className='grid grid-cols-2 gap-2'>
        <div className='col-start-1 row-span-2'>
          <div className='border border-gray-300 bg-gray-100 rounded overflow-hidden h-full'>
            <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
              Jenis, Bidang, Program & Kegiatan DAK
            </div>
            <div className='p-4 table-excel'>
              <table>
                <tbody className='capitalize'>
                  <tr>
                    <td className='text-right pr-4 font-bold capitalize w-[25%]'>
                      Jenis DAK
                    </td>
                    <td className='w-[75%]'>{data?.jenis_dak}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Sub-Jenis DAK</td>
                    <td>{data?.sub_jenis_dak}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Bidang DAK</td>
                    <td>{data?.bidang_dak}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>
                      Sub-Bidang DAK
                    </td>
                    <td>{data?.sub_bidang_dak}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Tahun</td>
                    <td>{data?.tahun}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>
                      Kabupaten / Kota
                    </td>
                    <td>{data?.kab_kot}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>OPD</td>
                    <td>{data?.opd}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Bidang OPD</td>
                    <td>{data?.bidang_opd}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Urusan</td>
                    <td>{data?.urusan}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Bidang</td>
                    <td>{data?.bidang}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Program</td>
                    <td>{data?.program}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Kegiatan</td>
                    <td>{data?.kegiatan}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Sub Kegiatan</td>
                    <td>{data?.subKegiatan}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Status</td>
                    <td>
                      <div className='space-y-2'>
                        <InputSearchBox
                          value={data?.verif_status}
                          options={[
                            { label: 'Di Periksa', value: 'di_periksa' },
                            { label: 'Cek Ulang', value: 'cek_ulang' },
                            { label: 'Di Verifikasi', value: 'di_verifikasi' },
                            { label: 'Belum Sesuai', value: 'belum_sesuai' },
                          ]}
                          onChange={(val) => {
                            handleStatus({ id_ident: id_ident, status: val });
                          }}
                        />
                        <span
                          className={
                            data?.verif_status === 'di_periksa'
                              ? 'text-blue-600'
                              : data?.verif_status === 'cek_ulang'
                                ? 'text-orange-600'
                                : data?.verif_status === 'di_verifikasi'
                                  ? 'text-green-600'
                                  : data?.verif_status === 'belum_sesuai'
                                    ? 'text-red-600'
                                    : ''
                          }
                        >
                          {data?.verif_status === 'di_periksa' &&
                            'Data sedang dalam proses pemeriksaan.'}
                          {data?.verif_status === 'cek_ulang' &&
                            'Diperlukan pengecekan ulang atau perbaikan data.'}
                          {data?.verif_status === 'di_verifikasi' &&
                            'Data telah berhasil diverifikasi.'}
                          {data?.verif_status === 'belum_sesuai' &&
                            'Data belum sesuai.'}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/*  */}
        <div>
          <div className='border border-gray-300 bg-gray-100 rounded overflow-hidden'>
            <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
              Detail DAK
            </div>
            <div className='p-4 table-excel space-y-4'>
              <table>
                <tbody className='capitalize'>
                  <tr>
                    <td className='text-right pr-4 font-bold w-[25%]'>
                      Nama Paket
                    </td>
                    <td className='w-[75%]'>{data?.nama_paket}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Detail Paket</td>
                    <td>{data?.detail_paket}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Volume</td>
                    <td>
                      {data?.volume} {data?.satuan}
                    </td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>
                      Estimasi Waktu
                    </td>
                    <td>{data?.estimasi_waktu}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>
                      Jumlah Penerima Manfaat
                    </td>
                    <td>{data?.jumlah_penerima_manfaat}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Anggaran DAK</td>
                    <td>{formatUang(Number(data?.anggaran_dak))}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Alamat</td>
                    <td>
                      {data?.desa_kel}, {data?.kec}
                    </td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Bujur</td>
                    <td>
                      {data?.bujur[0]}° {data?.bujur[1]}' {data?.bujur[2]}''
                    </td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Lintang</td>
                    <td>
                      {data?.lintang[0]}° {data?.lintang[1]}' {data?.lintang[2]}
                      ''
                    </td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Foto Kegiatan</td>
                    <td>{data?.foto_kegiatan ?? '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/*  */}
        <div>
          <div className='border border-gray-300 bg-gray-100 rounded overflow-hidden'>
            <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
              Mekanisme Pelaksana
            </div>
            <div className='p-4 table-excel'>
              <table>
                <tbody className='capitalize'>
                  <tr>
                    <td className='text-right pr-4 font-bold w-[25%]'>
                      Mekanisme
                    </td>
                    <td className='w-[75%]'>{data?.mekanisme}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Volume</td>
                    <td>
                      {data?.mekanisme_volume} {data?.satuan}
                    </td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Uang</td>
                    <td>{formatUang(Number(data?.mekanisme_uang))}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>
                      Metode Pembayaran
                    </td>
                    <td>{data?.metode_pembayaran}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className='col-span-2'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
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
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody className='text-center'>
                  {/* MARK: 12 DOKUMEN */}
                  {listDokName.map((dok, index) => {
                    if (dok.kode === 0) {
                      return (
                        <tr key={`${index}_${dok.kode}`}>
                          <td></td>
                          <td colSpan={8} className='text-left!'>
                            <b>{dok.name}</b>
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={`${index}_${dok.kode}`}>
                        <td>{dok.kode}</td>
                        <td className='text-left!'>
                          <b>{dok.name}</b>
                        </td>
                        <td>
                          {editingId === dok.kode ? (
                            <form.AppField
                              name='file'
                              children={(field) => (
                                <field.FileField
                                  label=''
                                  placeholder='File...'
                                />
                              )}
                            />
                          ) : (
                            (mapBerkas[dok.kode]?.file ?? '-')
                          )}
                        </td>
                        <td>
                          {editingId === dok.kode ? (
                            <form.AppField
                              name='Kesesuaian'
                              children={(field) => (
                                <field.TextAreaField
                                  label=''
                                  placeholder='Kesesuaian...'
                                />
                              )}
                            />
                          ) : (
                            (mapBerkas[dok.kode]?.Kesesuaian ?? '-')
                          )}
                        </td>
                        <td>
                          {editingId === dok.kode ? (
                            <form.AppField
                              name='Waktu'
                              children={(field) => (
                                <input
                                  type='date'
                                  value={field.state.value}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                />
                              )}
                            />
                          ) : (
                            (mapBerkas[dok.kode]?.Waktu ?? '-')
                          )}
                        </td>
                        <td>
                          {editingId === dok.kode ? (
                            <form.AppField
                              name='Keterangan'
                              children={(field) => (
                                <field.TextAreaField
                                  label=''
                                  placeholder='Keterangan...'
                                />
                              )}
                            />
                          ) : (
                            (mapBerkas[dok.kode]?.Keterangan ?? '-')
                          )}
                        </td>
                        <td>
                          {editingId === dok.kode ? (
                            <form.AppField
                              name='pesan'
                              children={(field) => (
                                <field.TextAreaField
                                  label=''
                                  placeholder='Pesan...'
                                />
                              )}
                            />
                          ) : (
                            (mapBerkas[dok.kode]?.pesan ?? '-')
                          )}
                        </td>
                        <td>
                          {mapBerkas[dok.kode]?.create_at &&
                            new Date(
                              mapBerkas[dok.kode].create_at,
                            ).toLocaleDateString('id-ID', {
                              timeZone: 'Asia/Jakarta',
                            })}
                        </td>
                        <td>
                          <div className='inline-flex'>
                            {editingId !== dok.kode ? (
                              <AksiButton
                                type='submit'
                                Icon={MdEdit}
                                onClick={() => {
                                  const d = mapBerkas[dok.kode];
                                  form.setFieldValue('id_dok', dok.kode);
                                  form.setFieldValue(
                                    'Kesesuaian',
                                    d?.Kesesuaian ?? '',
                                  );
                                  form.setFieldValue('Waktu', d?.Waktu ?? '');
                                  form.setFieldValue(
                                    'Keterangan',
                                    d?.Keterangan ?? '',
                                  );
                                  form.setFieldValue('pesan', d?.pesan ?? '');
                                  setEditingId(dok.kode);
                                }}
                              />
                            ) : (
                              <AksiButton
                                type='button'
                                className='hover:bg-green-500!'
                                Icon={MdCheck}
                                onClick={() => setEditingId(null)}
                              />
                            )}

                            {/* {editingId === dok.kode ? (
                              <AksiButton
                                type='submit'
                                Icon={MdCheck}
                                onClick={() => setEditingId(null)}
                              />
                            ) : (
                              <AksiButton
                                Icon={MdEdit}
                                onClick={() => startEdit(dok.kode)}
                              />
                            )} */}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DetailIdentifikasiDak;
