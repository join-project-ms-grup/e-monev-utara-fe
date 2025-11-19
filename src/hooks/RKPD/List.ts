import { useQuery } from "@tanstack/react-query";
import { getSKPD } from "../../services/Konfigurasi/Service_SKPD";
import type { OptionItem } from "../../components/inputs/InputSearchBox";

//#region LIST SKPD (RKPD RENSTRA)
export const useListSKPD = () => {
    const { data } = useQuery({
        queryKey: ['list_skpd_all'],
        queryFn: async () => getSKPD(),
    });
    return (
        data?.map((item) => ({
            label: `${item.name}`,
            value: item.id?.toString(),
        })) as OptionItem[] || []
    )
}
//#endregion

