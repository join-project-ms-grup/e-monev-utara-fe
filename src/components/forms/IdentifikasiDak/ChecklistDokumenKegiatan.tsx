import InputFile from '../../inputs/InputFile';
import InputTextArea from '../../inputs/InputTextArea';

const ChecklistDokumenKegiatan = () => {
  return (
    <div>
      <div className='flex items-center mb-4'>
        <h5 className='whitespace-nowrap mr-3'>
          Checklist Dokumen dan Kegiatan Pelaksanaan
        </h5>
        <div className='flex-grow h-px bg-[var(--color-3)]'></div>
      </div>
      <i className='opacity-75'>
        *Maks. @File Upload <b>98 MB</b>- File yang diijinkan:{' '}
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
            <tr>
              <td></td>
              <td colSpan={7}>
                <b>PERENCANAAN</b>
              </td>
            </tr>
            {/* 1 */}
            <tr>
              <td className='text-center'>1</td>
              <td>
                <b>PMK (Alokasi dan Pedoman Umum)</b>
              </td>
              <td>
                <div>
                  <InputFile
                    id='berkas1'
                    accept='.doc,.docx,.xls,.xlsx,.pdf'
                    onChange={(e) => console.log(e.target.files?.[0])}
                  />
                </div>
              </td>
              <td></td>
              <td>
                <InputTextArea id='waktu_berkas1' placeholder='Waktu...' />
              </td>
              <td>
                <InputTextArea id='ket_berkas1' placeholder='Keterangan...' />
              </td>
              <td></td>
              <td></td>
            </tr>
            {/* 2 */}
            <tr>
              <td className='text-center'>2</td>
              <td>
                <b>Petunjuk Teknis (Juknis)</b>
              </td>
              <td>
                <div>
                  <InputFile
                    id='berkas2'
                    accept='.doc,.docx,.xls,.xlsx,.pdf'
                    onChange={(e) => console.log(e.target.files?.[0])}
                  />
                </div>
              </td>
              <td></td>
              <td>
                <InputTextArea id='waktu_berkas2' placeholder='Waktu...' />
              </td>
              <td>
                <InputTextArea id='ket_berkas2' placeholder='Keterangan...' />
              </td>
              <td></td>
              <td></td>
            </tr>
            {/* 3 */}
            <tr>
              <td className='text-center'>3</td>
              <td>
                <b>Penyusunan Rencana Kerja dan Anggaran SKPD</b>
              </td>
              <td>
                <div>
                  <InputFile
                    id='berkas3'
                    accept='.doc,.docx,.xls,.xlsx,.pdf'
                    onChange={(e) => console.log(e.target.files?.[0])}
                  />
                </div>
              </td>
              <td></td>
              <td>
                <InputTextArea id='waktu_berkas3' placeholder='Waktu...' />
              </td>
              <td>
                <InputTextArea id='ket_berkas3' placeholder='Keterangan...' />
              </td>
              <td></td>
              <td></td>
            </tr>
            {/* 4 */}
            <tr>
              <td className='text-center'>4</td>
              <td>
                <b>Penetapan DPA - SKPD</b>
              </td>
              <td>
                <div>
                  <InputFile
                    id='berkas4'
                    accept='.doc,.docx,.xls,.xlsx,.pdf'
                    onChange={(e) => console.log(e.target.files?.[0])}
                  />
                </div>
              </td>
              <td></td>
              <td>
                <InputTextArea id='waktu_berkas4' placeholder='Waktu...' />
              </td>
              <td>
                <InputTextArea id='ket_berkas4' placeholder='Keterangan...' />
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td colSpan={7}>
                <b>PELAKSANAAN</b>
              </td>
            </tr>
            {/* 5 */}
            <tr>
              <td className='text-center'>5</td>
              <td>
                <b>SK Penetapan Pelaksanaan Kegiatan</b>
              </td>
              <td>
                <div>
                  <InputFile
                    id='berkas5'
                    accept='.doc,.docx,.xls,.xlsx,.pdf'
                    onChange={(e) => console.log(e.target.files?.[0])}
                  />
                </div>
              </td>
              <td></td>
              <td>
                <InputTextArea id='waktu_berkas5' placeholder='Waktu...' />
              </td>
              <td>
                <InputTextArea id='ket_berkas5' placeholder='Keterangan...' />
              </td>
              <td></td>
              <td></td>
            </tr>
            {/* 6 */}
            <tr>
              <td className='text-center'>6</td>
              <td>
                <b>Pelaksanaan Tender Pekerjaan Kontrak</b>
              </td>
              <td>
                <div>
                  <InputFile
                    id='berkas6'
                    accept='.doc,.docx,.xls,.xlsx,.pdf'
                    onChange={(e) => console.log(e.target.files?.[0])}
                  />
                </div>
              </td>
              <td></td>
              <td>
                <InputTextArea id='waktu_berkas6' placeholder='Waktu...' />
              </td>
              <td>
                <InputTextArea id='ket_berkas6' placeholder='Keterangan...' />
              </td>
              <td></td>
              <td></td>
            </tr>
            {/* 7 */}
            <tr>
              <td className='text-center'>7</td>
              <td>
                <b>Persiapan Pekerjaan Swakelola</b>
              </td>
              <td>
                <div>
                  <InputFile
                    id='berkas7'
                    accept='.doc,.docx,.xls,.xlsx,.pdf'
                    onChange={(e) => console.log(e.target.files?.[0])}
                  />
                </div>
              </td>
              <td></td>
              <td>
                <InputTextArea id='waktu_berkas7' placeholder='Waktu...' />
              </td>
              <td>
                <InputTextArea id='ket_berkas7' placeholder='Keterangan...' />
              </td>
              <td></td>
              <td></td>
            </tr>
            {/* 8 */}
            <tr>
              <td className='text-center'>8</td>
              <td>
                <b>Pelaksanaan Pekerjaan Kontrak</b>
              </td>
              <td>
                <div>
                  <InputFile
                    id='berkas8'
                    accept='.doc,.docx,.xls,.xlsx,.pdf'
                    onChange={(e) => console.log(e.target.files?.[0])}
                  />
                </div>
              </td>
              <td></td>
              <td>
                <InputTextArea id='waktu_berkas8' placeholder='Waktu...' />
              </td>
              <td>
                <InputTextArea id='ket_berkas8' placeholder='Keterangan...' />
              </td>
              <td></td>
              <td></td>
            </tr>
            {/* 9 */}
            <tr>
              <td className='text-center'>9</td>
              <td>
                <b>Pelaksanaan Pekerjaan Swakelola</b>
              </td>
              <td>
                <div>
                  <InputFile
                    id='berkas9'
                    accept='.doc,.docx,.xls,.xlsx,.pdf'
                    onChange={(e) => console.log(e.target.files?.[0])}
                  />
                </div>
              </td>
              <td></td>
              <td>
                <InputTextArea id='waktu_berkas9' placeholder='Waktu...' />
              </td>
              <td>
                <InputTextArea id='ket_berkas9' placeholder='Keterangan...' />
              </td>
              <td></td>
              <td></td>
            </tr>
            {/* 10 */}
            <tr>
              <td className='text-center'>10</td>
              <td>
                <b>Penerbitan Surat Permintaan Pembayaran (SPP)</b>
              </td>
              <td>
                <div>
                  <InputFile
                    id='berkas10'
                    accept='.doc,.docx,.xls,.xlsx,.pdf'
                    onChange={(e) => console.log(e.target.files?.[0])}
                  />
                </div>
              </td>
              <td></td>
              <td>
                <InputTextArea id='waktu_berkas10' placeholder='Waktu...' />
              </td>
              <td>
                <InputTextArea id='ket_berkas10' placeholder='Keterangan...' />
              </td>
              <td></td>
              <td></td>
            </tr>
            {/* 11 */}
            <tr>
              <td className='text-center'>11</td>
              <td>
                <b>Penerbitan Surat Perintah Membayar (SPM)</b>
              </td>
              <td>
                <div>
                  <InputFile
                    id='berkas11'
                    accept='.doc,.docx,.xls,.xlsx,.pdf'
                    onChange={(e) => console.log(e.target.files?.[0])}
                  />
                </div>
              </td>
              <td></td>
              <td>
                <InputTextArea id='waktu_berkas11' placeholder='Waktu...' />
              </td>
              <td>
                <InputTextArea id='ket_berkas11' placeholder='Keterangan...' />
              </td>
              <td></td>
              <td></td>
            </tr>
            {/* 12 */}
            <tr>
              <td className='text-center'>12</td>
              <td>
                <b>Penerbitan Surat Perintah Pencairan Dana (SP2D)</b>
              </td>
              <td>
                <div>
                  <InputFile
                    id='berkas12'
                    accept='.doc,.docx,.xls,.xlsx,.pdf'
                    onChange={(e) => console.log(e.target.files?.[0])}
                  />
                </div>
              </td>
              <td></td>
              <td>
                <InputTextArea id='waktu_berkas12' placeholder='Waktu...' />
              </td>
              <td>
                <InputTextArea id='ket_berkas12' placeholder='Keterangan...' />
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChecklistDokumenKegiatan;
