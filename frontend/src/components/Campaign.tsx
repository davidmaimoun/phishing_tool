import React, { useEffect, useState } from 'react';
import { getCampaign } from '../services/campaignServices';
import { CampaignDB } from '../types/types';
import { useParams } from 'react-router-dom';
import { getUserFromToken } from '../services/authServices';


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
               console.log(response)
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
        <h2>Campaign</h2>

      {campaign && campaign.data.length > 0 && 
          <>
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
          </>
        
      }
    { campaign && campaign.data.length === 0 && <p>You have no data</p>}
    </div>
  );
};

export default Campaign;
