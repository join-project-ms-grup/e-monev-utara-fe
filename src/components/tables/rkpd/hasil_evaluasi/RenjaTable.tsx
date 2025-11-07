import { useState, type JSX } from 'react';
import Tabel from '../../Tabel';
import InputButton from '../../../inputs/InputButton';
import { MdRefresh, MdSubdirectoryArrowRight } from 'react-icons/md';
import type { ColumnDef } from '@tanstack/react-table';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import { useQuery } from '@tanstack/react-query';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
} from '../../../../lib/usercookie';
import { getSKPDPeriode } from '../../../../services/PeriodeService';
import PesanSKPDTabel from '../../../PesanSKPDTabel';
import {
  flatRenja,
  getRenja,
  type FlatRenja,
} from '../../../../services/RenjaService';
import Spinner from '../../../inputs/Spinner';
import { formatUang } from '../../../../lib/helper';

const tableHead = () => {
  return (
    <>
      <tr>
        <th>No</th>
        <th>Kode Sub Kegiatan</th>
        <th>Nama Sub Kegiatan</th>
        <th>Pagu (Rp.)</th>
        <th>Waktu Pelaksanaan</th>
        <th>Detail</th>
      </tr>
    </>
  );
};

const RenjaTable = () => {
  //#region SKPD, Tahun ke, Bidang
  const [tahunKe, setTahunKe] = useState('');
  const tahunMulai = Number(getPeriodeMulaiFromCookie()!);
  const tahunAkhir = Number(getPeriodeAkhirFromCookie()!);
  const listTahunKe = Array.from(
    { length: tahunAkhir - tahunMulai + 1 },
    (_, i) => ({
      label: `${tahunMulai + i}`,
      value: `${i + 1}`,
    }),
  );
  const [selectedSKPD, setSelectedSKPD] = useState('');
  const { data: dataSKPDPeriode } = useQuery({
    queryKey: ['list_skpd_periode'],
    queryFn: async () => getSKPDPeriode(Number(getPeriodeIDFromCookie())) || [],
  });
  const listSKPDPeriode =
    dataSKPDPeriode?.map((item) => ({
      label: `${item.skpd_name}`,
      value: item.id?.toString(),
    })) || [];
  const [selectedBidang, setSelectedBidang] = useState('');
  //#endregion

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['list_renja', tahunKe, selectedSKPD],
    queryFn: async () => {
      const rawData = await getRenja({
        skpd_periode_id: Number(selectedSKPD),
        tahun_ke: Number(tahunKe),
        bidang: null,
      });
      const flatData = await flatRenja(rawData);
      return flatData;
    },
    enabled: !!(selectedSKPD && tahunKe),
  });

  const columns: ColumnDef<FlatRenja>[] = [
    {
      header: 'No',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'kode',
    },
    {
      accessorKey: 'rekening',
    },
    {
      accessorKey: 'pagu',
      cell: ({ getValue }) => formatUang(Number(getValue())),
    },
    {
      header: 'Waktu Pelaksanaan',
    },
    {
      header: 'Detail',
    },
  ];

  // const tableBody = ({ data }: { data?: FlatRenja[] }) => {
  //   if (!data || data.length === 0)
  //     return (
  //       <tr>
  //         <td colSpan={7} className='text-center'>
  //           TIDAK ADA DATA
  //         </td>
  //       </tr>
  //     );

  //   const rows: JSX.Element[] = [];

  //   // Untuk memastikan header tidak duplikat
  //   const addedHeaders = new Set<string>();

  //   // Iterasi data secara urut berdasarkan hierarki
  //   data.forEach((item, idx) => {
  //     const kodeLevels = [
  //       {
  //         kode: item.kode_urusan,
  //         label: item.kode_urusan,
  //         name: item.rekening,
  //       },
  //       {
  //         kode: `${item.kode_urusan}.${item.kode_bidang}`,
  //         label: item.kode_bidang,
  //         name: item.rekening,
  //       },
  //       {
  //         kode: `${item.kode_urusan}.${item.kode_bidang}.${item.kode_program}`,
  //         label: item.kode_program,
  //         name: item.rekening,
  //       },
  //       {
  //         kode: `${item.kode_urusan}.${item.kode_bidang}.${item.kode_program}.${item.kode_kegiatan}`,
  //         label: item.kode_kegiatan,
  //         name: item.rekening,
  //       },
  //       {
  //         kode: `${item.kode_urusan}.${item.kode_bidang}.${item.kode_program}.${item.kode_kegiatan}.${item.kode_subKegiatan}`,
  //         label: item.kode_subKegiatan,
  //         name: item.rekening,
  //       },
  //     ];

  //     // Tambahkan header dari level atas sampai kegiatan
  //     kodeLevels.slice(0, 4).forEach((lvl, i) => {
  //       if (!lvl.kode || addedHeaders.has(lvl.kode)) return;
  //       addedHeaders.add(lvl.kode);

  //       rows.push(
  //         <tr key={`header-${lvl.kode}`} className='bg-gray-200 font-bold'>
  //           <td colSpan={7}>
  //             <div
  //               className='inline-flex items-center gap-1'
  //               style={{ paddingLeft: `${i * 16}px` }}
  //             >
  //               {i > 0 && <MdSubdirectoryArrowRight />}
  //               <span>
  //                 [{lvl.kode}] {lvl.name}
  //               </span>
  //             </div>
  //           </td>
  //         </tr>,
  //       );
  //     });

  //     // Baris data sub-kegiatan
  //     const kodeFull = `${item.kode_urusan}.${item.kode_bidang}.${item.kode_program}.${item.kode_kegiatan}.${item.kode_subKegiatan}`;

  //     rows.push(
  //       <tr key={`row-${idx}`} className='border-t'>
  //         <td className='text-center'>{idx + 1}</td>
  //         <td className='text-left w-[50px]'>{kodeFull}</td>
  //         <td>{item.rekening}</td>
  //         <td className='text-right'>{formatUang(Number(item.pagu))}</td>
  //         <td className='text-center'>-</td>
  //         <td className='text-center'>Detail</td>
  //       </tr>,
  //     );
  //   });

  //   return <>{rows}</>;
  // };

  return (
    <>
      <div className='space-y-2'>
        <div className='flex items-end justify-between'>
          <div className='inline-flex gap-2'>
            <div>
              <label htmlFor='skpd'>SKPD</label>
              <InputSearchBox
                id='skpd'
                className='w-72 h-9'
                btnclassName='bg-white'
                placeholder='Pilih SKPD...'
                value={selectedSKPD.toString()}
                options={listSKPDPeriode as OptionItem[]}
                onChange={(val) => setSelectedSKPD(val)}
                onClear={() => setSelectedSKPD('')}
                tooltip
                withSearch
              />
            </div>
            <div>
              <label htmlFor='tahun_ke'>Tahun ke</label>
              <InputSearchBox
                id='tahun_ke'
                className='w-42 h-9'
                btnclassName='bg-white'
                placeholder='Pilih Tahun ke...'
                value={tahunKe}
                options={listTahunKe}
                onChange={(val) => setTahunKe(val)}
                onClear={() => setTahunKe('')}
              />
            </div>
            <div>
              <label htmlFor='urusan'>Bidang Urusan</label>
              <InputSearchBox
                id='urusan'
                className='w-72 h-9'
                btnclassName='bg-white'
                placeholder='Pilih Bidang Urusan...'
                options={[]}
                tooltip
              />
            </div>
          </div>
          <div className='inline-flex gap-2'>
            <InputButton
              tooltip='Refresh'
              className='btn btn-theme w-9 h-9'
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? <Spinner color='var(--color-2)' /> : <MdRefresh />}
            </InputButton>
          </div>
        </div>
        <Tabel
          data={data || []}
          columns={columns}
          renderHeader={tableHead}
          // renderBody={() => tableBody({ data })}
          pesanDataKosong={
            <PesanSKPDTabel
              selectedSKPD={selectedSKPD}
              tahun={tahunKe}
              butuhTahun
            />
          }
        />
      </div>
    </>
  );
};

export default RenjaTable;
