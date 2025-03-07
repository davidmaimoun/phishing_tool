import React, { useEffect, useState } from 'react';
import { getCampaigns } from '../services/campaignServices';
import { CampaignDB } from '../types/types';
import { getUserFromToken } from '../services/authServices';
import { Link } from 'react-router-dom';
import MyButton from './all/Button';


const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]|null>([]);
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
          <Link to='/campaigns/new-campaign'>
            <MyButton 
              label='+ New Campaign'
              color='success'/>
          </Link>
        </div>

      </div>
      {error && <p>{error}</p>}
      {campaigns && campaigns.length > 0 && 
          <table>
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c:any, i) => (
                <tr key={i}>
                  {/* <td>{c[0]}</td> */}
                  <td>{c[1]}</td> 
                  <td>{c[2]}</td>
                  <td>{c[3]}</td>
                  <td>
                    <Link to={`${c[1]}`}>
                      <MyButton label='View'/>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            
          
      }
    { !campaigns && <p>You have no campaign</p>}
    </div>
  );
};

export default Campaigns;
