import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/UserContext"; // Assuming you have a context for the user
import MyButton from "./all/Button";
import { createCampaign } from "../services/campaignServices";
import { toast } from "react-toastify";
import TemplateViewer from "./TemplateViewer";
import { getAllTemplates } from "../services/templateServices";
import { useRadio } from "./hooks/useRadio";
import { Template } from "../types/types";
import WindowScript from "./WindowScript";



const CampaignForm: React.FC = () => {
  const { user } = useAuth(); 
  const { selected, Radio } = useRadio("No", "Yes");
  const [isWindowDisplay, setWindowDisplay] = useState<boolean>(false)
  const [campaignName, setCampaignName] = useState("");
  const [jsScript, setJsScript] = useState("");
  const [templateWanted, setTemplateWanted] = useState<string>('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [buttonChosen, setButtonChosen] = useState<number|null>()
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
    else 
      setTemplateWanted('')
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
        template: templateWanted
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
          <label htmlFor="">Campaign Name </label>

          <input
            type="text"
            placeholder="My Worderful Campaign"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
          
          <div className="separator"></div>
          
          <h2>Templates</h2>
          <p>Do you want to use our template?</p>
          {Radio}
          {
            selected ? 
            (
              <div className="grid-container">
                {templates.map((template, index) => (
                  <div key={index} className="card">
                    <h3>📄 {template.name}</h3>
                    <TemplateViewer template={template.template} />
                    <MyButton 
                      label={buttonChosen === index ? "Template Chosen !" : "Choose this template"}
                      color={buttonChosen === index ? "success" : "secondary"}
                      onClick={
                        () => {
                          setTemplateWanted(template.name)
                          setButtonChosen(index)
                        }
                      }
                    />
                  </div>
                ))}
              </div>
            ) 
            :
            <>
            <label htmlFor="">Page Name </label>
            <input
              type="text"
              placeholder="My Page"
              value={templateWanted}
              onChange={(e) => setTemplateWanted(e.target.value)}
            />
            <div className="card">
              ⚠️⚠️⚠️
              <p>In creating the campaign, you will get a JS script to add in your own template.</p>
              <p>The form must contain:</p>
              <ul>
              <li>An input attribut: <i>name="email"</i> </li>
              <li>An input attribut: <i>name="pass"</i> </li>
              </ul>
            </div>
            </>
          }

          <div className="separator"></div>
          {
            (campaignName && templateWanted) ? (
              <>
              <p>💁 Before Submit :</p>
              <ul>
                <li>Your campagne name is <i>{campaignName}</i></li>
                <li>Your template is <i>{selected && templateWanted ? templateWanted : "your own template"}</i></li>
              </ul>
              <br></br>
              <MyButton type="submit" onClick={handleSubmit} label={"Create Campaign"} />
              </>
            ) : null
          }

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
