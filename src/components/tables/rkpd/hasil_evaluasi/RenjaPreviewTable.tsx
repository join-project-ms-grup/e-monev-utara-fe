import React, {  } from 'react';
import Tabel from '../../Tabel';
import type { ColumnDef } from '@tanstack/react-table';
import type { FlatRenstraRow } from '../../../../services/RenstraService';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeMulaiFromCookie,
} from '../../../../lib/usercookie';
import { MdClose, MdPrint } from 'react-icons/md';
import InputButton from '../../../inputs/InputButton';

interface MainTableProps {
  data: FlatRenstraRow[];
  skpd: string;
  onClose: () => void;
  onCetak: () => void;
}

const RenjaPreviewTable = ({
  data,
  skpd,
  onCetak,
  onClose,
}: MainTableProps) => {
  //#region Head Tabel
  const tableHead = () => {
    return (
      <>
        <tr>
          <th rowSpan={2}>No</th>
          <th rowSpan={2}>Sasaran</th>
          <th rowSpan={2}> Program/ Kegiatan</th>
          <th rowSpan={2}>
            Indikator Kinerja Program (outcome)/ Kegiatan (output)
          </th>
          <th rowSpan={2} colSpan={2}>
            Target Renstra Perangkat Daerah pada Tahun{' '}
            {getPeriodeAkhirFromCookie()}
          </th>
          <th rowSpan={2} colSpan={2}>
            Realisasi Capaian Kinerja Renstra Perangkat Daerah sampai dengan
            Renja Perangkat Daerah Tahun Lalu
            <br />
            (n-2)
          </th>
          <th rowSpan={2} colSpan={2}>
            Target Kinerja dan Anggaran Renja Perangkat Daerah Tahun berjalan
            (Tahun n-1) yang dievaluasi
          </th>
          <th rowSpan={1} colSpan={8}>
            Realisasi Kinerja Pada Triwulan
          </th>
          <th rowSpan={2} colSpan={2}>
            Realisasi Capaian Kinerja dan Anggaran Renja Perangkat Daerah yang
            dievaluasi
          </th>
          <th rowSpan={2} colSpan={2}>
            Realisasi Kinerja dan Anggaran Renstra Perangkat Daerah s/d tahun
            {` `}
            {getPeriodeAkhirFromCookie()}
          </th>
          <th rowSpan={2} colSpan={2}>
            Tingkat Capaian Kinerja Dan Realisasi Anggaran Renstra Perangkat
            Daerah s/d tahun
            {` `}
            {getPeriodeAkhirFromCookie()}
            <br />
            (%)
          </th>
          <th rowSpan={2}>Perangkat Daerah Penanggung Jawab</th>
        </tr>
        <tr>
          <th colSpan={2}>I</th>
          <th colSpan={2}>II</th>
          <th colSpan={2}>III</th>
          <th colSpan={2}>IV</th>
        </tr>
        <tr>
          <th rowSpan={2}>(1)</th>
          <th rowSpan={2}>(2)</th>
          <th rowSpan={2}>(3)</th>
          <th rowSpan={2}>(4)</th>
          {[...Array(10)].map((_, i) => (
            <th key={i} rowSpan={1} colSpan={2}>
              ({i + 5})
            </th>
          ))}
          <th rowSpan={2}>(15)</th>
        </tr>
        <tr>
          {[...Array(10)].map((_, i) => (
            <React.Fragment key={i}>
              <th>K</th>
              <th>Rp.</th>
            </React.Fragment>
          ))}
        </tr>
      </>
    );
  };
  //#endregion
  const customAkhir = () => {
    return (
      <>
        <tr>
          <td colSpan={10} className='text-right'>
            Rata-rata capaian kinerja (%)
          </td>
          <td colSpan={15}></td>
        </tr>
        <tr>
          <td colSpan={10} className='text-right'>
            Predikat kinerja
          </td>
          <td colSpan={15}></td>
        </tr>
        <tr>
          <td colSpan={25}>Faktor pendorong keberhasilan kinerja:</td>
        </tr>
        <tr>
          <td colSpan={25}>Faktor penghambat pencapaian kinerja:</td>
        </tr>
        <tr>
          <td colSpan={25}>
            Tindak lanjut yang diperlukan dalam triwulan berikutnya*{`)`}:
          </td>
        </tr>
        <tr>
          <td colSpan={25}>
            Tindak lanjut yang diperlukan dalam Renja Perangkat Daerah
            kabupaten/kota berikutnya*{`)`}:
          </td>
        </tr>
      </>
    );
  };

  const columns: ColumnDef<any>[] = Array.from({ length: 39 }, (_, i) => ({
    id: (i + 1).toString(),
  }));

  return (
    <div className='flex flex-col p-4'>
      <div className='flex flex-row gap-5 mb-5'>
        <button
          onClick={onClose}
          className='text-3xl font-bold text-gray-800 hover:text-gray-300 transition-all'
          aria-label='Tutup preview'
        >
          <MdClose />
        </button>
        <InputButton className='h-9' onClick={onCetak}>
          <span className='inline-flex items-center gap-2 px-2'>
            <MdPrint />
            Cetak Excel
          </span>
        </InputButton>
      </div>
      <div className='border p-2 w-fit'>
        <div className='min-w-[1500px]'>
          <div className='flex flex-col items-center justify-center text-xl'>
            <p>
              Evaluasi Terhadap Hasil Renja Perangkat Daerah Lingkup
              Kabupaten/kota
            </p>
            <p>Renja Perangkat Daerah {skpd} Kabupaten Bengkulu Utara</p>
            <p>
              Periode Pelaksanaan: {getPeriodeMulaiFromCookie()} -{' '}
              {getPeriodeAkhirFromCookie()}
            </p>
          </div>
          <br />
          <div className='text-xl'>
            <p>
              Indikator dan target kinerja Perangkat Daerah Kabupaten/Kota yang
              mengacu pada sasaran RKPD:
            </p>
            <p>…………………………………………………………………………………………………………………………………………………</p>
          </div>

          <Tabel
            customTableClass='table-excel'
            data={data}
            columns={columns}
            renderHeader={tableHead}
            disablePagination
            customRowAkhir={customAkhir()}
          />
          <br />
          <div className='grid grid-cols-2 text-xl'>
            <div></div>
            <div className='grid grid-cols-2'>
              <div className='flex flex-col items-center'>
                <span>Disusun</span>
                <span>
                  ......................., tanggal ...................
                </span>
                <br />
                <span>
                  KEPALA Perangkat Daerah....................................
                </span>
                <span>KAB/KOTA .................................... </span>
                <br />
                <br />
                <br />
                <span>(....................................)</span>
              </div>
              <div className='flex flex-col items-center'>
                <span>Dievaluasi</span>
                <span>
                  ......................., tanggal ...................
                </span>
                <br />
                <span>KEPALA BAPPEDA....................................</span>
                <span>KAB/KOTA .................................... </span>
                <br />
                <br />
                <br />
                <span>(....................................)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenjaPreviewTable;
