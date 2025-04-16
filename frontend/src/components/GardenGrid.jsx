export default function GardenGrid({ length, width }) {
    const totalCols = Math.floor(length * 2);
    const totalRows = Math.floor(width * 2);
    const cellSize = 25;
  
    const gridSquares = [];
    for (let i = 0; i < totalRows * totalCols; i++) {
      gridSquares.push(
        <div 
          key={i} 
          className="grid-cell"
        ></div>
      );
    }
  
    return (
      <div
        className="garden-grid"
        style={{
          gridTemplateColumns: `repeat(${totalCols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${totalRows}, ${cellSize}px)`,
        }}
      >
        {gridSquares}
      </div>
    );
}