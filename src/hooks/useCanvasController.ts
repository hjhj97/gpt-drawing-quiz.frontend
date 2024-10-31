interface UseCanvasControllerProps {
  currentColor: string;
  drawingMode: "draw" | "erase";
  setCurrentColor: (color: string) => void;
  toggleMode: () => void;
  saveImage: () => void;
  clearCanvas: () => void;
}

export const useCanvasController = ({
  currentColor,
  drawingMode,
  setCurrentColor,
  toggleMode,
  saveImage,
  clearCanvas,
}: UseCanvasControllerProps) => {
  return {
    currentColor,
    drawingMode,
    setCurrentColor,
    toggleMode,
    saveImage,
    clearCanvas,
  };
};
