import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportDaftarDak = async (data: any, tahun: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('DAK');

  worksheet.mergeCells('A2:I2');
  worksheet.getCell('A2').value =
    'Daftar dan Jenis DAK Lingkup Kabupaten Bengkulu Utara';
  worksheet.getCell('A2').alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  worksheet.getCell('A2').font = { bold: true, size: 14 };
  worksheet.getRow(2).height = 30;

  worksheet.mergeCells('A3:I3');
  worksheet.getCell('A3').value = `Tahun Anggaran ${tahun}`;
  worksheet.getCell('A3').alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  worksheet.getCell('A3').font = { bold: true, size: 14 };
  worksheet.getRow(3).height = 30;
  worksheet.addRow([]);
  worksheet.addRow([
    'NO',
    'URAIAN DANA ALOKASI KHUSUS',
    'PAGU',
    'REALISASI TW I',
    'REALISASI TW II',
    'REALISASI TW III',
    'REALISASI TW IV',
    'TOTAL',
    'SISA ANGGARAN',
  ]);

  const headerRow = worksheet.getRow(5);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });
  headerRow.height = 30;

  data.forEach((rowObj: any) => {
    const newRow = worksheet.addRow([
      rowObj.no,
      rowObj.uraian,
      rowObj.pagu,
      rowObj.realisasi_tw1,
      rowObj.realisasi_tw2,
      rowObj.realisasi_tw3,
      rowObj.realisasi_tw4,
      rowObj.total,
      rowObj.sisa,
    ]);

    newRow.getCell(1).alignment = { horizontal: 'center' };
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber >= 4) {
      for (let i = 3; i <= 9; i++) {
        row.getCell(i).numFmt = '#,##0';
      }
    }
  });

  worksheet.columns.forEach((col, index) => {
    const defaultWidths = [8, 40, 20, 30, 30, 30, 30, 20, 30];
    col.width = defaultWidths[index];
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(
    blob,
    `Daftar_dan_Jenis_DAK_Lingkup_Kabupaten_Bengkulu_Utara_Tahun_${tahun}.xlsx`,
  );
};

export const exportRankingRKPD = async (_data: any, tahun: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('RKPD');

  worksheet.mergeCells('A2:I2');
  worksheet.getCell('A2').value =
    'Rangking Evaluasi SKPD Terhadap RKPD';
  worksheet.getCell('A2').alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  worksheet.getCell('A2').font = { bold: true, size: 16 };
  worksheet.getRow(2).height = 30;

  worksheet.mergeCells('A3:I3');
  worksheet.getCell('A3').value = `Kabupaten Bengkulu Utara`;
  worksheet.getCell('A3').alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  worksheet.getCell('A3').font = { bold: true, size: 16 };
  worksheet.getRow(3).height = 30;

  worksheet.mergeCells('A4:I4');
  worksheet.getCell('A4').value = `sampai dengan Triwulan III Tahun ${tahun}`;
  worksheet.getCell('A4').alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  worksheet.getCell('A4').font = { bold: true, size: 16 };
  worksheet.getRow(4).height = 30;

  worksheet.mergeCells('A6:A7');
  worksheet.getCell('A6').value = 'Ranking';

  worksheet.mergeCells('B6:B7');
  worksheet.getCell('B6').value = 'Perangkat Daerah / Program';

  worksheet.mergeCells('C6:C7');
  worksheet.getCell('C6').value = 'Indikator Outcome Program';

  worksheet.mergeCells('D6:D7');
  worksheet.getCell('D6').value = 'Target Kinerja';

  worksheet.mergeCells('E6:F6');
  worksheet.getCell('E6').value = 'Rata - Rata Capaian Kinerja';

  worksheet.mergeCells('G6:H6');
  worksheet.getCell('G6').value = 'Rata - Rata Capaian Anggaran';

  worksheet.mergeCells('I6:I7');
  worksheet.getCell('I6').value = 'Realisasi Anggaran (Rp)';

  worksheet.getCell('E7').value = 'Persentase (%)';
  worksheet.getCell('F7').value = 'Predikat';
  worksheet.getCell('G7').value = 'Persentase (%)';
  worksheet.getCell('H7').value = 'Predikat';

  [6, 7].forEach((rowNumber) => {
    const row = worksheet.getRow(rowNumber);
    row.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  worksheet.getRow(6).height = 20;
  worksheet.getRow(7).height = 20;

  worksheet.columns.forEach((col, index) => {
    const defaultWidths = [15, 45, 45, 35, 20, 20, 20, 20, 35];
    col.width = defaultWidths[index];
  });

  // data.forEach((rowObj: any) => {
  //   const newRow = worksheet.addRow([
  //     rowObj.no,
  //     rowObj.uraian,
  //     rowObj.pagu,
  //     rowObj.realisasi_tw1,
  //     rowObj.realisasi_tw2,
  //     rowObj.realisasi_tw3,
  //     rowObj.realisasi_tw4,
  //   ]);

  //   newRow.getCell(1).alignment = { horizontal: 'center' };
  // });

  // worksheet.eachRow((row, rowNumber) => {
  //   if (rowNumber >= 4) {
  //     for (let i = 3; i <= 9; i++) {
  //       row.getCell(i).numFmt = '#,##0';
  //     }
  //   }
  // });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(
    blob,
    `Rangking_Evaluasi_SKPD_Terhadap_RKPD_Kabupaten_Bengkulu_Utara_s.d_Triwulan_III_Tahun_${tahun}.xlsx`,
  );
};