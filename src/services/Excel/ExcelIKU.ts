import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { waktuNowGabung } from '../../lib/helper';
import { getPeriodeAkhirFromCookie, getPeriodeMulaiFromCookie } from '../../lib/usercookie';
import type { FlatHasilIK } from '../IKUIKDService';

/**
 * Export RKPD mimic dari file sumber.
 *
 * Data dapat berupa:
 *  - Array of objects: keys cocok dengan headerKeys array (lihat mapping di bawah)
 *  - Array of arrays: setiap item array ditulis langsung mulai dari kolom A
 *
 * @param data array data
 * @param opts.startRow (optional) baris mulai data (default 8)
 */
export const exportIKU = async (
    data: FlatHasilIK[],
    type: string,
    opts?: { startRow?: number },
) => {
    console.log(data)
    const mulaiPeriode = Number(getPeriodeMulaiFromCookie()!);
    const akhirPeriode = Number(getPeriodeAkhirFromCookie()!);

    const periode = [
        mulaiPeriode - 1,
        ...Array.from(
            { length: akhirPeriode - mulaiPeriode + 1 },
            (_, i) => mulaiPeriode + i,
        ),
    ];
    const startRow = opts?.startRow ?? 8;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Worksheet');

    const merges = [
        'A2:K2',
        'A3:K3',
        'A5:A6',
        'B5:B6',
        'C5:C6',
        'D5:D6',
        'E5:J5',
        'K5:P5',
        'Q5:V5',
        'W5:W6',
    ];
    merges.forEach((m) => {
        try { worksheet.mergeCells(m); } catch (e) { }
    });

    const widthMap: Record<string, number> = {
        A: 10, B: 40, C: 20, D: 20, E: 20, F: 20, G: 20,
        H: 20, I: 20, J: 20, K: 20, L: 20, M: 20, N: 20,
        O: 20, P: 20, Q: 20, R: 20, S: 20, T: 20, U: 20, V: 20, W: 20,
    };
    const colLetters = Object.keys(widthMap);
    colLetters.forEach((col, idx) => {
        worksheet.getColumn(idx + 1).width = widthMap[col];
    });

    const fixedCells: Array<{ addr: string; value: string; style?: Partial<ExcelJS.Style> }> = [
        { addr: 'A2', value: `INDIKATOR KINERJA ${type === 'iku' ? 'UTAMA' : 'DAERAH'}` },
        { addr: 'A3', value: 'PEMERINTAH KABUPATEN BENGKULU UTARA' },

        { addr: 'A5', value: 'NO' }, { addr: 'A7', value: '(01)' },

        { addr: 'B5', value: 'INDIKATOR' }, { addr: 'B7', value: '(02)' },

        { addr: 'C5', value: 'SATUAN' }, { addr: 'C7', value: '(03)' },

        { addr: 'D5', value: `BASELINE TAHUN ${mulaiPeriode - 2}` }, { addr: 'D7', value: '(04)' },

        { addr: 'E5', value: 'TARGET TAHUN' },
        { addr: 'E6', value: `${periode[0]}` }, { addr: 'E7', value: '(05)' },
        { addr: 'F6', value: `${periode[1]}` }, { addr: 'F7', value: '(06)' },
        { addr: 'G6', value: `${periode[2]}` }, { addr: 'G7', value: '(07)' },
        { addr: 'H6', value: `${periode[3]}` }, { addr: 'H7', value: '(08)' },
        { addr: 'I6', value: `${periode[4]}` }, { addr: 'I7', value: '(09)' },
        { addr: 'J6', value: `${periode[5]}` }, { addr: 'J7', value: '(10)' },

        { addr: 'K5', value: 'CAPAIAN' },
        { addr: 'K6', value: `${periode[0]}` }, { addr: 'K7', value: '(11)' },
        { addr: 'L6', value: `${periode[1]}` }, { addr: 'L7', value: '(12)' },
        { addr: 'M6', value: `${periode[2]}` }, { addr: 'M7', value: '(13)' },
        { addr: 'N6', value: `${periode[3]}` }, { addr: 'N7', value: '(14)' },
        { addr: 'O6', value: `${periode[4]}` }, { addr: 'O7', value: '(15)' },
        { addr: 'P6', value: `${periode[5]}` }, { addr: 'P7', value: '(16)' },

        { addr: 'Q5', value: 'RASIO (%)' },
        { addr: 'Q6', value: `${periode[0]}` }, { addr: 'Q7', value: '(17)' },
        { addr: 'R6', value: `${periode[1]}` }, { addr: 'R7', value: '(18)' },
        { addr: 'S6', value: `${periode[2]}` }, { addr: 'S7', value: '(19)' },
        { addr: 'T6', value: `${periode[3]}` }, { addr: 'T7', value: '(20)' },
        { addr: 'U6', value: `${periode[4]}` }, { addr: 'U7', value: '(21)' },
        { addr: 'V6', value: `${periode[5]}` }, { addr: 'V7', value: '(22)' },

        { addr: 'W5', value: 'KETERANGAN' }, { addr: 'W7', value: '(23)' },

    ];

    fixedCells.forEach((c) => {
        const cell = worksheet.getCell(c.addr);
        cell.value = c.value;
        if (c.addr === 'A2' || c.addr === 'A3') {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = { bold: true, size: 14 };
        }
    });

    for (let row = 5; row <= 7; row++) {
        const cols = worksheet.getRow(row);
        cols.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.font = { bold: true };
        });
    }

    //#region Mapping Data
    let rowIndex = startRow;

    data.forEach((item, idx) => {
        // Kalau baris urusan belum ditulis, tulis dulu urusan
        if (idx === 0 || item.urusan !== data[idx - 1].urusan) {
            // Merge kolom A sampai K untuk baris urusan
            worksheet.mergeCells(`A${rowIndex}:K${rowIndex}`);

            const urusanRow = worksheet.getRow(rowIndex);
            urusanRow.getCell('A').value = item.urusan;
            urusanRow.getCell('A').alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
            urusanRow.font = { bold: true }; // supaya urusan lebih menonjol
            rowIndex++;
        }

        const row = worksheet.getRow(rowIndex);

        row.getCell('A').value = idx + 1; // NO
        row.getCell('B').value = item.uraianName; // Indikator
        row.getCell('C').value = item.satuan;
        row.getCell('D').value = item.base_line;

        row.getCell('E').value = item.t_1_target;
        row.getCell('F').value = item.t_2_target;
        row.getCell('G').value = item.t_3_target;
        row.getCell('H').value = item.t_4_target;
        row.getCell('I').value = item.t_5_target;
        row.getCell('J').value = item.t_6_target;

        row.getCell('K').value = item.t_1_capaian;
        row.getCell('L').value = item.t_2_capaian;
        row.getCell('M').value = item.t_3_capaian;
        row.getCell('N').value = item.t_4_capaian;
        row.getCell('O').value = item.t_5_capaian;
        row.getCell('P').value = item.t_6_capaian;

        row.getCell('Q').value = item.t_1_persetase;
        row.getCell('R').value = item.t_2_persetase;
        row.getCell('S').value = item.t_3_persetase;
        row.getCell('T').value = item.t_4_persetase;
        row.getCell('U').value = item.t_5_persetase;
        row.getCell('V').value = item.t_6_persetase;

        for (let c = 1; c <= 23; c++) {
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

    console.log(data)
    const lastRow = rowIndex;
    const startCol = 1;
    const endCol = 23;

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
    for (let row = 5; row <= 7; row++) {
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


    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `Indikator Kinerja Utama Periode: ${periode[0]} - ${periode[periode.length - 1]} ${waktuNowGabung}.xlsx`);
};