import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from "./Home";
import Header from "./Header";
import Logout from "./Logout";
import Dashboard from "./Dashboard";
import Campaigns from "./Campaigns";
import CampaignForm from "./CampaignForm";
import Campaign from "./Campaign";


const AppLayout: React.FC = () => {
  
    return (
      <div className="app-container">
        <ToastContainer aria-label={undefined}/>
        <Header/>
  
        <div className="main-content">
          <aside className="left-side">
          </aside>
          
          <main className="main">
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/campaigns/:id" element={<Campaign />} />
                <Route path="/campaigns/new-campaign" element={<CampaignForm />} />
                <Route path="/logout" element={<Logout />} />
              </Routes>
          </main>
          
          <aside className="right-side">
          </aside>
        </div>
  
    </div>
  
    );
  };
  
export default AppLayout;