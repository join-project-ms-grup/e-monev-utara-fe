import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { FlatRKPDRow } from '../RKPDService';
import { waktuNowGabung } from '../../lib/helper';

/**
 * Export RKPD mimic dari file sumber.
 *
 * Data dapat berupa:
 *  - Array of objects: keys cocok dengan headerKeys array (lihat mapping di bawah)
 *  - Array of arrays: setiap item array ditulis langsung mulai dari kolom A
 *
 * @param data array data
 * @param tahun string tahun (mis. '2025')
 * @param opts.startRow (optional) baris mulai data (default 13)
 */
export const exportRKPD = async (
  data: FlatRKPDRow[],
  tahun: string,
  skpd: string,
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
  let subKegiatanIndex = 1;

  data.forEach((item) => {
    const startItemRow = rowIndex;
    const indikatorCount = item.indikator?.length || 0;

    const row = worksheet.getRow(startItemRow);

    // Nomor urut hanya untuk sub_kegiatan
    if (item.level === 'sub_kegiatan') row.getCell('A').value = subKegiatanIndex++;

    // Alignment dasar
    row.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((col) => {
      row.getCell(col).alignment = { vertical: 'top', horizontal: 'center' };
    });

    // Parsing kode fleksibel
    const kodeParts = (item.kode ?? '').toString().split(' ');
    switch (item.level) {
      case 'urusan':
        row.getCell('C').value = kodeParts[0];
        break;
      case 'bidang':
        row.getCell('C').value = kodeParts[0];
        row.getCell('D').value = kodeParts[1];
        break;
      case 'program':
        row.getCell('C').value = kodeParts[0];
        row.getCell('D').value = kodeParts[1];
        row.getCell('E').value = kodeParts[2];
        break;
      case 'kegiatan':
        row.getCell('C').value = kodeParts[0];
        row.getCell('D').value = kodeParts[1];
        row.getCell('E').value = kodeParts[2];
        row.getCell('F').value = kodeParts.slice(3).join(' ');
        break;
      case 'sub_kegiatan':
        row.getCell('C').value = kodeParts[0];
        row.getCell('D').value = kodeParts[1];
        row.getCell('E').value = kodeParts[2];
        row.getCell('F').value = kodeParts[3];
        row.getCell('G').value = kodeParts.slice(4).join(' ');
        break;
    }

    // Nama urusan/bidang/program/kegiatan/sub_kegiatan di kolom H
    row.getCell('H').value = item.name;

    if (indikatorCount > 0) {
      item.indikator?.forEach((ind) => {
        const indRow = worksheet.getRow(rowIndex++);

        // Kolom I → nama indikator
        indRow.getCell('I').value = ind.name;

        // ==== Kolom K (angka) ====
        indRow.getCell('J').value = ind.target_akhir_periode ?? 0;
        indRow.getCell('N').value = ind.target_tahun_dievaluasi ?? 0;
        ['P', 'R', 'T', 'V'].forEach((col, i) => {
          indRow.getCell(col).value = ind.triwulan?.[i]?.capaian ?? 0;
        });
        indRow.getCell('X').value = ind.total_capaian ?? 0;
        indRow.getCell('AB').value = ind.total_capaian_periode ?? 0;

        // ==== Kolom Rp ====
        indRow.getCell('K').value = item.pagu?.paguPeriode ?? 0;
        indRow.getCell('M').value = 0;
        indRow.getCell('O').value = item.pagu?.paguTahunEval ?? 0;
        ['Q', 'S', 'U', 'W'].forEach((col, i) => {
          indRow.getCell(col).value = Number(item.pagu?.triwulan?.[i]?.realisasi ?? 0);
        });
        indRow.getCell('Y').value = item.pagu?.totalRealisasi ?? 0;
        indRow.getCell('AA').value = Number(item.pagu?.persenRealisasi ?? 0);
        indRow.getCell('AC').value = Number(item.pagu?.persenRealisasiPeriode ?? 0);
        indRow.getCell('AD').value = skpd;

        // Format angka/persen
        const satuan = ind.satuan ?? '';
        const numFmtK = satuan.includes('%') ? '0.00 "%"' : 'General';
        ['J', 'N', 'P', 'R', 'T', 'V', 'X', 'AB'].forEach((col) => {
          indRow.getCell(col).numFmt = numFmtK;
        });

        const fmtRupiah = '"Rp"* #,##0.00;[<0]"Rp"* "-"#,##0.00;"Rp"* "0"';
        ['K', 'M', 'O', 'Q', 'S', 'U', 'W', 'Y', 'AA', 'AC'].forEach((col) => {
          indRow.getCell(col).numFmt = fmtRupiah;
        });
      });


      // Merge cell kolom A–H jika ada lebih dari 1 indikator
      const endItemRow = rowIndex - 1;
      if (indikatorCount > 1) {
        ['A', 'C', 'D', 'E', 'F', 'G', 'H'].forEach((col) => {
          worksheet.mergeCells(`${col}${startItemRow}:${col}${endItemRow}`);
        });
      }
    } else {
      rowIndex++; // jika tidak ada indikator, pindah row
    }
  });


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
    'Disusun';
  worksheet.mergeCells(`AC${rowIndex + 9}:AD${rowIndex + 9}`);
  worksheet.getRow(rowIndex + 9).getCell('AC').value =
    '......................, tanggal ...................';
  worksheet.mergeCells(`AC${rowIndex + 10}:AD${rowIndex + 10}`);
  worksheet.getRow(rowIndex + 10).getCell('AC').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 10).getCell('AC').value =
    'KEPALA BAPPEDA';
  worksheet.mergeCells(`AC${rowIndex + 11}:AD${rowIndex + 11}`);
  worksheet.getRow(rowIndex + 11).getCell('AC').value =
    'KABUPATEN/KOTA ....................................';
  worksheet.mergeCells(`AC${rowIndex + 16}:AD${rowIndex + 16}`);
  worksheet.getRow(rowIndex + 16).getCell('AC').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 16).getCell('AC').value =
    '(....................................)';

  worksheet.mergeCells(`Z${rowIndex + 8}:AA${rowIndex + 8}`);
  worksheet.getRow(rowIndex + 8).getCell('Z').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 8).getCell('Z').value =
    'Disetujui';
  worksheet.mergeCells(`Z${rowIndex + 9}:AA${rowIndex + 9}`);
  worksheet.getRow(rowIndex + 9).getCell('Z').value =
    '......................, tanggal ...................';
  worksheet.mergeCells(`Z${rowIndex + 10}:AA${rowIndex + 10}`);
  worksheet.getRow(rowIndex + 10).getCell('Z').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 10).getCell('Z').value =
    'GUBERNUR';
  worksheet.mergeCells(`Z${rowIndex + 11}:AA${rowIndex + 11}`);
  worksheet.getRow(rowIndex + 11).getCell('Z').value =
    'PROVINSI ....................................';
  worksheet.mergeCells(`Z${rowIndex + 16}:AA${rowIndex + 16}`);
  worksheet.getRow(rowIndex + 16).getCell('Z').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 16).getCell('Z').value =
    '(....................................)';
  //#endregion

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `Laporan Evaluasi Terhadap RKPD Kabupaten Bengkulu Utara Tahun ${tahun} ${waktuNowGabung}.xlsx`);
};