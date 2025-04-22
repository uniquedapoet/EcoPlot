import { useState } from "react";

export default function PlantSearch({ setGardenSize, addPlantToGarden }) {
  const [plantDetails, setPlantDetails] = useState({
    sunlight: "",
    soil: "",
    water: "",
  });
  const [gardenSuggestions, setGardenSuggestions] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState('');

  const changePlantDetails = (e) => {
    const { id, value } = e.target;
    console.log(id, value);
    setPlantDetails((prevDetails) => ({
      ...prevDetails,
      [id.replace("-search", "")]: value,
    }));
  };

  const submittPlantDetails = async () => {
    console.log("Submitting Plant Details...");
    console.log(plantDetails);

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
      console.log("Server Response:", result["Recommended Plants"]);
      setGardenSuggestions(result["Recommended Plants"]);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const handlePlantSelect = (e) => {
    setSelectedPlant(e.target.value);
  };

  const addSelectedPlant = () => {
    if (!selectedPlant) return;

    const plant = gardenSuggestions.find(p => p.plant_name === selectedPlant);
    if (plant) {
      addPlantToGarden(plant);
      setSelectedPlant('')
    }
  };

  return (
    <div id="plant-search">
      <div id="input-section">
        <h2>Input Your Garden's Details!</h2>
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
          <option value="Rich, Well-drained">
            Rich, Well-drained (Best for vegetables & flowers)
          </option>
          <option value="Loamy, Well-drained">
            Loamy, Well-drained (All-purpose garden soil)
          </option>
          <option value="Moist, Well-drained">
            Moist, Well-drained (Good for ferns & hostas)
          </option>
          <option value="Fertile, Well-drained">
            Fertile, Well-drained (Ideal for heavy feeders)
          </option>
          <option value="Sandy, Well-drained">
            Sandy, Well-drained (Great for herbs & succulents)
          </option>
          <option value="Loose, Sandy">
            Loose, Sandy (Perfect for root vegetables)
          </option>
          <option value="Deep, Sandy">
            Deep, Sandy (Best for native wildflowers)
          </option>
          <option value="Rich, Moist">
            Rich, Moist (For water-loving plants)
          </option>
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
        <h3>Garden Dimensions (Feet)</h3>
        <input
          type="number"
          placeholder="length"
          onChange={(e) =>
            setGardenSize((prev) => ({
              ...prev,
              length: parseInt(e.target.value),
            }))
          }
        />{" "}
        X{" "}
        <input
          type="number"
          placeholder="width"
          onChange={(e) =>
            setGardenSize((prev) => ({
              ...prev,
              width: parseInt(e.target.value),
            }))
          }
        />
        <button id="PlantSearch" onClick={submittPlantDetails}>
          Search
        </button>
      </div>

      <div className="suggestion-list">
        <h3>Suggestion List</h3>
        <p>Ordered by # Garden Spec Matches </p>
        <ul className="grid-list">
          {gardenSuggestions.map((suggestion, index) => (
            <li
              key={index}
              draggable
              onDragStart={(e) => {
                const plant = gardenSuggestions[index];
                const dragClone = document.createElement('div');
                
                // Style the drag preview
                dragClone.textContent = plant.plant_name
                  .split(" ")
                  .map(word => word[0])
                  .join("");
                dragClone.style.cssText = `
                  position: absolute;
                  width: 30px;
                  height: 30px;
                  background-color: lightgreen;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  top: -100px;
                  left: -100px;
                  z-index: 9999;
                `;

                document.body.appendChild(dragClone);
                e.dataTransfer.setData("application/json", JSON.stringify(plant));
                e.dataTransfer.setDragImage(dragClone, 15, 15);
                
                setTimeout(() => document.body.removeChild(dragClone), 0);
                e.currentTarget.style.opacity = "0.5";
              }}
              onDragEnd={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <label>
                {suggestion.plant_name} ({suggestion.spacing})
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
