import ttd from '/src/assets/ttd.png';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { numOrEmpty, renderSatuan, waktuNowGabung } from '../../lib/helper';
import { getPeriodeAkhirFromCookie, getPeriodeMulaiFromCookie } from '../../lib/usercookie';
import type { FlatRenstraNew } from '../RenstraService';
import type { CatatanForm } from '../CatatanService';

export const exportRenstra = async (
  data: FlatRenstraNew[],
  skpd: string,
  catatan: CatatanForm,
  opts?: { startRow?: number },
) => {
  const startRow = opts?.startRow ?? 15;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Worksheet');

  const merges = [
    'A2:AL2', 'A3:AL3', 'A7:AL7', 'A8:AL8',

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
    A: 5, B: 20, C: 40, D: 40, E: 30,
    F: 30, G: 30, H: 30, I: 30, J: 30, K: 30, L: 30,
    M: 30, N: 30, O: 30, P: 30, Q: 30, R: 30, S: 30,
    T: 30, U: 30, V: 30, W: 30, X: 30, Y: 30, Z: 30,
    AA: 30, AB: 30, AC: 30, AD: 30, AE: 30, AF: 30,
    AG: 30, AH: 30, AI: 30, AJ: 30, AK: 30, AL: 35
  };
  const colLetters = Object.keys(widthMap);
  colLetters.forEach((col, idx) => {
    worksheet.getColumn(idx + 1).width = widthMap[col];
  });

  //#region Mapping Data
  let rowIndex = startRow;

  data.forEach((item, idx) => {
    const row = worksheet.getRow(rowIndex);

    // 1
    row.getCell('A').value = idx + 1;
    row.getCell('A').alignment = { horizontal: 'center' }
    // 3
    row.getCell('C').value = item.ind_name ? item.name + '\n\n' + `(${item.ind_name})` : item.name;
    // 4
    row.getCell('D').value = item.ind_name;
    // 5
    row.getCell('E').value = renderSatuan(item.target_capaian_1, '');
    // 6
    row.getCell('F').value = renderSatuan(item.target_capaian_5, '');
    row.getCell('G').value = numOrEmpty(item.pagu_pagu_5);
    // 
    // 7 - 11
    row.getCell('H').value = renderSatuan(item.target_target_1, '');
    row.getCell('I').value = numOrEmpty(item.pagu_pagu_1);

    row.getCell('J').value = renderSatuan(item.target_target_2, '');
    row.getCell('K').value = numOrEmpty(item.pagu_pagu_2);

    row.getCell('L').value = renderSatuan(item.target_target_3, '');
    row.getCell('M').value = numOrEmpty(item.pagu_pagu_3);

    row.getCell('N').value = renderSatuan(item.target_target_4, '');
    row.getCell('O').value = numOrEmpty(item.pagu_pagu_4);

    row.getCell('P').value = renderSatuan(item.target_target_5, '');
    row.getCell('Q').value = numOrEmpty(item.pagu_pagu_5);
    // 12 - 16
    row.getCell('R').value = renderSatuan(item.target_capaian_1, '');
    row.getCell('S').value = numOrEmpty(item.pagu_realisasi_1);

    row.getCell('T').value = renderSatuan(item.target_capaian_2, '');
    row.getCell('U').value = numOrEmpty(item.pagu_realisasi_3);

    row.getCell('V').value = renderSatuan(item.target_capaian_3, '');
    row.getCell('W').value = numOrEmpty(item.pagu_realisasi_4);

    row.getCell('X').value = renderSatuan(item.target_capaian_4, '');
    row.getCell('Y').value = numOrEmpty(item.pagu_realisasi_5);

    row.getCell('Z').value = renderSatuan(item.target_capaian_5, '');
    row.getCell('AA').value = numOrEmpty(item.pagu_realisasi_5);
    // 17 - 21
    row.getCell('AB').value = numOrEmpty(item.target_persen_1);
    row.getCell('AC').value = numOrEmpty(item.pagu_persen_1);

    row.getCell('AD').value = numOrEmpty(item.target_persen_2);
    row.getCell('AE').value = numOrEmpty(item.pagu_persen_2);

    row.getCell('AF').value = numOrEmpty(item.target_persen_3);
    row.getCell('AG').value = numOrEmpty(item.pagu_persen_3);

    row.getCell('AH').value = numOrEmpty(item.target_persen_4);
    row.getCell('AI').value = numOrEmpty(item.pagu_persen_4);

    row.getCell('AJ').value = numOrEmpty(item.target_persen_5);
    row.getCell('AK').value = numOrEmpty(item.pagu_persen_5);
    // 22
    row.getCell('AL').value = skpd;

    const fmtPersen = '0.00%';
    ['AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK'].forEach((col) => {
      row.getCell(col).numFmt = fmtPersen;
    });

    const fmtRupiah = '"Rp"* #,##0.00;[<0]"Rp"* "-"#,##0.00;"Rp"* "0"';
    ['G', 'I', 'K', 'M', 'O', 'Q', 'S', 'U', 'W', 'Y', 'AA'].forEach((col) => {
      row.getCell(col).numFmt = fmtRupiah;
    });

    ['C', 'D', 'AL',].forEach((col) => {
      row.getCell(col).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    });
    rowIndex++;
  });

  const rowsConfig = [
    { offset: 1, merge: 'A:AA', text: 'Rata-rata capaian kinerja (%)', align: 'right' },
    { offset: 2, merge: 'A:AA', text: 'Predikat kinerja', align: 'right' },
    { offset: 3, merge: 'A:AL', text: `Faktor pendorong pencapaian kinerja: ${catatan.pendorong}` },
    { offset: 4, merge: 'A:AL', text: `Faktor penghambat: ${catatan.penghambat}` },
    { offset: 5, merge: 'A:AL', text: `Usulan tindak lanjut pada Renja Perangkat Daerah kabupaten/kota berikutnya: ${catatan.tl_1}` },
    { offset: 6, merge: 'A:AL', text: `Usulan tindak lanjut pada Renstra Perangkat Daerah kabupaten/kota berikutnya: ${catatan.tl_2}` }
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

  worksheet.mergeCells(`AJ${rowIndex + 8}:AK${rowIndex + 8}`);
  worksheet.getRow(rowIndex + 8).getCell('AJ').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 8).getCell('AJ').value =
    '......................, tanggal ...................';
  worksheet.mergeCells(`AJ${rowIndex + 10}:AK${rowIndex + 10}`);
  worksheet.getRow(rowIndex + 10).getCell('AJ').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 10).getCell('AJ').value =
    `KEPALA ${skpd.toUpperCase()}`;
  worksheet.mergeCells(`AJ${rowIndex + 11}:AK${rowIndex + 11}`);
  worksheet.getRow(rowIndex + 11).getCell('AJ').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 11).getCell('AJ').value =
    'KABUPATEN BENGKULU UTARA';

  const resp = await fetch(ttd);
  const blobImg = await resp.arrayBuffer();
  const imgId = workbook.addImage({
    buffer: blobImg,
    extension: 'png'
  });
  worksheet.addImage(imgId, {
    tl: { col: 35, row: rowIndex + 9 },
    ext: { width: 420, height: 210 }
  });

  worksheet.mergeCells(`AJ${rowIndex + 18}:AK${rowIndex + 18}`);
  worksheet.getRow(rowIndex + 18).getCell('AJ').alignment = { horizontal: 'center' }
  worksheet.getRow(rowIndex + 18).getCell('AJ').value =
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

  // Semua font default menggunakan Bookman Old Style
  const defaultFont: Partial<ExcelJS.Font> = { name: 'Bookman Old Style' };

  // Terapkan font ke seluruh sheet (semua baris yang ada)
  worksheet.eachRow({ includeEmpty: true }, (row) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { ...defaultFont, ...(cell.font ?? {}) };
    });
  });

  // Baris 9-12, tambahkan background abu-abu dan center alignment
  for (let row = 10; row <= 13; row++) {
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
  saveAs(blob, `Evaluasi Terhadap Hasil Renstra Perangkat Daerah Lingkup Kabupaten/kota ${getPeriodeMulaiFromCookie()} - ${getPeriodeAkhirFromCookie()} ${waktuNowGabung}.xlsx`);
};