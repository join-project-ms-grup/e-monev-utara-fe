import { Fragment, useState } from 'react';
import Tabel from '../../Tabel';
import { MdPrint, MdRefresh } from 'react-icons/md';
import InputButton from '../../../inputs/InputButton';
import InputSearchBox, {
  type OptionItem,
} from '../../../inputs/InputSearchBox';
import { type ColumnDef, type Table } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import {
  getPeriodeAkhirFromCookie,
  getPeriodeIDFromCookie,
  getPeriodeMulaiFromCookie,
} from '../../../../lib/usercookie';
import {
  flatHasilIK,
  flatIK,
  getHasilIK,
  getIKSKPD,
  getIKU,
  type FlatIK,
} from '../../../../services/IKUIKDService';
import Spinner from '../../../inputs/Spinner';
import toast from 'react-hot-toast';
import { exportIKU } from '../../../../services/Excel/ExcelIKU';

const IndikatorIKUTable = () => {
  const idPeriode = Number(getPeriodeIDFromCookie());
  //#region SKPD
  const [selectedSKPD, setSelectedSKPD] = useState('');
  const { data: dataIKSKPD } = useQuery({
    queryKey: ['list_ik_skpd', idPeriode],
    queryFn: async () => getIKSKPD(idPeriode),
  });
  const listIKSKPD =
    dataIKSKPD?.map((item) => ({
      label: `${item.name}`,
      value: item.id?.toString(),
    })) || [];
  //#endregion

  const { data, isFetching, refetch } = useQuery({
    queryKey: [
      'list_iku',
      selectedSKPD ? Number(selectedSKPD) : 'all',
      idPeriode,
    ],
    queryFn: async () => {
      const rawData = await getIKU({
        skpd_id: selectedSKPD ? Number(selectedSKPD) : 'all',
        periodeId: idPeriode,
      });
      const flatData = flatIK(rawData);
      return flatData;
    },
    enabled: !!idPeriode,
  });

  const mulaiPeriode = Number(getPeriodeMulaiFromCookie()!);
  const akhirPeriode = Number(getPeriodeAkhirFromCookie()!);

  const periode = [
    mulaiPeriode - 1,
    ...Array.from(
      { length: akhirPeriode - mulaiPeriode + 1 },
      (_, i) => mulaiPeriode + i,
    ),
  ];

  const columns: ColumnDef<FlatIK>[] = [
    {
      header: 'No',
    },
    {
      header: 'Urusan di RPJMD',
    },
    {
      header: 'IKU',
    },
    {
      header: 'Satuan',
    },
    {
      header: 'Kondisi Awal',
    },
    ...periode.slice(0).map((_, i) => ({
      header: `Target Tahun ${i + 1}`,
      accessorKey: `targetTahun${i + 1}`,
    })),
  ];

  const tableHead = () => {
    return (
      <>
        <tr>
          <th rowSpan={2}>No</th>
          <th rowSpan={2}>Urusan di RPJMD</th>
          <th rowSpan={2}>Indikator Kinerja Utama</th>
          <th rowSpan={2}>Satuan</th>
          <th rowSpan={2}>Kondisi Awal {mulaiPeriode - 2}</th>
          <th colSpan={periode.length}>Target Tahun</th>
        </tr>
        <tr>
          {periode.map((thn) => (
            <th key={thn} rowSpan={1}>
              {thn}
            </th>
          ))}
        </tr>
      </>
    );
  };

  const tableBody = (table: Table<FlatIK>) => {
    const rowModel = table.getRowModel();
    const { pageIndex, pageSize } = table.getState().pagination ?? {
      pageIndex: 0,
      pageSize: 10,
    };

    let lastSkpd = '';
    let counter = pageIndex * pageSize + 1;

    const grouped: Record<string, FlatIK[]> = {};
    rowModel.rows.forEach((row) => {
      const item = row.original;
      const key = `${item.skpdName}-${item.wMasterName}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    return (
      <>
        {Object.values(grouped).map((group) => {
          const firstItem = group[0];
          const headerRow =
            firstItem.skpdName !== lastSkpd ? (
              <tr className='odd gradeX' key={`header-${firstItem.skpdName}`}>
                <td colSpan={periode.length + 6} className='bg-blue'>
                  <p
                    style={{
                      margin: 0,
                      textIndent: -66,
                      paddingLeft: 66,
                      textAlign: 'left',
                    }}
                  >
                    <b>Perangkat Daerah : </b>
                    {firstItem.skpdName}
                  </p>
                </td>
              </tr>
            ) : null;

          lastSkpd = firstItem.skpdName;
          return (
            <Fragment key={`${firstItem.skpdName}-${firstItem.wMasterName}`}>
              {headerRow}
              {group.map((item, index) => (
                <tr
                  className='odd gradeX text-center'
                  id={`dtTb${item.uraianId}`}
                  key={item.uraianId}
                >
                  <td>{counter++}</td>
                  <td className='text-left!'>
                    {index === 0 ? item.wMasterName : ''}
                  </td>
                  <td className='text-left!'>{item.uraianName}</td>
                  <td>{item.satuan}</td>
                  <td>{item.base_line}</td>
                  <td>{item.t_1_target}</td>
                  <td>{item.t_2_target}</td>
                  <td>{item.t_3_target}</td>
                  <td>{item.t_4_target}</td>
                  <td>{item.t_5_target}</td>
                  <td>{item.t_6_target}</td>
                </tr>
              ))}
            </Fragment>
          );
        })}
      </>
    );
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-end justify-between'>
        <div className='inline-flex gap-2'>
          <div>
            <label htmlFor='skpd'>SKPD</label>
            <InputSearchBox
              id='skpd'
              className='w-64 h-9'
              btnclassName='bg-white'
              placeholder='Pilih SKPD...'
              value={selectedSKPD.toString()}
              options={listIKSKPD as OptionItem[]}
              onChange={(val) => setSelectedSKPD(val)}
              onClear={() => setSelectedSKPD('')}
              tooltip
              withSearch
            />
          </div>
        </div>
        <div className='inline-flex gap-2'>
          <InputButton
            className='btn btn-theme w-9 h-9'
            tooltip='Cetak Excel'
            onClick={async () => {
              try {
                const rawhasilData = await getHasilIK({
                  type: 'iku',
                  skpd_id: selectedSKPD ? Number(selectedSKPD) : 'all',
                  periodeId: idPeriode,
                });
                const hasilData = flatHasilIK(rawhasilData)

                if (!hasilData) {
                  toast.error('Data tidak ditemukan.');
                  return;
                }
                toast.promise(exportIKU(hasilData, 'iku'), {
                  loading: 'Sedang mengunduh...',
                  success: <b>Berhasil mengunduh.</b>,
                  error: <b>Gagal mengunduh.</b>,
                });

                console.log(hasilData)
              } catch (error) {
                console.error(error);
                toast.error('Terjadi kesalahan saat mengambil data.');
              }
            }}
          >
            <MdPrint />
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
        renderHeader={tableHead}
        renderBody={(table) => tableBody(table)}
      />
    </div>
  );
};

export default IndikatorIKUTable;
