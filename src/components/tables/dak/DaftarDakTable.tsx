import { createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import MainTable from '../MainTable';
import { MdPrint, MdRefresh } from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import toast from 'react-hot-toast';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import InputSearchBox from '../../inputs/InputSearchBox';

interface DaftarDAKType {
  no: number;
  uraian: string;
  pagu: number;
  realisasi_tw1: number;
  realisasi_tw2: number;
  realisasi_tw3: number;
  realisasi_tw4: number;
  total: number;
  sisa: number;
}

export const DaftarDakTable = () => {
  const [tahunDAK, setTahunDAK] = useState('2025');
  // Kolom
  const columnHelper = createColumnHelper<DaftarDAKType>();
  const columns = [
    columnHelper.display({
      header: 'No',
      cell: ({ row }) => `${row.index + 1}`,
      meta: {
        thClassNames: 'w-[5%]',
        tdClassNames: 'text-center',
      },
    }),
    columnHelper.accessor('uraian', {
      header: 'Uraian Dana Alokasi Khusus',
    }),
    columnHelper.accessor('pagu', {
      header: 'Pagu',
    }),
    columnHelper.accessor('realisasi_tw1', {
      header: 'Realisasi TW I',
    }),
    columnHelper.accessor('realisasi_tw2', {
      header: 'Realisasi TW II',
    }),
    columnHelper.accessor('realisasi_tw3', {
      header: 'Realisasi TW III',
    }),
    columnHelper.accessor('realisasi_tw4', {
      header: 'Realisasi TW IV',
    }),
    columnHelper.accessor('total', {
      header: 'Total',
    }),
    columnHelper.accessor('sisa', {
      header: 'Sisa',
    }),
  ];

  // Dummy data
  const data = [
    {
      no: 1,
      uraian: 'Pendidikan',
      pagu: 100000000,
      realisasi_tw1: 25000000,
      realisasi_tw2: 20000000,
      realisasi_tw3: 30000000,
      realisasi_tw4: 15000000,
      total: 90000000,
      sisa: 10000000,
    },
    {
      no: 2,
      uraian: 'Kesehatan',
      pagu: 80000000,
      realisasi_tw1: 20000000,
      realisasi_tw2: 25000000,
      realisasi_tw3: 10000000,
      realisasi_tw4: 15000000,
      total: 70000000,
      sisa: 10000000,
    },
  ];

  const exportWithStyle = async () => {
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
    worksheet.getCell('A3').value = `Tahun Anggaran ${tahunDAK}`;
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

    data.forEach((rowObj) => {
      //   worksheet.addRow([
      //     rowObj.no,
      //     rowObj.uraian,
      //     rowObj.pagu,
      //     rowObj.realisasi_tw1,
      //     rowObj.realisasi_tw2,
      //     rowObj.realisasi_tw3,
      //     rowObj.realisasi_tw4,
      //     rowObj.total,
      //     rowObj.sisa,
      //   ]);
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
      `Daftar_dan_Jenis_DAK_Lingkup_Kabupaten_Bengkulu_Utara_Tahun_${tahunDAK}.xlsx`,
    );
  };

  const TableTopbar = () => {
    return (
      <>
        <div className='inline-flex flex-1 gap-1 justify-between'>
          <div className='inline-flex items-center gap-1'>
            <label htmlFor='tahun'>Tahun</label>
            <InputSearchBox
              id='tahun'
              className='h-9'
              //   defaultValue='2025'
              value={tahunDAK}
              onChange={(value) => {
                setTahunDAK(value);
              }}
              options={[
                { label: '2020', value: '2020' },
                { label: '2021', value: '2021' },
                { label: '2022', value: '2022' },
                { label: '2023', value: '2023' },
                { label: '2024', value: '2024' },
                { label: '2025', value: '2025' },
              ]}
            />
          </div>
          <div className='inline-flex flex-1 gap-1 justify-end'>
            <InputButton
              tooltip='Print'
              className='btn btn-theme w-9 h-9'
              onClick={() => {
                toast.success('Printing...');
                exportWithStyle();
              }}
            >
              <MdPrint />
            </InputButton>
            <InputButton
              tooltip='Refresh'
              className='btn btn-theme w-9 h-9'
              onClick={() => toast.success('Refreshing...')}
              // disabled={isFetching}
            >
              {/* {isFetching ? <Spinner color='var(--text-1)' /> : <MdRefresh />} */}
              <MdRefresh />
            </InputButton>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <MainTable
        data={data}
        columns={columns}
        sorting={false}
        tabletop={<TableTopbar />}
      />
    </>
  );
};
