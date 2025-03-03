
export interface User {
    id: string;
    username: string;
  }

export interface Templates {
  name:string
  template:string
}

export interface CampaignDB {
  db_name: string;
  data: any[];
}