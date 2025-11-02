import React from 'react'

const ChecklistDokumenKegiatan = () => {
  return (
<div>
  <div>
    <div>Checklist Dokumen dan Kegiatan Pelaksanaan (<span id="max_ket2">Maks. @File Upload <b>98 MB</b></span> - File yang diijinkan: <b>doc, docx, xls, xlsx, pdf</b>)</div>
    <div>
      <a href="#" data-rel="collapse"><i></i></a>
    </div>
  </div>

  <div>
    <table>
      <thead>
        <tr>
          <th style={{ textAlign: 'center', verticalAlign: 'middle', width: '1%', whiteSpace: 'nowrap' }}>No</th>
          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Kode Berkas</th>
          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Checklist</th>
          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Berkas</th>
          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Kesesuaian</th>
          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Waktu</th>
          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Keterangan</th>
          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Pesan Verifikasi</th>
          <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Tanggal & Jam Upload</th>
        </tr>
      </thead>

      <tbody id="tb_in_ceklist">
        <tr>
          <td></td>
          <td colSpan={8} style={{ textAlign: 'left', verticalAlign: 'middle' }}>
            <b>PERENCANAAN</b>
          </td>
        </tr>

        <tr>
          <td style={{ textAlign: 'center', verticalAlign: 'middle', width: '1%', whiteSpace: 'nowrap' }}>1</td>
          <td style={{ textAlign: 'center', verticalAlign: 'middle', width: '1%', whiteSpace: 'nowrap' }}>1</td>
          <td style={{ textAlign: 'left', verticalAlign: 'middle' }}><b>PMK (Alokasi dan Pedoman Umum)</b></td>
          <td style={{ textAlign: 'center', verticalAlign: 'middle', width: '220px' }}>
            <input name="berkas1" type="file" id="berkas1" placeholder="Berkas Checklist..." />
          </td>
          <td style={{ textAlign: 'center', verticalAlign: 'middle' }}></td>
          <td style={{ textAlign: 'left', verticalAlign: 'middle', width: '150px' }}>
            <textarea
              name="waktu_berkas1"
              id="waktu_berkas1"
              placeholder="Waktu..."
              style={{ resize: 'vertical' }}
            />
          </td>
          <td style={{ textAlign: 'left', verticalAlign: 'middle', width: '150px' }}>
            <textarea
              name="ket_berkas1"
              id="ket_berkas1"
              placeholder="Keterangan..."
              style={{ resize: 'vertical' }}
            />
          </td>
          <td style={{ textAlign: 'left', verticalAlign: 'middle' }}></td>
          <td style={{ textAlign: 'center', verticalAlign: 'middle' }}></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

  )
}

export default ChecklistDokumenKegiatan