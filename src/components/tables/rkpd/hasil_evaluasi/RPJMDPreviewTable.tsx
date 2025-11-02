import React, {  } from 'react';
import Tabel from '../../Tabel';
import type { ColumnDef } from '@tanstack/react-table';
import type { FlatRenstraRow } from '../../../../services/RenstraService';
import { MdClose, MdPrint } from 'react-icons/md';
import InputButton from '../../../inputs/InputButton';
import { getPeriodeAkhirFromCookie, getPeriodeMulaiFromCookie } from '../../../../lib/usercookie';

interface MainTableProps {
  data: FlatRenstraRow[];
  onClose: () => void;
  onCetak: () => void;
}

const RPJMDPreviewTable = ({ data, onClose, onCetak }: MainTableProps) => {
  console.log('data renstra', data);
  //#region Head Tabel
  const tableHead = () => {
    return (
      <>
        <tr>
          <th rowSpan={2}>No</th>
          <th rowSpan={2}>Sasaran</th>
          <th rowSpan={2}>Program Prioritas</th>
          <th rowSpan={2}>Indikator Kinerja</th>
          <th rowSpan={2}>Data Capaian pada Awal Tahun Perencanaan</th>
          <th rowSpan={2} colSpan={2}>
            Target pada Akhir Tahun Perencanaan
          </th>
          <th rowSpan={1} colSpan={10}>
            Target RPJMD Kabupaten/kota Pada RKPD Kabupaten/kota Tahun Ke-
          </th>
          <th rowSpan={1} colSpan={10}>
            Capaian Target RPJMD Kabupaten/kota Melalui Pelaksanaan RKPD Tahun
            Ke-
          </th>
          <th rowSpan={1} colSpan={10}>
            Tingkat Capaian Target RPJMD Kabupaten/kota Hasil Pelaksanaan RKPD
            Kabupaten/kotaTahun Ke-
            <br />
            (%)
          </th>
          <th rowSpan={2}>Capaian Pada Akhir Tahun Perencanaan</th>
          <th rowSpan={2}>Perangkat Daerah Penanggung Jawab</th>
        </tr>
        <tr>
          {[...Array(3)].map((_, i) => (
            <React.Fragment key={i}>
              <th colSpan={2}>1</th>
              <th colSpan={2}>2</th>
              <th colSpan={2}>3</th>
              <th colSpan={2}>4</th>
              <th colSpan={2}>5</th>
            </React.Fragment>
          ))}
        </tr>
        <tr>
          <th rowSpan={2}>(1)</th>
          <th rowSpan={2}>(2)</th>
          <th rowSpan={2}>(3)</th>
          <th rowSpan={2}>(4)</th>
          <th rowSpan={2}>(5)</th>
          {[...Array(16)].map((_, i) => (
            <th key={i} rowSpan={1} colSpan={2}>
              ({i + 6})
            </th>
          ))}

          <th rowSpan={2}>(22)</th>
          <th rowSpan={2}>(23)</th>
        </tr>
        <tr>
          {[...Array(16)].map((_, i) => (
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
          <td colSpan={27} className='text-right'>
            Rata-rata capaian kinerja (%)
          </td>
          <td colSpan={12}></td>
        </tr>
        <tr>
          <td colSpan={27} className='text-right'>
            Predikat kinerja
          </td>
          <td colSpan={12}></td>
        </tr>
        <tr>
          <td colSpan={39}>Faktor pendorong keberhasilan pencapaian:</td>
        </tr>
        <tr>
          <td colSpan={39}>Faktor penghambat pencapaian kinerja:</td>
        </tr>
        <tr>
          <td colSpan={39}>
            Tindak lanjut yang diperlukan dalam RKPD kabupaten/kota berikutnya:
          </td>
        </tr>
        <tr>
          <td colSpan={39}>
            Tindak lanjut yang diperlukan dalam RPJMD kabupaten/kota berikutnya:
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
            <p>Evaluasi Terhadap Hasil RPJMD</p>
            <p>Kabupaten Bengkulu Utara</p>
            <p>Periode Pelaksanaan: {getPeriodeMulaiFromCookie()} - {getPeriodeAkhirFromCookie()}</p>
          </div>
          <br />
          <div className='text-xl'>
            <p>Sasaran Pembangunan Jangka Menengah:</p>
            <p>…………………………………………………………………………………………………………………………………………………</p>
          </div>
          <Tabel
            customTableClass='table-excel'
            data={data}
            columns={columns}
            renderHeader={tableHead}
            customRowAkhir={customAkhir()}
            disablePagination
          />
          <br />
          <div className='flex justify-end'>
            <div className='grid grid-cols-2 gap-48 mr-96'>
              <div className='flex flex-col items-center'>
                <span>Disusun</span>
                <span>
                  ......................., tanggal ...................
                </span>
                <br />
                <span>KEPALA BAPPEDA</span>
                <span>KABUPATEN/KOTA.................................... </span>
                <br />
                <br />
                <br />
                <span>(....................................)</span>
              </div>
              <div className='flex flex-col items-center'>
                <span>Disetujui</span>
                <span>
                  ......................., tanggal ...................
                </span>
                <br />
                <span>
                  GUBERNUR
                </span>
                <span>
                  PROVINSI....................................{' '}
                </span>
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
    // <Tabel
    //   customTableClass='table-excel'
    //   data={data}
    //   columns={columns}
    //   renderHeader={tableHead}
    //   disablePagination
    // />
  );
};

export default RPJMDPreviewTable;
