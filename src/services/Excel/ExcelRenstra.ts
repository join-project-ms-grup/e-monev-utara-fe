import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { waktuNowGabung } from '../../lib/helper';
import { getPeriodeAkhirFromCookie, getPeriodeMulaiFromCookie } from '../../lib/usercookie';
import type { FlatRenstraRow } from '../RenstraService';

/**
 * Export RKPD mimic dari file sumber.
 *
 * Data dapat berupa:
 *  - Array of objects: keys cocok dengan headerKeys array (lihat mapping di bawah)
 *  - Array of arrays: setiap item array ditulis langsung mulai dari kolom A
 *
 * @param data array data
 * @param tahun string tahun (mis. '2025')
 * @param opts.startRow (optional) baris mulai data (default 15)
 */
export const exportRenstra = async (
  data: FlatRenstraRow[],
  skpd: string,
  opts?: { startRow?: number },
) => {
  const startRow = opts?.startRow ?? 15;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Worksheet');

  const merges = [
    'A2:AL2', 'A3:AL3', 'A4:AL4', 'A7:AL7', 'A8:AL8',

    'A10:A11', 'A12:A13',
    'B10:B11', 'B12:B13',
    'C10:C11', 'C12:C13',
    'D10:D11', 'D12:D13',
    'E10:E11', 'E12:E13',
    'F10:G11', 'F12:G12',
    'H10:Q10', 'H11:I11', 'J11:K11', 'L11:M11', 'N11:O11', 'P11:Q11', 'H12:I12', 'J12:K12', 'L12:M12', 'N12:O12', 'P12:Q12',
    'R10:AA10', 'R11:S11', 'T11:U11', 'V11:W11', 'X11:Y11', 'Z11:AA11', 'R12:S12', 'T12:U12', 'V12:W12', 'X12:Y12', 'Z12:AA12',
    'AB10:AK10', 'AB11:AC11', 'AD11:AE11', 'AF11:AG11', 'AH11:AI11', 'AJ11:AK11', 'AB12:AC12', 'AD12:AE12', 'AF12:AG12', 'AH12:AI12', 'AJ12:AK12',
    'AL10:AL11', 'AL12:AL13'
  ];
  merges.forEach((m) => {
    try { worksheet.mergeCells(m); } catch (e) { }
  });

  [
    { col: 'A2', value: 'Evaluasi Terhadap Hasil Renstra Perangkat Daerah Lingkup Kabupaten/kota' },
    { col: 'A3', value: `Renstra Perangkat Daerah ${skpd} Kabupaten Bengkulu Utara` },
    { col: 'A4', value: `Periode ${getPeriodeMulaiFromCookie()} - ${getPeriodeAkhirFromCookie()}` },
    { col: 'A7', value: 'Indikator dan target Kinerja Perangkat Daerah Kabupaten/Kota yang mengacu pada Sasaran RPJMD Kabupaten/Kota:' },
    { col: 'A8', value: '..............................................................................................................' },

    { col: 'A10', value: 'No' }, { col: 'A12', value: '1' },

    { col: 'B10', value: 'Sasaran' }, { col: 'B12', value: '2' },

    { col: 'C10', value: 'Program / Kegiatan' }, { col: 'C12', value: '3' },

    { col: 'D10', value: 'Indikator Kinerja Program (Outcome) / Kegiatan (Output) / Sub Kegiatan (Output)' }, { col: 'D12', value: '4' },

    { col: 'E10', value: 'Data Capaian Pada Awal Tahun Perencanaan' }, { col: 'E12', value: '5' },

    { col: 'F10', value: 'Target Capaian pada Akhir Tahun Perencanaan' }, { col: 'F12', value: '6' },
    { col: 'F13', value: 'K' }, { col: 'G13', value: 'Rp' },

    { col: 'H10', value: 'Target Renstra Perangkat Daerah kabupaten/kota Tahun ke-' },
    { col: 'H11', value: '1' }, { col: 'H12', value: '8' }, { col: 'H13', value: 'K' }, { col: 'I13', value: 'Rp' },
    { col: 'J11', value: '2' }, { col: 'J12', value: '9' }, { col: 'J13', value: 'K' }, { col: 'K13', value: 'Rp' },
    { col: 'L11', value: '3' }, { col: 'L12', value: '10' }, { col: 'L13', value: 'K' }, { col: 'M13', value: 'Rp' },
    { col: 'N11', value: '4' }, { col: 'N12', value: '11' }, { col: 'N13', value: 'K' }, { col: 'O13', value: 'Rp' },
    { col: 'P11', value: '5' }, { col: 'P12', value: '12' }, { col: 'P13', value: 'K' }, { col: 'Q13', value: 'Rp' },

    { col: 'R10', value: 'Realisasi Capaian Tahun ke-' },
    { col: 'R11', value: '1' }, { col: 'R12', value: '13' }, { col: 'R13', value: 'K' }, { col: 'S13', value: 'Rp' },
    { col: 'T11', value: '2' }, { col: 'T12', value: '14' }, { col: 'T13', value: 'K' }, { col: 'U13', value: 'Rp' },
    { col: 'V11', value: '3' }, { col: 'V12', value: '15' }, { col: 'V13', value: 'K' }, { col: 'W13', value: 'Rp' },
    { col: 'X11', value: '4' }, { col: 'X12', value: '16' }, { col: 'X13', value: 'K' }, { col: 'Y13', value: 'Rp' },
    { col: 'Z11', value: '5' }, { col: 'Z12', value: '17' }, { col: 'Z13', value: 'K' }, { col: 'AA13', value: 'Rp' },

    { col: 'AB10', value: 'Rasio Capaian pada Tahun ke-' },
    { col: 'AB11', value: '1' }, { col: 'AB12', value: '18' }, { col: 'AB13', value: 'K' }, { col: 'AC13', value: 'Rp' },
    { col: 'AD11', value: '2' }, { col: 'AD12', value: '19' }, { col: 'AD13', value: 'K' }, { col: 'AE13', value: 'Rp' },
    { col: 'AF11', value: '3' }, { col: 'AF12', value: '20' }, { col: 'AF13', value: 'K' }, { col: 'AG13', value: 'Rp' },
    { col: 'AH11', value: '4' }, { col: 'AH12', value: '21' }, { col: 'AH13', value: 'K' }, { col: 'AI13', value: 'Rp' },
    { col: 'AJ11', value: '5' }, { col: 'AJ12', value: '22' }, { col: 'AJ13', value: 'K' }, { col: 'AK13', value: 'Rp' },

    { col: 'AL10', value: 'Perangkat Daerah Penanggung Jawab' }, { col: 'AL12', value: '23' },
  ]
    .forEach((c) => {
      const cell = worksheet.getCell(c.col);
      cell.value = c.value;
    });

  ['A2', 'A3', 'A4'].forEach((col) => {
    const cell = worksheet.getCell(col);
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.font = { bold: true, size: 14 };
  });

  ['A7', 'A8'].forEach((col) => {
    const cell = worksheet.getCell(col);
    cell.font = { bold: true };
  });

  for (let row = 10; row <= 13; row++) {
    const cols = worksheet.getRow(row);
    cols.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.font = { bold: true };
    });
  }

  const widthMap: Record<string, number> = {
    A: 5, B: 20, C: 30, D: 30, E: 30, F: 20, G: 20,
    H: 20, I: 20, J: 20, K: 20, L: 20, M: 20,
    N: 20, O: 20, P: 20, Q: 20, R: 20, S: 20,
    T: 20, U: 20, V: 20, W: 20, X: 20, Y: 20,
    Z: 20, AA: 20, AB: 20, AC: 20, AD: 20, AE: 20,
    AF: 20, AG: 20, AH: 20, AI: 20, AJ: 20, AK: 20, AL: 35
  };
  const colLetters = Object.keys(widthMap);
  colLetters.forEach((col, idx) => {
    worksheet.getColumn(idx + 1).width = widthMap[col];
  });

  //#region Mapping Data
  let rowIndex = startRow;
  let noIndex = 1;

  const fmtRupiah = '"Rp"* #,##0.00;[<0]"Rp"* "-"#,##0.00;"Rp"* "0"';
  const targetRenstraCols: [string, string][] = [
    ['H', 'I'],
    ['J', 'K'],
    ['L', 'M'],
    ['N', 'O'],
    ['P', 'Q'],
  ];
  const realisasiCols: [string, string][] = [
    ['R', 'S'],
    ['T', 'U'],
    ['V', 'W'],
    ['X', 'Y'],
    ['Z', 'AA'],
  ];
  const rasioCols: [string, string][] = [
    ['AB', 'AC'],
    ['AD', 'AE'],
    ['AF', 'AG'],
    ['AH', 'AI'],
    ['AJ', 'AK'],
  ];

  data.forEach((item) => {
    const indikatorCount = item.indikator?.length ?? 0;

    if (indikatorCount > 0) {
      const startRowItem = rowIndex;

      item.indikator!.forEach((ind, idx) => {
        const row = worksheet.getRow(rowIndex++);
        row.alignment = { vertical: 'top', wrapText: true };

        // format satuan
        const satuan = ind.satuan ? ind.satuan.replace(/"/g, '').trim() : '';
        let numFmt = 'General';
        if (satuan) {
          if (satuan === '%' || satuan.toLowerCase().includes('persen')) numFmt = '0.00 "%"';
          else numFmt = `General "${satuan}"`;
        }

        if (idx === 0) row.getCell('A').value = noIndex;

        row.getCell('B').value = (item as any).sasaran ?? '';
        row.getCell('C').value = item.name ?? '';
        row.getCell('D').value = ind.name ?? '';
        row.getCell('E').value = ''; // kosong sesuai instruksi

        // Target akhir tahun
        row.getCell('F').value = isFinite(Number(ind.totalTarget)) ? Number(ind.totalTarget) : '';
        row.getCell('F').numFmt = numFmt;
        row.getCell('G').value = isFinite(Number(item.pagu?.totalPagu))
          ? Number(item.pagu?.totalPagu)
          : '';
        row.getCell('G').numFmt = fmtRupiah;

        // Target Renstra Tahun ke-1..5
        for (let t = 1; t <= 5; t++) {
          const [colK, colRp] = targetRenstraCols[t - 1];
          const targetObj = ind.target_per_tahun?.find((x) => x.tahun_ke === t);
          const paguObj = item.pagu?.pagu_per_tahun?.find((p) => p.tahun_ke === t);

          row.getCell(colK).value = isFinite(Number(targetObj?.target))
            ? Number(targetObj?.target)
            : '';
          row.getCell(colK).numFmt = numFmt;
          row.getCell(colRp).value = isFinite(Number(paguObj?.pagu))
            ? Number(paguObj?.pagu)
            : '';
          row.getCell(colRp).numFmt = fmtRupiah;
        }

        // Realisasi Tahun ke-1..5
        for (let t = 1; t <= 5; t++) {
          const [colK, colRp] = realisasiCols[t - 1];
          const realObj = ind.capaian_per_tahun?.find((x) => x.tahun_ke === t);
          const realPagu = item.pagu?.realisasi_per_tahun?.find((p) => p.tahun_ke === t);

          row.getCell(colK).value = isFinite(Number(realObj?.capaian))
            ? Number(realObj?.capaian)
            : '';
          row.getCell(colK).numFmt = numFmt;
          row.getCell(colRp).value = isFinite(Number(realPagu?.realisasi))
            ? Number(realPagu?.realisasi)
            : '';
          row.getCell(colRp).numFmt = fmtRupiah;
        }

        // Rasio Tahun ke-1..5
        for (let t = 1; t <= 5; t++) {
          const [colK, colRp] = rasioCols[t - 1];
          const rasioObj = ind.rasio_per_tahun?.find((x) => x.tahun_ke === t);
          const rasioPagu = item.pagu?.rasio_per_tahun?.find((p) => p.tahun_ke === t);

          row.getCell(colK).value = isFinite(Number(rasioObj?.rasio))
            ? Number(rasioObj?.rasio)
            : '';
          row.getCell(colK).numFmt = numFmt;
          row.getCell(colRp).value = isFinite(Number(rasioPagu?.rasio))
            ? Number(rasioPagu?.rasio)
            : '';
          row.getCell(colRp).numFmt = fmtRupiah;
        }

        row.getCell('AL').value = (item as any).skpd ?? '';
      });

      if (indikatorCount > 1) {
        const endRowItem = rowIndex - 1;
        ['A', 'B', 'C'].forEach((col) => {
          worksheet.mergeCells(`${col}${startRowItem}:${col}${endRowItem}`);
          const merged = worksheet.getCell(`${col}${startRowItem}`);
          merged.alignment = { vertical: 'top', horizontal: 'center', wrapText: true };
        });
      }

      noIndex++;
    } else {
      const row = worksheet.getRow(rowIndex++);
      row.alignment = { vertical: 'top', wrapText: true };
      row.getCell('A').value = noIndex++;
      row.getCell('B').value = (item as any).sasaran ?? '';
      row.getCell('C').value = item.name ?? '';
      row.getCell('AL').value = (item as any).skpd ?? '';
    }
  });

  const rowsConfig = [
    { offset: 1, merge: 'A:AF', text: 'Rata-rata capaian kinerja (%)', align: 'right' },
    { offset: 2, merge: 'A:AF', text: 'Predikat kinerja', align: 'right' },
    { offset: 3, merge: 'A:AL', text: 'Faktor pendorong pencapaian kinerja:' },
    { offset: 4, merge: 'A:AL', text: 'Faktor penghambat:' },
    { offset: 5, merge: 'A:AL', text: 'Usulan tindak lanjut pada Renja Perangkat Daerah kabupaten/kota berikutnya:' },
    { offset: 6, merge: 'A:AL', text: 'Usulan tindak lanjut pada Renstra Perangkat Daerah kabupaten/kota berikutnya:' }
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

  worksheet.mergeCells(`AK${rowIndex + 8}:AL${rowIndex + 8}`);
  worksheet.getRow(rowIndex + 8).getCell('AK').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 8).getCell('AK').value =
    '......................, tanggal ...................';
  worksheet.mergeCells(`AK${rowIndex + 10}:AL${rowIndex + 10}`);
  worksheet.getRow(rowIndex + 10).getCell('AK').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 10).getCell('AK').value =
    'KEPALA KEPALA Perangkat Daerah ..................';
  worksheet.mergeCells(`AK${rowIndex + 11}:AL${rowIndex + 11}`);
  worksheet.getRow(rowIndex + 11).getCell('AK').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 11).getCell('AK').value =
    'KABUPATEN/KOTA ....................................';
  worksheet.mergeCells(`AK${rowIndex + 16}:AL${rowIndex + 16}`);
  worksheet.getRow(rowIndex + 16).getCell('AK').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 16).getCell('AK').value =
    '(....................................)';
  //#endregion

  for (let r = 10; r <= rowIndex + 2; r++) {
    const row = worksheet.getRow(r);
    for (let c = 1; c <= 38; c++) {
      const cell = row.getCell(c);
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      };
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `Evaluasi Terhadap Hasil Renstra Perangkat Daerah Lingkup Kabupaten/kota ${getPeriodeMulaiFromCookie()} - ${getPeriodeAkhirFromCookie()} ${waktuNowGabung}.xlsx`);
};