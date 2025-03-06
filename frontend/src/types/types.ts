
export interface User {
    id: string;
    username: string;
  }

export interface Template {
  name:string
  template:string
}

export interface CampaignsData {
  id: string
  name: string
  page_name: string
  template: boolean
  date_created: string
  time_created: string
  users_number: number
}

export interface CampaignData {
  id: string 
  page: string 
  username: string 
  password: string 
  ip: string 
  user_agent: string 
  date: string 
  time: string 
}

export interface CampaignDB {
  name: string;
  data: CampaignData[];
}

export interface CampaignsDB {
  name: string;
  data: CampaignsData;
}