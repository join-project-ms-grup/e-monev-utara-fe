import Tabel from '../Tabel';
import type { ColumnDef, Table } from '@tanstack/react-table';
import AksiButton from '../../inputs/AksiButton';
import {
  MdAdd,
  MdEdit,
  MdRefresh,
  MdSubdirectoryArrowLeft,
  MdSubdirectoryArrowRight,
} from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import InputSearchBox, { type OptionItem } from '../../inputs/InputSearchBox';
import { getOPDDAK } from '../../../services/DAK/DAKOPDService';
import { useQuery } from '@tanstack/react-query';
import { getSubJenisDAK } from '../../../services/DAK/DAKJenisService';
import { getTahunDAK } from '../../../services/DAK/DAKTahunService';
import { useState } from 'react';
import {
  flatIdentifikasiDAK,
  getIdentifikasiDAK,
  getIdentifikasiDetailDAK,
  type FlatIdentifikasiDAK,
} from '../../../services/DAK/DAKIdentifikasiService';
import { formatUang } from '../../../lib/helper';
import { FaInfo } from 'react-icons/fa';
import toast from 'react-hot-toast';
import DialogModal from '../../inputs/DialogModal';

interface IdentifikasiDakTable {
  onAdd: () => void;
}

const IdentifikasiDakTable = ({ onAdd }: IdentifikasiDakTable) => {
  const columns: ColumnDef<FlatIdentifikasiDAK>[] = [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => `${row.index + 1}`,
    },
    {
      id: 'skpd',
      accessorKey: 'skpd',
      header: 'SKPD / Bidang DAK',
    },
    {
      id: 'program',
      accessorKey: 'program',
      header: 'Program / Kegiatan / Sub Kegiatan',
    },
    {
      id: 'paketDetail',
      accessorKey: 'paketDetail',
      header: 'Paket / Detail (Volume Satuan)',
    },
    {
      id: 'anggaran',
      accessorKey: 'anggaran',
      header: 'Anggaran DAK',
    },
    {
      id: 'aksi',
      header: 'Aksi',
      cell: () => (
        <>
          <AksiButton Icon={MdEdit} />
        </>
      ),
    },
  ];

  const [tahunDAK, setTahunDAK] = useState('');
  const { data: dataTahunDAK } = useQuery({
    queryKey: ['list_tahun_dak'],
    queryFn: getTahunDAK,
  });
  const listTahunDAK =
    dataTahunDAK?.map((item) => ({
      label: `${item.tahun}`,
      value: item.id?.toString(),
    })) || [];

  const [opdDAK, setOPDDAK] = useState('');
  const { data: dataOPD } = useQuery({
    queryKey: ['list_opd_dak'],
    queryFn: getOPDDAK,
  });
  const listOPD =
    dataOPD?.map((item) => ({
      label: `${item.fullname}`,
      value: item.id?.toString(),
    })) || [];

  const [subJenisDAK, setSubJenisDAK] = useState('');
  const { data: dataSubJenisDAK } = useQuery({
    queryKey: ['list_sub_jenis_dak'],
    queryFn: () => getSubJenisDAK(1),
  });
  const listSubJenisDAK =
    dataSubJenisDAK?.map((item) => ({
      label: `${item.nama}`,
      value: item.id?.toString(),
    })) || [];

  const { data } = useQuery({
    queryKey: ['list_identifikasi_dak', tahunDAK, opdDAK, subJenisDAK],
    queryFn: async () => {
      const data = await getIdentifikasiDAK({
        tahun: Number(
          listTahunDAK.find((item) => item.value === tahunDAK)?.label,
        ),
        opd_id: Number(opdDAK) ?? null,
        sub_jenis: Number(subJenisDAK) ?? null,
      });
      const flatData = flatIdentifikasiDAK(data);
      console.log('IDEN DAK', flatData);
      return flatData;
    },
    enabled: !!tahunDAK,
  });

  const tableBody = (
    table: Table<FlatIdentifikasiDAK & { level?: string }>,
  ) => {
    const rows = table.getRowModel().rows;
    let nomor = 1;
    return (
      <>
        {rows.map((row, i) => {
          const item = row.original;

          // Baris OPD
          if (item.level === 'opd') {
            return (
              <tr key={i} className='bg-gray-100 font-semibold'>
                <td colSpan={6}>OPD: {item.opd}</td>
              </tr>
            );
          }

          // Baris Sub-nama
          if (item.sub_nama && !item.id_ident) {
            return (
              <tr key={i}>
                <td colSpan={6}>
                  <span className='inline-flex gap-2 font-bold'>
                    <MdSubdirectoryArrowRight />
                    {item.sub_nama}
                  </span>
                </td>
              </tr>
            );
          }

          // Baris Detail Row
          return (
            <tr key={i}>
              <td className='text-center'>{nomor++}</td>
              <td>{item.bidang}</td>
              <td>{item.rekening}</td>
              <td>{item.paket_detail}</td>
              <td className='text-right'>
                {formatUang(Number(item.anggaran))}
              </td>
              <td>
                <div className='inline-flex gap-1'>
                  <AksiButton
                    tooltip='Detail Data'
                    Icon={FaInfo}
                    onClick={() => {
                      setFormData({ id_ident: item.id_ident });
                      setOpenModal(true);
                    }}
                  />
                  <AksiButton
                    tooltip='Ubah Data'
                    className='hover:bg-green-500!'
                    Icon={MdEdit}
                    onClick={() => {}}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </>
    );
  };

  const [openModal, setOpenModal] = useState(false);
  // Form Data
  const initialFormData: any = {
    id_ident: 0,
  };
  const [formData, setFormData] = useState<any>(initialFormData);
  // // Clear form
  // useEffect(() => {
  //   if (!openModal) {
  //     const timeout = setTimeout(() => {
  //       setFormData(initialFormData);
  //     }, 200);
  //     return () => clearTimeout(timeout);
  //   } else {
  //     console.log(formData);
  //   }
  // }, [openModal]);

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='tahun_ke'>Tahun</label>
            <InputSearchBox
              id='tahun_ke'
              className='w-42 h-9'
              btnclassName='bg-white'
              placeholder='Pilih Tahun ke...'
              value={tahunDAK}
              options={listTahunDAK as OptionItem[]}
              onChange={(val) => setTahunDAK(val)}
              onClear={() => setTahunDAK('')}
            />
          </div>
          <div>
            <label htmlFor='opd'>OPD</label>
            <InputSearchBox
              id='opd'
              className='w-72 h-9'
              btnclassName='bg-white'
              placeholder='Pilih OPD'
              value={opdDAK}
              options={listOPD as OptionItem[]}
              onChange={(val) => setOPDDAK(val)}
              onClear={() => setOPDDAK('')}
              withSearch
              tooltip
            />
          </div>
          <div>
            <label htmlFor='subJenis'>Sub-Jenis DAK</label>
            <InputSearchBox
              id='subJenis'
              className='w-44 h-9'
              btnclassName='bg-white'
              placeholder='Pilih Sub-Jenis DAK'
              options={listSubJenisDAK as OptionItem[]}
              value={subJenisDAK}
              onChange={(val) => setSubJenisDAK(val)}
              onClear={() => setSubJenisDAK('')}
            />
          </div>
        </div>
        <div className='flex justify-end items-end gap-2'>
          <InputButton
            tooltip='Tambah data'
            className='btn btn-theme w-9 h-9'
            onClick={onAdd}
          >
            <MdAdd />
          </InputButton>
          <InputButton
            tooltip='Refresh'
            className='btn btn-theme w-9 h-9'
            // onClick={() => refetch()}
            // disabled={isFetching}
          >
            {/* {isFetching ? <Spinner color='var(--color-2)' /> : <MdRefresh />} */}
            <MdRefresh />
          </InputButton>
        </div>
      </div>
      <Tabel
        data={data || []}
        columns={columns}
        renderBody={(table) => tableBody(table)}
      />
      <DialogModal
        widthLevel={10}
        title='Ubah data User'
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      >
        <DetailDak id_ident={formData.id_ident} />
      </DialogModal>
    </div>
  );
};

const DetailDak = ({ id_ident }: { id_ident: number }) => {
  const { data } = useQuery({
    queryKey: ['detail_identifikasi_dak', id_ident],
    queryFn: () => getIdentifikasiDetailDAK(id_ident),
  });

  console.log('DATA DETAIL', data);
  return (
    <>
      {' '}
      <div className='grid grid-cols-2 grid-rows-2 gap-2'>
        <div className='col-start-1 row-span-2'>
          <div className='border border-gray-300 bg-gray-100 rounded overflow-hidden'>
            <div className='bg-[var(--color-2)] text-[var(--text-3)] px-4 py-2 h-14 flex items-center'>
              Jenis, Bidang, Program & Kegiatan DAK
            </div>
            <div className='p-4 table-excel'>
              <table>
                <tbody className='capitalize'>
                  <tr>
                    <td className='text-right pr-4 font-bold capitalize w-[150px]'>
                      Jenis DAK
                    </td>
                    <td>{data?.jenis_dak}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Sub-Jenis DAK</td>
                    <td>{data?.sub_jenis_dak}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Bidang DAK</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>
                      Sub-Bidang DAK
                    </td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Tahun</td>
                    <td>{data?.tahun}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>
                      Kabupaten / Kota
                    </td>
                    <td>{data?.kab_kot}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>OPD</td>
                    <td>{data?.opd}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Bidang OPD</td>
                    <td>{data?.bidang_opd}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Urusan</td>
                    <td>{data?.urusan}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Bidang</td>
                    <td>{data?.bidang}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Program</td>
                    <td>{data?.program}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Kegiatan</td>
                    <td>{data?.kegiatan}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Sub Kegiatan</td>
                    <td>{data?.subKegiatan}</td>
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
              Detail DAK
            </div>
            <div className='p-4 table-excel space-y-4'>
              <table>
                <tbody className='capitalize'>
                  <tr>
                    <td className='text-right pr-4 font-bold w-[150px]'>
                      Nama Paket
                    </td>
                    <td>{data?.nama_paket}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Detail Paket</td>
                    <td>{data?.detail_paket}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Volume</td>
                    <td>
                      {data?.volume} {data?.satuan}
                    </td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>
                      Estimasi Waktu
                    </td>
                    <td>{data?.estimasi_waktu}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>
                      Jumlah Penerima Manfaat
                    </td>
                    <td>{data?.jumlah_penerima_manfaat}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Anggaran DAK</td>
                    <td>{formatUang(Number(data?.anggaran_dak))}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Alamat</td>
                    <td>
                      {data?.desa_kel}, {data?.kec}
                    </td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Bujur</td>
                    <td>
                      {data?.bujur[0]}° {data?.bujur[1]}' {data?.bujur[2]}''
                    </td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Lintang</td>
                    <td>
                      {data?.lintang[0]}° {data?.lintang[1]}' {data?.lintang[2]}
                      ''
                    </td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Foto Kegiatan</td>
                    <td>{data?.foto_kegiatan ?? '-'}</td>
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
              Mekanisme Pelaksana
            </div>
            <div className='p-4 table-excel'>
              <table>
                <tbody className='capitalize'>
                  <tr>
                    <td className='text-right pr-4 font-bold w-[150px]'>
                      Mekanisme
                    </td>
                    <td>{data?.mekanisme}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Volume</td>
                    <td>
                      {data?.mekanisme_volume} {data?.satuan}
                    </td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>Uang</td>
                    <td>{formatUang(Number(data?.mekanisme_uang))}</td>
                  </tr>
                  <tr>
                    <td className='text-right pr-4 font-bold'>
                      Metode Pembayaran
                    </td>
                    <td>{data?.metode_pembayaran}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IdentifikasiDakTable;
