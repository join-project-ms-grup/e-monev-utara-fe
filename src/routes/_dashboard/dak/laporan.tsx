import { createFileRoute } from '@tanstack/react-router';
import { SITE_NAME } from '../../../lib/config';
import InputSearchBox from '../../../components/inputs/InputSearchBox';
import { useState } from 'react';
import InputButton from '../../../components/inputs/InputButton';
import { MdPreview } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import {
  useListTahunDAK,
  useListSubJenisDAK,
  useListOPDDAK,
} from '../../../hooks/DAK/ListDataDAK';
import {
  getMonitoringDAK,
  flatMonitoringDAK,
  flatMonitoringDAKLaporan,
  getMasalahDAK,
} from '../../../services/DAK/DAKMonitoringService';
import { exportDAK } from '../../../services/Excel/ExcelDAK';

export const Route = createFileRoute('/_dashboard/dak/laporan')({
  head: () => ({
    meta: [
      {
        title: `Laporan DAK - ${SITE_NAME}`,
      },
    ],
  }),
  staticData: {
    title: 'Laporan DAK',
  },
  component: RouteComponent,
});

interface DakData {
  tahun: string;
  opd: string;
  jenis: string;
  subJenis: string;
  triwulan?: string;
}

function RouteComponent() {
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

  const { data } = useQuery({
    queryKey: [
      'list_monitoring_dak',
      dakData.tahun,
      dakData.opd,
      dakData.subJenis,
      dakData.triwulan,
    ],
    queryFn: async () => {
      const data = await getMonitoringDAK({
        tahun: Number(dakData.tahun),
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

  const { data: dataMasalah } = useQuery({
    queryKey: ['list_masalah_dak', dakData.jenis],
    queryFn: async () => getMasalahDAK(Number(dakData.jenis)),
    enabled: !!dakData.jenis,
  });

  return (
    <div className='max-w-xl mx-auto flex flex-col space-y-2'>
      <div className='grid grid-cols-[1fr_2fr] gap-2'>
        <div>
          <label htmlFor='jenis'>Jenis DAK</label>
          <InputSearchBox
            id='jenis'
            className='h-9'
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
            className='h-9'
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
      </div>
      <div className='grid grid-cols-[1fr_1fr] gap-2'>
        <div>
          <label htmlFor='tahun_ke'>Tahun</label>
          <InputSearchBox
            id='tahun_ke'
            className='h-9'
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
          <label htmlFor='triwulan'>Triwulan</label>
          <InputSearchBox
            id='triwulan'
            className='h-9'
            btnclassName='bg-white'
            placeholder='Pilih Triwulan'
            options={[
              { label: 'I', value: '1' },
              { label: 'II', value: '2' },
              { label: 'III', value: '3' },
              { label: 'IV', value: '4' },
            ]}
            value={dakData.triwulan}
            onChange={(val) => {
              changeDakData('triwulan', val);
              changeDakData('opd', '');
            }}
            onClear={() => {
              changeDakData('triwulan', '');
              changeDakData('opd', '');
            }}
            disabled={!dakData.tahun}
          />
        </div>
      </div>
      <div>
        <div>
          <label htmlFor='opd'>OPD</label>
          <InputSearchBox
            id='opd'
            className='h-9'
            btnclassName='bg-white'
            placeholder='Pilih OPD'
            value={dakData.opd}
            options={listOPDDAK}
            onChange={(val) => changeDakData('opd', val)}
            onClear={() => changeDakData('opd', '')}
            withSearch
            tooltip
            disabled={!dakData.triwulan}
          />
        </div>
      </div>
      <div className='w-full'>
        <InputButton
          className='px-2 w-full bg-green-700'
          onClick={() => {
            if (dakData.opd && data) {
              exportDAK(
                data,
                dataMasalah ?? [],
                dakData,
                listOPDDAK.find((i) => i.value === dakData.opd)?.label ?? '',
              );

            }
          }}
        >
          <MdPreview />
          Laporan Kemajuan Pelaksanaan Kegiatan DAK
        </InputButton>
      </div>
    </div>
  );
}
