export function formatUang(nilai: number): string {
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(nilai);

  return formatted.replace('Rp', 'Rp.');
}

export function formatRibu(nilai: number): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0
  }).format(nilai);
}


const now = new Date();
const formatted = now.toLocaleString('id-ID', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
}).replace(',', '');

export const waktuNowGabung = formatted.replace(/[- :]/g, '');

export function calculateAchievementPercentage(targetStr: any, capaian: any, perhitungan = 'standar') {
  if (!targetStr || capaian == null) return null;

  const normalized = targetStr.replace(",", ".");
  const capaianVal = parseFloat(String(capaian).replace(",", "."));
  if (isNaN(capaianVal)) return null;

  let targetValue;

  // Jika target adalah rentang, gunakan nilai tengahnya
  if (normalized.includes("-")) {
    const [min, max] = normalized.split("-").map(parseFloat);
    if (isNaN(min) || isNaN(max)) return null;
    targetValue = (min + max) / 2;
  } else {
    targetValue = parseFloat(normalized);
    if (isNaN(targetValue)) return null;
  }

  let percentage;

  switch (perhitungan.toLowerCase()) {
    case 'akumulatif':
    case 'naik':
      // Makin tinggi capaian makin bagus
      percentage = (capaianVal / targetValue) * 100;
      break;

    case 'turun':
    case 'menurun':
      // Makin rendah capaian makin bagus (misal angka kemiskinan)
      percentage = (targetValue / capaianVal) * 100;
      break;

    case 'standar':
    default:
      percentage = (capaianVal / targetValue) * 100;
      break;
  }

  return Number(percentage.toFixed(2));
}