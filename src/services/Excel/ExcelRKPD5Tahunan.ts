import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { FlatRKPD5TRow } from '../RKPDTahunanService';
import { waktuNowGabung } from '../../lib/helper';
import { getPeriodeAkhirFromCookie, getPeriodeMulaiFromCookie } from '../../lib/usercookie';

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
export const exportRKPD5T = async (
  data: FlatRKPD5TRow[],
  tahun: string,
  skpd: string,
  opts?: { startRow?: number },
) => {
  const startRow = opts?.startRow ?? 15;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Worksheet');

  const merges = [
    'A2:AQ2', 'A3:AQ3', 'A4:AQ4', 'A7:AQ7', 'A8:AQ8',

    'A10:A11', 'A12:A13',
    'B10:B11', 'B12:B13',
    'C10:G11', 'C12:G13',
    'H10:H11', 'H12:H13',
    'I10:I11', 'I12:I13',
    'J10:J11', 'J12:J13',
    'K10:L11', 'K12:L12',
    'M10:V10', 'M11:N11', 'O11:P11', 'Q11:R11', 'S11:T11', 'U11:V11', 'M12:N12', 'O12:P12', 'Q12:R12', 'S12:T12', 'U12:V12',
    'W10:AF10', 'W11:X11', 'Y11:Z11', 'AA11:AB11', 'AC11:AD11', 'AE11:AF11', 'W12:X12', 'Y12:Z12', 'AA12:AB12', 'AC12:AD12', 'AE12:AF12',
    'AG11:AH11', 'AI11:AJ11', 'AK11:AL11', 'AM11:AN11', 'AO11:AP11', 'AG12:AH12', 'AI12:AJ12', 'AK12:AL12', 'AM12:AN12', 'AO12:AP12',
    'AG10:AP10',
    'AQ10:AQ11', 'AQ12:AQ13'
  ];
  merges.forEach((m) => {
    try { worksheet.mergeCells(m); } catch (e) { }
  });

  [
    { col: 'A2', value: 'Evaluasi Terhadap Hasil RKPD' },
    { col: 'A3', value: 'Kabupaten Bengkulu Utara' },
    { col: 'A4', value: `Periode ${getPeriodeMulaiFromCookie()} - ${getPeriodeAkhirFromCookie()}` },
    { col: 'A7', value: 'Indikator dan Target Kinerja Perangkat Daerah yang mengacu pada Sasaran RPJMD : ' },
    { col: 'A8', value: '..............................................................................................................' },

    { col: 'A10', value: 'No' }, { col: 'A12', value: '1' },

    { col: 'B10', value: 'Sasaran' }, { col: 'B12', value: '2' },

    { col: 'C10', value: 'Kode' }, { col: 'C12', value: '3' },

    { col: 'H10', value: 'Urusan / Bidang Urusan Pemerintahan Daerah dan Program / Kegiatan / Sub Kegiatan' }, { col: 'H12', value: '4' },

    { col: 'I10', value: 'Indikator Kinerja Program (Outcome) / Kegiatan (Output) / Sub Kegiatan (Output)' }, { col: 'I12', value: '5' },

    { col: 'J10', value: 'Data Capaian Pada Awal Tahun Perencanaan' }, { col: 'J12', value: '6' },

    { col: 'K10', value: 'Target Capaian pada Akhir Tahun Perencanaan' }, { col: 'K12', value: '7' },
    { col: 'K13', value: 'K' }, { col: 'L13', value: 'Rp' },

    { col: 'M10', value: 'Target Tahun ke-' },
    { col: 'M11', value: '1' }, { col: 'M12', value: '8' }, { col: 'M13', value: 'K' }, { col: 'N13', value: 'Rp' },
    { col: 'O11', value: '2' }, { col: 'O12', value: '9' }, { col: 'O13', value: 'K' }, { col: 'P13', value: 'Rp' },
    { col: 'Q11', value: '3' }, { col: 'Q12', value: '10' }, { col: 'Q13', value: 'K' }, { col: 'R13', value: 'Rp' },
    { col: 'S11', value: '4' }, { col: 'S12', value: '11' }, { col: 'S13', value: 'K' }, { col: 'T13', value: 'Rp' },
    { col: 'U11', value: '5' }, { col: 'U12', value: '12' }, { col: 'U13', value: 'K' }, { col: 'V13', value: 'Rp' },

    { col: 'W10', value: 'Realisasi Capaian Tahun ke-' },
    { col: 'W11', value: '1' }, { col: 'W12', value: '13' }, { col: 'W13', value: 'K' }, { col: 'X13', value: 'Rp' },
    { col: 'Y11', value: '2' }, { col: 'Y12', value: '14' }, { col: 'Y13', value: 'K' }, { col: 'Z13', value: 'Rp' },
    { col: 'AA11', value: '3' }, { col: 'AA12', value: '15' }, { col: 'AA13', value: 'K' }, { col: 'AB13', value: 'Rp' },
    { col: 'AC11', value: '4' }, { col: 'AC12', value: '16' }, { col: 'AC13', value: 'K' }, { col: 'AD13', value: 'Rp' },
    { col: 'AE11', value: '5' }, { col: 'AE12', value: '17' }, { col: 'AE13', value: 'K' }, { col: 'AF13', value: 'Rp' },

    { col: 'AG10', value: 'Rasio Capaian pada Tahun ke-' },
    { col: 'AG11', value: '1' }, { col: 'AG12', value: '18' }, { col: 'AG13', value: 'K' }, { col: 'AH13', value: 'Rp' },
    { col: 'AI11', value: '2' }, { col: 'AI12', value: '19' }, { col: 'AI13', value: 'K' }, { col: 'AJ13', value: 'Rp' },
    { col: 'AK11', value: '3' }, { col: 'AK12', value: '20' }, { col: 'AK13', value: 'K' }, { col: 'AL13', value: 'Rp' },
    { col: 'AM11', value: '4' }, { col: 'AM12', value: '21' }, { col: 'AM13', value: 'K' }, { col: 'AN13', value: 'Rp' },
    { col: 'AO11', value: '5' }, { col: 'AO12', value: '22' }, { col: 'AO13', value: 'K' }, { col: 'AP13', value: 'Rp' },

    { col: 'AQ10', value: 'Perangkat Daerah Penanggung Jawab' }, { col: 'AQ12', value: '23' },
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
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      cell.fill = {
        type: 'pattern', pattern: 'solid', fgColor: { argb: '082187' }
      };
    });
  }

  const widthMap: Record<string, number> = {
    A: 5, B: 35, C: 5, D: 5, E: 5, F: 5, G: 5,
    H: 70, I: 50, J: 20, K: 20, L: 20, M: 20,
    N: 20, O: 20, P: 20, Q: 20, R: 20, S: 20,
    T: 20, U: 20, V: 20, W: 20, X: 20, Y: 20,
    Z: 20, AA: 20, AB: 20, AC: 20, AD: 20, AE: 20,
    AF: 20, AG: 20, AH: 20, AI: 20, AJ: 20, AK: 20, AL: 20, AM: 20, AN: 20, AO: 20, AP: 20, AQ: 35,
  };
  const colLetters = Object.keys(widthMap);
  colLetters.forEach((col, idx) => {
    worksheet.getColumn(idx + 1).width = widthMap[col];
  });

  //#region Mapping Data
  let rowIndex = startRow;
  let subKegiatanIndex = 1;

  data.forEach((item) => {
    const startItemRow = rowIndex;
    const row = worksheet.getRow(startItemRow);
    if (item.level === 'sub_kegiatan') {
      row.getCell('A').value = subKegiatanIndex++;
    }
    row.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    ['A', 'C', 'D', 'E', 'F', 'G'].forEach((col) => {
      row.getCell(col).alignment = { horizontal: 'center', vertical: 'top' };
    });
    const indikatorCount = item.indikator?.length || 0;
    const persenFormat = '0.00 "%"';

    const levelStyles = {
      urusan: { fill: 'FFCC00', font: { bold: true } },
      bidang: { fill: 'FF1E1E1E', font: { bold: true, color: { argb: 'FFFFFFFF' } } },
      program: { fill: 'FF666666', font: { bold: true, color: { argb: 'FFFFFFFF' } } },
      kegiatan: { fill: 'FFA6A6A6', font: { bold: true, color: { argb: 'FFFFFFFF' } } },
    };

    const levelKey = item.level.toLowerCase() as keyof typeof levelStyles;
    const style = levelStyles[levelKey];

    for (let col = 1; col <= 43; col++) {
      const cell = row.getCell(col);
      if (style) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: style.fill },
        };
        cell.font = style.font;
      }
    }

    if (indikatorCount > 0) {
      item.indikator?.forEach((ind) => {
        const row = worksheet.getRow(rowIndex++);
        row.getCell('I').value = ind.name;
        row.getCell('J').value = ind.capaian_per_tahun.find((item) => item.tahun_ke === 1)?.capaian;
        row.getCell('L').value = 0;
        row.getCell('M').value = 0;
        row.getCell('N').value = ind.target_tahun_dievaluasi;
        ['P', 'R', 'T', 'V'].forEach((col, i) => {
          row.getCell(col).value = ind.triwulan?.[i]?.capaian ?? '';
        });
        row.getCell('X').value = ind.total_capaian ?? '';
        row.getCell('Z').value = Number(ind.persen_capaian);
        row.getCell('Z').numFmt = persenFormat;
        row.getCell('AB').value = ind.total_capaian_periode;
        row.getCell('AD').value = Number(ind.persen_capaian_periode);
        row.getCell('AD').numFmt = persenFormat;
        row.getCell('AF').value = skpd;

        const satuan = ind.satuan ? ind.satuan.replace(/"/g, '') : '';
        let numFmt = 'General';
        if (satuan) {
          if (satuan.trim() === '%' || satuan.toLowerCase().includes('persen')) numFmt = '0.00 "%"';
          else numFmt = `General "${satuan}"`;
        }
        ['J', 'L', 'N', 'P', 'R', 'T', 'V', 'X', 'AA', 'AB'].forEach(col => {
          row.getCell(col).numFmt = numFmt;
        });

        const fmtRupiah = '"Rp"* #,##0.00;[<0]"Rp"* "-"#,##0.00;"Rp"* "0"';
        ['K', 'M', 'O', 'Q', 'S', 'U', 'W', 'Y', 'AA'].forEach(col => {
          row.getCell(col).numFmt = fmtRupiah;
        });
      });

      const endItemRow = rowIndex - 1;
      const row = worksheet.getRow(startItemRow);
      row.getCell('H').value = item.name;

      if (indikatorCount > 1) {
        const colsToMerge = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'Q', 'S', 'U', 'W', 'O', 'Y', 'AA', 'AC', 'AE'];
        colsToMerge.forEach(col => {
          worksheet.mergeCells(`${col}${startItemRow}:${col}${endItemRow}`);
        });
      }

      const kodeStr = (item.kode ?? '').toString();
      if (item.level === 'urusan') row.getCell('C').value = kodeStr;
      else if (item.level === 'bidang') {
        const [urusanKode, bidangKode] = kodeStr.split(' ');
        row.getCell('C').value = urusanKode;
        row.getCell('D').value = bidangKode;
      } else if (item.level === 'program') {
        const [urusanKode, bidangKode, programKode] = kodeStr.split(' ');
        row.getCell('C').value = urusanKode;
        row.getCell('D').value = bidangKode;
        row.getCell('E').value = programKode;
      } else if (item.level === 'kegiatan') {
        const [urusanKode, bidangKode, programKode, kegiatanKode] = kodeStr.split(' ');
        row.getCell('C').value = urusanKode;
        row.getCell('D').value = bidangKode;
        row.getCell('E').value = programKode;
        row.getCell('F').value = kegiatanKode;
      } else if (item.level === 'sub_kegiatan') {
        const [urusanKode, bidangKode, programKode, kegiatanKode, subKode] = kodeStr.split(' ');
        row.getCell('C').value = urusanKode;
        row.getCell('D').value = bidangKode;
        row.getCell('E').value = programKode;
        row.getCell('F').value = kegiatanKode;
        row.getCell('G').value = subKode;
      }

      row.getCell('K').value = item.pagu?.paguPeriode;
      row.getCell('O').value = item.pagu?.paguTahunEval;
      row.getCell('Y').value = item.pagu?.totalRealisasi;
      ['Q', 'S', 'U', 'W'].forEach((col, i) => {
        row.getCell(col).value = Number(item.pagu?.triwulan?.[i]?.realisasi) ?? 0;
      });
      row.getCell('AA').value = Number(item.pagu?.persenRealisasi);
      row.getCell('AA').numFmt = persenFormat;
      row.getCell('AC').value = item.pagu?.totalRealisasiPeriode;
      row.getCell('AE').value = Number(item.pagu?.persenRealisasiPeriode);
      row.getCell('AE').numFmt = persenFormat;
    } else {
      const row = worksheet.getRow(rowIndex++);
      row.getCell('H').value = item.name;
    }
  });

  const rowsConfig = [
    { offset: 1, merge: 'A:AF', text: 'Rata-rata capaian kinerja (%)', align: 'right' },
    { offset: 2, merge: 'A:AF', text: 'Predikat kinerja', align: 'right' },
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

  worksheet.mergeCells(`AO${rowIndex + 4}:AQ${rowIndex + 4}`);
  worksheet.getRow(rowIndex + 4).getCell('AO').value =
    'Kabupaten Bengkulu Utara, .........................................';

  worksheet.getRow(rowIndex + 10).getCell('AO').value = 'NIP.';
  //#endregion

  for (let r = 10; r <= rowIndex; r++) {
    const row = worksheet.getRow(r);
    for (let c = 1; c <= 43; c++) {
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
  saveAs(blob, `Laporan Evaluasi Terhadap RKPD Kabupaten Bengkulu Utara Tahun ${tahun} ${waktuNowGabung}.xlsx`);
};