import "./App.css";
import { useState } from "react";
import PlantSearch from "./components/PlantSearch";
import GardenGrid from "./components/GardenGrid";

function App() {
  const [gardenSize, setGardenSize] = useState({ length: 0, width: 0 });

  return (
    <div className="App">
      <div className="left">
        <PlantSearch setGardenSize={setGardenSize} />
      </div>
      <div className="right">
        <GardenGrid length={gardenSize.length} width={gardenSize.width} />
      </div>
      <div className="footer">
        <p>
          Drag a plant from the left into the grid to place it. Each square = 6
          inches.
        </p>
      </div>
    </div>
  );
}

export default App;
