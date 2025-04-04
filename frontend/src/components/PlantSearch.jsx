import { useEffect, useState } from "react";

export default function PlantSearch() {
    const [plantDetails, setPlantDetails] = useState({sunlight:'', soil:'', water:''});

    const changePlantDetails = (e) => {
        const { id, value } = e.target;
        console.log(id, value);
        setPlantDetails(prevDetails => ({
            ...prevDetails,
            [id.replace("-search", "")]: value  // Removes "-search" from ID to match object keys
        }));
    };

    const submittPlantDetails = async () => {
        console.log('Submitting Plant Details...');
        
        try {
            const response = await fetch("http://127.0.0.1:5005/plants/recommend", {  
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sunlight: plantDetails.sunlight,
                    water: plantDetails.water,
                    soil: plantDetails.soil
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log("Server Response:", result);
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };
    

    return (
        <div id='plant-search'>
            Input Your Plant Details
            <input type="text" id="sunlight-search" value={plantDetails.sunlight} onChange={changePlantDetails}  />
            <input type="text" id="soil-search" value={plantDetails.soil} onChange={changePlantDetails}  />
            <input type="text" id="water-search" value={plantDetails.water} onChange={changePlantDetails}  />
            <button id='PlantSearch' onClick={submittPlantDetails}>Search</button>
        </div>
    )
}