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

const data = [
  {
    skpd: 'Dinas Pendidikan',
    fisikDAK: 0,
    keuanganDAK: 0,
    fisikNonDAK: 0,
    keuanganNonDAK: 0,
  },
  {
    skpd: 'Dinas Kesehatan',
    fisikDAK: 0,
    keuanganDAK: 0,
    fisikNonDAK: 0,
    keuanganNonDAK: 0,
  },
  {
    skpd: 'Dinas Sosial',
    fisikDAK: 0,
    keuanganDAK: 0,
    fisikNonDAK: 0,
    keuanganNonDAK: 0,
  },
];

const DashDAKChart = () => {
  return (
    <div className='space-y-2'>
      <h4 className='text-center'>
        Grafik Progress Kegiatan per SKPD s.d Bulan November Tahun Anggaran 2025
      </h4>
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
          <YAxis type='category' dataKey='skpd' />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Bar
            dataKey='fisikDAK'
            fill='#dc143c'
            name='Realisasi DAK Fisik - Progress Fisik'
          />
          <Bar
            dataKey='keuanganDAK'
            fill='#ff6b81'
            name='Realisasi DAK Fisik - Progress Keuangan'
          />
          <Bar
            dataKey='fisikNonDAK'
            fill='#ff878d'
            name='Realisasi DAK Non-Fisik - Progress Fisik'
          />
          <Bar
            dataKey='keuanganNonDAK'
            fill='#ffa6a6'
            name='Realisasi DAK Non-Fisik - Progress Keuangan'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashDAKChart;
