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