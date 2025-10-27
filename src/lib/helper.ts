export function formatUang(nilai: number): string {
    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(nilai);

    return formatted.replace('Rp', 'Rp.');
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
