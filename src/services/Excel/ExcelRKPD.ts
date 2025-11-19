import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { numOrEmpty, renderSatuan, waktuNowGabung } from '../../lib/helper';
import type { FlatRKPDTriwulan } from '../RKPDService';
import type { CatatanForm } from '../CatatanService';

/**
 * Export RKPD.
 *
 * @param data array data FlatRKPDRow[]
 * @param tahun string tahun (mis. '2025')
 * @param opts.startRow (optional) baris mulai data (default 13)
 */
export const exportRKPD = async (
  data: FlatRKPDTriwulan[],
  skpd: string,
  tahun: string,
  catatan: CatatanForm,
  opts?: { startRow?: number },
) => {
  const startRow = opts?.startRow ?? 13;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Evaluasi RKPD');

  const merges = [
    'A2:AD2',
    'A3:AD3',
    'A4:AD4',
    'A7:AD7',
    'A8:AD8',
    'A9:A10', 'A11:A12',
    'B9:B10', 'B11:B12',
    'C9:C10', 'C11:C12',
    'D9:D10', 'D11:D12',
    'E9:E10', 'E11:E12',
    'F9:G10', 'F11:G11',
    'H9:I10', 'H11:I11',
    'J9:K10', 'J11:K:11',
    'L9:S9', 'L10:M10', 'L11:M11', 'N10:O10', 'N11:011', 'P10:Q10', 'P11:Q11', 'R10:S10', 'R11:S11',
    'T9:U10', 'T11:U11',
    'V9:W10', 'W11:W11',
    'X9:Y10', 'X11:Y11', 'Z9:Z10', 'Z11:Z12'
  ];
  merges.forEach((m) => {
    try { worksheet.mergeCells(m); } catch (e) { }
  });

  const widthMap: Record<string, number> = {
    A: 5, B: 20, C: 25, D: 40, E: 40, F: 30, G: 30,
    H: 30, I: 30, J: 30, K: 30, L: 30, M: 30,
    N: 30, O: 30, P: 30, Q: 30, R: 30, S: 30,
    T: 30, U: 30, V: 30, W: 30, X: 30, Y: 30, Z: 30, AA: 30, AB: 30, AC: 30, AD: 30,
  };
  const colLetters = Object.keys(widthMap);
  colLetters.forEach((col, idx) => {
    worksheet.getColumn(idx + 1).width = widthMap[col];
  });

  const fixedCells: Array<{ addr: string; value: string; style?: Partial<ExcelJS.Style> }> = [
    { addr: 'A2', value: 'Evaluasi Terhadap Hasil RKPD' },
    { addr: 'A3', value: 'Kabupaten Bengkulu Utara' },
    { addr: 'A4', value: `Tahun ${tahun}` },
    { addr: 'A7', value: 'Sasaran Pembangunan Tahunan Kabupaten/kota:' },
    { addr: 'A8', value: '……………………………………………………………………………………………………………………' },

    { addr: 'A9', value: 'No' }, { addr: 'A11', value: '1' },

    { addr: 'B9', value: 'Sasaran' }, { addr: 'B11', value: '2' },

    { addr: 'C9', value: 'Kode' }, { addr: 'C11', value: '3' },

    { addr: 'D9', value: 'Urusan / Bidang Urusan Pemerintahan Daerah dan Program / Kegiatan / Sub Kegiatan' }, { addr: 'D11', value: '4' },

    { addr: 'E9', value: 'Indikator Kinerja Program (Outcome) / Kegiatan (output)' }, { addr: 'E11', value: '5' },

    { addr: 'F9', value: `Target RPJMD Kabupaten/kota pada Tahun ${tahun}\n(Akhir Periode RPJMD)` },
    { addr: 'F11', value: '6' }, { addr: 'F12', value: 'K' }, { addr: 'G12', value: 'Rp' },

    { addr: 'H9', value: 'Realisasi Capaian Kinerja RPJMD Kabupaten/kota sampai dengan RKPD Kabupaten/kota Tahun Lalu\n(n-2)' },
    { addr: 'H11', value: '7' }, { addr: 'H12', value: 'K' }, { addr: 'I12', value: 'Rp' },

    { addr: 'J9', value: 'Target Kinerja dan Anggaran RKPD Kabupaten/kota Tahun Berjalan (Tahun n-1) yang Dievaluasi' },
    { addr: 'J11', value: '8' }, { addr: 'J12', value: 'K' }, { addr: 'K12', value: 'Rp' },

    { addr: 'L9', value: 'Realisasi Kinerja Pada Triwulan' },
    { addr: 'L10', value: 'I' }, { addr: 'L11', value: '9' }, { addr: 'L12', value: 'K' }, { addr: 'M12', value: 'Rp' },
    { addr: 'N10', value: 'II' }, { addr: 'N11', value: '10' }, { addr: 'N12', value: 'K' }, { addr: 'O12', value: 'Rp' },
    { addr: 'P10', value: 'III' }, { addr: 'P11', value: '11' }, { addr: 'P12', value: 'K' }, { addr: 'Q12', value: 'Rp' },
    { addr: 'R10', value: 'IV' }, { addr: 'R11', value: '12' }, { addr: 'R12', value: 'K' }, { addr: 'S12', value: 'Rp' },

    { addr: 'T9', value: 'Realisasi Capaian Kinerja dan Anggaran RKPD Kabupaten/kota yang Dievaluasi' },
    { addr: 'T11', value: '13' }, { addr: 'T12', value: 'K' }, { addr: 'U12', value: 'Rp' },

    { addr: 'V9', value: `Realisasi Kinerja dan Anggaran RPJMD Kabupaten/kota s/d Tahun ${tahun})` },
    { addr: 'V11', value: '14 = 7 + 13' }, { addr: 'V12', value: 'K' }, { addr: 'W12', value: 'Rp' },

    { addr: 'X9', value: `Tingkat Capaian Kinerja dan Realisasi Anggaran RPJMD Kabupaten/kota s/d Tahun ${tahun}\n(%)` },
    { addr: 'X11', value: '15 = 14 / 6 x 100%' }, { addr: 'X12', value: 'K (%)' }, { addr: 'Y12', value: 'Rp (%)' },

    { addr: 'Z9', value: 'Perangkat Daerah Penanggung Jawab' }, { addr: 'Z11', value: '16' },
  ];

  fixedCells.forEach((c) => {
    const cell = worksheet.getCell(c.addr);
    cell.value = c.value;
    if (c.addr === 'A2' || c.addr === 'A3' || c.addr === 'A4') {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = { bold: true, size: 14 };
    }
  });

  ['A7', 'A8'].forEach((col) => {
    const cell = worksheet.getCell(col);
    cell.font = { bold: true };
  });

  for (let row = 9; row <= 12; row++) {
    const cols = worksheet.getRow(row);
    cols.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.font = { bold: true };
    });
  }

  //#region Mapping Data
  let rowIndex = startRow;
  data.forEach((item, idx) => {
    const row = worksheet.getRow(rowIndex);

    // 1
    row.getCell('A').value = idx + 1;
    row.getCell('A').alignment = { horizontal: 'center' }
    // 3
    row.getCell('C').value = item.kode;
    // 4
    row.getCell('D').value = item.name;
    // 5
    row.getCell('E').value = item.ind_name;
    // 6
    row.getCell('F').value = renderSatuan(item.ind_target_akhir_periode, item.ind_satuan);
    row.getCell('G').value = numOrEmpty(item.paguPeriode);
    // 7
    row.getCell('H').value = renderSatuan(item.total_capaian, item.ind_satuan);
    row.getCell('I').value = numOrEmpty(item.totalRealisasi);
    // 8
    row.getCell('J').value = renderSatuan(item.ind_target_tahun_dievaluasi, item.ind_satuan);
    row.getCell('K').value = numOrEmpty(item.paguTahunEval);
    // 9
    row.getCell('L').value = renderSatuan(item.ind_triwulan_capaian_1, item.ind_satuan);
    row.getCell('M').value = numOrEmpty(item.pagu_triwulan_realisasi_1);
    // 10
    row.getCell('N').value = renderSatuan(item.ind_triwulan_capaian_2, item.ind_satuan);
    row.getCell('O').value = numOrEmpty(item.pagu_triwulan_realisasi_2);
    // 11
    row.getCell('P').value = renderSatuan(item.ind_triwulan_capaian_3, item.ind_satuan);
    row.getCell('Q').value = numOrEmpty(item.pagu_triwulan_realisasi_3);
    // 12
    row.getCell('R').value = renderSatuan(item.ind_triwulan_capaian_4, item.ind_satuan);
    row.getCell('S').value = numOrEmpty(item.pagu_triwulan_realisasi_4);
    // 13
    row.getCell('T').value = renderSatuan(item.ind_triwulan_capaian_3, item.ind_satuan);
    row.getCell('U').value = numOrEmpty(item.pagu_triwulan_realisasi_3);
    // 14
    row.getCell('V').value = renderSatuan(item.total_capaian_periode, item.ind_satuan);
    row.getCell('W').value = numOrEmpty(item.totalRealisasiPeriode);
    // 15
    row.getCell('X').value = numOrEmpty(item.persen_capaian);
    row.getCell('X').numFmt = '0.00%';
    row.getCell('Y').value = numOrEmpty(item.persenRealisasi);
    row.getCell('Y').numFmt = '0.00%';
    // 16
    row.getCell('Z').value = skpd;

    const fmtRupiah = '"Rp"* #,##0.00;[<0]"Rp"* "-"#,##0.00;"Rp"* "0"';
    ['G', 'I', 'K', 'M', 'O', 'Q', 'S', 'U', 'W'].forEach((col) => {
      row.getCell(col).numFmt = fmtRupiah;
    });

    ['C', 'D', 'Y',].forEach((col) => {
      row.getCell(col).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    });

    rowIndex++;
  });

  const lastRow = rowIndex;
  const startCol = 1;
  const endCol = 26;

  for (let r = startRow - 4; r <= lastRow; r++) {
    const row = worksheet.getRow(r);
    for (let c = startCol; c <= endCol; c++) {
      const cell = row.getCell(c);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  }

  const rowsConfig = [
    { offset: 1, merge: 'A:O', text: 'Rata-rata capaian kinerja (%)', align: 'right' },
    { offset: 2, merge: 'A:O', text: 'Predikat kinerja', align: 'right' },
    { offset: 3, merge: 'A:AD', text: `Faktor pendorong keberhasilan kinerja: ${catatan.pendorong}` },
    { offset: 4, merge: 'A:AD', text: `Faktor penghambat pencapaian kinerja: ${catatan.penghambat}` },
    { offset: 5, merge: 'A:AD', text: `Tindak lanjut yang diperlukan dalam triwulan berikutnya: ${catatan.tl_1}` },
    { offset: 6, merge: 'A:AD', text: `Tindak lanjut yang diperlukan dalam RKPD berikutnya: ${catatan.tl_2}` }
  ];

  rowsConfig.forEach(({ offset, merge, text, align = 'left' }) => {
    const r = rowIndex + offset;
    worksheet.mergeCells(`${merge.replace(':', r + ':')}${r}`);
    const row = worksheet.getRow(r);
    const cell = row.getCell('A');
    cell.value = text;
    cell.alignment = { horizontal: align as any };
    cell.font = { bold: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  worksheet.mergeCells(`AC${rowIndex + 8}:AD${rowIndex + 8}`);
  worksheet.getRow(rowIndex + 8).getCell('AC').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 8).getCell('AC').value =
    'Disetujui';
  worksheet.mergeCells(`AC${rowIndex + 9}:AD${rowIndex + 9}`);
  worksheet.getRow(rowIndex + 9).getCell('AC').value =
    '......................, tanggal ...................';
  worksheet.mergeCells(`AC${rowIndex + 11}:AD${rowIndex + 11}`);
  worksheet.getRow(rowIndex + 11).getCell('AC').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 11).getCell('AC').value =
    'KEPALA SKPD';
  worksheet.mergeCells(`AC${rowIndex + 12}:AD${rowIndex + 12}`);
  worksheet.getRow(rowIndex + 12).getCell('AC').value =
    'KABUPATEN/KOTA ....................................';
  worksheet.mergeCells(`AC${rowIndex + 18}:AD${rowIndex + 18}`);
  worksheet.getRow(rowIndex + 18).getCell('AC').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 18).getCell('AC').value =
    '(....................................)';
  //#endregion

  // Semua font default menggunakan Bookman Old Style
  const defaultFont: Partial<ExcelJS.Font> = { name: 'Bookman Old Style' };

  // Terapkan font ke seluruh sheet (semua baris yang ada)
  worksheet.eachRow({ includeEmpty: true }, (row) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { ...defaultFont, ...(cell.font ?? {}) };
    });
  });

  // Baris 9-12, tambahkan background abu-abu dan center alignment
  for (let row = 9; row <= 12; row++) {
    const worksheetRow = worksheet.getRow(row);
    worksheetRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9D9D9' }, // abu-abu terang
      };
      cell.font = { ...defaultFont, bold: true };
    });
  }


  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `Laporan Evaluasi Terhadap RKPD Kabupaten Bengkulu Utara Tahun ${tahun} ${waktuNowGabung}.xlsx`);
};