import { CampaignDB } from "../types/types";
import apiService from "./apiServices";

const apiEndpoint = '/campaigns'

export const getCampaigns = async(userId: string): Promise<any[]|null> => {
    return await apiService.get(`/campaigns/${userId}`)
}

export const getCampaign = async(data: any): Promise<CampaignDB|null> => {
    return await apiService.post<CampaignDB, CampaignDB>(`${apiEndpoint}/fetch_campaign`, data);
}

export const createCampaign = async (data: any): Promise<string> => {
    const response = await apiService.post<{ message: string }, any>(`${apiEndpoint}/create`, data);
    if (!response || !response.message) 
        throw new Error("No message in response");
      
    return response.message;
}
