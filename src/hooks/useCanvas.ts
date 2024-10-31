import { useRef, useState, useEffect } from "react";

type DrawingMode = "draw" | "erase";

interface UseCanvasProps {
  width: number;
  height: number;
}

export const useCanvas = ({ width, height }: UseCanvasProps) => {
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

  const saveImage = () => {
    if (!canvasRef.current) return;

    const date = new Date();
    const fileName = `drawing-${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}-${date
      .getHours()
      .toString()
      .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    const image = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = image;
    link.click();
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;

    // 캔버스 전체 지우기
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return {
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
  };
};
