import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { numOrEmpty, renderSatuan, waktuNowGabung } from '../../lib/helper';
import { getPeriodeAkhirFromCookie, getPeriodeMulaiFromCookie } from '../../lib/usercookie';
import type { FlatRKPDTriwulan } from '../RKPDService';

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
export const exportRenja = async (
    data: FlatRKPDTriwulan[],
    skpd: string,
    opts?: { startRow?: number },
) => {
    const awalPeriode = getPeriodeMulaiFromCookie();
    const akhirPeriode = getPeriodeAkhirFromCookie()
    const startRow = opts?.startRow ?? 13;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Worksheet');

    const merges = [
        'A2:Y2',
        'A3:Y3',
        'A7:Y7',
        'A8:Y8',
        'A9:A10', 'A11:A12',
        'B9:B10', 'B11:B12',
        'C9:C10', 'C11:C12',
        'D9:D10', 'D11:D12',
        'E9:F10', 'E11:F11',
        'G9:H10', 'G11:H11',
        'I9:J10', 'I11:J11',
        'K9:R9', 'K10:L10', 'K11:L11', 'M10:N10', 'M11:N11', 'O10:P10', 'O11:P11', 'Q10:R10', 'Q11:R11',
        'S9:T10', 'S11:T11',
        'U9:V10', 'U11:V11',
        'W9:X10', 'W11:X11',
        'Y9:Y10', 'Y11:Y12',
    ];
    merges.forEach((m) => {
        try { worksheet.mergeCells(m); } catch (e) { }
    });

    const widthMap: Record<string, number> = {
        A: 5, B: 20, C: 40, D: 40,
        E: 30, F: 30, G: 30,
        H: 30, I: 30, J: 30, K: 30, L: 30, M: 30,
        N: 30, O: 30, P: 30, Q: 30, R: 30, S: 30,
        T: 30, U: 30, V: 30, W: 30, X: 30, Y: 30,
    };
    const colLetters = Object.keys(widthMap);
    colLetters.forEach((col, idx) => {
        worksheet.getColumn(idx + 1).width = widthMap[col];
    });

    const fixedCells: Array<{ addr: string; value: string; style?: Partial<ExcelJS.Style> }> = [
        { addr: 'A2', value: 'Evaluasi Terhadap Hasil Renja Perangkat Daerah Lingkup Kabupaten/kota' },
        { addr: 'A3', value: `Renja Perangkat Daerah ${skpd} Kabupaten Bengkulu Utara` },
        { addr: 'A4', value: `` },
        { addr: 'A7', value: 'Indikator dan target kinerja Perangkat Daerah Kabupaten/Kota yang mengacu pada sasaran RKPD:' },
        { addr: 'A8', value: '................................................................................................' },

        { addr: 'A9', value: 'No' }, { addr: 'A11', value: '(1)' },

        { addr: 'B9', value: 'Sasaran' }, { addr: 'B11', value: '(2)' },

        { addr: 'C9', value: 'Program / Kegiatan' }, { addr: 'C11', value: '(3)' },

        { addr: 'D9', value: 'Indikator Kinerja Program (outcome) / Kegiatan (output)' }, { addr: 'D11', value: '(4)' },

        { addr: 'E9', value: `Target Renstra Perangkat Daerah pada Tahun ${awalPeriode}` }, { addr: 'E11', value: '(5)' },
        { addr: 'E12', value: 'K' }, { addr: 'F12', value: 'Rp' },

        { addr: 'G9', value: 'Realisasi Capaian Kinerja Renstra Perangkat Daerah sampai dengan Renja Perangkat Daerah Tahun Lalu\n(n-2)' },
        { addr: 'G11', value: '(6)' }, { addr: 'G12', value: 'K' }, { addr: 'H12', value: 'Rp' },

        { addr: 'I9', value: 'Target Kinerja dan Anggaran Renja Perangkat Daerah Tahun berjalan (Tahun n-1) yang dievaluasi' },
        { addr: 'I11', value: '(7)' }, { addr: 'I12', value: 'K' }, { addr: 'J12', value: 'Rp' },

        { addr: 'K9', value: 'Realisasi Kinerja Pada Triwulan' },
        { addr: 'K10', value: 'I' }, { addr: 'K11', value: '(8)' }, { addr: 'K12', value: 'K' }, { addr: 'L12', value: 'Rp' },
        { addr: 'M10', value: 'II' }, { addr: 'M11', value: '(9)' }, { addr: 'M12', value: 'K' }, { addr: 'N12', value: 'Rp' },
        { addr: 'O10', value: 'III' }, { addr: 'O11', value: '(10)' }, { addr: 'O12', value: 'K' }, { addr: 'P12', value: 'Rp' },
        { addr: 'Q10', value: 'IV' }, { addr: 'Q11', value: '(11)' }, { addr: 'Q12', value: 'K' }, { addr: 'R12', value: 'Rp' },

        { addr: 'S9', value: 'Realisasi Capaian Kinerja dan Anggaran Renja Perangkat Daerah yang dievaluasi' },
        { addr: 'S11', value: '(12)' }, { addr: 'S12', value: 'K' }, { addr: 'T12', value: 'Rp' },

        { addr: 'U9', value: `Realisasi Kinerja dan Anggaran Renstra Perangkat Daerah s/d tahun ${akhirPeriode}` },
        { addr: 'U11', value: '(13)' }, { addr: 'U12', value: 'K' }, { addr: 'V12', value: 'Rp' },

        { addr: 'W9', value: `Tingkat Capaian Kinerja Dan Realisasi Anggaran Renstra Perangkat Daerah s/d tahun ${akhirPeriode}\n(%)` },
        { addr: 'W11', value: '(14)' }, { addr: 'W12', value: 'K' }, { addr: 'X12', value: 'Rp' },

        { addr: 'Y9', value: 'Perangkat Daerah Penanggung Jawab' }, { addr: 'Y11', value: '(15)' },
    ];

    fixedCells.forEach((c) => {
        const cell = worksheet.getCell(c.addr);
        cell.value = c.value;
        if (c.addr === 'A2' || c.addr === 'A3') {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = { bold: true, size: 14 };
        }
    });

    ['A7', 'A8'].forEach((col) => {
        const cell = worksheet.getCell(col);
        cell.font = { bold: true };
    });

    //#region Mapping Data
    let rowIndex = startRow;
    data.forEach((item, idx) => {
        const row = worksheet.getRow(rowIndex);

        // 1
        row.getCell('A').value = idx + 1;
        row.getCell('A').alignment = { horizontal: 'center' }
        // 3
        row.getCell('C').value = item.name;
        // 4
        row.getCell('D').value = item.ind_name;
        // 5
        row.getCell('E').value = renderSatuan(item.ind_target_akhir_periode, item.ind_satuan);
        row.getCell('F').value = numOrEmpty(item.paguPeriode);
        // 6
        row.getCell('G').value = renderSatuan(item.total_capaian, item.ind_satuan);
        row.getCell('H').value = numOrEmpty(item.totalRealisasi);
        // 7
        row.getCell('I').value = renderSatuan(item.ind_target_tahun_dievaluasi, item.ind_satuan);
        row.getCell('J').value = numOrEmpty(item.paguTahunEval);
        // 8
        row.getCell('K').value = renderSatuan(item.ind_triwulan_capaian_1, item.ind_satuan);
        row.getCell('L').value = numOrEmpty(item.pagu_triwulan_realisasi_1);
        // 9
        row.getCell('M').value = renderSatuan(item.ind_triwulan_capaian_2, item.ind_satuan);
        row.getCell('N').value = numOrEmpty(item.pagu_triwulan_realisasi_2);
        // 10
        row.getCell('O').value = renderSatuan(item.ind_triwulan_capaian_3, item.ind_satuan);
        row.getCell('P').value = numOrEmpty(item.pagu_triwulan_realisasi_3);
        // 11
        row.getCell('Q').value = renderSatuan(item.ind_triwulan_capaian_4, item.ind_satuan);
        row.getCell('R').value = numOrEmpty(item.pagu_triwulan_realisasi_4);
        // 12
        row.getCell('S').value = renderSatuan(item.ind_triwulan_capaian_3, item.ind_satuan);
        row.getCell('T').value = numOrEmpty(item.pagu_triwulan_realisasi_3);
        // 13
        row.getCell('U').value = renderSatuan(item.total_capaian_periode, item.ind_satuan);
        row.getCell('V').value = numOrEmpty(item.totalRealisasiPeriode);
        // 14
        row.getCell('W').value = numOrEmpty(item.persen_capaian);
        row.getCell('W').numFmt = '0.00%';
        row.getCell('X').value = numOrEmpty(item.persenRealisasi);
        row.getCell('X').numFmt = '0.00%';
        // 15
        row.getCell('Y').value = skpd;

        const fmtRupiah = '"Rp"* #,##0.00;[<0]"Rp"* "-"#,##0.00;"Rp"* "0"';
        ['F', 'H', 'J', 'L', 'N', 'P', 'R', 'T', 'V'].forEach((col) => {
            row.getCell(col).numFmt = fmtRupiah;
        });

        ['C', 'D', 'Y',].forEach((col) => {
            row.getCell(col).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
        });


        // ['E', 'G', 'I', 'K', 'M', 'O', 'Q', 'S', 'U'].forEach((col) => {
        //     row.getCell(col).alignment = { vertical: 'top', horizontal: 'center' };
        // });
        // for (let c = 1; c <= 11; c++) {
        //     const cell = row.getCell(c);
        //     cell.border = {
        //         top: { style: 'thin' },
        //         left: { style: 'thin' },
        //         bottom: { style: 'thin' },
        //         right: { style: 'thin' },
        //     };
        //     cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
        // }

        rowIndex++;
    });

    const lastRow = rowIndex;
    const startCol = 1;
    const endCol = 25;

    for (let r = startRow - 4; r <= lastRow; r++) {
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

    const rowsConfig = [
        { offset: 1, merge: 'A:J', text: 'Rata-rata capaian kinerja (%)', align: 'right' },
        { offset: 2, merge: 'A:J', text: 'Predikat kinerja', align: 'right' },
        { offset: 3, merge: 'A:Y', text: 'Faktor pendorong keberhasilan kinerja:' },
        { offset: 4, merge: 'A:Y', text: 'Faktor penghambat pencapaian kinerja:' },
        { offset: 5, merge: 'A:Y', text: 'Tindak lanjut yang diperlukan dalam triwulan berikutnya*):' },
        { offset: 6, merge: 'A:Y', text: 'Tindak lanjut yang diperlukan dalam Renja Perangkat Daerah kabupaten/kota berikutnya*):' }
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

    worksheet.mergeCells(`U${rowIndex + 8}:V${rowIndex + 8}`);
    worksheet.getRow(rowIndex + 8).getCell('U').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 8).getCell('U').value =
        'Disusun';
    worksheet.mergeCells(`U${rowIndex + 9}:V${rowIndex + 9}`);
    worksheet.getRow(rowIndex + 9).getCell('U').value =
        '......................, tanggal ...................';
    worksheet.mergeCells(`U${rowIndex + 10}:V${rowIndex + 10}`);
    worksheet.getRow(rowIndex + 10).getCell('U').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 10).getCell('U').value =
        'KEPALA Perangkat Daerah....................................';
    worksheet.mergeCells(`U${rowIndex + 11}:V${rowIndex + 11}`);
    worksheet.getRow(rowIndex + 11).getCell('U').value =
        'KAB/KOTA ....................................';
    worksheet.mergeCells(`U${rowIndex + 16}:V${rowIndex + 16}`);
    worksheet.getRow(rowIndex + 16).getCell('U').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 16).getCell('U').value =
        '(....................................)';

    worksheet.mergeCells(`X${rowIndex + 8}:Y${rowIndex + 8}`);
    worksheet.getRow(rowIndex + 8).getCell('X').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 8).getCell('X').value =
        'Dievaluasi';
    worksheet.mergeCells(`X${rowIndex + 9}:Y${rowIndex + 9}`);
    worksheet.getRow(rowIndex + 9).getCell('X').value =
        '......................, tanggal ...................';
    worksheet.mergeCells(`X${rowIndex + 10}:Y${rowIndex + 10}`);
    worksheet.getRow(rowIndex + 10).getCell('X').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 10).getCell('X').value =
        'KEPALA BAPPEDA';
    worksheet.mergeCells(`X${rowIndex + 11}:Y${rowIndex + 11}`);
    worksheet.getRow(rowIndex + 11).getCell('X').value =
        'KAB/KOTA ....................................';
    worksheet.mergeCells(`X${rowIndex + 16}:Y${rowIndex + 16}`);
    worksheet.getRow(rowIndex + 16).getCell('X').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 16).getCell('X').value =
        '(....................................)';
    //#endregion

    // Semua font default menggunakan Bookman Old Style
    const defaultFont: Partial<ExcelJS.Font> = { name: 'Bookman Old Style' };

    // Terapkan font ke seluruh sheet (semua baris yang ada)
    worksheet.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.font = { ...defaultFont, ...(cell.font ?? {}) };
        });
    });

    // Baris 9-12, tambahkan background abu-abu dan center alignment
    for (let row = 9; row <= 12; row++) {
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
    saveAs(blob, `Evaluasi Terhadap Hasil Renja Perangkat Daerah ${skpd} Lingkup Kabupaten Bengkulu Utara Periode Pelaksanaan: tahun ${awalPeriode} - tahun ${akhirPeriode} ${waktuNowGabung}.xlsx`);
};