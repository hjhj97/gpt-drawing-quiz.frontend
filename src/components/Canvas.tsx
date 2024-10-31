import React, { useRef, useEffect, useState } from "react";

interface CanvasProps {
  width?: number;
  height?: number;
}

type DrawingMode = "draw" | "erase";

const Canvas: React.FC<CanvasProps> = ({ width = 800, height = 600 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("draw");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    setContext(ctx);
  }, []);

  useEffect(() => {
    if (!context) return;

    if (drawingMode === "erase") {
      context.globalCompositeOperation = "destination-out";
      context.strokeStyle = "rgba(0,0,0,1)";
    } else {
      context.globalCompositeOperation = "source-over";
      context.strokeStyle = currentColor;
    }
  }, [drawingMode, currentColor, context]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!context) return;

    const { offsetX, offsetY } = e.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawing || !context) return;

    const { offsetX, offsetY } = e.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = (): void => {
    if (!context) return;

    context.closePath();
    setIsDrawing(false);
  };

  const toggleMode = () => {
    setDrawingMode((prev) => (prev === "draw" ? "erase" : "draw"));
  };

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
