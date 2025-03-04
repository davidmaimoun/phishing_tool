import React, { useEffect, useState } from 'react';
import { getCampaigns, getCampaignScript } from '../services/campaignServices';
import { CampaignDB, User } from '../types/types';
import { getUserFromToken } from '../services/authServices';
import { Link } from 'react-router-dom';
import MyButton from './all/Button';
import WindowScript from './WindowScript';


const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]|null>([]);
  const [error, setError] = useState<string | null>(null);
  const [isWindowDisplay, setWindowDisplay] = useState<boolean>(false)
  const [user, setUser] = useState<User|null>(null);
  const [jsScript, setJsScript] = useState<string|null>("");
  
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

  const fetchCampaignScript = async(campaignId:string) => {

    if (user) {
      const response = await getCampaignScript({ user_id: user.id, campaign_id: campaignId})
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
          <h2>Campaigns</h2>

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
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c:any, i) => (
                <tr key={i}>
                  {/* <td>{c[0]}</td> */}
                  <td>{c[2]}</td>
                  <td>{c[1]}</td> 
                  <td>
                    <Link to={`${c[1]}`}>
                      <MyButton label='View'/>
                    </Link>
                  </td>
                  <td>
                    <MyButton 
                      label='Script' 
                      color='warning'
                      onClick={() => fetchCampaignScript(c[1])}
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
          title={"Test.db"} 
          scriptContent={jsScript}
          onClose={() => setWindowDisplay(false)} />
    }
    </div>
  );
};

export default Campaigns;
