import { Templates } from "../types/types";
import apiService from "./apiServices";


export const getAllTemplates = async(): Promise<Templates[]|null> => {
    return await apiService.get(`/templates`)
}