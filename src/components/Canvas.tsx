import React from "react";
import { useCanvas } from "../hooks/useCanvas";
import { CanvasController } from "./CanvasController";

interface CanvasProps {
  width?: number;
  height?: number;
}

const Canvas: React.FC<CanvasProps> = ({ width = 800, height = 600 }) => {
  const {
    canvasRef,
    currentColor,
    drawingMode,
    startDrawing,
    draw,
    stopDrawing,
    setCurrentColor,
    toggleMode,
    saveImage,
    clearCanvas,
  } = useCanvas({ width, height });

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`
          border border-gray-300 rounded-lg
          ${drawingMode === "erase" ? "cursor-crosshair" : "cursor-default"}
        `}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />

      <CanvasController
        currentColor={currentColor}
        drawingMode={drawingMode}
        setCurrentColor={setCurrentColor}
        toggleMode={toggleMode}
        saveImage={saveImage}
        clearCanvas={clearCanvas}
      />
    </div>
  );
};

export default Canvas;
