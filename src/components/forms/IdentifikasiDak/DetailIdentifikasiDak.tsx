import { useQuery } from '@tanstack/react-query';
import { formatUang } from '../../../lib/helper';
import { getIdentifikasiDetailDAK } from '../../../services/DAK/DAKIdentifikasiService';

const DetailIdentifikasiDak = ({ id_ident }: { id_ident: number }) => {
  const { data } = useQuery({
    queryKey: ['detail_identifikasi_dak', id_ident],
    queryFn: () => getIdentifikasiDetailDAK(id_ident),
  });

  console.log('DATA DETAIL', data);
  return (
    <>
      {' '}
      <div className='grid grid-cols-2 gap-2'>
        <div className='col-start-1 row-span-2'>
          <div className='border border-gray-300 bg-gray-100 rounded overflow-hidden'>
            <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
              Jenis, Bidang, Program & Kegiatan DAK
            </div>
            <div className='p-4 table-excel'>
              <table>
                <tbody className='capitalize'>
                  <tr>
                    <td className='text-right pr-4 font-bold capitalize w-[150px]'>
                      Jenis DAK
                    </td>
                    <td>{data?.jenis_dak}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Sub-Jenis DAK</td>
                    <td>{data?.sub_jenis_dak}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Bidang DAK</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>
                      Sub-Bidang DAK
                    </td>
                    <td>-</td>
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
                    <td className='text-right pr-4 font-bold w-[150px]'>
                      Nama Paket
                    </td>
                    <td>{data?.nama_paket}</td>
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
                    <td className='text-right pr-4 font-bold w-[150px]'>
                      Mekanisme
                    </td>
                    <td>{data?.mekanisme}</td>
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

              <tbody className='text-center'>
                <tr>
                  <td>-</td>
                  <td colSpan={7} className='text-left'>
                    <b>PERENCANAAN</b>
                  </td>
                </tr>
                {/* 1 */}
                <tr>
                  <td>1</td>
                  <td className='text-left'>
                    <span className='text-red-500'>
                      PMK (Alokasi dan Pedoman Umum)
                    </span>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                {/* 2 */}
                <tr>
                  <td>2</td>
                  <td className='text-left'>
                    <span className='text-red-500'>
                      Petunjuk Teknis (Juknis)
                    </span>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                {/* 3 */}
                <tr>
                  <td>3</td>
                  <td className='text-left'>
                    <span className='text-red-500'>
                      Penyusunan Rencana Kerja dan Anggaran SKPD
                    </span>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                {/* 4 */}
                <tr>
                  <td>4</td>
                  <td className='text-left'>
                    <span className='text-red-500'>Penetapan DPA - SKPD</span>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>-</td>
                  <td colSpan={7} className='text-left'>
                    <b>PELAKSANAAN</b>
                  </td>
                </tr>
                {/* 5 */}
                <tr>
                  <td>5</td>
                  <td className='text-left'>
                    <span className='text-red-500'>
                      SK Penetapan Pelaksanaan Kegiatan
                    </span>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                {/* 6 */}
                <tr>
                  <td>6</td>
                  <td className='text-left'>
                    <span className='text-red-500'>
                      Pelaksanaan Tender Pekerjaan Kontrak
                    </span>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                {/* 7 */}
                <tr>
                  <td>7</td>
                  <td className='text-left'>
                    <span className='text-red-500'>
                      Persiapan Pekerjaan Swakelola
                    </span>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                {/* 8 */}
                <tr>
                  <td>8</td>
                  <td className='text-left'>
                    <span className='text-red-500'>
                      Pelaksanaan Pekerjaan Kontrak
                    </span>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                {/* 9 */}
                <tr>
                  <td>9</td>
                  <td className='text-left'>
                    <span className='text-red-500'>
                      Pelaksanaan Pekerjaan Swakelola
                    </span>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                {/* 10 */}
                <tr>
                  <td>10</td>
                  <td className='text-left'>
                    <span className='text-red-500'>
                      Penerbitan Surat Permintaan Pembayaran (SPP)
                    </span>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                {/* 11 */}
                <tr>
                  <td>11</td>
                  <td className='text-left'>
                    <span className='text-red-500'>
                      Penerbitan Surat Perintah Membayar (SPM)
                    </span>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                {/* 12 */}
                <tr>
                  <td>12</td>
                  <td className='text-left'>
                    <span className='text-red-500'>
                      Penerbitan Surat Perintah Pencairan Dana (SP2D)
                    </span>
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailIdentifikasiDak;
