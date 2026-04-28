import Tabel from '../Tabel';
import type { ColumnDef, Table } from '@tanstack/react-table';
import AksiButton from '../../inputs/AksiButton';
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdRefresh,
  MdSubdirectoryArrowRight,
} from 'react-icons/md';
import InputButton from '../../inputs/InputButton';
import InputSearchBox from '../../inputs/InputSearchBox';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  deleteIdent,
  flatIdentifikasiDAK,
  getIdentifikasiDAK,
  type FlatIdentifikasiDAK,
} from '../../../services/DAK/DAKIdentifikasiService';
import { formatUang } from '../../../lib/helper';
import { FaInfo } from 'react-icons/fa';
import DialogModal from '../../inputs/DialogModal';
import DetailIdentifikasiDak from '../../forms/IdentifikasiDak/DetailIdentifikasiDak';
import {
  useListOPDDAK,
  useListSubJenisDAK,
  useListTahunDAK,
} from '../../../hooks/DAK/ListDataDAK';
import Spinner from '../../inputs/Spinner';
import { getRoleId, getUserSKPDID } from '../../../lib/usercookie';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../lib/api';

interface DakData {
  tahun: string;
  opd: string;
  jenis: string;
  subJenis: string;
  id_ident?: string;
}

interface IdentifikasiDakTable {
  onAdd: () => void;
  onEdit: () => void;
  dakData: DakData;
  changeDakData: (field: keyof DakData, value: string) => void;
}

const IdentifikasiDakTable = ({
  onAdd,
  onEdit,
  dakData,
  changeDakData,
}: IdentifikasiDakTable) => {
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

  const listTahunDAK = useListTahunDAK();
  const listSubJenisDAK = useListSubJenisDAK(Number(dakData.jenis));
  const listOPDDAK = useListOPDDAK();
  const userSKPDID = getUserSKPDID();
  const { data, refetch, isFetching } = useQuery({
    queryKey: [
      'list_identifikasi_dak',
      dakData.tahun,
      dakData.opd,
      dakData.subJenis,
    ],
    queryFn: async () => {
      const data = await getIdentifikasiDAK({
        tahun: Number(
          listTahunDAK.find((item) => item.value === dakData.tahun)?.value,
        ),
        opd_id: userSKPDID ?? Number(dakData.opd) ?? null,
        sub_jenis: Number(dakData.subJenis) ?? null,
      });
      const flatData = flatIdentifikasiDAK(data);
      return flatData;
    },
    enabled:
      getRoleId() === 4
        ? Boolean(dakData.tahun) && Boolean(dakData.opd)
        : Boolean(dakData.tahun),
  });

  useEffect(() => {
    if (!dakData.tahun) return;

    if (getRoleId() === 4) {
      changeDakData('opd', userSKPDID?.toString() ?? '');
    }
  }, [dakData.opd, dakData.tahun]);

  const [idIdent, setIdIdent] = useState(0);
  const [modal, setModal] = useState<'' | 'Detail' | 'Delete'>('');
  const initSelectedIdent = {
    id: 0,
    name: '',
  };
  const [selectedIdent, setSelectedIdent] = useState(initSelectedIdent);

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
                <div className='inline-flex'>
                  <AksiButton
                    tooltip='Detail'
                    Icon={FaInfo}
                    onClick={() => {
                      // setFormData({ id_ident: item.id_ident });
                      setIdIdent(item.id_ident ?? 0);
                      setModal('Detail');
                    }}
                  />
                  <AksiButton
                    tooltip='Ubah'
                    className='hover:bg-green-500!'
                    Icon={MdEdit}
                    onClick={() => {
                      onEdit();
                      changeDakData('id_ident', item.id_ident as any);
                    }}
                  />
                  <AksiButton
                    Icon={MdDelete}
                    className='hover:bg-red-500!'
                    tooltip='Hapus data'
                    onClick={() => {
                      setSelectedIdent({
                        id: item.id_ident ?? 0,
                        name: item.paket_detail ?? '',
                      });
                      setModal('Delete');
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

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return deleteIdent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'list_identifikasi_dak',
          dakData.tahun,
          dakData.opd,
          dakData.subJenis,
        ],
      });
      setModal('');
      setSelectedIdent(initSelectedIdent);
      toast.success('Data berhasil dihapus');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      if (error.status === 400) {
        toast.error(`Gagal menghapus data\n${error.response?.data.message}`);
      }
    },
  });

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='subJenis'>Jenis DAK</label>
            <InputSearchBox
              id='subJenis'
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
              }}
              onClear={() => {
                changeDakData('jenis', '');
                changeDakData('subJenis', '');
                changeDakData('tahun', '');
                changeDakData('opd', '');
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
              }}
              onClear={() => {
                changeDakData('subJenis', '');
                changeDakData('tahun', '');
                changeDakData('opd', '');
              }}
              withSearch
              tooltip
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
              }}
              onClear={() => {
                changeDakData('tahun', '');
                changeDakData('opd', '');
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
                onChange={(val) => changeDakData('opd', val)}
                onClear={() => changeDakData('opd', '')}
                withSearch
                tooltip
                disabled={!dakData.tahun}
              />
            </div>
          )}
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
        renderBody={(table) => tableBody(table)}
      />
      {/* MARK: MODAL */}
      {modal === 'Detail' && (
        <DialogModal
          widthLevel={10}
          title='Detail Identifikasi DAK'
          isOpen={modal === 'Detail'}
          onClose={() => {
            setModal('');
            setIdIdent(0);
          }}
        >
          <DetailIdentifikasiDak id_ident={idIdent} />
        </DialogModal>
      )}
      {modal === 'Delete' && (
        <DialogModal
          title={`Yakin hapus data ?`}
          isOpen={modal === 'Delete'}
          onClose={() => {
            setModal('');
            setSelectedIdent(initSelectedIdent);
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedIdent.id) {
                deleteMutation.mutate(selectedIdent.id);
              }
            }}
          >
            <div>
              <p>
                Anda akan menghapus data{' '}
                <b>
                  <i>{selectedIdent.name}</i>
                </b>
              </p>
              <div className='float-end'>
                <InputButton className='px-2' type='submit'>
                  Hapus
                </InputButton>
              </div>
            </div>
          </form>
        </DialogModal>
      )}
    </div>
  );
};

export default IdentifikasiDakTable;
