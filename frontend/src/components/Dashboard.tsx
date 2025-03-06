import React, { useEffect, useState } from 'react'
import MyTitle from './all/Title'
import { useSelect } from './hooks/useSelect';
import { getUserFromToken } from '../services/authServices';
import { getCampaign, getCampaigns } from '../services/campaignServices';
import { CampaignDB, CampaignsData, CampaignsDB, User } from '../types/types';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Dashboard:React.FC = () => {
  const [campaignTargetData, setCampaignTargetData] = useState<CampaignDB|null>();
  const [allCampaigns, setAllCampaigns] = useState<CampaignsDB[]|null>();
  const [user, setUser] = useState<User|null>(null);
  const [error, setError] = useState<string | null>(null);
  const [barDaySubmissionsData, setBarDaySubmissionsData] = useState<any>(null);
  const [barClicksData, setBarClicksData] = useState<any>(null);
  const [lineHourSubmissionsData, setLineHourSubmissionsData] = useState<any>(null);

  useEffect(() => {
    const currentUser = getUserFromToken()
    
        if (!currentUser)
            return
      
        setUser(currentUser)
        
        const fetchCampaigns = async () => {
          try {
            const response = await getCampaigns(currentUser.id);
            console.log("All : ",response)

            if (response) {
              setAllCampaigns(response)
              
              const campaignsNames = response.map(item => item.name);
              setOptions(campaignsNames) 
            }
    
          } catch (err) {
            setError('Failed to fetch campaigns');            
            console.error(err);
          }
        };

        fetchCampaigns();
  },[])

  const drawChart = (data: any, selectedCampaign:string) => {
    const dayFrequency: { [key: string]: number } = {
      "Mon": 0, "Tue": 0, "Wed":0, "Thu": 0, "Fri":0, "Sun": 0
    };
    const hourFrequency: { [key: string]: number } = {};
    
    for (let i = 1; i <= 24; i++) {
      hourFrequency[i.toString()] = 0;
    }

    data.forEach((item:any) => {
      const day = item.day;
      const hour = item.time.split(':')[0]; 

      if (dayFrequency[day]) 
        dayFrequency[day] += 1;
      else 
        dayFrequency[day] = 1;
      

      if (hourFrequency[hour]) 
        hourFrequency[hour] += 1;
      else 
        hourFrequency[hour] = 1;
      
    });

    const barDaySubmissions = getBarChartData(
      "Submission by Day", 
      Object.keys(dayFrequency), 
      Object.values(dayFrequency).map((value:any) => Math.floor(value))
    )

    if (allCampaigns) {
        const campaignData: CampaignsDB|undefined = allCampaigns.find(c => c.name === selectedCampaign)
        
        if (campaignData) {
          const barClicks = getBarChartData(
            "Targets Clicks",
            ["Phished", "Submitted"], 
            [campaignData.data.phished_number, data.length]
          )
  
          setBarClicksData(barClicks);
        }
    }
    

    const lineHourSubmissions= getLineChartData("Submission by Hour", hourFrequency);

    setBarDaySubmissionsData(barDaySubmissions);
    setLineHourSubmissionsData(lineHourSubmissions);

   
  }

  const getBarChartData = (legend:string, labels:string|string[], data:number[], color:string|string[]='rgba(75, 192, 192, 0.5)') => {
    return {
      labels: labels,
      datasets: [
        {
          label: legend,
          data: data,
          backgroundColor: color,
        },
      ],
    };
  }

  const getLineChartData = (label:string, data: {[key: string]: number}) => {
    
    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: label,
          data: Object.values(data),
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
        },
      ],
    };
  }

  const fetchData = async (selectedValue: string) => {
    if (!user)
      return

    try {
      const response = await getCampaign({user_id: user.id, campaign_id: selectedValue});
      setCampaignTargetData(response)   

      if (response)
        drawChart(response.data, selectedValue)

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
      { selected &&
        <>
        <div className='separator'></div>
        <MyTitle name={`📊 ${selected}`} variant='subheader'/>
        <div className='dashboard'>
            <div className='dashboard-splitted'>
              {barDaySubmissionsData && (
                <div>
                  <h3>Submissions per Day</h3>
                  <Bar data={barDaySubmissionsData} />
                </div>
              )}
              {lineHourSubmissionsData && (
                <div>
                  <h3>Submissions per Hour</h3>
                  <Line data={lineHourSubmissionsData} />
                </div>
              )}
            </div>
            <div className='dashboard-splitted'>
              {barClicksData && (
                <div>
                  <h3>Phished & Submitted</h3>
                  <Bar data={barClicksData} />
                </div>
              )}
              
            </div>
        </div>
        </>
      
      }
    </div>
  )
}

export default Dashboard


