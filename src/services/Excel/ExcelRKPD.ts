import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { waktuNowGabung } from '../../lib/helper';
import type { FlatRKPD } from '../RKPDService';

/**
 * Export RKPD.
 *
 * @param data array data FlatRKPDRow[]
 * @param tahun string tahun (mis. '2025')
 * @param opts.startRow (optional) baris mulai data (default 13)
 */
export const exportRKPD = async (
  data: FlatRKPD[],
  tahun: string,
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
    'C9:G10', 'C11:G12',
    'H9:H10', 'H11:H12',
    'I9:I10', 'I11:I12',
    'J9:K10', 'J11:K11',
    'L9:M10', 'L11:M11',
    'N9:O10', 'N11:O11',
    'P9:W9', 'P10:Q10', 'R10:S10', 'T10:U10', 'V10:W10', 'P11:Q11', 'R11:S11', 'T11:U11', 'V11:W11',
    'X9:Y10', 'X11:Y11',
    'Z9:AA10', 'Z11:AA11',
    'AB9:AC10', 'AB11:AC11',
    'AD9:AD10', 'AD11:AD12'
  ];
  merges.forEach((m) => {
    try { worksheet.mergeCells(m); } catch (e) { }
  });

  const widthMap: Record<string, number> = {
    A: 5, B: 20, C: 5, D: 5, E: 5, F: 5, G: 5,
    H: 30, I: 30, J: 20, K: 20, L: 20, M: 20,
    N: 20, O: 20, P: 20, Q: 20, R: 20, S: 20,
    T: 20, U: 20, V: 20, W: 20, X: 20, Y: 20,
    Z: 20, AA: 20, AB: 20, AC: 20, AD: 30
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

    { addr: 'H9', value: 'Urusan / Bidang Urusan Pemerintahan Daerah dan Program / Kegiatan / Sub Kegiatan' }, { addr: 'H11', value: '4' },

    { addr: 'I9', value: 'Indikator Kinerja Program (Outcome) / Kegiatan (output)' }, { addr: 'I11', value: '5' },

    { addr: 'J9', value: `Target RPJMD Kabupaten/kota pada Tahun ${tahun}\n(Akhir Periode RPJMD)` },
    { addr: 'J11', value: '6' }, { addr: 'J12', value: 'K' }, { addr: 'K12', value: 'Rp' },

    { addr: 'L9', value: 'Realisasi Capaian Kinerja RPJMD Kabupaten/kota sampai dengan RKPD Kabupaten/kota Tahun Lalu\n(n-2)' },
    { addr: 'L11', value: '7' }, { addr: 'L12', value: 'K' }, { addr: 'M12', value: 'Rp' },

    { addr: 'N9', value: 'Target Kinerja dan Anggaran RKPD Kabupaten/kota Tahun Berjalan (Tahun n-1) yang Dievaluasi' },
    { addr: 'N11', value: '8' }, { addr: 'N12', value: 'K' }, { addr: 'O12', value: 'Rp' },

    { addr: 'P9', value: 'Realisasi Kinerja Pada Triwulan' },
    { addr: 'P10', value: 'I' }, { addr: 'P11', value: '9' }, { addr: 'P12', value: 'K' }, { addr: 'Q12', value: 'Rp' },
    { addr: 'R10', value: 'II' }, { addr: 'R11', value: '10' }, { addr: 'R12', value: 'K' }, { addr: 'S12', value: 'Rp' },
    { addr: 'T10', value: 'III' }, { addr: 'T11', value: '11' }, { addr: 'T12', value: 'K' }, { addr: 'U12', value: 'Rp' },
    { addr: 'V10', value: 'IV' }, { addr: 'V11', value: '12' }, { addr: 'V12', value: 'K' }, { addr: 'W12', value: 'Rp' },

    { addr: 'X9', value: 'Realisasi Capaian Kinerja dan Anggaran RKPD Kabupaten/kota yang Dievaluasi' },
    { addr: 'X11', value: '13' }, { addr: 'X12', value: 'K' }, { addr: 'Y12', value: 'Rp' },

    { addr: 'Z9', value: `Realisasi Kinerja dan Anggaran RPJMD Kabupaten/kota s/d Tahun ${tahun})` },
    { addr: 'Z11', value: '14 = 7 + 13' }, { addr: 'Z12', value: 'K (%)' }, { addr: 'AA12', value: 'Rp (%)' },

    { addr: 'AB9', value: `Tingkat Capaian Kinerja dan Realisasi Anggaran RPJMD Kabupaten/kota s/d Tahun ${tahun}\n(%)` },
    { addr: 'AB11', value: '15 = 14 / 6 x 100%' }, { addr: 'AB12', value: 'K' }, { addr: 'AC12', value: 'Rp' },

    { addr: 'AD9', value: 'Perangkat Daerah Penanggung Jawab' }, { addr: 'AD11', value: '16' },
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
  let nomorUrut = 1;
  // let subKegiatanIndex = 1;

  // 1️⃣ Kelompokkan data berdasarkan rekening
  const groupedByRekening: Record<string, typeof data> = {};
  for (const item of data) {
    if (!groupedByRekening[item.rekening]) groupedByRekening[item.rekening] = [];
    groupedByRekening[item.rekening].push(item);
  }

  // 2️⃣ Iterasi setiap kelompok rekening
  for (const [rekening, group] of Object.entries(groupedByRekening)) {
    const startMergeRow = rowIndex; // baris pertama dari kelompok ini

    for (const item of group) {
      const row = worksheet.getRow(rowIndex++);

      row.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

      // if (item.level === 'sub_kegiatan') row.getCell('A').value = subKegiatanIndex++;
      row.getCell('A').value = nomorUrut++;
      row.getCell('A').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('B').value = item.sasaran;
      row.getCell('C').value = item.kode_urusan;
      row.getCell('D').value = item.kode_bidang;
      row.getCell('E').value = item.kode_program;
      row.getCell('F').value = item.kode_kegiatan;
      row.getCell('G').value = item.kode_subKegiatan;
      row.getCell('H').value = item.rekening;
      row.getCell('I').value = item.indikator_kinerja;

      // Jangan render angka kalau urusan/bidang
      if (item.level !== 'urusan' && item.level !== 'bidang') {
        row.getCell('J').value = Number(item.target_rpjmd_kinerja);
        row.getCell('K').value = Number(item.target_rpjmd_anggaran);
        row.getCell('L').value = Number(item.realisasi_rpjmd_kinerja);
        row.getCell('M').value = Number(item.realisasi_rpjmd_anggaran);

        row.getCell('N').value = Number(item.target_rkpd_kinerja);
        row.getCell('O').value = Number(item.target_rkpd_anggaran);

        row.getCell('P').value = Number(item.realisasi_triwulan_I_kinerja);
        row.getCell('Q').value = Number(item.realisasi_triwulan_I_anggaran);
        row.getCell('R').value = Number(item.realisasi_triwulan_II_kinerja);
        row.getCell('S').value = Number(item.realisasi_triwulan_II_anggaran);
        row.getCell('T').value = Number(item.realisasi_triwulan_III_kinerja);
        row.getCell('U').value = Number(item.realisasi_triwulan_III_anggaran);
        row.getCell('V').value = Number(item.realisasi_triwulan_IV_kinerja);
        row.getCell('W').value = Number(item.realisasi_triwulan_IV_anggaran);

        row.getCell('X').value = Number(item.realisasi_rkpd_kinerja);
        row.getCell('Y').value = Number(item.realisasi_rkpd_anggaran);

        row.getCell('Z').value = Number(item.realisasi_rpjmd_sd_tahun_kinerja);
        row.getCell('AA').value = Number(item.realisasi_rpjmd_sd_tahun_anggaran);

        row.getCell('AB').value = Number(item.tingkat_capaian_rpjmd_kinerja);
        row.getCell('AC').value = Number(item.tingkat_capaian_rpjmd_anggaran);
      }

      row.getCell('AD').value = item.perangkat_daerah;

      const satuan = item.satuan ?? '';
      const numFmtK = satuan.includes('%') ? '0.00 "%"' : 'General';
      ['J', 'N', 'P', 'R', 'T', 'V', 'X', 'AB'].forEach((col) => {
        row.getCell(col).numFmt = numFmtK;
      });

      const fmtRupiah = '"Rp"* #,##0.00;[<0]"Rp"* "-"#,##0.00;"Rp"* "0"';
      ['K', 'M', 'O', 'Q', 'S', 'U', 'W', 'Y', 'AA', 'AC'].forEach((col) => {
        row.getCell(col).numFmt = fmtRupiah;
      });

      if (item.level === 'urusan' || item.level === 'bidang') {
        ['C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
          row.getCell(col).font = { bold: true };
        });
      }
      ['C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
        row.getCell(col).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
      });
    }

    const endMergeRow = rowIndex - 1; // baris terakhir dari kelompok ini

    // 3️⃣ Merge sel untuk kolom "kode" (C–G) dan "rekening" (H)
    worksheet.mergeCells(`C${startMergeRow}:C${endMergeRow}`);
    worksheet.mergeCells(`D${startMergeRow}:D${endMergeRow}`);
    worksheet.mergeCells(`E${startMergeRow}:E${endMergeRow}`);
    worksheet.mergeCells(`F${startMergeRow}:F${endMergeRow}`);
    worksheet.mergeCells(`G${startMergeRow}:G${endMergeRow}`);
    worksheet.mergeCells(`H${startMergeRow}:H${endMergeRow}`);
  }


  const lastRow = rowIndex;
  const startCol = 1;
  const endCol = 30;

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
    { offset: 3, merge: 'A:AD', text: 'Faktor pendorong keberhasilan kinerja:' },
    { offset: 4, merge: 'A:AD', text: 'Faktor penghambat pencapaian kinerja:' },
    { offset: 5, merge: 'A:AD', text: 'Tindak lanjut yang diperlukan dalam triwulan berikutnya:' },
    { offset: 6, merge: 'A:AD', text: 'Tindak lanjut yang diperlukan dalam RKPD berikutnya:' }
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
    'BUPATI/WALI KOTA';
  worksheet.mergeCells(`AC${rowIndex + 12}:AD${rowIndex + 12}`);
  worksheet.getRow(rowIndex + 12).getCell('AC').value =
    'KABUPATEN/KOTA ....................................';
  worksheet.mergeCells(`AC${rowIndex + 18}:AD${rowIndex + 18}`);
  worksheet.getRow(rowIndex + 18).getCell('AC').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 18).getCell('AC').value =
    '(....................................)';

  worksheet.mergeCells(`Z${rowIndex + 8}:AA${rowIndex + 8}`);
  worksheet.getRow(rowIndex + 8).getCell('Z').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 8).getCell('Z').value =
    'Disusun';
  worksheet.mergeCells(`Z${rowIndex + 9}:AA${rowIndex + 9}`);
  worksheet.getRow(rowIndex + 9).getCell('Z').value =
    '......................, tanggal ...................';
  worksheet.mergeCells(`Z${rowIndex + 11}:AA${rowIndex + 11}`);
  worksheet.getRow(rowIndex + 11).getCell('Z').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 11).getCell('Z').value =
    'KEPALA BAPPEDA';
  worksheet.mergeCells(`Z${rowIndex + 12}:AA${rowIndex + 12}`);
  worksheet.getRow(rowIndex + 12).getCell('Z').value =
    'PROVINSI ....................................';
  worksheet.mergeCells(`Z${rowIndex + 18}:AA${rowIndex + 18}`);
  worksheet.getRow(rowIndex + 18).getCell('Z').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 18).getCell('Z').value =
    '(....................................)';
  //#endregion

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `Laporan Evaluasi Terhadap RKPD Kabupaten Bengkulu Utara Tahun ${tahun} ${waktuNowGabung}.xlsx`);
};