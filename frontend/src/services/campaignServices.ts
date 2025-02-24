import { CampaignDB } from "../types/types";
import apiService from "./apiServices";

const apiEndpoint = '/campaigns'

export const getCampaigns = async(userId: string): Promise<CampaignDB[]|null> => {
    return await apiService.get(`/campaigns/${userId}`)
}

export const createCampaign = async (data: any): Promise<string> => {
    const response = await apiService.post<{ message: string }, any>(`${apiEndpoint}/create`, data);
    if (!response || !response.message) 
        throw new Error("No message in response");
      
    return response.message;
}
