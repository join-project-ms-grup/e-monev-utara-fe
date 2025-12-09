import api, { type ApiResponse } from "../../lib/api";


export interface BidangDAK {
    id?: number;
    name?: string;
    keterangan?: string | null;
    status?: boolean;
    dak_bidangId?: number;
    level?: string;
}

export const getBidangDAK = async (jenis_dak: number): Promise<BidangDAK[]> => {
    const response = await api.post<ApiResponse<BidangDAK[]>>("/dak/bidang/list", { jenis_dak });
    return response.data.data;
};

export interface SubBidangDAK {
    id: number;
    name: string;
    keterangan: string | null;
    status: boolean;
    sub: {
        id: number;
        name: string;
        dak_bidangId: number;
        keterangan: string | null;
        status: boolean;
        created_at: string;
        update_at: string;
    }[]
    level?: string;
}

export const getSubBidangDAK = async (dak_bidangId: number): Promise<SubBidangDAK[]> => {
    const response = await api.post<ApiResponse<SubBidangDAK[]>>("/dak/bidang/list-sub", { dak_bidangId });
    return response.data.data;
};

export function flatSubBidangDAK(data: SubBidangDAK[]): BidangDAK[] {
    const result: BidangDAK[] = [];

    for (const bid of data) {
        result.push({
            name: bid.name,
            level: 'bidang'
        })
        for (const sub of bid.sub) {
            result.push({
                id: sub.id,
                name: sub.name,
                keterangan: sub.keterangan,
                status: sub.status,
                dak_bidangId: sub.dak_bidangId,
                level: 'subBidang'
            })
        }
    }

    return result;
}

export interface BidangDAKForm {
    id?: number;
    status?: boolean;
    jenis_dak?: number;
    id_bidang?: number;
    name: string;
    keterangan?: string | null;
    type?: string
}

export const addBidangDAK = async (payload: BidangDAKForm): Promise<BidangDAKForm> => {
    const response = await api.post<ApiResponse<BidangDAKForm>>("/dak/bidang/add", payload);
    return response.data.data;
};

export const updateBidangDAK = async (payload: BidangDAKForm): Promise<BidangDAKForm> => {
    const response = await api.put<ApiResponse<BidangDAKForm>>("/dak/bidang/update", payload);
    return response.data.data;
};

export const addSubBidangDAK = async (payload: BidangDAKForm): Promise<BidangDAKForm> => {
    const response = await api.post<ApiResponse<BidangDAKForm>>("/dak/bidang/add-sub", payload);
    return response.data.data;
};

export const updateSubBidangDAK = async (payload: BidangDAKForm): Promise<BidangDAKForm> => {
    const response = await api.put<ApiResponse<BidangDAKForm>>("/dak/bidang/update-sub", payload);
    return response.data.data;
};