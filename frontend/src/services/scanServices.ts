import apiService from "./apiServices";

const apiEndpoint = "/scan"

export const scanURL = async (url: string): Promise<any> => {
  return await apiService.post<{ data: any, message: string }, { url: string }>(apiEndpoint, { url });

}
export const stopScan = async (): Promise<any> => {
  const stopApiEndpoint = `${apiEndpoint}/abort/1`
  return await apiService.get<{ message: string }>(stopApiEndpoint);

}