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
import MyBadge from "./all/Badge";



const CampaignForm: React.FC = () => {
  const { user } = useAuth(); 
  const { selected: isTemplateSelected, Radio: RadioTemplateSeletion } = useRadio("No", "Yes");
  
  const [isWindowDisplay, setWindowDisplay] = useState<boolean>(false)
  const [campaignName, setCampaignName] = useState("");
  const [pageName, setPageName] = useState("");
  const [jsScript, setJsScript] = useState("");
  const [isTemplateWanted, setTemplateWanted] = useState<boolean>(false);
  const [targetsNumber, setTargetsNumber] = useState<number>(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [buttonChosen, setButtonChosen] = useState<number|null>()
  const [error, setError] = useState("");

  useEffect(() => {
    if (isTemplateSelected) {
      const fetchTemplates = async () => {
        const t = await fetchAllTemplates(); 
        
        if (t) 
          setTemplates(t);
      };
      fetchTemplates(); 
    }
    else 
      setTemplateWanted(false)
  }, [isTemplateSelected]);
  
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
        template: isTemplateWanted,
        page_name: pageName,
        targets_number: targetsNumber
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
          {RadioTemplateSeletion}
          {
            isTemplateSelected ? 
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
                          setTemplateWanted(true)
                          setPageName(template.name)
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
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
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
          
          <h2>Targets</h2>
          <p>Add the targets number you want to aim (this will help us to do statistics)</p>
          <label htmlFor="">Targets Expected </label>
          <input
            type="number"
            min={1}
            placeholder="Number of targets to aim"
            value={targetsNumber}
            onChange={(e) => setTargetsNumber(Number(e.target.value))}
          />



          {
            (campaignName && pageName && targetsNumber) ? (
              <>
                <div className="separator"></div>
                <p>💁 Before Submitting:</p>
                <ul>
                  <li style={{"marginBottom":"8px"}}>Your campagne name is  <MyBadge label={campaignName}/></li>
                  <li style={{"marginBottom":"8px"}}>Your template is       <MyBadge label={isTemplateSelected && campaignName ? campaignName : "your own template"} /></li>
                  <li>Your targets number is <MyBadge label={String(targetsNumber)} /></li>

                </ul>
                <br></br>
                <br></br>
                <MyButton type="submit" onClick={handleSubmit} label={"Create Campaign"} />
              </>
            ) : null
          }

      </div>
    
    {
      isWindowDisplay &&
        <WindowScript 
          title={pageName} 
          scriptContent={jsScript}
          onClose={() => setWindowDisplay(false)} />
    }
    </>
  );
};

export default CampaignForm;
