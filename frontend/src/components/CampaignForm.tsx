import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/UserContext"; // Assuming you have a context for the user
import MyButton from "./all/Button";
import { createCampaign } from "../services/campaignServices";
import { toast } from "react-toastify";
import TemplateViewer from "./TemplateViewer";
import { getAllTemplates } from "../services/templateServices";
import { useRadio } from "./hooks/useRadio";
import { Templates } from "../types/types";
import WindowScript from "./WindowScript";



const CampaignForm: React.FC = () => {
  const { user } = useAuth(); 
  const { selected, Radio } = useRadio("No", "Yes");
  const [isWindowDisplay, setWindowDisplay] = useState<boolean>(false)
  const [campaignName, setCampaignName] = useState("");
  const [jsScript, setJsScript] = useState("");
  const [templateWanted, setTemplateWanted] = useState<string>('');
  const [templates, setTemplates] = useState<Templates[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selected) {
      const fetchTemplates = async () => {
        const t = await fetchAllTemplates(); 
        
        if (t) 
          setTemplates(t);

      };
  
      fetchTemplates(); 
    }
  }, [selected]);
  
  const fetchAllTemplates = async () => {
    const response = await getAllTemplates();
    return response;  
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaignName) {
      toast.error("Campaign name is required.")
      return;
    }

    if (!user) {
      toast.error('You need to login')
      return
    }

    try {
      const response = await createCampaign({
        user_id: user.id,
        name: campaignName,
        template: 'facebook'
      });
      if (response) {
        setJsScript(response.js)
        setWindowDisplay(true)
        toast.success("Campaign created successfully!");
      }
    } catch (err) {
      setError("Error creating campaign.");
    }
  };

  return (
    <>
      <div>
        <h2>Create a New Campaign</h2>
          <input
            type="text"
            placeholder="Campaign Name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
          
          <div className="separator"></div>
          
          <h2>Templates</h2>
          <p>Do you want to use our template?</p>
          {Radio}
          {
            selected ? <TemplateViewer templates={templates} /> 
            :
            <p>In creating the campaign, you will get a JS script to add in your own template</p>
          }

          <div className="separator"></div>
          <br></br>
          <MyButton type="submit" onClick={handleSubmit} label={"Create Campaign"} />

      </div>
    
    {
      isWindowDisplay &&
        <WindowScript 
          title={"Test.db"} 
          scriptContent={jsScript}
          onClose={() => setWindowDisplay(false)} />
    }
    </>
  );
};

export default CampaignForm;
