import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { waktuNowGabung } from '../../lib/helper';

/**
 * Export RKPD mimic dari file sumber.
 *
 * Data dapat berupa:
 *  - Array of objects: keys cocok dengan headerKeys array (lihat mapping di bawah)
 *  - Array of arrays: setiap item array ditulis langsung mulai dari kolom A
 *
 * @param data array data
 * @param opts.startRow (optional) baris mulai data (default 16)
 */
export const exportDAKSD = async (
    data: any[],
    tahun: string,
    periodeLaporan: string,
    periodeWaktuLaporan: string,
    // jadwal: string,
    skpd: string,
    jenis: string,
    opts?: { startRow?: number },
) => {
    const startRow = opts?.startRow ?? 17;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Worksheet');
    const defaultFont: Partial<ExcelJS.Font> = { name: 'Bookman Old Style' };

    const merges = [
        'A2:S2',
        'A3:S3',
        'A4:S4',
        'A5:S5',
        'B7:S7',
        'B8:S8',
        'B9:S9',
        'B10:S10',

        'A12:A15',
        'B12:E15', 'B16:E16',

        'F12:J13', 'F14:F15', 'G14:G15', 'H14:H15', 'I14:I15',
        'K12:M13',
        'M14:M15',

        'N12:U12', 'N13:Q13', 'R13:U13',
        'N14:O14', 'P14:Q14', 'R14:S14', 'T14:U14',
        'V12:V15', 'W12:X13', 'W14:W15', 'X14:X15', 'W16:X16'

    ];
    merges.forEach((m) => {
        try { worksheet.mergeCells(m); } catch (e) { }
    });

    const widthMap: Record<string, number> = {
        A: 15, B: 20, C: 20, D: 20, E: 20, F: 20, G: 20,
        H: 20, I: 20, J: 20, K: 20, L: 20, M: 20, N: 20, O: 20,
        P: 20, Q: 20, R: 30, S: 30,
    };
    const colLetters = Object.keys(widthMap);
    colLetters.forEach((col, idx) => {
        worksheet.getColumn(idx + 1).width = widthMap[col];
    });

    const fixedCells: Array<{ addr: string; value: string; style?: Partial<ExcelJS.Style> }> = [
        { addr: 'A2', value: `LAPORAN KEMAJUAN PELAKSANAAN KEGIATAN` },
        { addr: 'A3', value: 'DANA ALOKASI KHUSUS (DAK)' },
        { addr: 'A4', value: 'KABUPATEN BENGKULU UTARA' },
        { addr: 'A5', value: `TAHUN ANGGARAN ${tahun}` },

        { addr: 'A7', value: `${periodeLaporan}` }, { addr: 'B7', value: `${periodeWaktuLaporan}` },
        // { addr: 'A8', value: `JADWAL` }, { addr: 'B8', value: `${jadwal}` },
        { addr: 'A8', value: `SKPD` }, { addr: 'B8', value: `${skpd}` },
        { addr: 'A9', value: `JENIS` }, { addr: 'B9', value: `${jenis}` },

        { addr: 'A12', value: 'NO' }, { addr: 'A16', value: '1' },

        { addr: 'B12', value: 'URAIAN' }, { addr: 'B16', value: '2' },

        { addr: 'F12', value: 'PERENCANAAN KEGIATAN' },
        { addr: 'F14', value: 'KLASIFIKASI' }, { addr: 'F16', value: '3' },
        { addr: 'G14', value: 'VOLUME' }, { addr: 'G16', value: '4' },
        { addr: 'H14', value: 'SATUAN' }, { addr: 'H16', value: '5' },
        { addr: 'I14', value: 'PENERIMA MANFAAT' }, { addr: 'I16', value: '6' },
        { addr: 'J14', value: 'PAGU DAK FISIK' }, { addr: 'J15', value: '(Rp)' }, { addr: 'J16', value: '7' },

        { addr: 'K12', value: 'MEKANISME PELAKSANAAN' },
        { addr: 'K14', value: 'SWAKELOLA' }, { addr: 'K15', value: '(Rp)' }, { addr: 'K16', value: '8' },
        { addr: 'L14', value: 'KONTRAKTUAL' }, { addr: 'L15', value: '(Rp)' }, { addr: 'L16', value: '9' },
        { addr: 'M14', value: 'METODE PEMBAYARAN' }, { addr: 'M16', value: '10' },

        { addr: 'N12', value: `REALISASI` },
        { addr: 'N13', value: `${periodeLaporan} ${periodeWaktuLaporan}` },
        { addr: 'N14', value: 'KEUANGAN' },
        { addr: 'N15', value: '(Rp)' }, { addr: 'N16', value: '11' },
        { addr: 'O15', value: '(%)' }, { addr: 'O16', value: '12' },

        { addr: 'P14', value: 'FISIK' },
        { addr: 'P15', value: 'VOLUME' }, { addr: 'P16', value: '13' },
        { addr: 'Q15', value: '(%)' }, { addr: 'Q16', value: '14' },

        { addr: 'R13', value: `sd ${periodeLaporan} ${periodeWaktuLaporan}` },
        { addr: 'R15', value: 'KEUANGAN' },
        { addr: 'R16', value: '(Rp)' }, { addr: 'R16', value: '15' },
        { addr: 'S15', value: '(%)' }, { addr: 'S16', value: '16' },

        { addr: 'T14', value: 'FISIK' },
        { addr: 'T15', value: 'VOLUME' }, { addr: 'T16', value: '17' },
        { addr: 'U15', value: '(%)' }, { addr: 'U16', value: '18' },

        { addr: 'V12', value: 'SISA ANGGARAN' }, { addr: 'V16', value: '19' },

        { addr: 'W12', value: 'IDENTIFIKASI PERMASALAHAN' },
        { addr: 'W14', value: 'PILIHAN' }, { addr: 'X14', value: 'TEKS' }, { addr: 'W16', value: '20' },
    ];

    fixedCells.forEach((c) => {
        const cell = worksheet.getCell(c.addr);
        cell.value = c.value;
        if (c.addr === 'A2' || c.addr === 'A3' || c.addr === 'A4' || c.addr === 'A5') {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = { bold: true, size: 14 };
        }
        if (c.addr === 'A7' || c.addr === 'A8' || c.addr === 'A9' || c.addr === 'A10' || c.addr === 'B7' || c.addr === 'B8' || c.addr === 'B9' || c.addr === 'B10') {
            cell.font = { bold: true };
        }
    });

    // for (let row = 5; row <= 7; row++) {
    //     const cols = worksheet.getRow(row);
    //     cols.eachCell({ includeEmpty: true }, (cell) => {
    //         cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    //         cell.font = { bold: true };
    //     });
    // }

    //#region Mapping Data
    let rowIndex = startRow;

    const lastRow = rowIndex;
    const startCol = 1;
    const endCol = 24;

    for (let r = startRow - 5; r <= lastRow; r++) {
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


    //#region TTD
    worksheet.mergeCells(`Q${rowIndex + 4}:S${rowIndex + 4}`);
    worksheet.getRow(rowIndex + 4).getCell('Q').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 4).getCell('Q').value =
        'Kabupaten Bengkulu Utara, .........................................';
    worksheet.mergeCells(`Q${rowIndex + 10}:S${rowIndex + 10}`);
    worksheet.getRow(rowIndex + 10).getCell('Q').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 10).getCell('Q').value =
        'NIP.';
    //#endregion

    //#region KETERANGAN
    const problems = [
        'KETERANGAN PERMASALAHAN',
        '1. Permasalahan Terkait dengan Peraturan Menteri Keuangan (PMK)',
        '2. Permasalahan Terkait dengan Petunjuk Teknis',
        '3. Permasalahan Terkait dengan Rencana Kerja dan Anggaran SKPD',
        '4. Permasalahan Terkait dengan DPA - SKPD',
        '5. Permasalahan Terkait dengan SK Penetapan Pelaksanaan Kegiatan',
        '6. Permasalahan Terkait dengan Pelaksanaan Tender Pekerjaan Kontrak',
        '7. Permasalahan Terkait dengan Persiapan Pekerjaan Swakelola',
        '8. Permasalahan Terkait dengan Penerbitan SP2D',
        '9. Permasalahan Terkait dengan Pelaksanaan Pekerjaan Kontrak',
        '10. Permasalahan Terkait dengan Pelaksana Pekerjaan Swakelola'
    ];

    problems.forEach((text, i) => {
        const row = rowIndex + 4 + i;
        worksheet.mergeCells(`A${row}:E${row}`);
        const cell = worksheet.getRow(row).getCell('A');
        cell.value = text;

        // Border tipis di sekeliling sel gabungan
        ['A', 'B', 'C', 'D', 'E'].forEach((col) => {
            const c = worksheet.getCell(`${col}${row}`);
            c.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Style khusus untuk baris pertama
        if (i === 0) {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '000000' } // hitam
            };
            cell.font = { ...defaultFont, bold: true, color: { argb: 'FFFFFF' } }; // teks putih dan bold
        }
    });

    //#endregion

    worksheet.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.font = { ...defaultFont, ...(cell.font ?? {}) };
        });
    });
    for (let row = 12; row <= 16; row++) {
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
    saveAs(blob, `Laporan Kemajuan Pelaksanaan Kegiatan s.d ${periodeLaporan} ${periodeWaktuLaporan} DAK - Kabupaten Bengkulu Utara Tahun Anggaran ${tahun} ${waktuNowGabung}.xlsx`);
};