import { CampaignDB, CampaignsDB } from "../types/types";
import apiService from "./apiServices";

const apiEndpoint = '/campaigns'

export const getCampaigns = async(userId: string): Promise<CampaignsDB[]|null> => {
    return await apiService.get(`/campaigns/${userId}`)
}

export const getCampaign = async(data: any): Promise<CampaignDB|null> => {
    return await apiService.post<CampaignDB, CampaignDB>(`${apiEndpoint}/fetch_campaign`, data);
}

export const getCampaignScript = async (data: any): Promise<{ js: string } | null> => {
    return await apiService.post<{ js: string }, any>(`${apiEndpoint}/fetch_campaign/script`, data);
};

export const createCampaign = async (data: any) => {
    return await apiService.post<{ message: string, js:string }, any>(`${apiEndpoint}/create`, data);
  
}
