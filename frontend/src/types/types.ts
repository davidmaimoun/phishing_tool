
export interface User {
    id: string;
    username: string;
  }

export interface Template {
  name:string
  template:string
}

export interface CampaignData {
  id: string 
  page: string 
  username: string 
  password: string 
  ip: string 
  user_agent: string 
  timestamp: string 
}

export interface CampaignDB {
  name: string;
  data: CampaignData[];
}