import api from "../lib/api";
import type { DataUserType } from "../types/data";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const getUsers = async (): Promise<DataUserType[]> => {
  const response = await api.get<ApiResponse<DataUserType[]>>("/user/list");
  return response.data.data;
};