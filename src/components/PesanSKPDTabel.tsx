type Props = {
  selectedSKPD?: string;
  tahun?: string;
  butuhTahun?: boolean;
};

const PesanSKPDTabel = ({ selectedSKPD, tahun, butuhTahun = false }: Props) => {
  if (!selectedSKPD) return 'SKPD BELUM DIPILIH';

  if (butuhTahun && !tahun) return 'TAHUN BELUM DIPILIH';

  return 'TIDAK ADA DATA';
};

export default PesanSKPDTabel;
