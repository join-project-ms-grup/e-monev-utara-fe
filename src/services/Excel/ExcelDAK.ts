import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { numOrEmpty, waktuNowGabung } from '../../lib/helper';
import { type FlatMonitoringDAK, type MasalahDAK } from '../DAK/DAKMonitoringService';

interface DakData {
    tahun: string;
    opd: string;
    jenis: string;
    subJenis: string;
    triwulan?: string;
}

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
export const exportDAK = async (
    data: FlatMonitoringDAK[],
    dataMasalah: MasalahDAK[],
    dakData: DakData,
    skpd: string,
    opts?: { startRow?: number },
) => {
    const triwulanList = [
        { value: '1', label: 'I' },
        { value: '2', label: 'II' },
        { value: '3', label: 'III' },
        { value: '4', label: 'IV' },
    ]
    const startRow = opts?.startRow ?? 16;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Worksheet');
    const defaultFont: Partial<ExcelJS.Font> = { name: 'Bookman Old Style' };

    const merges = [
        'A2:S2',
        'A3:S3',
        'A4:S4',
        'A5:S5',
        'B7:S7',
        'B10:S10',
        'B11:S11',
        'A12:A14',
        'B12:B14', 'B15:B15',

        'C12:E12', 'C13:C14', 'D13:D14', 'F13:F14',
        'F12:H12', 'G13:G14',
        'I12:L12', 'I13:J13', 'K13:L13',
        'M12:N12', 'M13:M14', 'N13:N14'
    ];
    merges.forEach((m) => {
        try { worksheet.mergeCells(m); } catch (e) { }
    });

    const widthMap: Record<string, number> = {
        A: 15, B: 40, C: 20, D: 20, E: 20, F: 20, G: 20,
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
        { addr: 'A5', value: `TAHUN ANGGARAN ${dakData.tahun}` },

        // { addr: 'A7', value: `${periodeLaporan}` }, { addr: 'B7', value: `${periodeWaktuLaporan}` },
        { addr: 'A9', value: `TRIWULAN` }, { addr: 'B9', value: `${triwulanList.find(item => item.value === dakData.triwulan)?.label}` },
        { addr: 'A10', value: `SKPD` }, { addr: 'B10', value: `${skpd.toUpperCase()}` },
        { addr: 'A11', value: `JENIS` }, { addr: 'B11', value: `${dakData.jenis === '1' ? 'FISIK' : 'NON-FISIK'}` },

        { addr: 'A12', value: 'NO' }, { addr: 'A15', value: '1' },

        { addr: 'B12', value: 'URAIAN' }, { addr: 'B15', value: '2' },

        { addr: 'C12', value: 'PERENCANAAN KEGIATAN' },
        { addr: 'C13', value: 'VOLUME' }, { addr: 'C15', value: '4' },
        { addr: 'D13', value: 'PENERIMA MANFAAT' }, { addr: 'D15', value: '6' },
        { addr: 'E13', value: 'PAGU DAK FISIK' }, { addr: 'E14', value: '(Rp)' }, { addr: 'E15', value: '7' },

        { addr: 'F12', value: 'MEKANISME PELAKSANAAN' },
        { addr: 'F13', value: 'KEGIATAN' }, { addr: 'F15', value: '8' },
        { addr: 'G13', value: 'VOLUME' }, { addr: 'G15', value: '9' },
        { addr: 'H13', value: 'PAGU DAK FISIK' }, { addr: 'H14', value: '(Rp)' }, { addr: 'H15', value: '10' },

        { addr: 'I12', value: `REALISASI ${dakData.tahun}` },
        { addr: 'I13', value: 'KEUANGAN' },
        { addr: 'I14', value: '(Rp)' }, { addr: 'I15', value: '11' },
        { addr: 'J14', value: '(%)' }, { addr: 'J15', value: '12' },
        { addr: 'K13', value: 'FISIK' },
        { addr: 'K14', value: 'VOLUME' }, { addr: 'K15', value: '13' },
        { addr: 'L14', value: 'sd' }, { addr: 'L15', value: '14' },

        { addr: 'M12', value: 'IDENTIFIKASI PERMASALAHAN' },
        { addr: 'M13', value: 'PILIHAN' }, { addr: 'N13', value: 'TEKS' }, { addr: 'M15', value: '15' },
    ];

    fixedCells.forEach((c) => {
        const cell = worksheet.getCell(c.addr);
        cell.value = c.value;
        if (c.addr === 'A2' || c.addr === 'A3' || c.addr === 'A4' || c.addr === 'A5') {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = { bold: true, size: 14 };
        }
        if (c.addr === 'A9' || c.addr === 'B9' || c.addr === 'A10' || c.addr === 'A11' || c.addr === 'B10' || c.addr === 'B11') {
            cell.font = { bold: true };
        }
    });

    //#region Mapping Data
    let rowIndex = startRow;
    let indexPaket = 1;
    data.forEach((item) => {
        const row = worksheet.getRow(rowIndex);

        if (item.nama_paket) {
            row.getCell('A').value = indexPaket;
            indexPaket++;
        } else {
            row.getCell('A').value = '';
        }
        row.getCell('A').alignment = { horizontal: 'center' }
        if (item.level === 'sub_jenis_dak') {
            row.getCell('B').value = `SUB JENIS DAK\n${item.nama}`;
        } else if (item.level === 'bidang') {
            row.getCell('B').value = `BIDANG DAK\n${item.nama}`;
        } else if (item.level === 'sub_bidang') {
            row.getCell('B').value = `SUB BIDANG DAK\n${item.nama}`;
        } else {
            row.getCell('B').value = item.nama_paket;
        }
        // row.getCell('B').value = item.nama ?? item.nama_paket;

        row.getCell('C').value = item.perencanaan?.volume;
        row.getCell('D').value = item.perencanaan?.jumlah_penerima;
        row.getCell('E').value = numOrEmpty(item.perencanaan?.anggaran);

        row.getCell('F').value = item.mekanisme?.kegiatan;
        row.getCell('G').value = item.mekanisme?.volume;
        row.getCell('H').value = numOrEmpty(item.mekanisme?.uang);

        row.getCell('I').value = numOrEmpty(item.realisasi?.keuangan?.capaian);
        row.getCell('J').value = item.realisasi?.keuangan?.persen;
        row.getCell('K').value = item.realisasi?.fisik?.capaian;
        row.getCell('L').value = item.realisasi?.fisik?.totalSd;

        const fmtRupiah = '"Rp"* #,##0.00;[<0]"Rp"* "-"#,##0.00;"Rp"* "0"';
        ['E', 'H', 'I'].forEach((col) => {
            row.getCell(col).numFmt = fmtRupiah;
        });

        for (let c = 2; c <= 2; c++) {
            const cell = row.getCell(c);
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
            cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
            if (item.nama) {
                cell.font = { bold: true }
            }
        }

        rowIndex++;
    });

    const lastRow = rowIndex;
    const startCol = 1;
    const endCol = 14;

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
    //#endregion


    //#region TTD
    worksheet.mergeCells(`L${rowIndex + 3}:N${rowIndex + 3}`);
    worksheet.getRow(rowIndex + 3).getCell('L').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 3).getCell('L').value =
        'Kabupaten Bengkulu Utara, .........................................';
    worksheet.mergeCells(`L${rowIndex + 9}:N${rowIndex + 9}`);
    worksheet.getRow(rowIndex + 9).getCell('L').alignment = { horizontal: 'center' }
    worksheet.getRow(rowIndex + 9).getCell('L').value =
        'NIP.';
    //#endregion

    //#region KETERANGAN
    const problems = [
        'KETERANGAN PERMASALAHAN',
    ];

    dataMasalah.forEach((item, index) => {
        problems.push(`${index + 1}. ${item.name}`)
    })

    problems.forEach((text, i) => {
        const row = rowIndex + 3 + i;
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
    for (let row = 12; row <= 15; row++) {
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
    saveAs(blob, `Laporan Kemajuan Pelaksanaan Kegiatan DAK - Kabupaten Bengkulu Utara Tahun Anggaran ${dakData.tahun} Triwulan ${triwulanList.find(item => item.value === dakData.triwulan)?.label} ${waktuNowGabung}.xlsx`);
};