import React from "react";
import { useCanvas } from "../hooks/useCanvas";

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
  } = useCanvas({ width, height });

  return (
    <div>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div>
          <label htmlFor="colorPicker" style={{ marginRight: "0.5rem" }}>
            색상 선택:
          </label>
          <input
            id="colorPicker"
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            disabled={drawingMode === "erase"}
          />
        </div>

        <button
          onClick={toggleMode}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: drawingMode === "erase" ? "#ff4444" : "#4444ff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {drawingMode === "draw" ? "지우개 모드" : "그리기 모드"}
        </button>

        <button
          onClick={saveImage}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          이미지 저장
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: "1px solid black",
          cursor: drawingMode === "erase" ? "crosshair" : "default",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
    </div>
  );
};

export default Canvas;
