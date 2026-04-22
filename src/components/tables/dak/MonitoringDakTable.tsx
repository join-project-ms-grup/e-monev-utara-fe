import { useEffect, useState } from 'react';
import Tabel from '../Tabel';
import type { ColumnDef, Table } from '@tanstack/react-table';
import AksiButton from '../../inputs/AksiButton';
import {
  MdAssignmentTurnedIn,
  MdContentPasteSearch,
  MdFindReplace,
  MdInput,
  MdLock,
  MdLockOpen,
  MdRefresh,
  MdSave,
  MdSubdirectoryArrowRight,
} from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import InputSearchBox from '../../inputs/InputSearchBox';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  flatMonitoringDAK,
  getMonitoringDAK,
  kunciMonitoringDAK,
  type FlatMonitoringDAK,
} from '../../../services/DAK/DAKMonitoringService';
import Spinner from '../../inputs/Spinner';
import { formatUang } from '../../../lib/helper';
import DialogModal from '../../inputs/DialogModal';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../../../lib/api';
import F_MonitorMasalahDak from '../../forms/DAK/MonitoringDAK/F_MonitorMasalahDak';
import {
  useListOPDDAK,
  useListSubJenisDAK,
  useListTahunDAK,
} from '../../../hooks/DAK/ListDataDAK';
import { getRoleId, getUserSKPDID } from '../../../lib/usercookie';
import F_RealisasiDak from '../../forms/DAK/MonitoringDAK/F_RealisasiDak';
import {
  initDAKRekForm,
  type RealisasiDakForm,
} from '../../forms/DAK/MonitoringDAK/FV_RealisasiDak';

interface DakData {
  tahun: string;
  opd: string;
  jenis: string;
  subJenis: string;
  triwulan?: string;
}

