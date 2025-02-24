import React, { useEffect, useState } from 'react';
import { getCampaigns } from '../services/campaignServices';
import { CampaignDB } from '../types/types';
import { getUserFromToken } from '../services/authServices';
import { Link } from 'react-router-dom';
import MyButton from './all/Button';



const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignDB[]|null>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getUserFromToken()
    if (!user)
        return
    const fetchCampaigns = async () => {
      try {
        const response = await getCampaigns(user.id);
        
        setCampaigns(response);
      } catch (err) {
        setError('Failed to fetch campaigns');
        console.error(err);
      }
    };

    fetchCampaigns();
  }, []); 

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h2>Campaigns</h2>

        </div>
        <div>
          <Link to='new-campaign'>
            <MyButton 
              label='+ New Campaign'
              color='success'/>
          </Link>
        </div>

      </div>
      {error && <p>{error}</p>}
      {campaigns && campaigns.length > 0 && 
        campaigns.map((campaign, index) => (
          <div key={index}>
            <h3>{campaign.db_name}</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Page</th>
                </tr>
              </thead>
              <tbody>
                {campaign.data.map((d, i) => (
                  <tr key={i}>
                    <td>{d[0]}</td>
                    <td>{d[2]}</td>
                    <td>{d[3]}</td>
                    <td>{d[1]}</td> 
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      }
    { !campaigns && <p>You have no campaign</p>}
    </div>
  );
};

export default Campaigns;
