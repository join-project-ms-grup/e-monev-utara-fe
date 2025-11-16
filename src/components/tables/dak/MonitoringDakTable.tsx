import { useState } from 'react';
import Tabel from '../Tabel';
import type { ColumnDef, Table } from '@tanstack/react-table';
import AksiButton from '../../inputs/AksiButton';
import {
  MdAssignmentTurnedIn,
  MdContentPasteSearch,
  MdFindReplace,
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
  realisasiMonitoringDAK,
  type FlatMonitoringDAK,
  type RealisasiMonitoringDAKForm,
} from '../../../services/DAK/DAKMonitoringService';
import Spinner from '../../inputs/Spinner';
import { formatUang } from '../../../lib/helper';
import InputText from '../../inputs/InputText';
import InputTextArea from '../../inputs/InputTextArea';
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
        <th rowSpan={3}>Aksi</th>
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

  const [openModal, setOpenModal] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [selectedRealisasi, setSelectedRealisasi] = useState(0);

  //#region TABLE BODY
  const tableBody = (table: Table<FlatMonitoringDAK & { level?: string }>) => {
    const rows = table.getRowModel().rows;
    let nomor = 1;

    return (
      <>
        {rows.map((row, i) => {
          const item = row.original;
          const currentRowValues = formValues[item.id_realisasi ?? 0] || {};
          console.log(currentRowValues.uang);
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
              <td>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    realisasiMutation.mutate(
                      {
                        id_realisasi: item.id_realisasi ?? 0,
                        fisik: Number(currentRowValues.fisik),
                        anggaran:
                          Number(item.realisasi?.keuangan?.capaian) ?? 0,
                        kesesuaian_juknis:
                          Boolean(item.kesesuaian_juknis) ?? null,
                        sasaran_lokasi: Boolean(item.sasaran_lokasi) ?? null,
                        catatan: item.catatan,
                      },
                      {
                        onSuccess: () => {
                          setFormValues((prev) => {
                            const updated = { ...prev };
                            delete updated[item.id_realisasi ?? 0];
                            return updated;
                          });
                        },
                      },
                    );
                  }}
                >
                  <InputText
                    id='rea_fisik_cap'
                    value={
                      currentRowValues.fisik ??
                      item.realisasi?.fisik?.capaian ??
                      ''
                    }
                    inputMode='numeric'
                    Iconlabel='%'
                    IconlabelPos='right'
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      setFormValues((prev) => ({
                        ...prev,
                        [item.id_realisasi ?? 0]: {
                          ...prev[item.id_realisasi ?? 0],
                          fisik: newValue,
                        },
                      }));
                    }}
                    withButton={
                      (currentRowValues.fisik ??
                        item.realisasi?.fisik?.capaian ??
                        '') !== (item.realisasi?.fisik?.capaian ?? '')
                    }
                    buttonType='submit'
                    tooltip={item.realisasi?.fisik?.capaian?.toString()}
                  />
                </form>
              </td>
              <td>{item.realisasi?.fisik?.totalSd}</td>
              <td>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    realisasiMutation.mutate(
                      {
                        id_realisasi: item.id_realisasi ?? 0,
                        fisik: Number(item.realisasi?.fisik?.capaian),
                        anggaran: Number(currentRowValues.uang) ?? 0,
                        kesesuaian_juknis:
                          Boolean(item.kesesuaian_juknis) ?? null,
                        sasaran_lokasi: Boolean(item.sasaran_lokasi) ?? null,
                        catatan: item.catatan,
                      },
                      {
                        onSuccess: () => {
                          setFormValues((prev) => {
                            const updated = { ...prev };
                            delete updated[item.id_realisasi ?? 0];
                            return updated;
                          });
                        },
                      },
                    );
                  }}
                >
                  <InputText
                    id='rea_keuang_cap'
                    value={
                      currentRowValues.uang ??
                      item.realisasi?.keuangan?.capaian ??
                      ''
                    }
                    inputMode='numeric'
                    Iconlabel='Rp'
                    isRibu
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      setFormValues((prev) => ({
                        ...prev,
                        [item.id_realisasi ?? 0]: {
                          ...prev[item.id_realisasi ?? 0],
                          uang: newValue,
                        },
                      }));
                    }}
                    withButton={
                      (currentRowValues.uang ??
                        item.realisasi?.keuangan?.capaian ??
                        '') !== (item.realisasi?.keuangan?.capaian ?? '')
                    }
                    buttonType='submit'
                    tooltip={formatUang(
                      Number(item.realisasi?.keuangan?.capaian),
                    ).toString()}
                  />
                </form>
              </td>
              <td>{item.realisasi?.keuangan?.persen}</td>
              <td>{formatUang(Number(item.sisa_anggaran))}</td>
              <td>
                <InputSearchBox
                  id='kese_sasaran'
                  placeholder='Pilih...'
                  value={
                    currentRowValues.sasaran ??
                    item.sasaran_lokasi?.toString() ??
                    ''
                  }
                  options={[
                    { label: 'Ya', value: 'true' },
                    { label: 'Tidak', value: 'false' },
                  ]}
                  onChange={(value) => {
                    setFormValues((prev) => ({
                      ...prev,
                      [item.id_realisasi ?? 0]: {
                        ...prev[item.id_realisasi ?? 0],
                        sasaran: value,
                      },
                    }));
                    realisasiMutation.mutate(
                      {
                        id_realisasi: item.id_realisasi ?? 0,
                        fisik: Number(item.realisasi?.fisik?.capaian) ?? 0,
                        anggaran:
                          Number(item.realisasi?.keuangan?.capaian) ?? 0,
                        kesesuaian_juknis:
                          Boolean(item.kesesuaian_juknis) ?? null,
                        sasaran_lokasi: value === 'true',
                        catatan: item.catatan,
                      },
                      {
                        onSuccess: () => {
                          setFormValues((prev) => {
                            const updated = { ...prev };
                            delete updated[item.id_realisasi ?? 0];
                            return updated;
                          });
                        },
                      },
                    );
                  }}
                />
              </td>
              <td>
                <InputSearchBox
                  id='kese_dpaskpd'
                  placeholder='Pilih...'
                  value={
                    currentRowValues.kesesuaian_juknis ??
                    item.kesesuaian_juknis?.toString() ??
                    ''
                  }
                  options={[
                    { label: 'Ya', value: 'true' },
                    { label: 'Tidak', value: 'false' },
                  ]}
                  onChange={(value) => {
                    setFormValues((prev) => ({
                      ...prev,
                      [item.id_realisasi ?? 0]: {
                        ...prev[item.id_realisasi ?? 0],
                        kesesuaian_juknis: value,
                      },
                    }));
                    realisasiMutation.mutate(
                      {
                        id_realisasi: item.id_realisasi ?? 0,
                        fisik: Number(item.realisasi?.fisik?.capaian) ?? 0,
                        anggaran:
                          Number(item.realisasi?.keuangan?.capaian) ?? 0,
                        kesesuaian_juknis: value === 'true',
                        sasaran_lokasi: Boolean(item.sasaran_lokasi) ?? null,
                        catatan: item.catatan,
                      },
                      {
                        onSuccess: () => {
                          setFormValues((prev) => {
                            const updated = { ...prev };
                            delete updated[item.id_realisasi ?? 0];
                            return updated;
                          });
                        },
                      },
                    );
                  }}
                />
              </td>
              <td>-</td>
              <td>-</td>
              <td>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    realisasiMutation.mutate({
                      id_realisasi: item.id_realisasi ?? 0,
                      fisik: Number(item.realisasi?.fisik?.capaian) ?? 0,
                      anggaran: Number(item.realisasi?.keuangan?.capaian) ?? 0,
                      kesesuaian_juknis:
                        Boolean(item.kesesuaian_juknis) ?? null,
                      sasaran_lokasi: Boolean(item.sasaran_lokasi),
                      catatan: currentRowValues.catatan ?? '',
                    });
                  }}
                >
                  <div className='flex flex-col items-center'>
                    <InputTextArea
                      id='catatan'
                      placeholder='Catatan...'
                      value={currentRowValues.catatan ?? item.catatan ?? ''}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setFormValues((prev) => ({
                          ...prev,
                          [item.id_realisasi ?? 0]: {
                            ...prev[item.id_realisasi ?? 0],
                            catatan: newValue,
                          },
                        }));
                      }}
                      withButton={
                        (currentRowValues.catatan ?? item.catatan ?? '') !==
                        (item.catatan ?? '')
                      }
                    />
                  </div>
                </form>
              </td>
              <td>-</td>
              <td>
                <AksiButton
                  Icon={!!item.kunci ? MdLock : MdLockOpen}
                  className={`hover:bg-green-700! ${!!item.kunci ? 'text-red-500' : ''}`}
                  tooltip={!!item.kunci ? 'Buka ?' : 'Kunci ?'}
                  label={!!item.kunci ? 'Terkunci' : 'Terbuka'}
                  onClick={() =>
                    kunciMutation.mutate({ id_realisasi: item.id_realisasi })
                  }
                />
              </td>
              <td className='text-center'>
                <div className='inline-flex gap-1'>
                  <AksiButton
                    Icon={MdFindReplace}
                    className='hover:bg-red-700!'
                    tooltip='Identifikasi Masalah'
                    onClick={() => {
                      if (item.id_realisasi) {
                        setOpenModal(true);
                        setSelectedRealisasi(item.id_realisasi);
                      }
                    }}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </>
    );
  };
  //#endregion

  const queryClient = useQueryClient();
  const [loadingMutation, setLoadingMutation] = useState(false);
  const realisasiMutation = useMutation({
    mutationFn: async (payload: RealisasiMonitoringDAKForm) => {
      setLoadingMutation(true);
      return realisasiMonitoringDAK(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list_monitoring_dak'] });
      // setFormData(initialFormData);
      setOpenModal(false);
      toast.success('Data berhasil diperbarui');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal menambahkan data\n${error.response?.data.message}`);
      }
    },
    onSettled: () => {
      setLoadingMutation(false);
    },
  });
  const kunciMutation = useMutation({
    mutationFn: async (payload: any) => {
      setLoadingMutation(true);
      return kunciMonitoringDAK(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list_monitoring_dak'] });
      // setFormData(initialFormData);
      setOpenModal(false);
      toast.success('Data berhasil diperbarui');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal menambahkan data\n${error.response?.data.message}`);
      }
    },
    onSettled: () => {
      setLoadingMutation(false);
    },
  });

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex gap-2'>
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
      <DialogModal
        title='Identifikasi Masalah Data Monitoring DAK Kabupaten / Kota per Triwulan'
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedRealisasi(0);
        }}
        widthLevel={7}
      >
        <F_MonitorMasalahDak
          triwulan={dakData.triwulan ?? ''}
          id_realisasi={selectedRealisasi}
          onSuccess={() => {
            setOpenModal(false);
            setSelectedRealisasi(0);
          }}
        />
      </DialogModal>
    </div>
  );
};

export default IdentifikasiDakTable;