const columns: ColumnDef<FlatMonitoringDAK>[] = [
  {
    header: 'No',
    cell: ({ row }) => `${row.index + 1}`,
  },
  {
    accessorKey: 'nama',
    header: 'Jenis DAK / Bidang DAK / Nama Paket',
  },
  {
    header: 'Perencanaan Kegiatan',
    columns: [
      {
        id: 'skppkVolumed',
        accessorKey: 'perencanaan.volume',
        header: 'Volume',
      },
      {
        id: 'pkJumPenerima',
        accessorKey: 'pkJumPenerima',
        header: 'Jumlah Penerima Manfaat',
      },
      {
        id: 'pkAnggaran',
        accessorKey: 'pkAnggaran',
        header: 'Anggaran DAK (Rp.)',
      },
    ],
  },
  {
    header: 'Mekanisme Pelaksana',
    columns: [
      {
        id: 'mpMekKegiatan',
        accessorKey: 'mpMekKegiatan',
        header: 'Mekanisme Kegiatan',
      },
      {
        id: 'mpVolume',
        accessorKey: 'mpVolume',
        header: 'Volume',
      },
      {
        id: 'mpUang',
        accessorKey: 'mpUang',
        header: 'Uang (Rp)',
      },
    ],
  },
  {
    header: 'Realisasi',
    columns: [
      {
        header: 'Fisik (%)',
        columns: [
          {
            id: 'reFTriwulan',
            accessorKey: 'reFTriwulan',
            header: 'Triwulan Ini',
          },
          {
            id: 'reFSD',
            accessorKey: 'reFSD',
            header: 's.d',
          },
        ],
      },
      {
        header: 'Keuangan',
        columns: [
          {
            id: 'reKRP',
            accessorKey: 'reKRP',
            header: 'Rp.',
          },
          {
            id: 'reKPersen',
            accessorKey: 'reKPersen',
            header: '%',
          },
        ],
      },
    ],
  },
  {
    id: 'sisaAnggaran',
    accessorKey: 'sisaAnggaran',
    header: 'Sisa Anggaran s.d Triwulan Ini',
  },
  {
    id: 'kesesuaianRKPD',
    accessorKey: 'kesesuaianRKPD',
    header: 'Kesesuaian Sasaran dan Lokasi dengan RKPD',
  },
  {
    id: 'kesesuaianJuknis',
    accessorKey: 'kesesuaianJuknis',
    header: 'Keseuaian antara DPA-SKPD dengan Juknis',
  },
  {
    id: 'kodefikasi',
    accessorKey: 'kodefikasi',
    header: 'Kodefikasi Masalah',
  },
  {
    id: 'masalahLain',
    accessorKey: 'masalahLain',
    header: 'Masalah Lain',
  },
  {
    id: 'catatan',
    accessorKey: 'catatan',
    header: 'Catatan',
  },
  {
    id: 'skpdPelaksana',
    accessorKey: 'skpdPelaksana',
    header: 'SKPD Pelaksana',
  },
  {
    id: 'kunciProses',
    accessorKey: 'kunciProses',
    header: 'Kunci Proses',
  },
  {
    id: 'aksi',
    header: 'Aksi',
    cell: () => (
      //   <button className='px-2 py-1 bg-blue-500 text-white rounded'>Edit</button>
      <div className='flex justify-center'>
        <AksiButton
          hoverColor='bg-red-400'
          tooltip='Identifikasi Masalah'
          Icon={MdContentPasteSearch}
        />
        <AksiButton
          hoverColor='bg-green-400'
          tooltip='Simpan Data'
          Icon={MdSave}
        />
        <AksiButton
          hoverColor='bg-amber-400'
          tooltip='Data Ditindak'
          Icon={MdAssignmentTurnedIn}
        />
      </div>
    ),
  },
];

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={3}>No</th>
        <th rowSpan={3}>Jenis DAK / Bidang DAK / Nama Paket</th>
        <th colSpan={3}>Perencanaan Kegiatan</th>
        <th colSpan={3}>Mekanisme Pelaksana</th>
        <th rowSpan={3}>Aksi</th>
        <th colSpan={4}>Realisasi</th>
        <th rowSpan={3}>Sisa Anggaran s.d Triwulan Ini</th>
        <th rowSpan={3} className='w-[150px]'>
          Kesesuaian Sasaran dan Lokasi dengan RKPD
        </th>
        <th rowSpan={3} className='w-[150px]'>
          Keseuaian antara DPA-SKPD dengan Juknis
        </th>
        <th rowSpan={3}>Kodefikasi Masalah</th>
        <th rowSpan={3}>Masalah Lain</th>
        <th rowSpan={3}>Catatan</th>
        <th rowSpan={3}>SKPD Pelaksana</th>
        <th rowSpan={3}>Kunci Proses</th>
      </tr>
      <tr>
        <th rowSpan={2}>Volume</th>
        <th rowSpan={2}>Jumlah Penerima Manfaat</th>
        <th rowSpan={2}>Anggaran DAK {`(Rp.)`}</th>
        <th rowSpan={2}>Mekanisme Kegiatan</th>
        <th rowSpan={2}>Volume</th>
        <th rowSpan={2}>Uang {`(Rp.)`}</th>
        <th colSpan={2}>Fisik</th>
        <th colSpan={2}>Keuangan</th>
      </tr>
      <tr>
        <th>Triwulan Ini</th>
        <th>s.d</th>
        <th>Rp.</th>
        <th>%</th>
      </tr>
    </>
  );
};

