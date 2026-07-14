import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { waktuNowGabung } from '../../lib/helper';
// import { getPeriodeAkhirFromCookie, getPeriodeMulaiFromCookie } from '../../lib/usercookie';
import type { DashboardRankingResult } from '../DashRKPDService';
import type { RekapDak } from '../DAK/DAKMonitoringService';

export const exportRanking = async (
    data: RekapDak[],
    jenis: string,
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
    const startRow = opts?.startRow ?? 7;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Worksheet');

    if(jenis === 'DAK Fisik'){
        const merges = [
            'A2:G2',
            'A4:A6',
            'B4:B6',
            'C4:C6',
            'D4:D6',
            'E4:G4',
            'E5:F5',
            'G5:G6'
        ];
        merges.forEach((m) => {
            try { worksheet.mergeCells(m); } catch (e) { }
        });
    }else{
        const merges = [
            'A2:G2',
            'A4:A6',
            'B4:B6',
            'C4:C6',
            'D4:D6',
            'E4:F4',
            'F5:F6'
        ];
        merges.forEach((m) => {
            try { worksheet.mergeCells(m); } catch (e) { }
        });
    }

    const widthMap: Record<string, number> = {
        A: 10, B: 40, C: 15, D: 25, E: 15, F: 15, G: 15
    };
    const colLetters = Object.keys(widthMap);
    colLetters.forEach((col, idx) => {
        worksheet.getColumn(idx + 1).width = widthMap[col];
    });

    let fixedCells: Array<{ addr: string; value: string; style?: Partial<ExcelJS.Style> }> = []

    if(jenis === 'DAK Fisik'){
            fixedCells = [
                { addr: 'A2', value: `REALISASI ${jenis.toUpperCase()} TRIWULAN ${triwulan} TAHUN ${tahun}` },
                { addr: 'A4', value: 'No' },
                { addr: 'B4', value: 'Nama OPD' },
                { addr: 'C4', value: 'Jumlah Paket' },
                { addr: 'D4', value: 'Jumlah Anggaran (Rp.)' },
                { addr: 'E4', value: 'Realisasi (%)' },
                { addr: 'E5', value: `${jenis}` }, { addr: 'E6', value: 'Fisik' }, { addr: 'F6', value: 'Keuangan' },
                { addr: 'G5', value: 'Total Persentase' },

            ];
    }else{
        fixedCells = [
                { addr: 'A2', value: `REALISASI ${jenis.toUpperCase()} TRIWULAN ${triwulan} TAHUN ${tahun}` },
                { addr: 'A4', value: 'No' },
                { addr: 'B4', value: 'Nama OPD' },
                { addr: 'C4', value: 'Jumlah Paket' },
                { addr: 'D4', value: 'Jumlah Anggaran (Rp.)' },
                { addr: 'E4', value: 'Realisasi (%)' },
                { addr: 'E5', value: `${jenis}` }, { addr: 'E6', value: 'Keuangan' },
                { addr: 'F5', value: 'Total Persentase' },

            ];
    }

    fixedCells.forEach((c) => {
        const cell = worksheet.getCell(c.addr);
        cell.value = c.value;
        if (c.addr === 'A2') {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = { bold: true, size: 12 };
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

    // console.log(data);

    if(jenis === 'DAK Fisik'){
        data.forEach((item) => {
            const row = worksheet.getRow(rowIndex);

            row.getCell('A').value = item.rangking;
            row.getCell('B').value = item.nama_opd;
            row.getCell('C').value = item.jumlah_paket;
            row.getCell('D').value = item.jumlah_anggaran;
            row.getCell('E').value = item.realisasi_volume;
            row.getCell('F').value = item.realisasi_keuangan;
            row.getCell('G').value = item.persentase;

            for (let c = 1; c <= 7; c++) {
                const cell = row.getCell(c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
                cell.alignment = {
                    vertical: 'middle',
                    horizontal: c === 1 ? 'center' : c === 2 ? 'left' : 'right',
                    wrapText: true,
                };
            }

            rowIndex++;
        });
    }else{
        data.forEach((item) => {
            const row = worksheet.getRow(rowIndex);

            row.getCell('A').value = item.rangking;
            row.getCell('B').value = item.nama_opd;
            row.getCell('C').value = item.jumlah_paket;
            row.getCell('D').value = item.jumlah_anggaran;
            row.getCell('E').value = item.realisasi_keuangan;
            row.getCell('F').value = item.persentase;

            for (let c = 1; c <= 6; c++) {
                const cell = row.getCell(c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
                cell.alignment = {
                    vertical: 'middle',
                    horizontal: c === 1 ? 'center' : c === 2 ? 'left' : 'right',
                    wrapText: true,
                };
            }

            rowIndex++;
        });
    }

    const lastRow = rowIndex;
    const startCol = 1;
    let endCol = 0;
    if(jenis === 'DAK Fisik'){
        endCol = 7;
    }else{
        endCol = 6;
    }
   

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
    for (let row = 4; row <= 6; row++) {
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
    saveAs(blob, `RANKING EVALUASI ${jenis} ${tahun} TRIWULAN ${triwulan} ${waktuNowGabung}.xlsx`);
};