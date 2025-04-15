import { useEffect, useState } from "react";

export default function PlantSearch() {
  const [plantDetails, setPlantDetails] = useState({
    sunlight: "",
    soil: "",
    water: "",
  });
  const [gardenSuggestions, setGardenSuggestions] = useState([]);
  const [choosenPlants, setChoosenPlants] = useState([]);

  const changePlantDetails = (e) => {
    const { id, value } = e.target;
    console.log(id, value);
    setPlantDetails((prevDetails) => ({
      ...prevDetails,
      [id.replace("-search", "")]: value, // Removes "-search" from ID to match object keys
    }));
  };

  const submittPlantDetails = async () => {
    console.log("Submitting Plant Details...");
    console.log(plantDetails)

    const { sunlight, soil, water } = plantDetails;

    if (!sunlight && !soil && !water) {
      setGardenSuggestions([]);
      return;
    }
    

    try {
      const response = await fetch("http://127.0.0.1:5005/plants/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sunlight: plantDetails.sunlight,
          water: plantDetails.water,
          soil: plantDetails.soil,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setGardenSuggestions(result["Recommended Plants"]);

      console.log("Server Response:", result["Recommended Plants"]);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const addPlant = (e) => {
    const { value, checked } = e.target;

    setChoosenPlants((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((plant) => plant !== value);
      }
    });
  };
  console.log(choosenPlants);

  return (
    <div id="plant-search">
      <div id="input-section">
        <h2>Input Your Plant Details</h2>
        <h3>Sunlight</h3>
        <select
          id="sunlight-search"
          className="search-box"
          value={plantDetails.sunlight}
          onChange={changePlantDetails}
        >
          <option value="">----Select----</option>
          <option value="Full Sun">Full Sun</option>
          <option value="Full Sun/Partial Shade">Full Sun/Partial Shade</option>
          <option value="Partial Shade">Partial Shade</option>
        </select>

        <h3>Soil</h3>
        <select
          id="soil-search"
          className="search-box"
          value={plantDetails.soil}
          onChange={changePlantDetails}
        >
          <option value="">----Select----</option>
          <option value="Rich, Well-drained">Rich, Well-drained</option>
          <option value="Loamy, Well-drained">Loamy, Well-drained</option>
          <option value="Moist, Well-drained">Moist, Well-drained</option>
          <option value="Fertile, Well-drained">Fertile, Well-drained</option>
          <option value="Sandy, Well-drained">Sandy, Well-drained</option>
          <option value="Loose, Sandy">Loose, Sandy</option>
          <option value="Deep, Sandy">Deep, Sandy</option>
          <option value="Rich, Moist">Rich, Moist</option>
        </select>

        <h3>Water</h3>
        <select
          id="water-search"
          className="search-box"
          value={plantDetails.water}
          onChange={changePlantDetails}
        >
          <option value="">----Select----</option>
          <option value="Moderate">Moderate</option>
          <option value="Frequent">Frequent</option>
          <option value="Low">Low</option>
        </select>

        <button id="PlantSearch" onClick={submittPlantDetails}>
          Search
        </button>
      </div>

      <div className="suggestion-list">
        <h3>Suggestion List</h3>
        <ul className="grid-list">
          {gardenSuggestions.map((suggestion, index) => (
            <li key={index}>
              <label>
                <input
                  type="checkbox"
                  value={suggestion}
                  onChange={(e) => addPlant(e)}
                />
                {suggestion}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
