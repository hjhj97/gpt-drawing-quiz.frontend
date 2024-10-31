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
    clearCanvas,
  } = useCanvas({ width, height });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <label htmlFor="colorPicker" className="mr-2">
            색상 선택:
          </label>
          <input
            id="colorPicker"
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            disabled={drawingMode === "erase"}
            className="w-8 h-8 rounded cursor-pointer disabled:opacity-50"
          />
        </div>

        <button
          onClick={toggleMode}
          className={`
            px-4 py-2 rounded-md text-white transition-colors
            ${
              drawingMode === "erase"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }
          `}
        >
          {drawingMode === "draw" ? "지우개 모드" : "그리기 모드"}
        </button>

        <button
          onClick={saveImage}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
        >
          이미지 저장
        </button>

        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
        >
          전체 지우기
        </button>
      </div>

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
    </div>
  );
};

export default Canvas;
