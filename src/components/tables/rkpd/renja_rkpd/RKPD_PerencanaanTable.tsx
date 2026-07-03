import { Fragment, useState, type JSX } from 'react';
import Tabel from '../../Tabel';
import InputButton from '../../../inputs/InputButton';
import { MdRefresh, MdSubdirectoryArrowRight } from 'react-icons/md';
import { FaInfo } from 'react-icons/fa';
import type { ColumnDef, Table } from '@tanstack/react-table';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import { useQuery } from '@tanstack/react-query';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
  getUserSKPDID,
  isAdmin,
  isDev,
} from '../../../../lib/usercookie';
import PesanSKPDTabel from '../../../PesanSKPDTabel';
import {
  flatRenja,
  getRenjaDetailRKPD,
  getRenjaRKPD,
  type FlatRenja,
  type RenjaDetail,
} from '../../../../services/RenjaService';
import Spinner from '../../../inputs/Spinner';
import { formatUang } from '../../../../lib/helper';
import AksiButton from '../../../inputs/AksiButton';
import DialogModal from '../../../inputs/DialogModal';
import { getSKPDPerRKPD } from '../../../../services/PeriodeService';

const RKPD_PerencanaanTable = () => {
  //#region Form Data dan Modal
  const [openModal, setOpenModal] = useState(false);
  const initialFormData: RenjaDetail = {
    skpd: '',
    urusan: '',
    bidang: '',
    program: '',
    kegiatan: '',
    subKegiatan: '',
    waktu: '',
    pagu: '',
    lokasi: '',
    indikator: [
      {
        name: '',
        target: '',
      },
    ],
  };
  const [formData, setFormData] = useState<RenjaDetail>(initialFormData);
  //#endregion

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
  //#region SKPD
  const idPeriodeCookie = Number(getPeriodeIDFromCookie());
  const userSKPDID = getUserSKPDID();
  const [selectedSKPD, setSelectedSKPD] = useState(userSKPDID ?? '');
  const { data: dataSKPDPeriode } = useQuery({
    queryKey: ['list_rkpd_skpd_periode'],
    queryFn: async () => getSKPDPerRKPD(idPeriodeCookie),
  });
  const listSKPDPeriode =
    dataSKPDPeriode?.map((item) => ({
      label: `${item.skpd_name}`,
      value: item.id?.toString(),
    })) || [];
  //#endregion

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['list_renja', tahunKe, selectedSKPD],
    queryFn: async () => {
      const rawData = await getRenjaRKPD({
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
    },
    {
      accessorKey: 'kode',
    },
    {
      accessorKey: 'rekening',
    },
    {
      accessorKey: 'pagu',
    },
    {
      header: 'Waktu Pelaksanaan',
    },
    {
      header: 'Detail',
    },
  ];

  const tableHead = () => {
    return (
      <>
        <tr>
          <th>No</th>
          <th>Kode Sub Kegiatan</th>
          <th>Nama Sub Kegiatan</th>
          <th>Pagu</th>
          <th>Waktu Pelaksanaan</th>
          <th>Detail</th>
        </tr>
      </>
    );
  };

  const tableBody = (table: Table<FlatRenja & { group?: string }>) => {
    const rows = table.getRowModel().rows;
    if (!rows.length)
      return (
        <tr>
          <td colSpan={12}>TIDAK ADA DATA</td>
        </tr>
      );
    const { pageIndex, pageSize } = table.getState().pagination ?? {
      pageIndex: 0,
      pageSize: rows.length,
    };

    const allRows = table.getPrePaginationRowModel().rows;
    let subKegiatanOffset = 0;
    for (let i = 0; i < pageIndex * pageSize; i++) {
      if (allRows[i].original.kode_subKegiatan) subKegiatanOffset++;
    }

    let subkegiatanIdx = subKegiatanOffset + 1;
    const renderedHeaderKeys = new Set<string>();

    return (
      <>
        {rows.map((row) => {
          const item = row.original;
          const codes = [
            item.kode_urusan,
            item.kode_bidang,
            item.kode_program,
            item.kode_kegiatan,
            item.kode_subKegiatan,
          ].filter(Boolean);

          const headerRows: JSX.Element[] = [];

          codes.forEach((_code, i) => {
            if (i === codes.length - 1) return;
            const key = codes.slice(0, i + 1).join('.');
            if (!renderedHeaderKeys.has(key)) {
              renderedHeaderKeys.add(key);
              headerRows.push(
                <tr key={`header-${key}`} className='bg-gray-200 font-bold'>
                  <td colSpan={12}>
                    <div
                      style={{ paddingLeft: `${i * 16}px` }}
                      className='inline-flex items-center gap-1'
                    >
                      {i > 0 && <MdSubdirectoryArrowRight />}
                      <span>
                        [{codes.slice(0, i + 1).join('.')}] {item.rekening}
                      </span>
                    </div>
                  </td>
                </tr>,
              );
            }
          });

          const rowElement = (
            <Fragment key={row.id}>
              {headerRows}
              {item.kode_subKegiatan && (
                <tr>
                  <td>{subkegiatanIdx++}</td>
                  <td>{codes.join('.')}</td>
                  <td>{item.rekening}</td>
                  <td className='text-center'>
                    {formatUang(Number(item.pagu))}
                  </td>
                  <td className='text-center'>-</td>
                  <td>
                    <AksiButton
                      Icon={FaInfo}
                      iconClassName='scale-75'
                      tooltip='Informasi Data'
                      onClick={async () => {
                        const detailR = await getRenjaDetailRKPD({
                          skpd_periode_id: Number(selectedSKPD),
                          tahun_ke: Number(tahunKe),
                          sub_id: item.id,
                        });
                        setFormData(detailR);
                        setOpenModal(true);
                      }}
                    />
                  </td>
                </tr>
              )}
            </Fragment>
          );

          return rowElement;
        })}
      </>
    );
  };

  return (
    <>
      <div className='space-y-2'>
        <div className='flex items-end justify-between'>
          <div className='inline-flex gap-2'>
            {(isDev() || isAdmin()) && (
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
            )}
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
            {/* <div>
              <label htmlFor='urusan'>Bidang Urusan</label>
              <InputSearchBox
                id='urusan'
                className='w-72 h-9'
                btnclassName='bg-white'
                placeholder='Pilih Bidang Urusan...'
                options={[]}
                tooltip
              />
            </div> */}
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
          renderBody={(table) => tableBody(table)}
          pesanDataKosong={
            <PesanSKPDTabel
              selectedSKPD={selectedSKPD.toString()}
              tahun={tahunKe}
              butuhTahun
            />
          }
        />
        <DialogModal
          widthLevel={10}
          title='Informasi Data'
          isOpen={openModal}
          onClose={() => {
            setTimeout(() => {
              setFormData(initialFormData);
            }, 300);
            setOpenModal(false);
          }}
        >
          <DetailRenja
            formData={formData}
            tahun={listTahunKe.find((item) => item.value === tahunKe)?.label}
          />
        </DialogModal>
      </div>
    </>
  );
};

const DetailRenja = ({
  formData,
  tahun,
}: {
  formData: RenjaDetail;
  tahun?: string;
}) => {
  return (
    <div className='grid grid-cols-2 grid-rows-2 gap-2'>
      <div className='col-start-1 row-span-2'>
        <div className='border border-gray-300 bg-gray-100 rounded overflow-hidden'>
          <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
            Detail Program Kegiatan
          </div>
          <div className='p-4 table-excel'>
            <table>
              <tbody>
                <tr>
                  <td className='text-right pr-4 font-bold'>Tahun</td>
                  <td>{tahun}</td>
                </tr>
                <tr>
                  <td className='text-right pr-4 font-bold'>Jadwal</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td className='text-right pr-4 font-bold'>SKPD</td>
                  <td>{formData.skpd}</td>
                </tr>
                <tr>
                  <td className='text-right pr-4 font-bold'>Urusan</td>
                  <td>{formData.urusan}</td>
                </tr>
                <tr>
                  <td className='text-right pr-4 font-bold'>Bidang</td>
                  <td>{formData.bidang}</td>
                </tr>
                <tr>
                  <td className='text-right pr-4 font-bold'>Program</td>
                  <td>{formData.program}</td>
                </tr>
                <tr>
                  <td className='text-right pr-4 font-bold'>Kegiatan</td>
                  <td>{formData.kegiatan}</td>
                </tr>
                <tr>
                  <td className='text-right pr-4 font-bold'>Sub Kegiatan</td>
                  <td>{formData.subKegiatan}</td>
                </tr>
                <tr>
                  <td className='text-right pr-4 font-bold'>Waktu</td>
                  <td>{formData.waktu}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/*  */}
      <div>
        <div className='border border-gray-300 bg-gray-100 rounded overflow-hidden'>
          <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
            Anggaran & Lokasi
          </div>
          <div className='p-4 table-excel space-y-4'>
            <table>
              <thead>
                <tr>
                  <th colSpan={3}>Pagu</th>
                </tr>
                <tr>
                  <th>{Number(tahun) - 1}</th>
                  <th>{tahun}</th>
                  <th>{Number(tahun) - 1}</th>
                </tr>
              </thead>
              <tbody>
                <tr className='text-center'>
                  <td>0</td>
                  <td>{formatUang(Number(formData.pagu))}</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th>Lokasi</th>
                </tr>
              </thead>
              <tbody>
                <tr className='text-center'>
                  <td>{formData.lokasi}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/*  */}
      <div>
        <div className='border border-gray-300 bg-gray-100 rounded overflow-hidden'>
          <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
            Indikator Sub Kegiatan
          </div>
          <div className='p-4 table-excel'>
            <table>
              <thead>
                <tr>
                  <th>Narasi</th>
                  <th>Target</th>
                </tr>
              </thead>
              <tbody>
                {formData.indikator.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td className='text-center'>{item.target}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RKPD_PerencanaanTable;
