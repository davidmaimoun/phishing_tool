import React, { useEffect, useState } from 'react'
import MyTitle from './all/Title'
import { useSelect } from './hooks/useSelect';
import { getUserFromToken } from '../services/authServices';
import { getCampaign, getCampaigns } from '../services/campaignServices';
import { CampaignDB, CampaignsDB, User } from '../types/types';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { LineChart, MyChartData, BarChart, DoughnutChart, StackedPercentBarChart } from "./Charts";

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
  const [barDaySubmissionsData, setBarDaySubmissionsData] = useState<MyChartData|null>(null);
  const [barClicksData, setBarClicksData] = useState<MyChartData|null>(null);
  const [barClickTargetedRatioData, setBarClickTargetedRatioData] = useState<any|null>(null);
  const [pieClickTargetedRatioData, setPieClickTargetedRatioData] = useState<any|null>(null);
  const [lineHourSubmissionsData, setLineHourSubmissionsData] = useState<MyChartData|null>(null);

  useEffect(() => {
    const currentUser = getUserFromToken()
    
        if (!currentUser)
            return
      
        setUser(currentUser)
        
        const fetchCampaigns = async () => {
          try {
            const response = await getCampaigns(currentUser.id);

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

    const barDaySubmissions: MyChartData = {
      legend:"Submission by Day", labels: Object.keys(dayFrequency), values: Object.values(dayFrequency).map((value:any) => Math.floor(value))
    }
  

    if (allCampaigns) {
        const campaignData: CampaignsDB|undefined = allCampaigns.find(c => c.name === selectedCampaign)
        
        if (campaignData) {
          const { data:cd } = campaignData

          const barClicks: MyChartData = {
            legend:"Targets Clicks", labels:["Targeted", "Phished", "Submitted"], values:[cd.targets_number, cd.phished_number, data.length]
          }

      
          const barClicksTargetedRatio: MyChartData = {
            legend:"Targeted", labels:["Phished", "Submitted"], values:[(cd.phished_number/cd.targets_number)*100, (data.length/cd.targets_number)*100]
          }
          
          const pieClicksTargetedRatio: MyChartData = {
            legend:"Targeted", labels:["Phished", "Submitted"], values:[(cd.phished_number/cd.targets_number)*100, (data.length/cd.targets_number)*100]
          }
  
  
          setBarClicksData(barClicks);
          setBarClickTargetedRatioData(barClicksTargetedRatio);
          setPieClickTargetedRatioData(pieClicksTargetedRatio);
        }
    }
    

    const lineHourSubmissions= getLineChartData("Submission by Hour", hourFrequency);

    setBarDaySubmissionsData(barDaySubmissions);
    setLineHourSubmissionsData(lineHourSubmissions);

   
  }


  const getLineChartData = (legend:string, data: {[key: string]: number}): MyChartData => {
    
    return { labels: Object.keys(data), values: Object.values(data), legend }
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
    <div >
      <MyTitle name={'Dashboard'} color='white'/>
      <label>Choose a Campaign</label>
      <SelectComponent />
      { selected &&
        <>
        <div className='separator'></div>
        <MyTitle name={`${selected}`} variant='subheader'/>
        <div className='dashboard'>
      
            
            <div className='dashboard-splitted'>
               {barClicksData && (
                <div className='chart'>
                <h3>Phished & Submitted</h3>
                  <BarChart data={barClicksData} isHorizontal={true} />
                </div>
              )} 
              { barClickTargetedRatioData && (
                <div className='chart'>
                  <h3>Phished & Submitted by All Targeted (%)</h3>
                  <StackedPercentBarChart data={barClickTargetedRatioData}/>
                </div>
              
              )}
              { pieClickTargetedRatioData && (
                <div className='chart'>
                  <h3>Phished & Submitted by All Targeted (%)</h3>
                    <DoughnutChart data={pieClickTargetedRatioData}/>
                </div>
              
              )} 
              
            </div>

            <div className='dashboard-splitted'>
              {barDaySubmissionsData && (
                <div className='chart'>
                  <h3>Submissions per Day</h3>
                  <BarChart data={barDaySubmissionsData} /> 
                </div>
              )}
              {lineHourSubmissionsData && (
                <div className='chart'>
                  <h3>Submissions per Hour</h3>
                  <LineChart data={lineHourSubmissionsData}/>

                </div>
              )}
              {barDaySubmissionsData && (
                <div className='chart'>
                  <h3>Submissions per Day</h3>
                  <BarChart data={barDaySubmissionsData} /> 
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


