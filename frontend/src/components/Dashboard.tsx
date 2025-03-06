import React, { useEffect, useState } from 'react'
import MyTitle from './all/Title'
import { useSelect } from './hooks/useSelect';
import { getUserFromToken } from '../services/authServices';
import { getCampaign, getCampaigns } from '../services/campaignServices';
import { CampaignDB, CampaignsDB, User } from '../types/types';

const Dashboard:React.FC = () => {
  const [campaign, setCampaign] = useState<CampaignDB|null>();
  const [user, setUser] = useState<User|null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const currentUser = getUserFromToken()
    
        if (!currentUser)
            return
      
        setUser(currentUser)
        
        const fetchCampaignsName = async () => {
          try {
            const response = await getCampaigns(currentUser.id);
            
            if (response) {
              const campaignsNames = response.map(item => item.name);
              setOptions(campaignsNames) 
            }
    
          } catch (err) {
            setError('Failed to fetch campaigns');            
            console.error(err);
          }
        };

        fetchCampaignsName();
  },[])

  const fetchData = async (selectedValue: string) => {
    if (!user)
      return

    try {
      const response = await getCampaign({user_id: user.id, campaign_id: selectedValue});
      setCampaign(response)
      console.log("CAMPAIGN,", response)
    } 
    catch (err) {
      console.error(err);
    }
  };
  
  const { selected, SelectComponent, options, setOptions } = useSelect([], "", fetchData);

          

  if (!options) return <p>No have no campaigns data yet</p>

  return (
    <div>
      <MyTitle name={'Dashboard'}/>
      <label>Choose a Campaign</label>
      <SelectComponent />
      <MyTitle name={`📊 ${selected}`} variant='subheader'/>
      
    </div>
  )
}

export default Dashboard