const IdentifikasiDakTable = () => {
  const userSKPDID = getUserSKPDID();
  const [dakData, setDakData] = useState<DakData>({
    tahun: '',
    opd: '',
    jenis: '',
    subJenis: '',
    triwulan: '',
  });

  const changeDakData = (key: keyof DakData, val: string) => {
    setDakData((prev) => ({ ...prev, [key]: val }));
  };

  const listTahunDAK = useListTahunDAK();
  const listSubJenisDAK = useListSubJenisDAK(Number(dakData.jenis));
  const listOPDDAK = useListOPDDAK();

  useEffect(() => {
    if (!dakData.tahun) return;

    if (getRoleId() === 4) {
      changeDakData('opd', userSKPDID?.toString() ?? '');
      console.log('change dak dulu');
    }
  }, [dakData.opd, dakData.tahun]);

  const { data, isFetching, refetch } = useQuery({
    queryKey: [
      'list_monitoring_dak',
      dakData.tahun,
      dakData.opd,
      dakData.subJenis,
      dakData.triwulan,
    ],
    queryFn: async () => {
      const data = await getMonitoringDAK({
        tahun: Number(
          listTahunDAK.find((item) => item.value === dakData.tahun)?.label,
        ),
        opd_id: Number(dakData.opd) ?? null,
        sub_jenis: Number(dakData.subJenis) ?? null,
        triwulan: Number(dakData.triwulan),
      });
      const flatData = flatMonitoringDAK(data);
      return flatData;
    },
    enabled: !!(
      dakData.tahun &&
      dakData.opd &&
      dakData.subJenis &&
      dakData.triwulan
    ),
  });

  const [modalState, setModalState] = useState<'Realisasi' | 'Masalah' | ''>(
    '',
  );
  const [openModal, setOpenModal] = useState(false);
  // const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [selectedRealisasi, setSelectedRealisasi] = useState(0);
  const [selectedRealisasiInput, setSelectedRealisasiInput] =
    useState<RealisasiDakForm>(initDAKRekForm);
  const [selectedRealisasiPaket, setSelectedRealisasiPaket] = useState('');

  //#region TABLE BODY
  const tableBody = (table: Table<FlatMonitoringDAK & { level?: string }>) => {
    const rows = table.getRowModel().rows;
    let nomor = 1;

    return (
      <>
        {rows.map((row, i) => {
          const item = row.original;
          if (item.level === 'sub_jenis_dak') {
            return (
              <tr key={i}>
                <td colSpan={21} className='font-bold'>
                  Sub-Jenis DAK: {item.nama}
                </td>
              </tr>
            );
          }
          if (item.level === 'bidang') {
            return (
              <tr key={i}>
                <td colSpan={21}>
                  <span className='inline-flex gap-2 font-bold'>
                    <MdSubdirectoryArrowRight />
                    Bidang DAK: {item.nama}
                  </span>
                </td>
              </tr>
            );
          }

          if (item.level === 'sub_bidang') {
            return (
              <tr key={i}>
                <td colSpan={21}>
                  <span className='inline-flex gap-2 ps-3 font-bold'>
                    <MdSubdirectoryArrowRight />
                    Sub-Bidang DAK: {item.nama}
                  </span>
                </td>
              </tr>
            );
          }

          return (
            <tr key={i}>
              <td className='text-center'>{nomor++}</td>
              <td>{item.nama_paket}</td>
              <td>{item.perencanaan?.volume}</td>
              <td>{item.perencanaan?.jumlah_penerima}</td>
              <td>{formatUang(Number(item.perencanaan?.anggaran))}</td>
              <td>{item.mekanisme?.kegiatan}</td>
              <td>{item.mekanisme?.volume}</td>
              <td>{formatUang(Number(item.mekanisme?.uang))}</td>
              <td className='text-center'>
                <div className='inline-flex gap-1'>
                  <AksiButton
                    Icon={MdInput}
                    className='hover:text-gray-800 bg-green-100! hover:bg-green-200!'
                    tooltip='Input Realisasi'
                    onClick={() => {
                      if (item.id_realisasi) {
                        setSelectedRealisasi(item.id_realisasi);
                        setSelectedRealisasiPaket(item.nama_paket ?? '');
                        setSelectedRealisasiInput({
                          id_realisasi: item.id_realisasi,
                          fisik:
                            item.realisasi?.fisik?.capaian
                              ?.toString()
                              .replace('.', ',') ?? '',
                          anggaran: item.realisasi?.keuangan?.capaian ?? '',
                          kesesuaian_juknis:
                            Boolean(item.kesesuaian_juknis) ?? false,
                          sasaran_lokasi: Boolean(item.sasaran_lokasi) ?? false,
                          catatan: item.catatan ?? '',
                        });
                        setModalState('Realisasi');
                        setOpenModal(true);
                      }
                    }}
                  />
                  <AksiButton
                    Icon={MdFindReplace}
                    className='hover:text-gray-800 bg-green-100! hover:bg-green-200!'
                    tooltip='Identifikasi Masalah'
                    onClick={() => {
                      if (item.id_realisasi) {
                        setSelectedRealisasi(item.id_realisasi);
                        setSelectedRealisasiPaket(item.nama_paket ?? '');
                        setModalState('Masalah');
                        setOpenModal(true);
                      }
                    }}
                  />
                </div>
              </td>
              <td className='whitespace-nowrap'>
                {Number(item.realisasi?.fisik?.capaian || 0)
                  .toFixed(2)
                  .replace(/\.00$/, '')
                  .replace('.', ',')}{' '}
                %
              </td>
              <td className='whitespace-nowrap'>
                {Number(item.realisasi?.fisik?.totalSd || 0)
                  .toFixed(2)
                  .replace(/\.00$/, '')
                  .replace('.', ',')}{' '}
                %
              </td>
              <td>
                {formatUang(Number(item.realisasi?.keuangan?.capaian))}
              </td>
              <td className='whitespace-nowrap'>
                {Number(item.realisasi?.keuangan?.persen || 0)
                  .toFixed(2)
                  .replace(/\.00$/, '')
                  .replace('.', ',')}{' '}
                %
              </td>
              <td>{formatUang(Number(item.sisa_anggaran))}</td>
              <td>{item.kesesuaian_juknis ? 'Ya' : 'Tidak'}</td>
              <td>{item.sasaran_lokasi ? 'Ya' : 'Tidak'}</td>
              <td>-</td>
              <td>-</td>
              <td>{item.catatan}</td>
              <td>-</td>
              <td>
                <AksiButton
                  Icon={!!item.kunci ? MdLock : MdLockOpen}
                  className={`hover:text-gray-800 bg-green-100! hover:bg-green-200! ${!!item.kunci ? 'bg-red-500! text-gray-100 hover:bg-red-600! hover:text-gray-100!' : ''}`}
                  // className={`hover:text-gray-800 bg-green-100! hover:bg-green-200! ${!!item.kunci ? 'text-red-500 hover:text-red-500' : ''}`}
                  tooltip={!!item.kunci ? 'Terkunci' : 'Terbuka'}
                  onClick={() =>
                    kunciMutation.mutate({ id_realisasi: item.id_realisasi })
                  }
                />
              </td>
            </tr>
          );
        })}
      </>
    );
  };
  //#endregion

  const queryClient = useQueryClient();
  // const realisasiMutation = useMutation({
  //   mutationFn: async (payload: RealisasiMonitoringDAKForm) => {
  //     return realisasiMonitoringDAK(payload);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['list_monitoring_dak'] });
  //     setOpenModal(false);
  //     toast.success('Data berhasil diperbarui');
  //   },
  //   onError: (error: AxiosError<ApiResponse<unknown>>) => {
  //     if (error.status === 400) {
  //       toast.error(`Gagal menambahkan data\n${error.response?.data.message}`);
  //     }
  //   },
  // });
  const kunciMutation = useMutation({
    mutationFn: async (payload: any) => {
      return kunciMonitoringDAK(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list_monitoring_dak'] });
      setOpenModal(false);
      toast.success('Data berhasil diperbarui');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal menambahkan data\n${error.response?.data.message}`);
      }
    },
  });

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='flex flex-wrap gap-2'>
          <div>
            <label htmlFor='jenis'>Jenis DAK</label>
            <InputSearchBox
              id='jenis'
              className='w-44 h-9'
              btnclassName='bg-white'
              placeholder='Pilih Jenis DAK'
              options={[
                { label: 'Fisik', value: '1' },
                { label: 'Non-Fisik', value: '2' },
              ]}
              value={dakData.jenis}
              onChange={(val) => {
                changeDakData('jenis', val);
                changeDakData('subJenis', '');
                changeDakData('tahun', '');
                changeDakData('opd', '');
                changeDakData('triwulan', '');
              }}
              onClear={() => {
                changeDakData('jenis', '');
                changeDakData('subJenis', '');
                changeDakData('tahun', '');
                changeDakData('opd', '');
                changeDakData('triwulan', '');
              }}
            />
          </div>

          <div>
            <label htmlFor='subJenis'>Sub-Jenis DAK</label>
            <InputSearchBox
              id='subJenis'
              className='w-56 h-9'
              btnclassName='bg-white'
              placeholder='Pilih Sub-Jenis DAK'
              options={listSubJenisDAK}
              value={dakData.subJenis}
              onChange={(val) => {
                changeDakData('subJenis', val);
                changeDakData('tahun', '');
                changeDakData('opd', '');
                changeDakData('triwulan', '');
              }}
              onClear={() => {
                changeDakData('subJenis', '');
                changeDakData('tahun', '');
                changeDakData('opd', '');
                changeDakData('triwulan', '');
              }}
              withSearch
              disabled={!dakData.jenis}
            />
          </div>

          <div>
            <label htmlFor='tahun_ke'>Tahun</label>
            <InputSearchBox
              id='tahun_ke'
              className='w-42 h-9'
              btnclassName='bg-white'
              placeholder='Pilih Tahun ke...'
              value={dakData.tahun}
              options={listTahunDAK}
              onChange={(val) => {
                changeDakData('tahun', val);
                changeDakData('opd', '');
                changeDakData('triwulan', '');
              }}
              onClear={() => {
                changeDakData('tahun', '');
                changeDakData('opd', '');
                changeDakData('triwulan', '');
              }}
              disabled={!dakData.subJenis}
            />
          </div>

          {getRoleId() !== 4 && (
            <div>
              <label htmlFor='opd'>OPD</label>
              <InputSearchBox
                id='opd'
                className='w-72 h-9'
                btnclassName='bg-white'
                placeholder='Pilih OPD'
                value={dakData.opd}
                options={listOPDDAK}
                onChange={(val) => {
                  changeDakData('opd', val);
                  changeDakData('triwulan', '');
                }}
                onClear={() => {
                  changeDakData('opd', '');
                  changeDakData('triwulan', '');
                }}
                withSearch
                tooltip
                disabled={!dakData.tahun}
              />
            </div>
          )}

          <div>
            <label htmlFor='triwulan'>Triwulan</label>
            <InputSearchBox
              id='triwulan'
              className='w-44 h-9'
              btnclassName='bg-white'
              placeholder='Pilih Triwulan'
              options={[
                { label: 'I', value: '1' },
                { label: 'II', value: '2' },
                { label: 'III', value: '3' },
                { label: 'IV', value: '4' },
              ]}
              value={dakData.triwulan}
              onChange={(val) => changeDakData('triwulan', val)}
              onClear={() => changeDakData('triwulan', '')}
              disabled={!dakData.opd}
            />
          </div>
        </div>
        <div className='flex justify-end items-end gap-2'>
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
        tblClassName='min-w-[2800px]'
        data={data || []}
        columns={columns}
        renderHeader={tableHead}
        renderBody={(table) => tableBody(table)}
      />
      {modalState === 'Realisasi' && (
        <DialogModal
          title='Input Realisasi'
          isOpen={openModal}
          onClose={() => {
            setOpenModal(false);
            setModalState('');
            setSelectedRealisasi(0);
          }}
          widthLevel={3}
        >
          <F_RealisasiDak
            data={selectedRealisasiInput}
            onSuccess={() => {
              setOpenModal(false);
              setModalState('');
              setSelectedRealisasiInput(initDAKRekForm);
            }}
          />
        </DialogModal>
      )}
      {modalState === 'Masalah' && (
        <DialogModal
          title='Identifikasi Masalah Data Monitoring DAK Kabupaten / Kota per Triwulan'
          isOpen={openModal}
          onClose={() => {
            setOpenModal(false);
            setModalState('');
            setSelectedRealisasi(0);
            setSelectedRealisasiPaket('');
          }}
          widthLevel={7}
        >
          <F_MonitorMasalahDak
            triwulan={dakData.triwulan ?? ''}
            id_realisasi={selectedRealisasi}
            nama_paket={selectedRealisasiPaket}
            onSuccess={() => {
              setOpenModal(false);
              setModalState('');
              setSelectedRealisasi(0);
              setSelectedRealisasiPaket('');
            }}
          />
        </DialogModal>
      )}
    </div>
  );
};

export default IdentifikasiDakTable;
