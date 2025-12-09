import api, { type ApiResponse } from "../../lib/api";


export interface DAKMaster {
    id?: number;
    kodeFull?: (string | number)[];
    kode?: string | number;
    name?: string;
    rekening?: string;
    parent?: string | number;
    type?: string;
}
export interface DAKMasterUrusan extends DAKMaster {
    children?: DAKMasterBidang[];
}
export interface DAKMasterBidang extends DAKMaster {
    children?: DAKMasterProgram[];
}
export interface DAKMasterProgram extends DAKMaster {
    children?: DAKMasterKegiatan[];
}
export interface DAKMasterKegiatan extends DAKMaster {
    children?: DAKMasterSubKegiatan[];
}
export interface DAKMasterSubKegiatan extends DAKMaster {
}
export type DAKMasterTree = DAKMasterUrusan & DAKMasterBidang & DAKMasterProgram & DAKMasterKegiatan & DAKMasterSubKegiatan;


export const getRekeningDAK = async (): Promise<DAKMasterUrusan[]> => {
    const response = await api.get<ApiResponse<DAKMasterUrusan[]>>("/dak/rek/list-all");

    const rawData = response.data.data;
    const cleanData = rawData.map((urusan) => ({
        rekening: 'urusan',
        ...urusan,
        bidang: urusan.children?.map((bid) => ({
            rekening: 'bidang',
            parent: urusan.id,
            ...bid,
            program: bid.children?.map((prog) => ({
                rekening: 'program',
                parent: bid.id,
                ...prog,
                kegiatan: prog.children?.map((keg) => ({
                    rekening: 'kegiatan',
                    parent: prog.id,
                    ...keg,
                    subKegiatan: keg.children?.map((subkeg) => ({
                        rekening: 'subKegiatan',
                        parent: keg.id,
                        ...subkeg,
                    })),
                })),
            })),
        })),
    }));
    return cleanData;
};

type ChildKey = 'bidang' | 'program' | 'kegiatan' | 'subKegiatan';
export const getRekeningDAKFlat = async (
    treeData: DAKMaster[]
): Promise<(DAKMaster & { depth: number })[]> => {
    const flatData: (DAKMaster & { depth: number; })[] = [];

    const childKeys: ChildKey[] = ['bidang', 'program', 'kegiatan', 'subKegiatan'];

    function flattenNode(
        node: DAKMaster,
        parentKodeFull: (string | number)[] = [],
        depth = 0
    ): void {
        const kodeFull = [...parentKodeFull, node.kode ?? ''];
        const flatNode = {
            ...node,
            depth,
            kodeFull,
        };
        childKeys.forEach((key) => delete (flatNode as any)[key]);
        flatData.push(flatNode);
        childKeys.forEach((key) => {
            const children = (node as any)[key];
            if (Array.isArray(children)) {
                children.forEach((child: DAKMaster) =>
                    flattenNode(child, kodeFull, depth + 1)
                );
            }
        });
    }
    treeData.forEach((item) => flattenNode(item));
    return flatData;
};

export const getRekUrusanDAK = async (): Promise<DAKMaster[]> => {
    const response = await api.post<ApiResponse<DAKMaster[]>>("/dak/rek/list-urusan");
    return response.data.data;
};

export const getRekBidangDAK = async (
    id_urusan: number | null
): Promise<DAKMasterBidang[]> => {
    const response = await api.post<ApiResponse<DAKMasterUrusan[]>>(
        "/dak/rek/list-bidang",
        { urusan: id_urusan }
    );

    const rawData = response.data.data;

    const bidangList: DAKMasterBidang[] = rawData.flatMap((urusan) =>
        urusan.children?.map((bidang) => ({
            id: bidang.id,
            kode: bidang.kode,
            name: bidang.name,
            rekening: bidang.rekening,
            parent: urusan.id,
            type: bidang.type,
        })) ?? []
    );

    return bidangList;
};

export const getRekProgramDAK = async (
    id_urusan: number,
    id_bidang: number | null
): Promise<DAKMasterProgram[]> => {
    const response = await api.post<ApiResponse<DAKMasterUrusan[]>>(
        "/dak/rek/list-program",
        { urusan: id_urusan, bidang: id_bidang }
    );

    const rawData = response.data.data;

    const programList: DAKMasterProgram[] = rawData.flatMap((urusan) => (
        urusan.children?.flatMap((bidang) =>
            bidang.children?.map((program) => ({
                id: program.id,
                kode: program.kode,
                name: program.name,
                parent: bidang.id,
                type: program.type,
            })) ?? []
        ) ?? []));
    return programList;
};

export const getRekKegiatanDAK = async (
    id_urusan: number,
    id_bidang: number,
    id_program: number | null
): Promise<DAKMasterKegiatan[]> => {
    const response = await api.post<ApiResponse<DAKMasterUrusan[]>>(
        "/dak/rek/list-kegiatan",
        { urusan: id_urusan, bidang: id_bidang, program: id_program }
    );

    const rawData = response.data.data;

    const kegiatanList: DAKMasterKegiatan[] = rawData.flatMap((urusan) =>
        urusan.children?.flatMap((bidang) =>
            bidang.children?.flatMap((program) =>
                program.children?.map((kegiatan) => ({
                    id: kegiatan.id,
                    kode: kegiatan.kode,
                    name: kegiatan.name,
                    rekening: kegiatan.rekening,
                    parent: id_program ?? program.id, // parent bisa id_program atau program.id
                    type: kegiatan.type,
                })) ?? []
            ) ?? []
        ) ?? []
    );

    return kegiatanList;
};

export const getRekSubKegiatanDAK = async (
    id_urusan: number,
    id_bidang: number,
    id_program: number,
    id_kegiatan: number | null
): Promise<DAKMasterSubKegiatan[]> => {
    const response = await api.post<ApiResponse<DAKMasterUrusan[]>>(
        "/dak/rek/list-sub",
        { urusan: id_urusan, bidang: id_bidang, program: id_program, kegiatan: id_kegiatan }
    );

    const rawData = response.data.data;

    const subList: DAKMasterSubKegiatan[] = rawData.flatMap((urusan) =>
        urusan.children?.flatMap((bidang) =>
            bidang.children?.flatMap((program) =>
                program.children?.flatMap((kegiatan) =>
                    kegiatan.children?.map((sub) => ({
                        id: sub.id,
                        kode: sub.kode,
                        name: sub.name,
                        rekening: sub.rekening,
                        parent: id_kegiatan ?? kegiatan.id,
                        type: sub.type,
                    })) ?? []
                ) ?? []
            ) ?? []
        ) ?? []
    );

    return subList
};

export interface DAKRekeningForm {
    id?: number | null;
    kode?: string | number;
    name?: string;
    parent_id?: string | number | null;
    status?: boolean | null;
    type?: string;
}

export const addDAKRek = async (payload: DAKRekeningForm): Promise<DAKRekeningForm> => {
  const response = await api.post<ApiResponse<DAKRekeningForm>>("/dak/rek/add", payload);
  return response.data.data;
};

export const updateDAKRek = async (payload: DAKRekeningForm): Promise<DAKRekeningForm> => {
  const response = await api.put<ApiResponse<DAKRekeningForm>>(`/dak/rek/update`, payload);
  return response.data.data;
};