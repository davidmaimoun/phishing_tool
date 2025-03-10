import React, { useEffect, useState } from 'react';
import { getCampaigns, getCampaignScript } from '../services/campaignServices';
import { User, CampaignsDB } from '../types/types';
import { getUserFromToken } from '../services/authServices';
import { Link } from 'react-router-dom';
import MyButton from './all/Button';
import WindowScript from './WindowScript';
import MyTitle from './all/Title';


const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignsDB[]|null>([]);
  const [error, setError] = useState<string | null>(null);
  const [pageName, setPageName] = useState("");
  const [isWindowDisplay, setWindowDisplay] = useState<boolean>(false)
  const [user, setUser] = useState<User|null>(null);
  const [jsScript, setJsScript] = useState<string>("");
  
  useEffect(() => {
    const currentUser = getUserFromToken()

    if (!currentUser)
        return
    
    setUser(currentUser)
    const fetchCampaigns = async () => {
      try {
        const response = await getCampaigns(currentUser.id);
        setCampaigns(response);

      } catch (err) {
        setError('Failed to fetch campaigns');
        console.error(err);
      }
    };

    fetchCampaigns();
  }, []); 

  const fetchCampaignScript = async(campaignId:string, page_name:string, template:boolean) => {

    if (user) {
      const response = await getCampaignScript({ 
        user_id: user.id, 
        campaign_id: campaignId,
        page_name,
        template
      })

      if(response && response.js) {
        setJsScript(response.js)
        setWindowDisplay(true)
      }
    }

  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <MyTitle name={'Campaigns'} variant='subheader'/>  
        </div>
        <div>
          <Link to='/campaigns/new-campaign'>
            <MyButton 
              label='+ New Campaign'
              color='success'/>
          </Link>
        </div>

      </div>
      {error && <p>{error}</p>}
      {campaigns && campaigns.length > 0 && 
          <table >
          
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>Date created</th>
                <th>Name</th>
                <th>Page</th>
                <th>Users Number</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(({ data: campaignData }: CampaignsDB, i) => (
                
                <tr key={i}>
                  {/* <td>{c[0]}</td> */}
                  <td>{campaignData.date_created}</td> 
                  <td>{campaignData.name}</td>
                  <td>{campaignData.page_name}</td> 
                  <td>{campaignData.targets_number}</td> 
                  <td>
                    <Link to={`${campaignData.name}`}>
                      <MyButton label='View'/>
                    </Link>
                  </td>
                  <td>
                    <MyButton 
                      label='Script' 
                      color='warning'
                      onClick={() => {
                        fetchCampaignScript(campaignData.name, campaignData.page_name, campaignData.template)
                        setPageName(campaignData.page_name)
                      }}
                      />
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
            
          
      }
    { !campaigns && <p>You have no campaign</p>}

    {
      isWindowDisplay &&
        <WindowScript 
          title={pageName} 
          scriptContent={jsScript}
          onClose={() => setWindowDisplay(false)} />
    }
    </div>
  );
};

export default Campaigns;
