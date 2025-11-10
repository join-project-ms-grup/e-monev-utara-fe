import api, { type ApiResponse } from "../../lib/api";


export interface BidangDAK {
    id: number;
    name: string;
    keterangan: string | null;
    status: boolean;
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
}

export const getSubBidangDAK = async (dak_bidangId: number): Promise<SubBidangDAK[]> => {
    const response = await api.post<ApiResponse<SubBidangDAK[]>>("/dak/bidang/list-sub", { dak_bidangId });
    return response.data.data;
};