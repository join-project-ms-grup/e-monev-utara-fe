import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { getPeriodeAkhirFromCookie, getPeriodeMulaiFromCookie } from '../../lib/usercookie';
import InputSearchBox from '../inputs/InputSearchBox';
import { useEffect, useState } from 'react';
import { useGetDataGrafikDAK } from '../../hooks/RKPD/TabelDataRkpd';


const DashDAKChart = () => {
  const tahunMulai = Number(getPeriodeMulaiFromCookie()!);
  const tahunAkhir = Number(getPeriodeAkhirFromCookie()!);
  const [tahun, setTahun] = useState<number>(0)

  const { data } = useGetDataGrafikDAK({ tahun_ke: tahun });

  const listTahunKe = Array.from(
    { length: tahunAkhir - tahunMulai + 1 },
    (_, i) => ({
      label: `${tahunMulai + i}`,
      value: `${tahunMulai + i}`,
    }),
  );

  useEffect(() => {
    const now = new Date();
    const tahun = now.getFullYear().toString();
    setTahun(Number(listTahunKe.find((v) => v.label === tahun)?.label || 0))
  }, [])
  return (
    <div className='space-y-2'>
      <h4 className='text-center'>
        Grafik Progress Kegiatan per SKPD s.d Bulan November Tahun Anggaran {listTahunKe.find((v) => v.value === tahun.toString())?.label}
      </h4>
      <div className='ps-25'>
        {/* <label htmlFor="tahun_ke">Pilih tahun</label> */}
        <InputSearchBox
          id="tahun_ke"
          className="w-42 h-9"
          btnclassName="bg-white"
          placeholder="Pilih Tahun..."
          value={tahun.toString()}
          options={listTahunKe}
          onChange={(val) => setTahun(Number(val))}
        />
      </div>
      <ResponsiveContainer width='100%' height={400}>
        <BarChart
          data={data}
          layout='vertical'
          margin={{ top: 20, right: 50, left: 50, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            type='number'
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis type='category' dataKey='triwulan' />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Bar
            dataKey='fisikDAK'
            fill='#e80000'
            name='Realisasi DAK Fisik - Progress Volume'
          />
          <Bar
            dataKey='keuanganDAK'
            fill='#fa6464'
            name='Realisasi DAK Fisik - Progress Keuangan'
          />
          <Bar
            dataKey='fisikNonDAK'
            fill='#ffc807'
            name='Realisasi DAK Non-Fisik - Progress Volume'
          />
          <Bar
            dataKey='keuanganNonDAK'
            fill='#ffe37f'
            name='Realisasi DAK Non-Fisik - Progress Keuangan'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashDAKChart;
