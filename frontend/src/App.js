import "./App.css";
import { useState } from "react";
import PlantSearch from "./components/PlantSearch";
import GardenGrid from "./components/GardenGrid";

function App() {
  const [gardenSize, setGardenSize] = useState({ length: 0, width: 0 });

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <div className="App">
        <div className="left">
          <PlantSearch setGardenSize={setGardenSize} />
        </div>
        <div className="right">
          <h2>Your Garden Plan</h2>
          <GardenGrid length={gardenSize.length} width={gardenSize.width} />
        </div>
        <div className="footer">
          <p>
            Drag a plant from the left into the grid to place it. Each square ≈ 6 inches.
          </p>
        </div>
      </div>
    </>
  );
}

export default App;