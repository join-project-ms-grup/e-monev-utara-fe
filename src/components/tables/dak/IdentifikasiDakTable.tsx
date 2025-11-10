import Tabel from '../Tabel';
import type { ColumnDef, Table } from '@tanstack/react-table';
import AksiButton from '../../inputs/AksiButton';
import {
  MdAdd,
  MdEdit,
  MdRefresh,
  MdSubdirectoryArrowRight,
} from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import InputSearchBox, { type OptionItem } from '../../inputs/InputSearchBox';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  flatIdentifikasiDAK,
  getIdentifikasiDAK,
  type FlatIdentifikasiDAK,
} from '../../../services/DAK/DAKIdentifikasiService';
import { formatUang } from '../../../lib/helper';
import { FaInfo } from 'react-icons/fa';
import DialogModal from '../../inputs/DialogModal';
import DetailIdentifikasiDak from '../../forms/IdentifikasiDak/DetailIdentifikasiDak';
import { ListOPDDAK, ListSubJenisDAK, ListTahunDAK } from '../../../services/ListData/ListDataDAK';

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
  const [opdDAK, setOPDDAK] = useState('');
  const [subJenisDAK, setSubJenisDAK] = useState('');

  const { data } = useQuery({
    queryKey: ['list_identifikasi_dak', tahunDAK, opdDAK, subJenisDAK],
    queryFn: async () => {
      const data = await getIdentifikasiDAK({
        tahun: Number(
          ListTahunDAK().find((item) => item.value === tahunDAK)?.label,
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
              options={ListTahunDAK() as OptionItem[]}
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
              options={ListOPDDAK() as OptionItem[]}
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
              options={ListSubJenisDAK(1) as OptionItem[]}
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
        title='Detail Identifikasi DAK'
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      >
        <DetailIdentifikasiDak id_ident={formData.id_ident} />
      </DialogModal>
    </div>
  );
};

export default IdentifikasiDakTable;
