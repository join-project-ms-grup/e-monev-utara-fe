import { fakerID_ID as faker } from '@faker-js/faker'

const fakeRKPDDashboard = faker.helpers
    .shuffle(Array.from({ length: 100 }, (_, i) => i + 1))
    .map(ranking => ({
        ranking,
        perangkat: faker.company.name(),
        persentaseKinerja: faker.number.int({ min: 0, max: 100 }).toString(),
        predikatKinerja: ["ST", "T", "S", "R", "SR", "UNK"][Math.floor(Math.random() * 6)],
        persentaseAnggaran: faker.number.int({ min: 0, max: 100 }).toString(),
        predikatAnggaran: ["ST", "T", "S", "R", "SR", "UNK"][Math.floor(Math.random() * 6)],
        anggaran: faker.number.int({ min: 100000, max: 10000000 }).toString(),
        program: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
            perangkat: faker.lorem.sentence(),
            persentaseKinerja: faker.number.int({ min: 0, max: 100 }).toString(),
            predikatKinerja: ["ST", "T", "S", "R", "SR", "UNK"][Math.floor(Math.random() * 6)],
            persentaseAnggaran: faker.number.int({ min: 0, max: 100 }).toString(),
            predikatAnggaran: ["ST", "T", "S", "R", "SR", "UNK"][Math.floor(Math.random() * 6)],
            anggaran: faker.number.int({ min: 100000, max: 10000000 }).toString(),
            kegiatan: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
                perangkat: faker.lorem.sentence(),
                persentaseKinerja: faker.number.int({ min: 0, max: 100 }).toString(),
                predikatKinerja: ["ST", "T", "S", "R", "SR", "UNK"][Math.floor(Math.random() * 6)],
                persentaseAnggaran: faker.number.int({ min: 0, max: 100 }).toString(),
                predikatAnggaran: ["ST", "T", "S", "R", "SR", "UNK"][Math.floor(Math.random() * 6)],
                anggaran: faker.number.int({ min: 100000, max: 10000000 }).toString(),
                subKegiatan: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
                    perangkat: faker.lorem.sentence(),
                    persentaseKinerja: faker.number.int({ min: 0, max: 100 }).toString(),
                    predikatKinerja: ["ST", "T", "S", "R", "SR", "UNK"][Math.floor(Math.random() * 6)],
                    persentaseAnggaran: faker.number.int({ min: 0, max: 100 }).toString(),
                    predikatAnggaran: ["ST", "T", "S", "R", "SR", "UNK"][Math.floor(Math.random() * 6)],
                    anggaran: faker.number.int({ min: 100000, max: 10000000 }).toString(),
                }))
            }))
        }))
    }));
export const fakeRKPDDashboardData = [...fakeRKPDDashboard].sort(
    (a, b) => a.ranking - b.ranking
);

export const fakeRealisasi = [
    {
        sasaran: 'Sasaran',
        kode: '1.0.1',
        name: faker.lorem.sentence(),
        indikator: 'Indikator',
        trFisik: '72%',
        trRp: 'Rp.0',
        rrFisik: '0 Unit',
        rrRp: 'Rp. 0',
        tkFisik: '96%',
        tkRp: 'Rp. 0',
        penanggung: 'Dinas Penanggung',
    },
]

export const fakeTaggingIku = [
    {
        iku: faker.lorem.sentence(),
        level: 'Sasaran',
        satuan: 'Poin',
        kondisiAwal: '52,5',
        2022: '52,5',
        2023: '52,5',
        2024: '52,5',
        2025: '52,5',
        2026: '52,5',
    },
]

export const fakeIku = [
    {
        sasaran: 'Sasaran',
        iku: faker.lorem.sentence(),
        deskform: '',
        satuan: 'Poin',
        kondisiAwal: '52,5',
        2022: '52,5',
        2023: '52,5',
        2024: '52,5',
        2025: '52,5',
        2026: '52,5',
    },
]

export const fakeCapaianIku = [
    {
        sasaran: 'Sasaran',
        iku: faker.lorem.sentence(),
        satuan: 'Poin',
        targetTahunan: '52,5',
        triwulan: 'Triwulan 1',
        target: '',
        realisasi: '',
        capaian: '0',
        keterangan: '',
    },
]