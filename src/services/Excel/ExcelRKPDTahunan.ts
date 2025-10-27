import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { FlatRKPDRow } from '../RKPDTahunanService';
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
 * @param opts.startRow (optional) baris mulai data (default 18)
 */
export const exportRKPD = async (
  data: FlatRKPDRow[],
  tahun: string,
  skpd: string,
  opts?: { startRow?: number },
) => {
  const startRow = opts?.startRow ?? 18;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Evaluasi RKPD');

  const merges = [
    'A2:AG2',
    'A3:AG3',
    'A4:AG4',
    'A7:AG7',
    'A8:AG8',
    'A9:AG9',
    'A10:AG10',
    'A11:AG11',
    'A13:A14', 'A15:A16',
    'B13:B14', 'B15:B16',
    'C13:G14', 'C15:G16',
    'H13:H14', 'H15:H16',
    'I13:I14', 'I15:I16',
    'J13:K14', 'J15:K15',
    'L13:M14', 'L15:M15',
    'N13:O14', 'N15:O15',
    'P13:W13', 'P14:Q14', 'R14:S14', 'T14:U14', 'V14:W14',
    'P15:Q15', 'R15:S15', 'T15:U15', 'V15:W15',
    'X13:Y14', 'X15:Y15',
    'Z13:AA14', 'Z15:AA15',
    'AB13:AC14', 'AB15:AC15',
    'AD13:AE14', 'AD15:AE15',
    'AF13:AF14', 'AF15:AF16',
    'AG13:AG14', 'AG15:AG16',
  ];
  merges.forEach((m) => {
    try { worksheet.mergeCells(m); } catch (e) { }
  });

  const widthMap: Record<string, number> = {
    A: 5, B: 35, C: 5, D: 5, E: 5, F: 5, G: 5,
    H: 70, I: 50, J: 20, K: 20, L: 20, M: 20,
    N: 20, O: 20, P: 20, Q: 20, R: 20, S: 20,
    T: 20, U: 20, V: 20, W: 20, X: 20, Y: 20,
    Z: 20, AA: 20, AB: 20, AC: 20, AD: 20, AE: 20,
    AF: 35, AG: 35,
  };
  const colLetters = Object.keys(widthMap);
  colLetters.forEach((col, idx) => {
    worksheet.getColumn(idx + 1).width = widthMap[col];
  });

  const fixedCells: Array<{ addr: string; value: string; style?: Partial<ExcelJS.Style> }> = [
    { addr: 'A2', value: 'Evaluasi Terhadap Hasil RKPD Perangkat Daerah' },
    { addr: 'A3', value: 'Kabupaten Bengkulu Utara' },
    { addr: 'A4', value: `Tahun ${tahun}` },
    { addr: 'A7', value: 'Sasaran Pembangunan Tahunan : ' },
    { addr: 'A8', value: '1. ' },
    { addr: 'A9', value: '2. ' },
    { addr: 'A10', value: '3. ' },
    { addr: 'A11', value: '4. ' },

    { addr: 'A13', value: 'No' }, { addr: 'A15', value: '1' },

    { addr: 'B13', value: 'Sasaran' }, { addr: 'B15', value: '2' },

    { addr: 'C13', value: 'Kode' }, { addr: 'C15', value: '3' },

    { addr: 'H13', value: 'Urusan / Bidang Urusan Pemerintahan Daerah dan Program / Kegiatan / Sub Kegiatan' }, { addr: 'H15', value: '4' },

    { addr: 'I13', value: 'Indikator Kinerja Program (outcome) / Kegiatan (output) / Sub Kegiatan (sub-output)' }, { addr: 'I15', value: '5' },

    { addr: 'J13', value: 'Target Akhir Renstra Tahun RPJM/Renstra (2021-2026)' },
    { addr: 'J15', value: '6' }, { addr: 'J16', value: 'K' }, { addr: 'K16', value: 'Rp' },

    { addr: 'L13', value: 'Realisasi Capaian Kinerja RKPD sampai dengan Tahun sebelumnya (2024)' },
    { addr: 'L15', value: '7' }, { addr: 'L16', value: 'K' }, { addr: 'M16', value: 'Rp' },

    { addr: 'N13', value: 'Target Kinerja & Anggaran RKPD Tahun yang dievaluasi (2025)' },
    { addr: 'N15', value: '8' }, { addr: 'N16', value: 'K' }, { addr: 'O16', value: 'Rp' },

    { addr: 'P13', value: 'Realisasi Kinerja Pada Triwulan (2025)' },
    { addr: 'P14', value: 'I' }, { addr: 'P15', value: '9' }, { addr: 'P16', value: 'K' }, { addr: 'Q16', value: 'Rp' },
    { addr: 'R14', value: 'II' }, { addr: 'R15', value: '10' }, { addr: 'R16', value: 'K' }, { addr: 'S16', value: 'Rp' },
    { addr: 'T14', value: 'III' }, { addr: 'T15', value: '11' }, { addr: 'T16', value: 'K' }, { addr: 'U16', value: 'Rp' },
    { addr: 'V14', value: 'IV' }, { addr: 'V15', value: '12' }, { addr: 'V16', value: 'K' }, { addr: 'W16', value: 'Rp' },

    { addr: 'X13', value: 'Realisasi Capaian Kinerja & Anggaran RKPD Tahun yang dievaluasi (2025)' },
    { addr: 'X15', value: '13 = (9 + 10 + 11 + 12)' }, { addr: 'X16', value: 'K' }, { addr: 'Y16', value: 'Rp' },

    { addr: 'Z13', value: 'Tingkat Capaian Kinerja & Realisasi Anggaran Tahun yang dievaluasi (%)' },
    { addr: 'Z15', value: '14 = (13 / 8 * 100) %' }, { addr: 'Z16', value: 'K (%)' }, { addr: 'AA16', value: 'Rp (%)' },

    { addr: 'AB13', value: 'Realisasi Kinerja & Anggaran RPJM/Renstra s/d Tahun yang dievaluasi (2025)' },
    { addr: 'AB15', value: '15 = (7 + 13)' }, { addr: 'AB16', value: 'K' }, { addr: 'AC16', value: 'Rp' },

    { addr: 'AD13', value: 'Tingkat Capaian Kinerja & Realisasi Anggaran RPJM/Renstra s/d Tahun yang dievaluasi (%)' },
    { addr: 'AD15', value: '16 = (15 / 6 * 100) %' }, { addr: 'AD16', value: 'K (%)' }, { addr: 'AE16', value: 'Rp (%)' },

    { addr: 'AF13', value: 'Perangkat Daerah Penanggung Jawab' }, { addr: 'AF15', value: '17' },
    { addr: 'AG13', value: 'Keterangan' }, { addr: 'AG15', value: '18' },
  ];

  fixedCells.forEach((c) => {
    const cell = worksheet.getCell(c.addr);
    cell.value = c.value;
    if (c.addr === 'A2' || c.addr === 'A3' || c.addr === 'A4') {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.font = { bold: true, size: 14 };
    }
  });

  const headerRowNumber = 13;
  const headerRow = worksheet.getRow(headerRowNumber);
  headerRow.height = 30;
  [
    'A13', 'B13', 'C13', 'H13', 'I13', 'J13', 'L13', 'N13', 'P13', 'X13', 'Z13', 'AB13', 'AD13', 'AF13', 'AG13',
    'P14', 'R14', 'T14', 'V14',
    'A15', 'B15', 'C15', 'H15', 'I15', 'J15', 'L15', 'N15', 'P15', 'R15', 'T15', 'V15', 'X15', 'Z15', 'AB15', 'AD15', 'AF15', 'AG15',
    'J16', 'K16', 'L16', 'M16', 'N16', 'O16', 'P16', 'Q16', 'R16', 'S16', 'T16', 'U16', 'V16', 'W16', 'X16', 'Y16', 'Z16', 'AA16', 'AB16', 'AC16', 'AD16', 'AE16',
  ]
    .forEach((addr) => {
      const c = worksheet.getCell(addr);
      c.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      c.fill = {
        type: 'pattern', pattern: 'solid', fgColor: { argb: '082187' }
      };
      c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      c.border = {
        top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
      };
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

    const cols = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG'
    ];
    const levelStyles = {
      urusan: { fill: 'FFCC00', font: { bold: true } },
      bidang: { fill: 'FF1E1E1E', font: { bold: true, color: { argb: 'FFFFFFFF' } } },
      program: { fill: 'FF666666', font: { bold: true, color: { argb: 'FFFFFFFF' } } },
      kegiatan: { fill: 'FFA6A6A6', font: { bold: true, color: { argb: 'FFFFFFFF' } } },
    };

    // const style = levelStyles[item.level.toLowerCase()];
    const levelKey = item.level.toLowerCase() as keyof typeof levelStyles;
    const style = levelStyles[levelKey];
    if (style) {
      cols.forEach(col => {
        const cell = row.getCell(col);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: style.fill },
        };
        cell.font = style.font;
      });
    }

    // tulis baris indikator
    if (indikatorCount > 0) {
      item.indikator?.forEach((ind) => {
        const row = worksheet.getRow(rowIndex++);

        // tulis indikator
        row.getCell('I').value = ind.name;
        row.getCell('J').value = ind.target_akhir_periode;
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

      // Merge cell untuk kode & nama item
      const row = worksheet.getRow(startItemRow);
      row.getCell('H').value = item.name;

      // Merge kolom kode jika ada lebih dari 1 indikator
      if (indikatorCount > 1) {
        const colsToMerge = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'Q', 'S', 'U', 'W', 'O', 'Y', 'AA', 'AC', 'AE'];
        colsToMerge.forEach(col => {
          worksheet.mergeCells(`${col}${startItemRow}:${col}${endItemRow}`);
        });
      }

      // tulis kode & pagu di baris pertama saja
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
    cols.forEach(col => {
      const cell = row.getCell(col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  const rowsConfig = [
    { offset: 1, merge: 'A:O', text: 'Rata-rata capaian kinerja (%)', align: 'right' },
    { offset: 2, merge: 'A:O', text: 'Predikat kinerja', align: 'right' },
    { offset: 3, merge: 'A:AG', text: 'Faktor pendorong keberhasilan kinerja:Predikat kinerja:' },
    { offset: 4, merge: 'A:AG', text: 'Faktor penghambat pencapaian kinerja:' },
    { offset: 5, merge: 'A:AG', text: 'Tindak lanjut yang diperlukan dalam triwulan berikutnya:' },
    { offset: 6, merge: 'A:AG', text: 'Tindak lanjut yang diperlukan dalam Renja Perangkat Daerah berikutnya:' }
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

  worksheet.mergeCells(`AE${rowIndex + 8}:AG${rowIndex + 8}`);
  worksheet.getRow(rowIndex + 8).getCell('AE').value =
    'Kabupaten Bengkulu Utara, .........................................';

  worksheet.getRow(rowIndex + 15).getCell('AE').value = 'NIP.';


  // const rerataCapKinerjaRowIndex = rowIndex + 1;
  // worksheet.mergeCells(`A${rerataCapKinerjaRowIndex}:O${rerataCapKinerjaRowIndex}`);
  // const rerataCapKinerjaRow = worksheet.getRow(rerataCapKinerjaRowIndex);
  // rerataCapKinerjaRow.getCell('A').value = 'Rata-rata capaian kinerja (%)';
  // rerataCapKinerjaRow.getCell('A').alignment = { horizontal: 'right' };
  // rerataCapKinerjaRow.getCell('A').font = { bold: true };

  // const predikatKinerjaRowIndex = rowIndex + 2;
  // worksheet.mergeCells(`A${predikatKinerjaRowIndex}:O${predikatKinerjaRowIndex}`);
  // const predikatKinerjaRow = worksheet.getRow(predikatKinerjaRowIndex);
  // predikatKinerjaRow.getCell('A').value = 'Predikat kinerja';
  // predikatKinerjaRow.getCell('A').alignment = { horizontal: 'right' };
  // predikatKinerjaRow.getCell('A').font = { bold: true };

  // const faktorPendorongRowIndex = rowIndex + 3;
  // worksheet.mergeCells(`A${faktorPendorongRowIndex}:AG${faktorPendorongRowIndex}`);
  // const faktorPendorongRow = worksheet.getRow(faktorPendorongRowIndex);
  // faktorPendorongRow.getCell('A').value = 'Faktor pendorong keberhasilan kinerja:Predikat kinerja:';
  // faktorPendorongRow.getCell('A').alignment = { horizontal: 'left' };
  // faktorPendorongRow.getCell('A').font = { bold: true };

  // const faktorPenghambatRowIndex = rowIndex + 4;
  // worksheet.mergeCells(`A${faktorPenghambatRowIndex}:AG${faktorPenghambatRowIndex}`);
  // const faktorPenghambatRow = worksheet.getRow(faktorPenghambatRowIndex);
  // faktorPenghambatRow.getCell('A').value = 'Faktor penghambat pencapaian kinerja:';
  // faktorPenghambatRow.getCell('A').alignment = { horizontal: 'left' };
  // faktorPenghambatRow.getCell('A').font = { bold: true };

  // const tlTriRowIndex = rowIndex + 5;
  // worksheet.mergeCells(`A${tlTriRowIndex}:AG${tlTriRowIndex}`);
  // const tlTriRow = worksheet.getRow(tlTriRowIndex);
  // tlTriRow.getCell('A').value = 'Tindak lanjut yang diperlukan dalam triwulan berikutnya:';
  // tlTriRow.getCell('A').alignment = { horizontal: 'left' };
  // tlTriRow.getCell('A').font = { bold: true };

  // const tlRenjaRowIndex = rowIndex + 6;
  // worksheet.mergeCells(`A${tlRenjaRowIndex}:AG${tlRenjaRowIndex}`);
  // const tlRenjaRow = worksheet.getRow(tlRenjaRowIndex);
  // tlRenjaRow.getCell('A').value = 'Tindak lanjut yang diperlukan dalam Renja Perangkat Daerah berikutnya:';
  // tlRenjaRow.getCell('A').alignment = { horizontal: 'left' };
  // tlRenjaRow.getCell('A').font = { bold: true };

  // const targetRowKab = rowIndex + 7;
  // worksheet.mergeCells(`AE${targetRowKab}:AG${targetRowKab}`);
  // const rowKab = worksheet.getRow(targetRowKab);
  // rowKab.getCell('AE').value = 'Kabupaten Bengkulu Utara, .........................................';

  // const targetRowNIP = rowIndex + 14;
  // const rowNIP = worksheet.getRow(targetRowNIP);
  // rowNIP.getCell('AE').value = 'NIP.';
  //#endregion

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `Laporan Evaluasi Terhadap RKPD Kabupaten Bengkulu Utara Tahun ${tahun} ${waktuNowGabung}.xlsx`);
};