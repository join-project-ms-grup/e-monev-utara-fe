import Tabel from "./Tabel";
import type { ColumnDef } from "@tanstack/react-table";
import InputSearchBox from "../inputs/InputSearchBox";
import { useEffect, useState } from "react";
import {
  getPeriodeAkhirFromCookie,
  getPeriodeMulaiFromCookie,
} from "../../lib/usercookie";
import { useGetRekapDAK } from "../../hooks/RKPD/TabelDataRkpd";
import type { RekapDak } from "../../services/DAK/DAKMonitoringService";
import { exportRanking } from "../../services/Excel/ExcelRankingDAK";
import toast from "react-hot-toast";
import { MdPrint } from "react-icons/md";
import InputButton from "../inputs/InputButton";

const tableHead = () => {
  return (
    <>
      <tr>
        <th rowSpan={3}>
          <big>Ranking</big>
        </th>
        <th rowSpan={3}>
          <big>Nama SKPD</big>
        </th>
        <th rowSpan={3}>
          <big>
            Jumlah
            <br />
            Paket
          </big>
        </th>
        <th rowSpan={3}>
          <big>
            Jumlah
            <br />
            Anggaran
            <br />
            (Rp.)
          </big>
        </th>
        <th colSpan={3}>
          <big>Realisasi (%)</big>
        </th>
      </tr>
      <tr>
        <th colSpan={2}>
          <big>DAK Fisik</big>
        </th>
        <th rowSpan={2}>
          <big>
            Persentase
            <br />
            Rata-Rata
          </big>
        </th>
      </tr>
      <tr>
        <th>
          <big>Fisik</big>
        </th>
        <th>
          <big>Keuangan</big>
        </th>
      </tr>
    </>
  );
};

const DashDAKTable = () => {
  const [triwulan, setTriwulan] = useState("1");
  const [tahunKe, setTahunKe] = useState("2026");
  const [jenis, setJenis] = useState("1");
  const tahunMulai = Number(getPeriodeMulaiFromCookie()!);
  const tahunAkhir = Number(getPeriodeAkhirFromCookie()!);
  const { data } = useGetRekapDAK({
    triwulan: Number(triwulan),
    tahun: Number(tahunKe),
    jenis: Number(jenis),
  });

  const listTahunKe = Array.from(
    { length: tahunAkhir - tahunMulai + 1 },
    (_, i) => ({
      label: `${tahunMulai + i}`,
      value: `${tahunMulai + i}`,
    }),
  );

  const jenisOpt = [
    { label: "DAK Fisik", value: "1" },
    { label: "DAK Non-Fisik", value: "2" },
  ];

  const listTriwulan = [
    { label: "I", value: "1" },
    { label: "II", value: "2" },
    { label: "III", value: "3" },
    { label: "IV", value: "4" },
  ];

  const columns: ColumnDef<RekapDak>[] = [
    {
      header: "Ranking",
      accessorKey: "rangking",
      meta: {
        tdClassNames: "text-center",
      },
      // cell: () => `-`,
    },
    {
      accessorKey: "nama_opd",
    },
    {
      header: "Paket",
      accessorKey: "jumlah_paket",
      meta: {
        tdClassNames: "text-center",
      },
      // cell: () => `-`,
    },
    {
      header: "Jumlah Anggaran",
      accessorKey: "jumlah_anggaran",
      meta: {
        tdClassNames: "text-center",
      },
      // cell: () => `-`,
    },
    {
      header: "DAK Fisik Fisik",
      accessorKey: "realisasi_volume",
      meta: {
        tdClassNames: "text-center",
      },
      // cell: () => `-`,
    },
    {
      header: "Dak Fisik Keuangan",
      accessorKey: "realisasi_keuangan",
      meta: {
        tdClassNames: "text-center",
      },
      // cell: () => `-`,
    },
    {
      header: "Persentase",
      accessorKey: "persentase",
      meta: {
        tdClassNames: "text-center",
      },
      // cell: () => `-`,
    },
  ];

  const now = new Date();

  const defaultValue = {
    tahun: now.getFullYear().toString(),
    triwulan: Math.ceil((now.getMonth() + 1) / 3),
  };

  useEffect(() => {
    const tahunNow = defaultValue.tahun.toString();
    setTahunKe(tahunNow);

    const twEval = defaultValue.triwulan - 1;
    setTriwulan(twEval.toString());
  }, []);

  return (
    <div className="space-y-2">
      <h4 className="text-center mb-20">
        Tabel Ranking Kinerja Kegiatan DAK per SKPD Kabupaten Bengkulu Utara
      </h4>
      <div className="flex items-end justify-between">
        <div className="inline-flex gap-5">
          <div>
            <label htmlFor="tahun_ke">Jenis</label>
            <InputSearchBox
              id="tahun_ke"
              className="w-42 h-9"
              btnclassName="bg-white"
              placeholder="Pilih Tahun..."
              value={jenis}
              options={jenisOpt}
              onChange={(val) => setJenis(val)}
            />
          </div>
          <div>
            <label htmlFor="tahun_ke">Tahun</label>
            <InputSearchBox
              id="tahun_ke"
              className="w-42 h-9"
              btnclassName="bg-white"
              placeholder="Pilih Tahun..."
              value={tahunKe}
              options={listTahunKe}
              onChange={(val) => setTahunKe(val)}
            />
          </div>
          <div>
            <label htmlFor="triwulan">s.d Triwulan</label>
            <InputSearchBox
              id="triwulan"
              className="w-42 h-9"
              btnclassName="bg-white"
              placeholder="Pilih Triwulan..."
              value={triwulan}
              onChange={(e) => setTriwulan(e)}
              options={listTriwulan}
              disabled={!tahunKe}
            />
          </div>
        </div>
        <div className="inline-flex gap-2">
          <InputButton
            tooltip="Cetak Ranking"
            className="btn btn-theme w-9 h-9"
            onClick={() => {
              if (data) {
                toast.promise(
                  exportRanking(
                    data || [],
                    jenisOpt.find((item) => item.value === jenis)?.label ?? "",
                    listTahunKe.find((item) => item.value === tahunKe)?.label ??
                      "",
                    listTriwulan.find((item) => item.value === triwulan)
                      ?.label ?? "",
                  ),
                  {
                    loading: "Sedang mengunduh, harap tunggu...",
                    success: <b>Berhasil mengunduh.</b>,
                    error: () => {
                      return <b>Gagal mengunduh.</b>;
                    },
                  },
                );
              }
            }}
          >
            <MdPrint />
          </InputButton>
        </div>
      </div>
      <Tabel data={data || []} columns={columns} renderHeader={tableHead} />
    </div>
  );
};

export default DashDAKTable;
