import React from 'react';
import Tabel from '../../Tabel';
import InputButton from '../../../inputs/InputButton';
import { MdPrint, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import type { ColumnDef } from '@tanstack/react-table';
import { exportRPJMD } from '../../../../services/Excel/ExcelRPJMDTable';

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={2}>No</th>
        <th rowSpan={2}>Sasaran</th>
        <th rowSpan={2}>Program Prioritas</th>
        <th rowSpan={2}>Indikator Kinerja</th>
        <th rowSpan={2}>Data Capaian pada Awal Tahun Perencanaan</th>
        <th colSpan={2}>Target pada Akhir Tahun Perencanaan</th>
        <th colSpan={2}>Capaian Pada Akhir Tahun Perencanaan</th>
        <th colSpan={2}>
          Rasio Capaian Akhir <br />
          (%)
        </th>
      </tr>
      <tr>
        <th>K</th>
        <th>Rp</th>
        <th>K</th>
        <th>Rp</th>
        <th>K</th>
        <th>Rp</th>
      </tr>
    </>
  );
};

const RPJMDTable = () => {
  const columns: ColumnDef<any>[] = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
    { id: '11' },
  ];

  return (
    <>
      <div className='space-y-2'>
        <div className='flex items-end justify-between'>
          <div></div>
          <div className='inline-flex gap-2'>
            <InputButton
              tooltip='Print'
              className='btn btn-theme w-9 h-9'
              onClick={async () => {
                toast.success('Printing...');
                // if (data) {
                //   toast.success('Printing...');
                //   const tahunLabel =
                //     listTahunKe.find((t) => t.value === tahunKe)?.label ?? '';
                //   const skpdLabel =
                //     dataSKPDPeriode?.find((s) => s.id === Number(selectedSKPD))
                //       ?.name ?? '';
                  await exportRPJMD([], '2025', 'Contoh SKPD');
                // }
              }}
            >
              <MdPrint />
            </InputButton>
            <InputButton
              tooltip='Refresh'
              className='btn btn-theme w-9 h-9'
              //   onClick={() => refetch()}
              //   disabled={isFetching}
            >
              {/* {isFetching ? <Spinner color='var(--text-1)' /> : <MdRefresh />} */}
              <MdRefresh />
            </InputButton>
          </div>
        </div>
        <Tabel data={[]} columns={columns} renderHeader={tableHead} />
      </div>
    </>
  );
};

export default RPJMDTable;
