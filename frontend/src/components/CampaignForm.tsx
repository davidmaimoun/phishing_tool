import React, { useState } from "react";
import { useAuth } from "../contexts/UserContext"; // Assuming you have a context for the user
import MyButton from "./all/Button";
import { createCampaign } from "../services/campaignServices";
import { toast } from "react-toastify";

const CampaignForm: React.FC = () => {
  const { user } = useAuth(); 
  const [campaignName, setCampaignName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName) {
      setError("Campaign name is required.");
      return;
    }

    if (!user) {
        toast.error('You need to login')
        return
    }
    try {
        console.log(user)
      const response = await createCampaign({
        user_id: user.id,
        name: campaignName,
      });
      
      console.log(response)
      toast.success("Campaign created successfully!");
    } catch (err) {
      setError("Error creating campaign.");
    }
  };

  return (
    <div>
      <h2>Create a New Campaign</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Campaign Name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
        <MyButton type="submit" label={"Create Campaign"} />
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default CampaignForm;
