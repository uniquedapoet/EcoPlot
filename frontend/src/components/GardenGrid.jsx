import { useState, useRef, useEffect } from "react";

export default function GardenGrid({ length, width }) {
  const gridSize = 40;
  const gapSize = 1;
  const totalCols = Math.floor(length * 2);
  const totalRows = Math.floor(width * 2);

  const [cellSize, setCellSize] = useState(0);
  const [plants, setPlants] = useState([]);
  const [plantHistory, setPlantHistory] = useState([]);
  const gridRef = useRef(null);

  useEffect(() => {
    const updateCellSize = () => {
      if (gridRef.current) {
        const width = gridRef.current.offsetWidth;
        const height = gridRef.current.offsetHeight;
        const sizeByWidth = Math.floor(
          (width - (totalCols - 1) * gapSize) / totalCols
        );
        const sizeByHeight = Math.floor(
          (height - (totalRows - 1) * gapSize) / totalRows
        );
        setCellSize(Math.min(sizeByWidth, sizeByHeight));
      }
    };

    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, [totalCols, totalRows]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const gridRect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - gridRect.left;
    const y = e.clientY - gridRect.top;

    try {
      const plantData = e.dataTransfer.getData("application/json");
      const plant = JSON.parse(plantData);

      setPlantHistory((prev) => [...prev, plants]);

      setPlants((prev) => [
        ...prev,
        {
          ...plant,
          x: x,
          y: y,
          id: Date.now(),
        },
      ]);
    } catch (error) {
      console.error("Error processing drop:", error);
    }
  };

  const clearAllPlants = () => {
    setPlantHistory((prev) => [...prev, plants]);
    setPlants([]);
  };

  const undoLastPlant = () => {
    if (plantHistory.length > 0) {
      const lastState = plantHistory[plantHistory.length - 1];
      setPlants(lastState);

      setPlantHistory((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="garden-container">
      <div
        ref={gridRef}
        className="garden-grid"
        style={{
          width: `${gridSize + 0.2}vw`,
          height: `${gridSize * 1.75 - 2.8}vh`,
          display: "grid",
          gridTemplateColumns: `repeat(${totalCols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${totalRows}, ${cellSize}px)`,
          position: "relative",
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {Array.from({ length: totalRows * totalCols }).map((_, i) => (
          <div key={`cell-${i}`} className="grid-cell"></div>
        ))}
        {plants.map((plant) => {
          const plantSpacing = plant.spacing.split("-");
          const spacingInches = parseInt(plantSpacing[0]);
          const scale = spacingInches / 6;
          const plantSize = cellSize * scale;

          // Calculate shadow size as a percentage of plant size
          const shadowSize = plantSize * 0.5; // Adjust this multiplier as needed

          return (
            <div
              key={plant.id}
              className="plant-in-grid"
              style={{
                position: "absolute",
                left: `${plant.x}px`,
                top: `${plant.y}px`,
                width: `${plantSize}px`,
                height: `${plantSize}px`,
                backgroundColor: "lightgreen",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                cursor: "move",
                zIndex: 10,
                boxShadow: `0 0 ${shadowSize * 0.5}px ${
                  shadowSize * 0.2
                }px rgba(34, 139, 34, 0.5)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {plant.plant_name.split(" ").map((word) => word[0])}
            </div>
          );
        })}
      </div>
      <div className="garden-controls">
        <button
          onClick={undoLastPlant}
          disabled={plantHistory.length === 0}
          className="control-button"
        >
          Undo Last Plant
        </button>
        <button
          onClick={clearAllPlants}
          disabled={plantHistory.length === 0}
          className="control-button"
        >
          Clear All Plant
        </button>
      </div>
    </div>
  );
}
