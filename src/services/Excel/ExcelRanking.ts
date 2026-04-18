import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { waktuNowGabung } from '../../lib/helper';
// import { getPeriodeAkhirFromCookie, getPeriodeMulaiFromCookie } from '../../lib/usercookie';
import type { DashboardRankingResult } from '../DashRKPDService';

export const exportRanking = async (
    data: DashboardRankingResult[],
    tahun: string,
    triwulan: string,
    opts?: { startRow?: number },
) => {
    // const mulaiPeriode = Number(getPeriodeMulaiFromCookie()!);
    // const akhirPeriode = Number(getPeriodeAkhirFromCookie()!);

    // const periode = [
    //     mulaiPeriode - 1,
    //     ...Array.from(
    //         { length: akhirPeriode - mulaiPeriode + 1 },
    //         (_, i) => mulaiPeriode + i,
    //     ),
    // ];
    const startRow = opts?.startRow ?? 9;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Worksheet');

    const merges = [
        'A2:K2',
        'A3:K3',
        'A4:K4',
        'A6:A8',
        'B6:B8',
        'C6:F6', 'C7:D7', 'E7:F7',
        'G6:J6', 'G7:H7', 'I7:J7',
        'K6:L6'
    ];
    merges.forEach((m) => {
        try { worksheet.mergeCells(m); } catch (e) { }
    });

    const widthMap: Record<string, number> = {
        A: 15, B: 40, C: 20, D: 20, E: 20, F: 20, G: 20,
        H: 20, I: 20, J: 20, K: 20, L: 20
    };
    const colLetters = Object.keys(widthMap);
    colLetters.forEach((col, idx) => {
        worksheet.getColumn(idx + 1).width = widthMap[col];
    });

    const fixedCells: Array<{ addr: string; value: string; style?: Partial<ExcelJS.Style> }> = [
        { addr: 'A2', value: `RANKING EVALUASI SKPD TERHADAP RKPD` },
        { addr: 'A3', value: 'PEMERINTAH KABUPATEN BENGKULU UTARA' },
        { addr: 'A4', value: `TAHUN ${tahun} TRIWULAN ${triwulan}` },

        { addr: 'A6', value: 'RANKING' },
        { addr: 'B6', value: 'PERANGKAT DAERAH' },

        { addr: 'C6', value: 'RATA-RATA CAPAIAN KINERJA' },
        { addr: 'C7', value: 'TRIWULAN' }, { addr: 'C8', value: '(%)' }, { addr: 'D8', value: 'P' },
        { addr: 'E7', value: 'S/D TRIWULAN' }, { addr: 'E8', value: '(%)' }, { addr: 'F8', value: 'P' },

        { addr: 'G6', value: 'RATA-RATA CAPAIAN ANGGARAN' },
        { addr: 'G7', value: 'TRIWULAN' }, { addr: 'G8', value: '(%)' }, { addr: 'H8', value: 'P' },
        { addr: 'I7', value: 'S/D TRIWULAN' }, { addr: 'I8', value: '(%)' }, { addr: 'J8', value: 'P' },

        { addr: 'K6', value: 'REALISASI ANGGARAN' },
        { addr: 'K7', value: 'TRIWULAN' }, { addr: 'K8', value: 'RP' },
        { addr: 'L7', value: 'S/D TRIWULAN' }, { addr: 'L8', value: 'RP' },


    ];

    fixedCells.forEach((c) => {
        const cell = worksheet.getCell(c.addr);
        cell.value = c.value;
        if (c.addr === 'A2' || c.addr === 'A3' || c.addr === 'A4') {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = { bold: true, size: 14 };
        }
    });

    for (let row = 6; row <= 8; row++) {
        const cols = worksheet.getRow(row);
        cols.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.font = { bold: true };
        });
    }

    //#region Mapping Data
    let rowIndex = startRow;

    console.log(data);

    data.forEach((item) => {
        const row = worksheet.getRow(rowIndex);

        row.getCell('A').value = item.rangking;
        row.getCell('B').value = item.name;

        row.getCell('C').value = item.rata_rata_triwulan.capaian;
        row.getCell('D').value = item.rata_rata_triwulan.c_predikat;

        row.getCell('E').value = item.rata_rata_kumulatif.capaian;
        row.getCell('F').value = item.rata_rata_kumulatif.c_predikat;

        row.getCell('G').value = item.rata_rata_triwulan.realisasi;
        row.getCell('H').value = item.rata_rata_triwulan.r_predikat;

        row.getCell('I').value = item.rata_rata_kumulatif.realisasi;
        row.getCell('J').value = item.rata_rata_kumulatif.r_predikat;

        row.getCell('K').value = item.total_realisasi.triwulan;
        row.getCell('L').value = item.total_realisasi.kumulatif;

        for (let c = 1; c <= 12; c++) {
            const cell = row.getCell(c);
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
            cell.alignment = { vertical: 'middle', horizontal: c === 2 ? 'left' : 'center', wrapText: true };
        }

        rowIndex++;
    });

    const lastRow = rowIndex;
    const startCol = 1;
    const endCol = 12;

    for (let r = startRow - 3; r <= lastRow; r++) {
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
    //#endregion
    const defaultFont: Partial<ExcelJS.Font> = { name: 'Bookman Old Style' };
    worksheet.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.font = { ...defaultFont, ...(cell.font ?? {}) };
        });
    });
    for (let row = 6; row <= 8; row++) {
        const worksheetRow = worksheet.getRow(row);
        worksheetRow.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD9D9D9' },
            };
            cell.font = { ...defaultFont, bold: true };
        });
    }


const ket = [
    'KETERANGAN PREDIKAT',
    'ST: SANGAT TINGGI (>90 dan <=100)',
    'T: TINGGI (>75 dan <=90)',
    'S: SEDANG (>65 dan <=75)',
    'R: RENDAH (>50 dan <=65)',
    'SR: SANGAT RENDAH (<=50)',
    'UNK: UNKNOWN (<0 atau >100)',
];

ket.forEach((text, i) => {
    const row = rowIndex + 2 + i;
    const rowObj = worksheet.getRow(row);

    if (i === 0) {
        rowObj.getCell('A').value = text;
        worksheet.mergeCells(`A${row}:B${row}`);
        const cell = rowObj.getCell('A');
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '000000' }
        };
        cell.font = { ...defaultFont, bold: true, color: { argb: 'FFFFFF' } };
    } else {
        const [kode, keterangan] = text.split(':').map(v => v.trim());
        rowObj.getCell('A').value = kode;
        rowObj.getCell('B').value = keterangan;
    }

    ['A', 'B'].forEach((col) => {
        const c = worksheet.getCell(`${col}${row}`);
        c.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });
});


    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `RANKING EVALUASI SKPD TERHADAP RKPD KABUPATEN BENGKULU UTARA TAHUN ${tahun} TRIWULAN ${triwulan} ${waktuNowGabung}.xlsx`);
};