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
        'K5:K6',
    ];
    merges.forEach((m) => {
        try { worksheet.mergeCells(m); } catch (e) { }
    });

    const widthMap: Record<string, number> = {
        A: 10, B: 40, C: 20, D: 20, E: 20, F: 20, G: 20,
        H: 20, I: 20, J: 20, K: 20, L: 20, M: 20
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
        { addr: 'K5', value: 'KETERANGAN' }, { addr: 'K7', value: '(13)' },

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

        row.getCell('E').value = item.t_1_capaian;
        row.getCell('F').value = item.t_2_capaian;
        row.getCell('G').value = item.t_3_capaian;
        row.getCell('H').value = item.t_4_capaian;
        row.getCell('I').value = item.t_5_capaian;
        row.getCell('J').value = item.t_6_capaian;

        for (let c = 1; c <= 11; c++) {
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
    const endCol = 11;

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