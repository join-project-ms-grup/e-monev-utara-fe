import { Fragment, useEffect, useState } from 'react';
import InputButton from '../../../inputs/InputButton';
import toast from 'react-hot-toast';
import { exportRKPD } from '../../../../services/Excel/ExcelRKPD';
import { MdClose, MdPreview, MdPrint, MdRefresh } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import {
  flatRKPD,
  getRKPD,
  type FlatRKPD,
} from '../../../../services/RKPDService';

import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
  getUserSKPDID,
  isAdmin,
  isDev,
} from '../../../../lib/usercookie';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import Tabel from '../../Tabel';
import Spinner from '../../../inputs/Spinner';
import { type ColumnDef, type Table } from '@tanstack/react-table';
import { createPortal } from 'react-dom';
import RKPDPreviewTable from './RKPDPreviewTable';
import PesanSKPDTabel from '../../../PesanSKPDTabel';
import { formatUang } from '../../../../lib/helper';
import { getSKPDPerRKPD } from '../../../../services/PeriodeService';
import { exportRenja } from '../../../../services/Excel/ExcelRenja';
import RenjaPreviewTable from './RenjaPreviewTable';

const RenjaTable = () => {
  //#region SKPD dan Tahun ke
  const [tahunKe, setTahunKe] = useState('');
  const userSKPDID = getUserSKPDID();
  const [selectedSKPD, setSelectedSKPD] = useState(userSKPDID ?? '');
  const { data: dataSKPDPeriode } = useQuery({
    queryKey: ['list_skpd_periode'],
    queryFn: async () => getSKPDPerRKPD(Number(getPeriodeIDFromCookie())),
  });
  const listSKPDPeriode =
    dataSKPDPeriode?.map((item) => ({
      label: `${item.skpd_name}`,
      value: item.id?.toString(),
    })) || [];
  //#endregion
  //#region List data periode
  const tahunMulai = Number(getPeriodeMulaiFromCookie()!);
  const tahunAkhir = Number(getPeriodeAkhirFromCookie()!);
  const listTahunKe = Array.from(
    { length: tahunAkhir - tahunMulai + 1 },
    (_, i) => ({
      label: `${tahunMulai + i}`,
      value: `${i + 1}`,
    }),
  );
  //#endregion

  //#region RKPD Data Flatten
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['tabel_rkpd_tahunan', selectedSKPD, tahunKe],
    queryFn: async () => {
      const rawData = await getRKPD(Number(selectedSKPD), Number(tahunKe));
      const skpdName =
        dataSKPDPeriode?.find((s) => s.id === Number(selectedSKPD))
          ?.skpd_name ?? '';
      const flatData = await flatRKPD(rawData, skpdName);
      return flatData;
    },
    enabled: !!(selectedSKPD && tahunKe),
  });
  //#endregion

  //#region Head Tabel
  const tableHead = () => {
    return (
      <>
        <tr>
          <th rowSpan={2}>No</th>
          <th rowSpan={2}>Sasaran</th>
          <th rowSpan={2} className='w-[50px]'>
            Kode
          </th>
          <th rowSpan={2} className='w-[20%]'>
            Urusan / Bidang / Program / Kegiatan / Sub Kegiatan
          </th>
          <th rowSpan={2} className='w-[25%]'>
            Indikator Kinerja Program (Outcome)/ Kegiatan (output)
          </th>
          <th rowSpan={1} colSpan={2}>
            Target RPJMD Kabupaten/kota pada Tahun{' '}
            {listTahunKe.find((item) => item.value === tahunKe)?.label ??
              '........'}
          </th>
          <th rowSpan={1} colSpan={2}>
            Realisasi Capaian Kinerja RPJMD Kabupaten/kota sampai dengan RKPD
            Kabupaten/kota Tahun Lalu <br />
            (n-2)
          </th>
          <th rowSpan={1} colSpan={2}>
            Target Kinerja dan Anggaran RKPD Kabupaten/kota Tahun Berjalan
            (Tahun n-1) yang Dievaluasi
          </th>
        </tr>
        <tr>
          {Array.from({ length: 3 }, (_, i) => (
            <Fragment key={i}>
              <th className='w-[200px]'>Fisik</th>
              <th className='w-[200px]'>Rp.</th>
            </Fragment>
          ))}
        </tr>
      </>
    );
  };
  //#endregion

  const tableBody = ({ table }: { table: Table<FlatRKPD> }) => {
    const rows = table.getRowModel().rows;

    // Kelompokkan berdasarkan rekening
    const grouped = rows.reduce<Record<string, typeof rows>>((acc, row) => {
      const key = row.original.rekening;
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    return (
      <>
        {Object.entries(grouped).map(([rekening, group]) =>
          group.map((row, i) => (
            <tr key={row.id}>
              {/* Kolom No */}
              <td>{row.index + 1}</td>

              {/* Kolom Sasaran */}
              <td>{row.original.sasaran ?? ''}</td>

              {/* Kolom Kode dengan rowspan */}
              {i === 0 && (
                <td
                  rowSpan={group.length}
                  className='whitespace-nowrap align-top'
                >
                  {`${row.original.kode_urusan} ${row.original.kode_bidang} ${row.original.kode_program} ${row.original.kode_kegiatan} ${row.original.kode_subKegiatan}`}
                </td>
              )}

              {/* Kolom Rekening dengan rowspan */}
              {i === 0 && (
                <td
                  rowSpan={group.length}
                  className={`align-top ${
                    ['urusan', 'bidang'].some((l) =>
                      row.original.level.includes(l),
                    )
                      ? 'font-bold'
                      : ''
                  }`}
                >
                  {rekening}
                </td>
              )}

              {/* Kolom Indikator Kinerja */}
              <td className=''>{row.original.indikator_kinerja ?? ''}</td>

              {/* Target RPJMD Kinerja */}
              <td className='text-center'>
                {row.original.target_rpjmd_kinerja
                  ? `${row.original.target_rpjmd_kinerja} ${row.original.satuan ?? ''}`
                  : ''}
              </td>

              {/* Target RPJMD Anggaran */}
              <td className='text-center'>
                {['urusan', 'bidang'].some((l) =>
                  row.original.level.includes(l),
                )
                  ? ''
                  : formatUang(Number(row.original.target_rpjmd_anggaran))}
              </td>

              {/* Realisasi RPJMD Kinerja */}
              <td className='text-center'>
                {row.original.realisasi_rpjmd_kinerja
                  ? `${row.original.realisasi_rpjmd_kinerja} ${row.original.satuan ?? ''}`
                  : ''}
              </td>

              {/* Realisasi RPJMD Anggaran */}
              <td className='text-center'>
                {['urusan', 'bidang'].some((l) =>
                  row.original.level.includes(l),
                )
                  ? ''
                  : formatUang(Number(row.original.realisasi_rpjmd_anggaran))}
              </td>

              {/* Target RKPD Kinerja */}
              <td className='text-center'>
                {row.original.target_rkpd_kinerja
                  ? `${row.original.target_rkpd_kinerja} ${row.original.satuan ?? ''}`
                  : ''}
              </td>

              {/* Target RKPD Anggaran */}
              <td className='text-center'>
                {['urusan', 'bidang'].some((l) =>
                  row.original.level.includes(l),
                )
                  ? ''
                  : formatUang(Number(row.original.target_rkpd_anggaran))}
              </td>
            </tr>
          )),
        )}
      </>
    );
  };

  // #region Kolom Tabel
  const columns: ColumnDef<FlatRKPD>[] = [
    {
      header: 'No',
      meta: { tdClassNames: 'text-center' },
      cell: ({ row }) => row.index + 1,
    },
    {
      header: 'Sasaran',
      meta: { tdClassNames: 'text-center' },
    },
    {
      header: 'Kode',
      accessorFn: (row) =>
        `${row.kode_urusan} ${row.kode_bidang} ${row.kode_program} ${row.kode_kegiatan} ${row.kode_subKegiatan}`,
      meta: { tdClassNames: 'whitespace-nowrap' },
    },
    {
      accessorKey: 'rekening',
      cell: ({ row, getValue, table }) => {
        const current = getValue() as string;
        const previousRow = table.getRowModel().rows[row.index - 1];
        const previous = previousRow?.original.rekening;
        const isSameAsPrevious = current === previous;

        if (isSameAsPrevious) return null;

        return (
          <span
            className={`${['urusan', 'bidang'].some((l) => row.original.level.includes(l)) ? 'font-bold' : ''}`}
          >
            {current}
          </span>
        );
      },
    },
    {
      accessorKey: 'indikator_kinerja',
    },
    {
      accessorKey: 'target_rpjmd_kinerja',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: ({ row, getValue }) => getValue() + ' ' + row.original.satuan,
    },
    {
      accessorKey: 'target_rpjmd_anggaran',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: ({ row, getValue }) => {
        if (['urusan', 'bidang'].some((l) => row.original.level.includes(l))) {
          return;
        }
        return `${formatUang(Number(getValue()))}`;
      },
    },
    {
      accessorKey: 'realisasi_rpjmd_kinerja',
      meta: {
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'realisasi_rpjmd_anggaran',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: ({ row, getValue }) => {
        if (['urusan', 'bidang'].some((l) => row.original.level.includes(l))) {
          return;
        }
        return `${formatUang(Number(getValue()))}`;
      },
    },
    {
      accessorKey: 'target_rkpd_kinerja',
      meta: {
        tdClassNames: 'text-center',
      },
    },
    {
      accessorKey: 'target_rkpd_anggaran',
      meta: {
        tdClassNames: 'text-center',
      },
      cell: ({ row, getValue }) => {
        if (['urusan', 'bidang'].some((l) => row.original.level.includes(l))) {
          return;
        }
        return `${formatUang(Number(getValue()))}`;
      },
    },
  ];
  // #endregion

  const [isPreview, setIsPreview] = useState(false);
  useEffect(() => {
    if (isPreview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isPreview]);

  return (
    <>
      <div className='space-y-2'>
        <div className='flex items-end justify-between'>
          <div className='inline-flex gap-2'>
            {isDev() ||
              (isAdmin() && (
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
                    onClear={() => {
                      setSelectedSKPD('');
                      setTahunKe('');
                    }}
                    withSearch
                  />
                </div>
              ))}
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
                disabled={!selectedSKPD}
              />
            </div>
          </div>
          <div className='inline-flex gap-2'>
            <InputButton
              tooltip='Lihat tabel penuh'
              className='btn btn-theme w-9 h-9'
              onClick={() => {
                if (data) {
                  setIsPreview(true);
                } else {
                  toast.error(
                    `${!selectedSKPD ? 'SKPD dan' : ''} Tahun belum dipilih`,
                  );
                }
              }}
            >
              <MdPreview />
            </InputButton>
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
          tblClassName={`${selectedSKPD && data && 'lg:min-w-[2500px]'}`}
          data={data || []}
          columns={columns}
          renderHeader={tableHead}
          renderBody={(table) => tableBody({ table })}
          pesanDataKosong={
            <PesanSKPDTabel
              selectedSKPD={selectedSKPD.toString()}
              tahun={tahunKe}
              butuhTahun
            />
          }
        />
      </div>
      {isPreview &&
        createPortal(
          <div className='fixed inset-0 z-[9999] flex flex-col bg-white'>
            <div className='border-b'>
              <div className='flex flex-row justify-between p-2'>
                <button
                  onClick={() => setIsPreview(false)}
                  className='text-3xl font-bold text-gray-800 hover:text-gray-300 transition-all'
                  aria-label='Tutup preview'
                >
                  <MdClose />
                </button>
                <InputButton
                  className='h-9'
                  onClick={() => {
                    if (data) {
                      const tahunLabel =
                        listTahunKe.find((t) => t.value === tahunKe)?.label ??
                        '';
                      toast.promise(exportRenja(data, tahunLabel), {
                        loading: 'Sedang mengunduh...',
                        success: <b>Berhasil mengunduh.</b>,
                        error: <b>Gagal mengunduh.</b>,
                      });
                    } else {
                      toast.error(
                        `${!selectedSKPD ? 'SKPD dan' : ''} Tahun belum dipilih`,
                      );
                    }
                  }}
                >
                  <span className='inline-flex items-center gap-2 px-2'>
                    <MdPrint />
                    Cetak Excel
                  </span>
                </InputButton>
              </div>
            </div>
            <div className='p-2 overflow-auto'>
              <RenjaPreviewTable
                data={data || []}
                skpd={
                  listSKPDPeriode.find((item) => item.value === selectedSKPD)
                    ?.label ?? ''
                }
              />
              {/* <RKPDPreviewTable
                data={data || []}
                listTahunKe={listTahunKe}
                tahunKe={tahunKe}
              /> */}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default RenjaTable;
