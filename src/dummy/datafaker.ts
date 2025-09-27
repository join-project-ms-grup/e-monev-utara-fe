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