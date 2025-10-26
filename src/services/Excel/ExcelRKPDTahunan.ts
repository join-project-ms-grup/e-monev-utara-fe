import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { RKPDMasterTree } from '../RKPDTahunanService';

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
  data: RKPDMasterTree[],
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
    { addr: 'Z15', value: '14 = (13 / 8 * 100) %' }, { addr: 'Z16', value: 'K' }, { addr: 'AA16', value: 'Rp' },

    { addr: 'AB13', value: 'Realisasi Kinerja & Anggaran RPJM/Renstra s/d Tahun yang dievaluasi (2025)' },
    { addr: 'AB15', value: '15 = (7 + 13)' }, { addr: 'AB16', value: 'K' }, { addr: 'AC16', value: 'Rp' },

    { addr: 'AD13', value: 'Tingkat Capaian Kinerja & Realisasi Anggaran RPJM/Renstra s/d Tahun yang dievaluasi (%)' },
    { addr: 'AD15', value: '16 = (15 / 6 * 100) %' }, { addr: 'AD16', value: 'K' }, { addr: 'AE16', value: 'Rp' },

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
        type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' }
      };
      c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      c.border = {
        top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    });

  let rowIndex = startRow;
  data.forEach((urusan) => {
    // Baris untuk URUSAN
    const rowU = worksheet.getRow(rowIndex++);
    rowU.getCell('H').value = urusan.name;
    rowU.getCell('C').value = urusan.kode;
    rowU.getCell('A').value = rowIndex - startRow + 1;
    rowU.font = { bold: true };

    urusan.bidang?.forEach((bidang) => {
      // Baris untuk BIDANG
      const rowB = worksheet.getRow(rowIndex++);
      rowB.getCell('H').value = `${bidang.name}`;
      rowB.getCell('C').value = urusan.kode;
      rowB.getCell('D').value = bidang.kode;
      rowB.getCell('A').value = rowIndex - startRow + 1;
      rowB.font = { bold: true };

      bidang.program?.forEach((program) => {
        // Baris untuk PROGRAM
        const rowP = worksheet.getRow(rowIndex++);
        rowP.getCell('H').value = `${program.name}`;
        rowP.getCell('C').value = urusan.kode;
        rowP.getCell('D').value = bidang.kode;
        rowP.getCell('E').value = program.kode;
        rowP.getCell('A').value = rowIndex - startRow + 1;
        rowP.font = { bold: true };
        program.indikator?.forEach((indikator) => {
          rowP.getCell('I').value = indikator.name;
        })

        program.kegiatan?.forEach((kegiatan) => {
          // Baris untuk KEGIATAN
          const rowK = worksheet.getRow(rowIndex++);
          rowK.getCell('H').value = `${kegiatan.name}`;
          rowK.getCell('C').value = urusan.kode;
          rowK.getCell('D').value = bidang.kode;
          rowK.getCell('E').value = program.kode;
          rowK.getCell('F').value = kegiatan.kode;
          rowK.getCell('A').value = rowIndex - startRow + 1;
          rowK.font = { bold: true };
          kegiatan.indikator?.forEach((indikator) => {
            rowK.getCell('I').value = indikator.name;
          })

          kegiatan.subKegiatan?.forEach((sub) => {
            // Baris untuk SUB KEGIATAN
            const rowS = worksheet.getRow(rowIndex);
            rowS.getCell('H').value = `${sub.name}`;
            rowS.getCell('C').value = urusan.kode;
            rowS.getCell('D').value = bidang.kode;
            rowS.getCell('E').value = program.kode;
            rowS.getCell('F').value = kegiatan.kode;
            rowS.getCell('G').value = sub.kode;
            rowS.getCell('A').value = rowIndex - startRow + 1;
            rowS.font = { bold: true };

            // Baris indikator (data detail)
            const pagu = sub.pagu;
            sub.indikator?.forEach((indikator) => {
              const row = worksheet.getRow(rowIndex++);
              row.getCell('I').value = indikator.name;
              row.getCell('J').value = indikator.target_akhir_periode;
              row.getCell('K').value = pagu?.paguPeriode;
              row.getCell('L').value = indikator.total_capaian_periode;
              row.getCell('M').value = pagu?.paguTahunEval;
              row.getCell('N').value = indikator.target_tahun_dievaluasi;
              row.getCell('O').value = pagu?.paguTahunEval;

              const tri1 = pagu?.triwulan?.[0];
              const tri2 = pagu?.triwulan?.[1];
              const tri3 = pagu?.triwulan?.[2];
              const tri4 = pagu?.triwulan?.[3];

              row.getCell('P').value = indikator.triwulan?.[0]?.capaian ?? '';
              row.getCell('Q').value = Number(tri1?.realisasi) ?? '';
              row.getCell('R').value = indikator.triwulan?.[1]?.capaian ?? '';
              row.getCell('S').value = Number(tri2?.realisasi) ?? '';
              row.getCell('T').value = indikator.triwulan?.[2]?.capaian ?? '';
              row.getCell('U').value = Number(tri3?.realisasi) ?? '';
              row.getCell('V').value = indikator.triwulan?.[3]?.capaian ?? '';
              row.getCell('W').value = Number(tri4?.realisasi) ?? '';
              row.getCell('X').value = indikator.total_capaian ?? '';
              row.getCell('Y').value = pagu?.totalRealisasi ?? '';
              row.getCell('Z').value = indikator.persen_capaian ?? '';
              row.getCell('AA').value = Number(pagu?.persenRealisasi) ?? '';
              row.getCell('AF').value = skpd;

              const satuan = indikator.satuan ? indikator.satuan.replace(/"/g, '') : '';
              let numFmt = 'General';
              if (satuan) {
                if (satuan.trim() === '%' || satuan.toLowerCase().includes('persen')) {
                  numFmt = '0.00 "%"';
                } else {
                  numFmt = `General "${satuan}"`;
                }
              }

              ['J', 'L', 'N', 'P', 'R', 'T', 'V', 'X', 'Z'].forEach(col => {
                row.getCell(col).numFmt = numFmt;
              });

              const fmtRupiah = '"Rp"* #,##0.00;[<0]"Rp"* "-"#,##0.00;"Rp"* "0"';
              ['K', 'M', 'O', 'Q', 'S', 'U', 'W', 'Y', 'AA'].forEach(col => {
                row.getCell(col).numFmt = fmtRupiah;
              });

            });
          });
        });
      });
    });
  });

  worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: startRow - 1, topLeftCell: `A${startRow}` }];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `[473 - 1.01.2.22.0.00.01.0000] Laporan Evaluasi Terhadap RKPD Kabupaten Bengkulu Utara Tahun ${tahun} (20251026141917).xlsx`);
};