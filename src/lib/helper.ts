export function formatUang(nilai: number): string {
    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(nilai);

    return formatted.replace('Rp', 'Rp.');
}
