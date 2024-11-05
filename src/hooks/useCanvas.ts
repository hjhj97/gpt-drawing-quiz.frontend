import { useRef, useState, useEffect } from "react";
import { sendMessage } from "../api";

type DrawingMode = "draw" | "erase";

interface UseCanvasProps {
  width: number;
  height: number;
}

// 색상 상수 추가
export const COLORS = {
  BLACK: "#000000",
  RED: "#FF0000",
  BLUE: "#0000FF",
  GREEN: "#008000",
  YELLOW: "#FFD700",
} as const;

export const useCanvas = ({ width, height }: UseCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [currentColor, setCurrentColor] = useState<string>(COLORS.BLACK);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("draw");
  const [isMessageLoading, setIsMessageLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);

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
    addKeyboardEvent();
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

  const addKeyboardEvent = () => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        undo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  };

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

  const toggleMode = () => {
    setDrawingMode((prev) => (prev === "draw" ? "erase" : "draw"));
  };

  const getBase64Image = () => {
    if (!canvasRef.current) return;
    return canvasRef.current.toDataURL("image/png");
  };

  const getFileName = () => {
    const date = new Date();
    return `drawing-${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}-${date
      .getHours()
      .toString()
      .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  };

  const sendImage = async () => {
    const imageData = getBase64Image();
    if (!imageData) {
      throw new Error("Image data is not available");
    }

    try {
      setIsMessageLoading(true);
      const response = await sendMessage(imageData);
      setMessage(response);
    } catch (error) {
      alert("서버 오류가 발생했습니다." + error);
    } finally {
      setIsMessageLoading(false);
    }
  };

  const saveImage = () => {
    if (!canvasRef.current) return;

    const fileName = getFileName();
    const imageData = getBase64Image();
    if (!imageData) {
      throw new Error("Image data is not available");
    }
    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = imageData;
    link.click();
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;

    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setMessage("");
  };

  const saveState = () => {
    if (!canvasRef.current || !isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setUndoStack((prev) => [...prev, imageData]);
  };

  const undo = () => {
    if (!canvasRef.current || undoStack.length === 0) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const newStack = [...undoStack];
    newStack.pop();
    const lastState = newStack[newStack.length - 1];

    if (lastState) {
      ctx.putImageData(lastState, 0, 0);
      setUndoStack(newStack);
    } else {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setUndoStack([]);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      saveState();
    }
    setIsDrawing(false);
  };

  return {
    isMessageLoading,
    message,
    canvasRef,
    currentColor,
    drawingMode,
    startDrawing,
    draw,
    setCurrentColor,
    toggleMode,
    saveImage,
    sendImage,
    clearCanvas,
    handleMouseUp,
    undo,
  };
};
