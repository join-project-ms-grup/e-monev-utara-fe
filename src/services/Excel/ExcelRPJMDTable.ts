import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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
 * @param opts.startRow (optional) baris mulai data (default 13)
 */
export const exportRPJMD = async (
    data: any[],
    tahun: string,
    skpd: string,
    opts?: { startRow?: number },
) => {
    const awalPeriode = getPeriodeMulaiFromCookie();
    const akhirPeriode = getPeriodeAkhirFromCookie()
    const startRow = opts?.startRow ?? 13;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Worksheet');

    const merges = [
        'A2:AO2',
        'A3:AO3',
        'A4:AO4',
        'A7:AO7',
        'A8:AO8',
        'A9:A10', 'A11:A12',
        'B9:B10', 'B11:B12',
        'C9:C10', 'C11:C12',
        'D9:D10', 'D11:D12',
        'E9:E10', 'E11:E12',
        'F9:G10', 'F11:G11',
        'H9:Q9', 'H10:I10', 'J10:K10', 'L10:M10', 'N10:O10', 'P10:Q10', 'H11:I11', 'J11:K11', 'L11:M11', 'N11:O11', 'P11:Q11',
        'R9:AA9', 'R10:S10', 'T10:U10', 'V10:W10', 'X10:Y10', 'Z10:AA10', 'R11:S11', 'T11:U11', 'V11:W11', 'X11:Y11', 'Z11:AA11',
        'AB9:AK9', 'AB10:AC10', 'AD10:AE10', 'AF10:AG10', 'AH10:AI10', 'AJ10:AK10', 'AB11:AC11', 'AD11:AE11', 'AF11:AG11', 'AH11:AI11', 'AJ11:AK11',
        'AL9:AM10', 'AL11:AM11',
        'AN9:AO10', 'AN11:AO11'
    ];
    merges.forEach((m) => {
        try { worksheet.mergeCells(m); } catch (e) { }
    });

    const widthMap: Record<string, number> = {
        A: 5, B: 20, C: 20, D: 20, E: 20, F: 20, G: 20,
        H: 20, I: 20, J: 20, K: 20, L: 20, M: 20,
        N: 20, O: 20, P: 20, Q: 20, R: 20, S: 20,
        T: 20, U: 20, V: 20, W: 20, X: 20, Y: 20,
        Z: 20, AA: 20, AB: 20, AC: 20, AD: 20, AE: 20,
        AF: 20, AG: 20, AH: 20, AI: 20, AJ: 20, AK: 20,
        AL: 20, AM: 20, AN: 20, AO: 20
    };
    const colLetters = Object.keys(widthMap);
    colLetters.forEach((col, idx) => {
        worksheet.getColumn(idx + 1).width = widthMap[col];
    });

    const fixedCells: Array<{ addr: string; value: string; style?: Partial<ExcelJS.Style> }> = [
        { addr: 'A2', value: 'Evaluasi Terhadap Hasil RPJMD' },
        { addr: 'A3', value: 'Kabupaten Bengkulu Utara' },
        { addr: 'A4', value: `Periode Pelaksanaan: ${awalPeriode} - ${akhirPeriode}` },
        { addr: 'A7', value: 'Sasaran Pembangunan Jangka Menengah:' },
        { addr: 'A8', value: '................................................................................................' },

        { addr: 'A9', value: 'No' }, { addr: 'A11', value: '(1)' },

        { addr: 'B9', value: 'Sasaran' }, { addr: 'B11', value: '(2)' },

        { addr: 'C9', value: 'Program Prioritas' }, { addr: 'C11', value: '(3)' },

        { addr: 'D9', value: 'Indikator Kinerja' }, { addr: 'D11', value: '(4)' },

        { addr: 'E9', value: 'Data Capaian pada Awal Tahun Perencanaan' }, { addr: 'E11', value: '(5)' },

        { addr: 'F9', value: 'Target pada Akhir Tahun Perencanaan' }, { addr: 'F11', value: '(6)' }, { addr: 'F12', value: 'K' }, { addr: 'G12', value: 'Rp' },

        { addr: 'H9', value: 'Target RPJMD Kabupaten/kota Pada RKPD Kabupaten/kota Tahun Ke' },
        { addr: 'H10', value: '1' }, { addr: 'H11', value: '(7)' }, { addr: 'H12', value: 'K' }, { addr: 'I12', value: 'Rp' },
        { addr: 'J10', value: '2' }, { addr: 'J11', value: '(8)' }, { addr: 'J12', value: 'K' }, { addr: 'K12', value: 'Rp' },
        { addr: 'L10', value: '3' }, { addr: 'L11', value: '(9)' }, { addr: 'L12', value: 'K' }, { addr: 'M12', value: 'Rp' },
        { addr: 'N10', value: '4' }, { addr: 'N11', value: '(10)' }, { addr: 'N12', value: 'K' }, { addr: 'O12', value: 'Rp' },
        { addr: 'P10', value: '5' }, { addr: 'P11', value: '(11)' }, { addr: 'P12', value: 'K' }, { addr: 'Q12', value: 'Rp' },

        { addr: 'R9', value: 'Capaian Target RPJMD Kabupaten/kota Melalui Pelaksanaan RKPD Tahun Ke' },
        { addr: 'R10', value: '1' }, { addr: 'R11', value: '(12)' }, { addr: 'R12', value: 'K' }, { addr: 'S12', value: 'Rp' },
        { addr: 'T10', value: '2' }, { addr: 'T11', value: '(13)' }, { addr: 'T12', value: 'K' }, { addr: 'U12', value: 'Rp' },
        { addr: 'V10', value: '3' }, { addr: 'V11', value: '(14)' }, { addr: 'V12', value: 'K' }, { addr: 'W12', value: 'Rp' },
        { addr: 'X10', value: '4' }, { addr: 'X11', value: '(15)' }, { addr: 'X12', value: 'K' }, { addr: 'Y12', value: 'Rp' },
        { addr: 'Z10', value: '5' }, { addr: 'Z11', value: '(16)' }, { addr: 'Z12', value: 'K' }, { addr: 'AA12', value: 'Rp' },

        { addr: 'AB9', value: 'Tingkat Capaian Target RPJMD Kabupaten/kota Hasil Pelaksanaan RKPD Kabupaten/kotaTahun Ke- \n(%)' },
        { addr: 'AB10', value: '1' }, { addr: 'AB11', value: '(17)' }, { addr: 'AB12', value: 'K' }, { addr: 'AC12', value: 'Rp' },
        { addr: 'AD10', value: '2' }, { addr: 'AD11', value: '(18)' }, { addr: 'AD12', value: 'K' }, { addr: 'AE12', value: 'Rp' },
        { addr: 'AF10', value: '3' }, { addr: 'AF11', value: '(19)' }, { addr: 'AF12', value: 'K' }, { addr: 'AG12', value: 'Rp' },
        { addr: 'AH10', value: '4' }, { addr: 'AH11', value: '(20)' }, { addr: 'AH12', value: 'K' }, { addr: 'AI12', value: 'Rp' },
        { addr: 'AJ10', value: '5' }, { addr: 'AJ11', value: '(21)' }, { addr: 'AJ12', value: 'K' }, { addr: 'AK12', value: 'Rp' },

        { addr: 'AL9', value: 'Capaian Pada Akhir Tahun Perencanaan' },
        { addr: 'AL11', value: '(22)' }, { addr: 'AL12', value: 'K' }, { addr: 'AM12', value: 'Rp' },

        { addr: 'AN9', value: 'Rasio Capaian Akhir \n(%)' },
        { addr: 'AN11', value: '(23)' }, { addr: 'AN12', value: 'K' }, { addr: 'AO12', value: 'Rp' },
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

    const rowsConfig = [
        { offset: 1, merge: 'A:AA', text: 'Rata-rata capaian kinerja (%)', align: 'right' },
        { offset: 2, merge: 'A:AA', text: 'Predikat kinerja', align: 'right' },
        { offset: 3, merge: 'A:AO', text: 'Faktor pendorong keberhasilan pencapaian:' },
        { offset: 4, merge: 'A:AO', text: 'Faktor penghambat pencapaian kinerja:' },
        { offset: 5, merge: 'A:AO', text: 'Tindak lanjut yang diperlukan dalam RKPD kabupaten/kota berikutnya:' },
        { offset: 6, merge: 'A:AO', text: 'Tindak lanjut yang diperlukan dalam RPJMD kabupaten/kota berikutnya:' }
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
        'Disusun';
    worksheet.mergeCells(`AK${rowIndex + 9}:AL${rowIndex + 9}`);
    worksheet.getRow(rowIndex + 9).getCell('AK').value =
        '......................, tanggal ...................';
    worksheet.mergeCells(`AK${rowIndex + 10}:AL${rowIndex + 10}`);
    worksheet.getRow(rowIndex + 10).getCell('AK').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 10).getCell('AK').value =
        'KEPALA BAPPEDA';
    worksheet.mergeCells(`AK${rowIndex + 11}:AL${rowIndex + 11}`);
    worksheet.getRow(rowIndex + 11).getCell('AK').value =
        'KABUPATEN/KOTA ....................................';
    worksheet.mergeCells(`AK${rowIndex + 16}:AL${rowIndex + 16}`);
    worksheet.getRow(rowIndex + 16).getCell('AK').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 16).getCell('AK').value =
        '(....................................)';

    worksheet.mergeCells(`AN${rowIndex + 8}:AO${rowIndex + 8}`);
    worksheet.getRow(rowIndex + 8).getCell('AN').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 8).getCell('AN').value =
        'Disetujui';
    worksheet.mergeCells(`AN${rowIndex + 9}:AO${rowIndex + 9}`);
    worksheet.getRow(rowIndex + 9).getCell('AN').value =
        '......................, tanggal ...................';
    worksheet.mergeCells(`AN${rowIndex + 10}:AO${rowIndex + 10}`);
    worksheet.getRow(rowIndex + 10).getCell('AN').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 10).getCell('AN').value =
        'GUBERNUR';
    worksheet.mergeCells(`AN${rowIndex + 11}:AO${rowIndex + 11}`);
    worksheet.getRow(rowIndex + 11).getCell('AN').value =
        'PROVINSI ....................................';
    worksheet.mergeCells(`AN${rowIndex + 16}:AO${rowIndex + 16}`);
    worksheet.getRow(rowIndex + 16).getCell('AN').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 16).getCell('AN').value =
        '(....................................)';
    //#endregion

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `Evaluasi Terhadap Hasil RPJMD Kabupaten Bengkulu Utara Periode Pelaksanaan: tahun ${awalPeriode} - tahun ${akhirPeriode} ${waktuNowGabung}.xlsx`);
};